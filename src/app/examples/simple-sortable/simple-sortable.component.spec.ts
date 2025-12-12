import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SortableModule } from 'ng-hub-ui-sortable';
import { SimpleSortableComponent } from './simple-sortable.component';

describe('SimpleSortableComponent', () => {
  let component: SimpleSortableComponent;
  let fixture: ComponentFixture<SimpleSortableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        SortableModule,
        SimpleSortableComponent,
    ],
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleSortableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
