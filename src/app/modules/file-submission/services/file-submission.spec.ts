import { TestBed } from '@angular/core/testing';

import { FileSubmissionService } from './file-submission';

describe('FileUpload', () => {
  let service: FileSubmissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileSubmissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
