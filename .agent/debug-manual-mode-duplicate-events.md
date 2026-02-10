# Bug: onUpdate fires twice in manual mode (autoUpdateArray: false)

## Problem

When using `[autoUpdateArray]="false"`, the `(update)` event fires twice for a single drag-and-drop operation. The two calls are 2-6ms apart with identical `oldIndex`/`newIndex` values.

### Reproduction log

```
[onTasksUpdate] Called with event: {oldIndex: 3, newIndex: 0, timestamp: '...050Z'}
[onTasksUpdate] Moving task: Deploy to production
[onTasksUpdate] Array updated successfully
[onTasksUpdate] Called with event: {oldIndex: 3, newIndex: 0, timestamp: '...056Z'} // 6ms later
[onTasksUpdate] Skipping - duplicate call within 50ms
```

### Reproduction template

```html
<ul [hubSortable]="tasks" [autoUpdateArray]="false" (update)="onTasksUpdate($event)">
  @for (task of tasks; track task.id) {
    <li>{{ task.title }}</li>
  }
</ul>
```

### Reproduction handler

```typescript
onTasksUpdate(event: SortableEvent): void {
  moveItemInArray(this.tasks, event.oldIndex!, event.newIndex!);
}
```

## Root cause analysis (confirmed)

The duplicate was NOT caused by two `onUpdate` callbacks inside the directive.

What was happening:

1. SortableJS callback `onUpdate` fired once.
2. Directive emitted Angular output `this.update.emit(event)`.
3. SortableJS also dispatched a native DOM event named `update` on the container.
4. Template binding `(update)="onTasksUpdate($event)"` listened to both:
   - directive `@Output() update`
   - native DOM `update` event
5. Result: component handler executed twice with same indexes.

This was confirmed with runtime traces:

- Directive `onUpdate` callback logged only once.
- Component handler logged twice.

So the duplicate source was event name collision (`update`) between Angular output and Sortable native DOM events.

## Key files

- **Directive**: `projects/ng-hub-ui-sortable/src/lib/sortable.directive.ts`
  - `overridenOptions` getter (line ~543): where all SortableJS event handlers are set up
  - `onUpdate` handler (line ~641): the handler that fires twice
  - `proxyEvent()` (line ~351): re-enters Angular zone and emits output
  - `revertSortableDom()` (line ~675): reverts SortableJS DOM manipulation for same-list reorder
  - `revertTransferDom()` (line ~706): reverts DOM for between-list transfers
- **Example component**: `src/app/examples/manual-sortable/manual-sortable.component.ts`
  - Currently has a 50ms timestamp-based guard as workaround (lines 64-88)
- **Entry point**: `projects/ng-hub-ui-sortable/src/public-api.ts`
- **tsconfig paths**: `tsconfig.json` maps `ng-hub-ui-sortable` → `./projects/ng-hub-ui-sortable`

## What was tried before root cause was confirmed

### 1. DOM revert before emitting event

**Idea**: Revert SortableJS's DOM manipulation so Angular can re-render cleanly.

```typescript
// In onUpdate, manual mode:
this.revertSortableDom(event);
this.proxyEvent('onUpdate', event);
```

**Result**: Still fires twice. The revert itself causes a DOM change that Angular then reconciles on top of, creating the same feedback loop.

### 2. Boolean guard flag (`_dropEventProcessed`) reset in `onEnd`

**Idea**: Set flag on first onUpdate, block subsequent calls, reset in onEnd.

```typescript
if (this._dropEventProcessed) return;
this._dropEventProcessed = true;
// ... process event
// In onEnd: this._dropEventProcessed = false;
```

**Result**: Still fires twice. The 2nd onUpdate arrives AFTER onEnd (which resets the flag). Event order: onUpdate → onSort → onEnd → (async DOM mutation) → onUpdate(duplicate).

### 3. Boolean guard flag reset in `onStart` instead of `onEnd`

**Idea**: Reset the flag at the start of the NEXT drag instead of the end of the current one.

```typescript
// In onStart: this._dropEventProcessed = false;
```

**Result**: Still fires twice. Possible reasons:
- `ng serve` may not detect file changes under `projects/` (only watches `src/` per `tsconfig.app.json` include)
- OR the guard code IS running but the flag reset timing is still wrong

### Important note about dev server

`tsconfig.app.json` has `"include": ["src/**/*.ts"]`. Changes to `projects/ng-hub-ui-sortable/src/` may NOT be detected by `ng serve` file watcher. **Always restart `ng serve` after modifying library source files.** This has NOT been conclusively verified — the guard code may not have been executing at all during testing.

## Final solution (implemented)

### Directive (`sortable.directive.ts`)

Implemented fix:

1. Create Sortable instance outside Angular zone:

```typescript
this.zone.runOutsideAngular(() => {
  this.sortableInstance = Sortable.create(container, this.sortableOptions);
});
```

2. Suppress native Sortable DOM events on the container (capture phase), so Angular templates only receive directive outputs:

```typescript
private suppressNativeSortableEvents(container: HTMLElement): void {
  const sortableNativeEvents = [
    'start', 'end', 'add', 'update', 'sort',
    'remove', 'filter', 'change', 'choose', 'unchoose', 'clone'
  ] as const;

  sortableNativeEvents.forEach((eventName) => {
    const handler = (event: Event) => {
      event.stopImmediatePropagation();
    };

    container.addEventListener(eventName, handler, true);
    this.nativeEventCleanup.push(() => {
      container.removeEventListener(eventName, handler, true);
    });
  });
}
```

3. Cleanup listeners in `ngOnDestroy()` via `nativeEventCleanup`.

4. Keep manual-mode dedup guards (`_dropEventProcessed` and signature/time dedup) as extra safety.

### Example component (`manual-sortable.component.ts`)

The temporary 50ms dedup guard is no longer required after the directive fix.

## Validation result

After applying the fix and restarting `ng serve`, single-list manual drag now emits only one component call:

```
[onTasksUpdate] Called with event: {oldIndex: 3, newIndex: 0, ...}
[onTasksUpdate] Moving task: Deploy to production
[onTasksUpdate] Array updated successfully.
```
