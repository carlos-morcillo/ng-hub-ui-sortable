import {Component} from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import {SortablejsModule} from './sortablejs.module';

describe('SortablejsDirective', () => {
  @Component({
    template: `
      <div [sortablejs]="items">
        <div *ngFor="let item of items">{{item}}</div>
      </div>
    `,
    imports: [SortablejsModule]
})
  class TestComponent1 {
    items = [1, 2, 3, 4, 5];
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        SortablejsModule,
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
