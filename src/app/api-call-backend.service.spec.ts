import { TestBed } from '@angular/core/testing';

import { ApiCallBackendService } from './api-call-backend.service';

describe('ApiCallBackendService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiCallBackendService = TestBed.get(ApiCallBackendService);
    expect(service).toBeTruthy();
  });
});
