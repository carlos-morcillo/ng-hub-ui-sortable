import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { SortablejsDirective } from 'ng-hub-ui-sortable';

@Component({
    selector: 'app-simple-sortable',
    templateUrl: './simple-sortable.component.html',
    styleUrls: ['./simple-sortable.component.css'],
    imports: [
    SortablejsDirective,
    JsonPipe
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
