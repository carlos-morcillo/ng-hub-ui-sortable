import { JsonPipe } from "@angular/common";
import { Component } from "@angular/core";
import { SortableDirective } from "ng-hub-ui-sortable";
import { Options } from "sortablejs";

@Component({
  selector: "app-sortable-with-options",
  templateUrl: "./sortable-with-options.component.html",
  styleUrls: ["./sortable-with-options.component.css"],
  imports: [SortableDirective, JsonPipe],
})
export class SortableWithOptionsComponent {
  draggableItems = [
    { draggable: true, text: "1" },
    { draggable: true, text: "2" },
    { draggable: false, text: "3" },
    { draggable: true, text: "4" },
    { draggable: true, text: "5" },
  ];

  eventItems = ["1", "2", "3", "4", "5"];

  eventUpdateCounter = 0;

  scrollableItems = Array.from({ length: 30 }).map((u, i) => i + 1);

  draggableOptions: Options = {
    filter: ".disabled",
    preventOnFilter: true,
  };

  eventOptions: Options = {
    onUpdate: () => this.eventUpdateCounter++,
  };

  scrollableOptions: Options = {
    scroll: true,
    scrollSensitivity: 100,
  };

  getDraggableValues(): string[] {
    return this.draggableItems.map((item) => item.text);
  }
}
