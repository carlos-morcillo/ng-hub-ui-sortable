import {Component} from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import {SortableModule} from './sortable.module';

describe('SortableDirective', () => {
  @Component({
    template: `
      <div [hubUISortable]="items">
        @for (item of items; track item) {
          <div>{{item}}</div>
        }
      </div>
      `,
    imports: [SortableModule]
})
  class TestComponent1 {
    items = [1, 2, 3, 4, 5];
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        SortableModule,
        TestComponent1,
    ],
}).compileComponents();
  }));

  it('should create', () => {
    const fixture = TestBed.createComponent(TestComponent1);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
