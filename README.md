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

Angular bindings for [SortableJS](https://github.com/SortableJS/Sortable), providing a powerful and flexible directive for creating drag-and-drop sortable lists. This package is a fork of `@worktile/ngx-sortablejs`, keeping the same API while refreshing the branding and metadata to align with the ng-hub-ui family.

## Features

- **Directive-based** - Simple directive API for adding sortable functionality to any container
- **Array binding** - Automatically syncs drag-and-drop operations with your data array
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
import { SortablejsModule } from 'ng-hub-ui-sortable';

@NgModule({
  imports: [
    SortablejsModule.forRoot({ animation: 150 })
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
<div [sortablejs]="items" [sortablejsOptions]="{ animation: 150 }">
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
import { SortablejsModule } from 'ng-hub-ui-sortable';

@NgModule({
  imports: [
    SortablejsModule.forRoot({ animation: 150 })
  ]
})
export class AppModule {}
```

### 2. Standalone Component Import

```typescript
import { Component } from '@angular/core';
import { SortablejsModule } from 'ng-hub-ui-sortable';

@Component({
  selector: 'app-sortable-list',
  standalone: true,
  imports: [SortablejsModule],
  template: `
    <div [sortablejs]="items" [sortablejsOptions]="{ animation: 150 }">
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

### Inputs

| Input                    | Type                     | Description                                                                                              |
|--------------------------|--------------------------|----------------------------------------------------------------------------------------------------------|
| `sortablejs`             | `any[]` or `FormArray`   | Model binding that stays in sync with drag-and-drop operations                                           |
| `sortablejsContainer`    | `string`                 | Optional CSS selector for the real sortable container when the host is wrapped by another component      |
| `sortablejsOptions`      | `Options`                | Native SortableJS options. Provide a new object reference to trigger option updates                      |
| `sortablejsCloneFunction`| `(item: any) => any`     | Custom clone function for clone mode                                                                     |

### Outputs

| Output           | Type                        | Description                                        |
|------------------|-----------------------------|----------------------------------------------------|
| `sortablejsInit` | `EventEmitter<Sortable>`    | Emits the instantiated Sortable instance on init   |

## SortableJS Options

All SortableJS options can be passed via `sortablejsOptions`. They are proxied into Angular's zone to keep change detection predictable.

### Common Options

```typescript
interface SortablejsOptions {
  animation?: number;        // Animation speed in ms
  handle?: string;           // CSS selector for drag handle
  filter?: string;           // CSS selector for elements to ignore
  draggable?: string;        // CSS selector for draggable items
  ghostClass?: string;       // Class for the drop placeholder
  chosenClass?: string;      // Class for the chosen item
  dragClass?: string;        // Class for the dragging item
  group?: string | object;   // Group name for multi-list drag
  sort?: boolean;            // Enable sorting within list
  disabled?: boolean;        // Disable the sortable
  // ... and many more
}
```

### Event Callbacks

```typescript
{
  onStart: (event) => { /* Drag started */ },
  onEnd: (event) => { /* Drag ended */ },
  onAdd: (event) => { /* Item added from another list */ },
  onRemove: (event) => { /* Item removed to another list */ },
  onUpdate: (event) => { /* Item order changed within list */ },
  onSort: (event) => { /* Any sorting change */ },
  onChange: (event) => { /* Item moved within or between lists */ },
  onChoose: (event) => { /* Item chosen */ },
  onUnchoose: (event) => { /* Item unchosen */ },
  onFilter: (event) => { /* Filtered element clicked */ },
  onClone: (event) => { /* Clone created */ }
}
```

## Examples

### Simple Sortable List

```html
<ul [sortablejs]="items">
  @for (item of items; track item) {
    <li>{{ item }}</li>
  }
</ul>
```

### With Animation and Handle

```html
<div [sortablejs]="items" [sortablejsOptions]="{ animation: 150, handle: '.drag-handle' }">
  @for (item of items; track item.id) {
    <div class="item">
      <span class="drag-handle">&#9776;</span>
      {{ item.name }}
    </div>
  }
</div>
```

### Multiple Connected Lists

```typescript
@Component({
  selector: 'app-multi-list',
  standalone: true,
  imports: [SortablejsModule],
  template: `
    <div class="list" [sortablejs]="list1" [sortablejsOptions]="options">
      @for (item of list1; track item) {
        <div>{{ item }}</div>
      }
    </div>
    <div class="list" [sortablejs]="list2" [sortablejsOptions]="options">
      @for (item of list2; track item) {
        <div>{{ item }}</div>
      }
    </div>
  `
})
export class MultiListComponent {
  list1 = ['Item 1', 'Item 2', 'Item 3'];
  list2 = ['Item 4', 'Item 5', 'Item 6'];

  options = {
    group: 'shared',
    animation: 150
  };
}
```

### With FormArray

```typescript
@Component({
  selector: 'app-form-array',
  standalone: true,
  imports: [ReactiveFormsModule, SortablejsModule],
  template: `
    <form [formGroup]="form">
      <div [sortablejs]="formArray" [sortablejsOptions]="{ animation: 150 }">
        @for (control of formArray.controls; track control; let i = $index) {
          <div>
            <input [formControlName]="i" />
          </div>
        }
      </div>
    </form>
  `
})
export class FormArrayComponent {
  form = new FormGroup({
    items: new FormArray([
      new FormControl('Item 1'),
      new FormControl('Item 2'),
      new FormControl('Item 3')
    ])
  });

  get formArray() {
    return this.form.get('items') as FormArray;
  }
}
```

### Clone Mode

```typescript
@Component({
  selector: 'app-clone',
  standalone: true,
  imports: [SortablejsModule],
  template: `
    <div [sortablejs]="items"
         [sortablejsOptions]="cloneOptions"
         [sortablejsCloneFunction]="cloneItem">
      @for (item of items; track item.name) {
        <div>{{ item.name }}</div>
      }
    </div>
  `
})
export class CloneComponent {
  items = [{ name: 'Item 1' }, { name: 'Item 2' }];

  cloneOptions = {
    group: {
      name: 'clone-group',
      pull: 'clone',
      put: false
    }
  };

  cloneItem = (item: any) => ({ ...item, name: `${item.name} (copy)` });
}
```

### Custom Container

For cases where the directive host is wrapped by another component (e.g., Angular Material):

```html
<mat-list [sortablejs]="items" sortablejsContainer=".mat-list-inner">
  @for (item of items; track item) {
    <mat-list-item>{{ item }}</mat-list-item>
  }
</mat-list>
```

## Real-world Use Cases

The `ng-hub-ui-sortable` component is versatile and can be used in various real-world applications:

- **Task Lists** - Reorder tasks by priority with drag-and-drop
- **Playlist Managers** - Arrange media items in custom order
- **Form Builders** - Drag-and-drop form field ordering
- **Dashboard Widgets** - User-customizable widget layouts
- **Photo Galleries** - Rearrange images in albums
- **Menu Editors** - CMS navigation menu ordering
- **Kanban Boards** - (For advanced boards, see [ng-hub-ui-board](https://www.npmjs.com/package/ng-hub-ui-board))

## Troubleshooting

Here are some common issues and how to resolve them:

### Drag and drop not working
- **Check imports**: Ensure `SortablejsModule` is properly imported
- **Verify binding**: Make sure `[sortablejs]` is bound to an array or FormArray
- **Check container**: Items must be direct children of the sortable container

### Array not updating
- **Reference check**: SortableJS modifies the array in place; ensure change detection picks it up
- **Zone issues**: If using `OnPush`, you may need to trigger change detection manually

### Events not firing
- **Zone proxying**: Events are proxied through Angular's zone automatically
- **Option reference**: Provide a new object reference to `sortablejsOptions` when updating options

### Multi-list issues
- **Group name**: Ensure all lists share the same `group` name in options
- **Module import**: `SortablejsModule` must be imported in both components' modules

### FormArray sync issues
- **Direct binding**: Bind the FormArray directly, not the parent FormGroup
- **Control access**: Access controls via `formArray.controls` in your template

If problems persist, open an issue at: https://github.com/carlos-morcillo/ng-hub-ui-sortable/issues

## Scripts

| Command            | Description                                                    |
|--------------------|----------------------------------------------------------------|
| `npm run start`    | Run the demo app locally                                       |
| `npm run build:app`| Production build for GitHub Pages (base href `/ng-hub-ui-sortable/`) |
| `npm run build:lib`| Build the library package                                      |
| `npm run test:app` | Run demo app tests                                             |
| `npm run pub`      | Publish workflow (uses `wpm publish` then `npm publish`)       |

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## Support the Project

If you find this project helpful and would like to support its development, you can buy me a coffee:

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/carlosmorcillo)

Your support is greatly appreciated and helps maintain and improve this project!

## License

This project is licensed under the **Creative Commons Attribution 4.0 International License (CC BY 4.0)**.

### What this means:

**You can:**
- Use commercially and non-commercially
- Modify, adapt, and create derivatives
- Distribute and redistribute in any format
- Use in private and public projects

**You must:**
- Give appropriate credit to the original authors
- Provide a link to the license
- Indicate if changes were made

### Example attribution:

```
Based on ng-hub-ui-sortable by Carlos Morcillo
Original: https://github.com/carlos-morcillo/ng-hub-ui-sortable
License: CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)
```

For full license details, see the [LICENSE](LICENSE) file.

---

Made with love by [Carlos Morcillo Fernandez](https://www.carlosmorcillo.com/)
