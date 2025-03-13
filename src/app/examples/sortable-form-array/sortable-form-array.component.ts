import { Component } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, ReactiveFormsModule } from '@angular/forms';
import { NgFor, JsonPipe } from '@angular/common';
import { SortablejsDirective } from '../../../../projects/ngx-sortablejs/src/lib/sortablejs.directive';

@Component({
    selector: 'app-sortable-form-array',
    templateUrl: './sortable-form-array.component.html',
    styleUrls: ['./sortable-form-array.component.css'],
    imports: [
        SortablejsDirective,
        NgFor,
        ReactiveFormsModule,
        JsonPipe,
    ]
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
