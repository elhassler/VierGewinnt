import { TestBed } from '@angular/core/testing';

import { SocketHelperService } from './socket-helper.service';

describe('SocketHelperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SocketHelperService = TestBed.get(SocketHelperService);
    expect(service).toBeTruthy();
  });
});
