import { Component } from '@angular/core';
import { NgFor, JsonPipe } from '@angular/common';
import { SortablejsDirective } from '../../../../projects/ngx-sortablejs/src/lib/sortablejs.directive';

@Component({
    selector: 'app-simple-sortable',
    templateUrl: './simple-sortable.component.html',
    styleUrls: ['./simple-sortable.component.css'],
    imports: [
        SortablejsDirective,
        NgFor,
        JsonPipe,
    ]
})
export class SimpleSortableComponent {

  cities = [
    'Ankara',
    'Moscow',
    'Munich',
    'Paris',
    'Washington',
  ];

}
