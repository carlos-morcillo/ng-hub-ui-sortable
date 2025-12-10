import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SortablejsModule } from 'ng-hub-ui-sortable';
import { MultipleListsComponent } from './multiple-lists.component';

describe('MultipleListsComponent', () => {
  let component: MultipleListsComponent;
  let fixture: ComponentFixture<MultipleListsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        SortablejsModule,
        MultipleListsComponent,
    ],
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
