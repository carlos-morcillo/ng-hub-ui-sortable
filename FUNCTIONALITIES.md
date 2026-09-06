# Functionalities of Sortable Library

This table details the functionalities of the `ng-hub-ui-sortable` library and indicates which ones
are covered by interactive examples.

The library ships one directive, `[hubSortable]`, three array helpers, a standalone provider and a
deprecated NgModule. It has no styles of its own: list items are dressed by the consumer.

## Directive — core inputs (`[hubSortable]`)

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Data binding** | Plain array (`[hubSortable]="items"`) | ✅ |
| | Reactive forms `FormArray` | ✅ |
| | `WritableSignal<T[]>` | ✅ |
| | No binding at all — the bare `hubSortable` attribute activates the directive | ❌ |
| **Container** | Nested sortable element (`container`) | ❌ |
| **Options** | Whole SortableJS options object (`options`) | ✅ |
| | Live option updates on a new object reference | ❌ |
| **Update mode** | Automatic array mutation (`autoUpdateArray`, default `true`) | ✅ |
| | Manual mode (`[autoUpdateArray]="false"`) | ✅ |
| **Cloning** | Custom clone factory (`cloneFunction`) | ❌ |

## Directive — SortableJS option inputs

Every option below can be bound either as its own input or through the `options` object.

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Grouping** | `group` | ✅ |
| | `sort` | ❌ |
| | `disabled` | ❌ |
| **Selection** | `draggable` | ✅ |
| | `handle` | ✅ |
| | `filter` | ✅ |
| | `preventOnFilter` | ✅ |
| | `ignore` | ❌ |
| **Timing** | `delay` | ❌ |
| | `delayOnTouchOnly` | ❌ |
| | `touchStartThreshold` | ❌ |
| **Animation** | `animation` | ✅ |
| | `easing` | ❌ |
| **Classes** | `ghostClass` | ✅ |
| | `chosenClass` | ❌ |
| | `dragClass` | ❌ |
| **Fallback (no HTML5 DnD)** | `forceFallback` | ❌ |
| | `fallbackClass` | ❌ |
| | `fallbackOnBody` | ✅ |
| | `fallbackTolerance` | ❌ |
| | `fallbackOffset` | ❌ |
| **Swap behaviour** | `direction` | ❌ |
| | `swapThreshold` | ❌ |
| | `invertSwap` | ❌ |
| | `invertedSwapThreshold` | ❌ |
| | `emptyInsertThreshold` | ❌ |
| **Cloning** | `removeCloneOnHide` | ❌ |
| **Bubbling** | `dropBubble` | ❌ |
| | `dragoverBubble` | ❌ |
| **Persistence** | `dataIdAttr` | ✅ |
| | `store` | ❌ |
| | `setData` | ❌ |

## Directive — outputs

Every output is an `OutputEmitterRef` declared with `output()`, re-entered into Angular's zone
before it emits.

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Lifecycle** | `init` — the SortableJS instance | ❌ |
| **Drag** | `start` | ✅ |
| | `end` | ✅ |
| | `move` (return `false` to veto) | ❌ |
| **Selection** | `choose` | ❌ |
| | `unchoose` | ❌ |
| **Ordering** | `update` — reorder within one list | ✅ |
| | `sortEvent` — any ordering change | ❌ |
| | `change` | ✅ |
| **Transfers** | `add` — item arrives from another list | ✅ |
| | `remove` — item leaves for another list | ✅ |
| | `clone` — clone created in `pull: 'clone'` mode | ❌ |
| **Filtering** | `filterEvent` — drag attempted on a filtered item | ❌ |

## Array helpers (manual mode)

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Reordering** | `moveItemInArray(array, from, to)` | ✅ |
| **Transfer** | `transferArrayItem(source, target, from, to)` | ✅ |
| | `copyArrayItem(source, target, from, to)` | ❌ |
| **Semantics** | Out-of-range indexes are a silent no-op | ❌ |

## Configuration

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Global options** | `provideSortable(options)` | ❌ |
| | Precedence: individual inputs over `options` over the global defaults | ❌ |
| **NgModule** | `SortableModule` / `SortableModule.forRoot()` (deprecated) | ❌ |

## Types

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Own types** | `SortableData`, `SortableEventName`, `SortableMoveEventPayload` | ❌ |
| **Re-exports** | `Sortable`, `SortableEvent`, `Options`, `MoveEvent`, `GroupOptions`, `PullResult`, `PutResult` | ✅ |

## Platform

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **SSR** | No SortableJS instance without a `window` | ❌ |
| **Zone** | Instance created outside Angular, events re-entered into it | ❌ |
| **Console** | The library never writes to the consuming application's console | ❌ |
| **Accessibility** | Pointer-only: no keyboard or screen-reader path (see the README) | ❌ |
