import { TestBed } from '@angular/core/testing';

import { GamescreenService } from './gamescreen.service';

describe('GamescreenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GamescreenService = TestBed.get(GamescreenService);
    expect(service).toBeTruthy();
  });
});
