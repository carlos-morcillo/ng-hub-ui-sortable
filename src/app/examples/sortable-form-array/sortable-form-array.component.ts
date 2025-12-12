import { Component } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { SortableDirective } from 'ng-hub-ui-sortable';

@Component({
    selector: 'app-sortable-form-array',
    templateUrl: './sortable-form-array.component.html',
    styleUrls: ['./sortable-form-array.component.css'],
    imports: [SortableDirective, ReactiveFormsModule, JsonPipe],
})
export class SortableFormArrayComponent {

  citiesControls = new UntypedFormArray([
    'Ankara',
    'Moscow',
    'Munich',
    'Paris',
    'Washington',
  ].map(city => new UntypedFormControl(city)));

}
