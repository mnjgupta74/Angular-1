import { TestBed } from '@angular/core/testing';

import { PensionServiceService } from './pension-service.service';

describe('PensionServiceService', () => {
  let service: PensionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PensionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
