import { Component, Input } from '@angular/core';
import {Options} from 'sortablejs';
import { NgFor } from '@angular/common';
import { SortablejsDirective } from 'ng-hub-ui-sortable';

@Component({
    selector: 'app-child-component',
    templateUrl: './child-component.component.html',
    styleUrls: ['./child-component.component.css'],
    imports: [SortablejsDirective, NgFor]
})
export class ChildComponentComponent {

  @Input()
  list: string[];

  options: Options = {
    group: 'test',
  };

}
