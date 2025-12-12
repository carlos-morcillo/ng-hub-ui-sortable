import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'sortable-array',
    loadComponent: () => import('./examples/simple-sortable/simple-sortable.component').then(m => m.SimpleSortableComponent)
  },
  {
    path: 'sortable-form-array',
    loadComponent: () => import('./examples/sortable-form-array/sortable-form-array.component').then(m => m.SortableFormArrayComponent)
  },
  {
    path: 'custom-options',
    loadComponent: () => import('./examples/sortable-with-options/sortable-with-options.component').then(m => m.SortableWithOptionsComponent)
  },
  {
    path: 'multiple-lists',
    loadComponent: () => import('./examples/multiple-lists/multiple-lists.component').then(m => m.MultipleListsComponent)
  },
  {
    path: 'layout-builder',
    loadComponent: () => import('./examples/layout-builder/layout-builder.component').then(m => m.LayoutBuilderComponent)
  },
  {
    path: 'sortable-signal',
    loadComponent: () => import('./examples/sortable-signal/sortable-signal.component').then(m => m.SortableSignalComponent)
  }
];
