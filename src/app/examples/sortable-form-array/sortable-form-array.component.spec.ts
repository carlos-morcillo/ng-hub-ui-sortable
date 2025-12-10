import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SortablejsModule } from 'ng-hub-ui-sortable';
import { SortableFormArrayComponent } from './sortable-form-array.component';

describe('SortableFormArrayComponent', () => {
  let component: SortableFormArrayComponent;
  let fixture: ComponentFixture<SortableFormArrayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        SortablejsModule,
        ReactiveFormsModule,
        SortableFormArrayComponent,
    ],
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortableFormArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
