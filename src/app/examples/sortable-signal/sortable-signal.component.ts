import { JsonPipe } from "@angular/common";
import { Component, signal } from "@angular/core";
import { SortableDirective } from "ng-hub-ui-sortable";

@Component({
  selector: "app-sortable-signal",
  standalone: true,
  templateUrl: "./sortable-signal.component.html",
  styleUrls: ["./sortable-signal.component.css"],
  imports: [SortableDirective, JsonPipe],
})
export class SortableSignalComponent {
  frameworks = signal([
    { name: "Angular", version: "18", id: "ng" },
    { name: "React", version: "19", id: "react" },
    { name: "Vue", version: "3", id: "vue" },
    { name: "Svelte", version: "5", id: "svelte" },
  ]);

  get frameworkNames(): string[] {
    return this.frameworks().map((fw) => fw.name);
  }
}
