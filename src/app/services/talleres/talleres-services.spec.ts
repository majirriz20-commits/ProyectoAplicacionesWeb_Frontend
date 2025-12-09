import { TestBed } from '@angular/core/testing';

import { TalleresServices } from './talleres-services';

describe('TalleresServices', () => {
  let service: TalleresServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TalleresServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
