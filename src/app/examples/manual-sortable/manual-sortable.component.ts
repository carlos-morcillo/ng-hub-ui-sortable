import { JsonPipe } from "@angular/common";
import { Component } from "@angular/core";
import {
  SortableDirective,
  moveItemInArray,
  transferArrayItem,
} from "ng-hub-ui-sortable";
import { SortableEvent } from "sortablejs";

/**
 * Example component demonstrating manual array control mode.
 *
 * This example shows how to use the autoUpdateArray flag set to false,
 * giving you complete control over when and how arrays are updated during
 * drag-and-drop operations. This approach is similar to Angular CDK's
 * drag-and-drop functionality.
 *
 * Benefits of manual control:
 * - Perform validation before updating arrays
 * - Make API calls to persist changes
 * - Use immutable data patterns
 * - Implement undo/redo functionality
 * - Add custom business logic to drag operations
 */
@Component({
  selector: "app-manual-sortable",
  templateUrl: "./manual-sortable.component.html",
  styleUrls: ["./manual-sortable.component.css"],
  standalone: true,
  imports: [SortableDirective, JsonPipe],
})
export class ManualSortableComponent {
  /**
   * Simple task list for demonstrating manual reordering
   */
  tasks = [
    { id: 1, title: "Design UI mockups", completed: false },
    { id: 2, title: "Implement authentication", completed: false },
    { id: 3, title: "Write unit tests", completed: false },
    { id: 4, title: "Deploy to production", completed: false },
  ];

  /**
   * Lists for demonstrating transfer between multiple lists
   */
  todoList = [
    { id: 5, title: "Review pull requests", priority: "high" },
    { id: 6, title: "Update documentation", priority: "medium" },
    { id: 7, title: "Refactor legacy code", priority: "low" },
  ];

  inProgressList = [
    { id: 8, title: "Fix bug #123", priority: "high" },
    { id: 9, title: "Add new feature", priority: "medium" },
  ];

  doneList = [{ id: 10, title: "Initial setup", priority: "high" }];

  /**
   * Tracking array for operation history (for demonstration)
   */
  operationsLog: string[] = [];

  /**
   * Timestamp of last update event to prevent duplicate calls
   */
  private lastUpdateTimestamp: number = 0;

  /**
   * Handler for update events within the same list.
   * This is called when items are reordered within the tasks list.
   *
   * @param event - SortableJS event containing oldIndex and newIndex
   */
  onTasksUpdate(event: SortableEvent): void {
    const now = Date.now();
    console.log("[onTasksUpdate] Called with event:", {
      oldIndex: event.oldIndex,
      newIndex: event.newIndex,
      timestamp: new Date().toISOString(),
    });

    // Prevent duplicate calls within 50ms (angular change detection might trigger this)
    if (now - this.lastUpdateTimestamp < 50) {
      console.log("[onTasksUpdate] Skipping - duplicate call within 50ms");
      return;
    }
    this.lastUpdateTimestamp = now;

    if (event.oldIndex === undefined || event.newIndex === undefined) {
      console.log("[onTasksUpdate] Skipping - undefined indices");
      return;
    }

    // If indices are the same, no operation needed
    if (event.oldIndex === event.newIndex) {
      console.log("[onTasksUpdate] Skipping - same index");
      return;
    }

    // Capture task info BEFORE moving
    const task = this.tasks[event.oldIndex];
    console.log("[onTasksUpdate] Moving task:", task.title);

    this.logOperation(
      `Reordered "${task.title}" from position ${event.oldIndex} to ${event.newIndex}`,
    );

    // Manually update the array using the helper function
    moveItemInArray(this.tasks, event.oldIndex, event.newIndex);

    console.log("[onTasksUpdate] Array updated successfully");
  }

  /**
   * Handler for add events when items are dropped into a list.
   * This is called on the target list when receiving an item.
   *
   * @param event - SortableJS event
   * @param targetList - The list receiving the item
   * @param listName - Name of the target list for logging
   */
  onListAdd(event: SortableEvent, targetList: any[], listName: string): void {
    if (event.newIndex === undefined || event.oldIndex === undefined) {
      return;
    }

    // Determine which list the item came from
    const sourceList = this.getListByElement(event.from);
    if (!sourceList) {
      return;
    }

    const item = sourceList[event.oldIndex];
    this.logOperation(`Moved "${item.title}" to ${listName}`);

    // Manually transfer the item using the helper function
    transferArrayItem(sourceList, targetList, event.oldIndex, event.newIndex);
  }

  /**
   * Handler for remove events when items are dragged out of a list.
   * Note: In manual mode, we handle the actual removal in the onListAdd handler
   * to ensure the operation is atomic.
   *
   * @param event - SortableJS event
   */
  onListRemove(event: SortableEvent): void {
    // In manual mode with transferArrayItem, the removal is handled
    // automatically by the add handler on the target list
    // This event can be used for additional logging or validation
  }

  /**
   * Handler for update events in the multi-list scenario.
   *
   * @param event - SortableJS event
   * @param list - The list being reordered
   * @param listName - Name of the list for logging
   */
  onListUpdate(event: SortableEvent, list: any[], listName: string): void {
    if (event.oldIndex === undefined || event.newIndex === undefined) {
      return;
    }

    const item = list[event.oldIndex];
    this.logOperation(
      `Reordered "${item.title}" within ${listName} from ${event.oldIndex} to ${event.newIndex}`,
    );

    moveItemInArray(list, event.oldIndex, event.newIndex);
  }

  /**
   * Helper method to get the list array by the DOM element.
   * This is used to identify which list an item came from.
   *
   * @param element - The DOM element of the source list
   * @returns The source array or null if not found
   */
  private getListByElement(element: HTMLElement): any[] | null {
    const listId = element.getAttribute("data-list-id");
    switch (listId) {
      case "todo":
        return this.todoList;
      case "in-progress":
        return this.inProgressList;
      case "done":
        return this.doneList;
      default:
        return null;
    }
  }

  /**
   * Logs an operation to the operations log.
   *
   * @param message - Message to log
   */
  private logOperation(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    this.operationsLog.unshift(`[${timestamp}] ${message}`);

    // Keep only last 10 operations
    if (this.operationsLog.length > 10) {
      this.operationsLog = this.operationsLog.slice(0, 10);
    }
  }

  /**
   * Clears the operations log.
   */
  clearLog(): void {
    this.operationsLog = [];
  }
}
