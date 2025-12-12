# ng-hub-ui-sortable

[![npm version](https://badge.fury.io/js/ng-hub-ui-sortable.svg)](https://badge.fury.io/js/ng-hub-ui-sortable)

## Part of ng-hub-ui Family

This component is part of the ng-hub-ui ecosystem, which includes:

- [ng-hub-ui-paginable](https://www.npmjs.com/package/ng-hub-ui-paginable)
- [ng-hub-ui-modal](https://www.npmjs.com/package/ng-hub-ui-modal)
- [ng-hub-ui-stepper](https://www.npmjs.com/package/ng-hub-ui-stepper)
- [ng-hub-ui-breadcrumbs](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs)
- [ng-hub-ui-portal](https://www.npmjs.com/package/ng-hub-ui-portal)
- [ng-hub-ui-avatar](https://www.npmjs.com/package/ng-hub-ui-avatar)
- [ng-hub-ui-accordion](https://www.npmjs.com/package/ng-hub-ui-accordion)
- [ng-hub-ui-board](https://www.npmjs.com/package/ng-hub-ui-board)

## Description

**ng-hub-ui-sortable** provides a complete, modern integration of [SortableJS](https://github.com/SortableJS/Sortable) for Angular, letting you build interactive UIs with drag-and-drop in a simple, declarative way. With a directive-based API, you can turn any list into a sortable experience by adding a single attribute to your template.

The library covers simple scenarios like reordering items in a list, as well as advanced cases such as **nested lists**, transferring items between multiple lists, item cloning, integration with Angular Reactive Forms (`FormArray`) and **Angular Signals** (`WritableSignal`), plus full customization through options and events. Every drag-and-drop operation syncs automatically with your data model, keeping your app reactive and predictable.

This package is a fork of `@worktile/ngx-sortablejs`, keeping the same robust API while updating branding and metadata to align with the ng-hub-ui family.

## Features

- **Directive-based** - Simple directive API for adding sortable functionality to any container
- **Array binding** - Automatically syncs drag-and-drop operations with your data array
- **Signal support** - Native integration with Angular writable signals for reactive state management
- **FormArray support** - Native integration with Angular Reactive Forms FormArray
- **Full SortableJS API** - Access to all SortableJS options and events
- **Zone integration** - Events are properly proxied into Angular's zone for predictable change detection
- **Clone mode** - Support for cloning items with custom clone functions
- **Multi-list support** - Drag items between multiple connected lists
- **TypeScript support** - Full type safety with proper typings

## Installation

```bash
# Install the component and SortableJS
npm install ng-hub-ui-sortable sortablejs

# Install types for development
npm install -D @types/sortablejs
```

Or using yarn:

```bash
yarn add ng-hub-ui-sortable sortablejs
yarn add -D @types/sortablejs
```

### Peer Requirements

- Angular `>=18.0.0`
- SortableJS `>=1.7.0`

## Quick Start

Here's a quick example to get you started with `ng-hub-ui-sortable`.

### 1. Import the module

```typescript
import { SortableModule } from 'ng-hub-ui-sortable';

@NgModule({
  imports: [
    SortableModule.forRoot({ animation: 150 })
  ]
})
export class AppModule {}
```

### 2. Create your component

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-sortable-demo',
  templateUrl: './sortable-demo.component.html'
})
export class SortableDemoComponent {
  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
}
```

### 3. Use in your template

```html
<div [hubUISortable]="items" [options]="{ animation: 150 }">
  @for (item of items; track item) {
    <div class="sortable-item">{{ item }}</div>
  }
</div>
```

## Usage

The component can be used in two ways:

### 1. Module Import with Global Options (Recommended)

```typescript
import { NgModule } from '@angular/core';
import { SortableModule } from 'ng-hub-ui-sortable';

@NgModule({
  imports: [
    SortableModule.forRoot({ animation: 150 })
  ]
})
export class AppModule {}
```

### 2. Standalone Component Import

```typescript
import { Component } from '@angular/core';
import { SortableModule } from 'ng-hub-ui-sortable';

@Component({
  selector: 'app-sortable-list',
  standalone: true,
  imports: [SortableModule],
  template: `
    <div [hubUISortable]="items" [options]="{ animation: 150 }">
      @for (item of items; track item) {
        <div class="sortable-item">{{ item }}</div>
      }
    </div>
  `
})
export class SortableListComponent {
  items = ['Item 1', 'Item 2', 'Item 3'];
}
```

## Directive API

### Primary Inputs

| Input            | Type                                      | Description                                                                                              |
|------------------|-------------------------------------------|----------------------------------------------------------------------------------------------------------|
| `items`          | `any[]`, `FormArray`, or `WritableSignal<any[]>` | Model binding that stays in sync with drag-and-drop operations (used with alias `[hubSortable]`)         |
| `container`      | `string`                                  | Optional CSS selector for the real sortable container when the host is wrapped by another component      |
| `options`        | `Options`                                 | Native SortableJS options object. Provide a new object reference to trigger option updates               |
| `cloneFunction`  | `(item: any) => any`                      | Custom clone function for clone mode. Allows you to customize how items are cloned                       |

### SortableJS Option Inputs

All SortableJS options can be passed either through the `[options]` input or as individual inputs:

| Input                  | Type                  | Description                                                                                   |
|------------------------|-----------------------|-----------------------------------------------------------------------------------------------|
| `group`                | `string \| object`    | Group name or options for dragging between lists                                              |
| `sort`                 | `boolean`             | Enable/disable sorting within the list                                                        |
| `delay`                | `number`              | Time in milliseconds to define when sorting should start                                      |
| `disabled`             | `boolean`             | Disable the sortable if set to true                                                           |
| `draggable`            | `string`              | CSS selector for draggable items within the container                                         |
| `handle`               | `string`              | CSS selector for drag handle within list items                                                |
| `animation`            | `number`              | Animation speed in milliseconds when sorting                                                  |
| `ghostClass`           | `string`              | CSS class applied to the ghost element during drag                                            |
| `chosenClass`          | `string`              | CSS class applied to the chosen element                                                       |
| `dragClass`            | `string`              | CSS class applied to the dragging element                                                     |
| `fallbackOnBody`       | `boolean`             | Append ghost element to document body                                                         |
| `fallbackTolerance`    | `number`              | Number of pixels a point should move before triggering drag                                   |
| `fallbackClass`        | `string`              | CSS class applied when using forceFallback                                                    |
| `fallbackOffset`       | `object`              | Fallback offset configuration                                                                 |
| `forceFallback`        | `boolean`             | Force the fallback to activate                                                                |
| `filter`               | `string \| function`  | CSS selector or function to filter items that should not be draggable                         |
| `preventOnFilter`      | `boolean`             | Call preventDefault on filter event                                                           |
| `direction`            | `string`              | Direction of Sortable ('vertical' or 'horizontal', auto-detected if not provided)            |
| `swapThreshold`        | `number`              | Threshold of swap zone (0-1)                                                                  |
| `invertSwap`           | `boolean`             | Inverts swap threshold direction                                                              |
| `invertedSwapThreshold`| `number`              | Threshold when swapping direction is inverted                                                 |
| `removeCloneOnHide`    | `boolean`             | Remove clone element when not showing                                                         |
| `ignore`               | `string`              | CSS selector for elements to ignore                                                           |
| `touchStartThreshold`  | `number`              | Number of pixels a point should move before cancelling a delayed drag event                   |
| `emptyInsertThreshold` | `number`              | Distance mouse must be from empty sortable to insert drag element into it                     |
| `dropBubble`           | `boolean`             | Enable drop bubble                                                                            |
| `dragoverBubble`       | `boolean`             | Enable dragover bubble                                                                        |
| `dataIdAttr`           | `string`              | HTML attribute that defines the data id                                                       |
| `delayOnTouchOnly`     | `boolean`             | Only delay on touch devices                                                                   |
| `easing`               | `string`              | Easing for animation (e.g., 'cubic-bezier(1, 0, 0, 1)')                                       |
| `setData`              | `function`            | Function to set data for dragover/drop events                                                 |
| `store`                | `object`              | Store module for saving and restoring the sort order                                          |

### Outputs

All outputs emit events that are proxied through Angular's zone for proper change detection:

| Output       | Type                                                      | Description                                                        |
|--------------|-----------------------------------------------------------|--------------------------------------------------------------------|
| `init`       | `EventEmitter<Sortable>`                                  | Emits the instantiated Sortable instance on initialization         |
| `start`      | `EventEmitter<SortableEvent>`                             | Fired when dragging starts                                         |
| `end`        | `EventEmitter<SortableEvent>`                             | Fired when dragging ends                                           |
| `add`        | `EventEmitter<SortableEvent>`                             | Fired when an item is added from another list                      |
| `remove`     | `EventEmitter<SortableEvent>`                             | Fired when an item is removed to another list                      |
| `update`     | `EventEmitter<SortableEvent>`                             | Fired when items are reordered within the same list                |
| `sortEvent`  | `EventEmitter<SortableEvent>`                             | Fired when sorting happens (any change)                            |
| `change`     | `EventEmitter<SortableEvent>`                             | Fired when items are added or removed (list changed)               |
| `choose`     | `EventEmitter<SortableEvent>`                             | Fired when an item is selected (mouse down)                        |
| `unchoose`   | `EventEmitter<SortableEvent>`                             | Fired when an item is deselected (mouse up without drag)           |
| `clone`      | `EventEmitter<SortableEvent>`                             | Fired when an item is cloned                                       |
| `filterEvent`| `EventEmitter<SortableEvent>`                             | Fired when attempting to drag a filtered item                      |
| `move`       | `EventEmitter<{ event: MoveEvent; originalEvent: Event }>`| Fired during drag movement                                         |
