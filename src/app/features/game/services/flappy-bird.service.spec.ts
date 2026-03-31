import { TestBed } from '@angular/core/testing';

import { FlappyBirdService } from './flappy-bird.service';

describe('FlappyBirdService', () => {
  let service: FlappyBirdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlappyBirdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
