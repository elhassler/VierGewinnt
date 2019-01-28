import { TestBed } from '@angular/core/testing';

import { MyDialogService } from './my-dialog.service';

describe('MyDialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyDialogService = TestBed.get(MyDialogService);
    expect(service).toBeTruthy();
  });
});
