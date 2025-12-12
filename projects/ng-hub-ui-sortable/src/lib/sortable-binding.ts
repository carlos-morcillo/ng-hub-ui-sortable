import { isSignal, WritableSignal } from '@angular/core';
import { SortableData } from './sortable.types';

export class SortableBinding {

  constructor(private target: SortableData) {}

  private isSignalArray(): boolean {
    return isSignal(this.target) && typeof (this.target as any).set === "function";
  }

  private get arrayValue(): any[] {
    return this.isSignalArray()
      ? (this.target as WritableSignal<any[]>)()
      : (this.target as any[]);
  }

  private set arrayValue(next: any[]) {
    if (this.isSignalArray()) {
      (this.target as WritableSignal<any[]>).set(next);
    } else {
      (this.target as any[]).splice(0, (this.target as any[]).length, ...next);
    }
  }

  insert(index: number, item: any) {
    if (this.isFormArray()) {
      this.target.insert(index, item);
    } else if (this.isSignalArray()) {
      const copy = [...this.arrayValue];
      copy.splice(index, 0, item);
      this.arrayValue = copy;
    } else {
      this.target.splice(index, 0, item);
    }
  }

  get(index: number) {
    return this.isFormArray() ? this.target.at(index) : this.arrayValue[index];
  }

  remove(index: number) {
    let item;

    if (this.isFormArray()) {
      item = this.target.at(index);
      this.target.removeAt(index);
    } else if (this.isSignalArray()) {
      const copy = [...this.arrayValue];
      item = copy.splice(index, 1)[0];
      this.arrayValue = copy;
    } else {
      item = this.target.splice(index, 1)[0];
    }

    return item;
  }

  // we need this to identify that the target is a FormArray
  // we don't want to have a dependency on @angular/forms just for that
  private isFormArray(): boolean {
    // just checking for random FormArray methods not available on a standard array
    return !!(this.target as any).at && !!(this.target as any).insert && !!(this.target as any).reset;
  }

}
