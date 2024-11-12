import { TestBed } from '@angular/core/testing';

import { NgxSheetModalService } from './ngx-sheet-modal.service';

describe('NgxSheetModalService', () => {
  let service: NgxSheetModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxSheetModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
