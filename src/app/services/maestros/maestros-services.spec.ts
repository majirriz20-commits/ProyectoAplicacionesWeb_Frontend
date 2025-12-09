import { TestBed } from '@angular/core/testing';

import { MaestrosServices } from './maestros-services';

describe('MaestrosServices', () => {
  let service: MaestrosServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaestrosServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
