import { TestBed } from '@angular/core/testing';

import { ContextPathService } from './context-path.service';

describe('ContextPathService', () => {
  let service: ContextPathService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContextPathService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
