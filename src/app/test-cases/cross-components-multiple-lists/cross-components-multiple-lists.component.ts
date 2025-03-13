import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { ChildComponentComponent } from './child-component/child-component.component';

@Component({
    selector: 'app-cross-components-multiple-lists',
    templateUrl: './cross-components-multiple-lists.component.html',
    styleUrls: ['./cross-components-multiple-lists.component.css'],
    imports: [ChildComponentComponent, JsonPipe]
})
export class CrossComponentsMultipleListsComponent {

  list1 = [
    '1',
    '2',
    '3',
    '4',
    '5',
  ];

  list2 = [
    '6',
    '7',
    '8',
    '9',
    '10',
  ];

}
