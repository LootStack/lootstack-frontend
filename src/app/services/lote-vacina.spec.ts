import { TestBed } from '@angular/core/testing';

import { LoteVacina } from './lote-vacina';

describe('LoteVacina', () => {
  let service: LoteVacina;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoteVacina);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
