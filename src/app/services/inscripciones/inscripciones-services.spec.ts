import { TestBed } from '@angular/core/testing';

import { InscripcionesServices } from './inscripciones-services';

describe('InscripcionesServices', () => {
  let service: InscripcionesServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InscripcionesServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
