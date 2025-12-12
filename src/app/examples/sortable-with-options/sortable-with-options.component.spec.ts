import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SortableModule } from 'ng-hub-ui-sortable';
import { SortableWithOptionsComponent } from './sortable-with-options.component';

describe('SortableWithOptionsComponent', () => {
  let component: SortableWithOptionsComponent;
  let fixture: ComponentFixture<SortableWithOptionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        SortableModule,
        SortableWithOptionsComponent,
    ],
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortableWithOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
