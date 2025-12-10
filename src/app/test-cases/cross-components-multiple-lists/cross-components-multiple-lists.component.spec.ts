import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SortablejsModule } from 'ng-hub-ui-sortable';
import { ChildComponentComponent } from './child-component/child-component.component';
import { CrossComponentsMultipleListsComponent } from './cross-components-multiple-lists.component';

describe('CrossComponentsMultipleListsComponent', () => {
  let component: CrossComponentsMultipleListsComponent;
  let fixture: ComponentFixture<CrossComponentsMultipleListsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        SortablejsModule,
        CrossComponentsMultipleListsComponent,
        ChildComponentComponent,
    ],
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrossComponentsMultipleListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
