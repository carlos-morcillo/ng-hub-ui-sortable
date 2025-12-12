import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SortableModule } from 'ng-hub-ui-sortable';
import { MultipleListsComponent } from './multiple-lists/multiple-lists.component';
import { LayoutBuilderComponent } from './layout-builder/layout-builder.component';
import { SimpleSortableComponent } from './simple-sortable/simple-sortable.component';
import { SortableFormArrayComponent } from './sortable-form-array/sortable-form-array.component';
import { SortableWithOptionsComponent } from './sortable-with-options/sortable-with-options.component';
import { SortableSignalComponent } from './sortable-signal/sortable-signal.component';

@NgModule({
    imports: [
        CommonModule,
        SortableModule,
        ReactiveFormsModule,
        SimpleSortableComponent,
        SortableWithOptionsComponent,
        SortableFormArrayComponent,
        MultipleListsComponent,
        LayoutBuilderComponent,
        SortableSignalComponent,
    ],
})
export class ExamplesModule { }
