import { TestBed } from '@angular/core/testing';

import { Aplicacao } from './aplicacao';

describe('Aplicacao', () => {
  let service: Aplicacao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Aplicacao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
