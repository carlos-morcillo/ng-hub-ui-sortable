# Understanding Events in ng-hub-ui-sortable

When working with drag-and-drop, especially in manual mode, it's important to understand when and why events fire. SortableJS (the underlying library) emits multiple events for a single drag operation.

## Event Firing Order

### When dragging within the same list:

1. `choose` - Item is selected (mousedown/touchstart)
2. `start` - Drag begins (after movement threshold)
3. `move` - Fires continuously during drag (can fire many times)
4. `update` - Position changed within same list
5. `sort` - Generic sort event (fires AFTER update)
6. `change` - List order changed
7. `end` - Drag operation ends

### When dragging between different lists:

1. `choose` - Item selected (source list)
2. `start` - Drag begins (source list)
3. `move` - Fires continuously during drag
4. `remove` - Item removed from source list
5. `add` - Item added to target list
6. `sort` - Fires in both lists
7. `change` - Fires in both lists
8. `end` - Drag ends (original source list)

## Why Multiple Events Fire

You might notice that **both `update` and `sort` fire** when reordering items in the same list. This is expected SortableJS behavior:

- **`update`** - Specific event for changes within the same list
- **`sort`** - Generic event that fires for ANY sorting operation

This means if you listen to both events, your handler will be called twice for a single drag.

## Best Practices for Event Handling

### In Manual Mode:

```typescript
// ✅ Good: Listen to specific events
onTaskUpdate(event: SortableEvent): void {
  // Prevent duplicate processing
  if (event.oldIndex === event.newIndex) return;

  moveItemInArray(this.tasks, event.oldIndex, event.newIndex);
}

// ❌ Avoid: Listening to both update and sort
(update)="onUpdate($event)"  // Will fire twice
(sortEvent)="onSort($event)" // when used together
```

### Preventing Duplicate Processing:

If you need to listen to multiple events, implement debouncing:

```typescript
private lastEventTimestamp = 0;

onUpdate(event: SortableEvent): void {
  const now = Date.now();

  // Skip if same event fired within 50ms
  if (now - this.lastEventTimestamp < 50) {
    return;
  }
  this.lastEventTimestamp = now;

  // Process the update
  moveItemInArray(this.array, event.oldIndex, event.newIndex);
}
```

## Recommended Events for Manual Mode

| Scenario               | Recommended Event | Why                               |
| ---------------------- | ----------------- | --------------------------------- |
| Reorder within list    | `update`          | Specific to same-list changes     |
| Transfer between lists | `add` + `remove`  | Clear source/target separation    |
| Validation before drop | `move`            | Can return false to cancel        |
| Track any change       | `end`             | Fires once per drag operation     |
| Detect selection       | `choose`          | Know when user starts interacting |

## Event Properties

Each `SortableEvent` contains useful information:

```typescript
interface SortableEvent {
  oldIndex?: number; // Original position
  newIndex?: number; // New position
  item: HTMLElement; // The dragged DOM element
  from: HTMLElement; // Source list element
  to: HTMLElement; // Target list element
  clone?: HTMLElement; // Clone element (in clone mode)
  // ... and more
}
```

In manual mode, use these properties to determine exactly what changed and update your arrays accordingly.

## Common Pitfalls

### 1. Listening to Too Many Events

**Problem:** Handler fires multiple times for one drag operation.

**Solution:** Choose the most specific event for your use case. For reordering in the same list, use only `update`, not both `update` and `sort`.

### 2. Not Checking for Same Index

**Problem:** Unnecessary processing when item is dropped in the same position.

**Solution:** Always check if `oldIndex === newIndex` and return early.

```typescript
if (event.oldIndex === event.newIndex) return;
```

### 3. Modifying Wrong Array

**Problem:** In multi-list scenarios, updating the wrong source/target array.

**Solution:** Use `event.from` and `event.to` to identify the correct arrays, or use `data-` attributes on list elements.

```typescript
const sourceList = this.getListByElement(event.from);
const targetList = this.getListByElement(event.to);
```

## Advanced: Event Cancellation

You can cancel a drag operation by returning `false` from the `move` event handler:

```typescript
onMove(event: MoveEvent): boolean {
  // Prevent dropping high-priority items into the "Done" list
  if (event.dragged.dataset.priority === 'high' &&
      event.to.dataset.listId === 'done') {
    return false; // Cancels the drag
  }
  return true; // Allows the drag
}
```

This is useful for implementing complex validation rules that prevent certain drag operations entirely.
