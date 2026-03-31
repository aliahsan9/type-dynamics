import { TestBed } from '@angular/core/testing';

import { SnakeGameService } from './snake-game.service';

describe('SnakeGameService', () => {
  let service: SnakeGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnakeGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
