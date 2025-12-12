import { TestBed } from '@angular/core/testing';

import { SortableService } from './sortable.service';

describe('SortableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SortableService = TestBed.inject(SortableService);
    expect(service).toBeTruthy();
  });
});
