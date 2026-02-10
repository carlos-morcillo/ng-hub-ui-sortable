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

## Automatic Duplicate Prevention

SortableJS naturally fires multiple events for consistent operations (e.g., `update` and `sort` both fire when reordering). Additionally, when frameworks like Angular re-render the DOM after an array update, SortableJS might detect this as another change and fire events again.

**ng-hub-ui-sortable handles this automatically in manual mode.**

- The directive includes internal guards to prevent `update` and `add` events from being emitted multiple times for a single drag operation.
- It automatically reverts SortableJS's DOM changes before emitting events, ensuring that your manual array update dictates the final DOM structure without conflicts.

This means you **do NOT need to implement debouncing** or timestamp checks in your component. You can trust that `(update)` will fire exactly once per valid drop operation.

## Best Practices for Event Handling

### In Manual Mode:

```typescript
import { SortableEvent, moveItemInArray } from 'ng-hub-ui-sortable';

// ✅ Good: Simple and clean
onTaskUpdate(event: SortableEvent): void {
  // Always check indices
  if (event.oldIndex === undefined || event.newIndex === undefined) return;

  // Prevent unnecessary work
  if (event.oldIndex === event.newIndex) return;

  moveItemInArray(this.tasks, event.oldIndex, event.newIndex);
}
```

### Choosing the Right Event

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
import { SortableEvent } from "ng-hub-ui-sortable";

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

**Problem:** Handling logic runs multiple times because you listen to `update`, `sort`, and `end`.

**Solution:** Choose the most specific event for your use case (usually `update` for reordering).

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
import { MoveEvent } from 'ng-hub-ui-sortable';

onMove(event: MoveEvent): boolean {
  // Prevent dropping high-priority items into the "Done" list
  if (event.dragged.dataset.priority === 'high' &&
      event.to.dataset.listId === 'done') {
    return false; // Cancels the drag
  }
  return true; // Allows the drag
}
```
