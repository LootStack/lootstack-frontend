import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoteConsulta } from './lote-consulta';

describe('LoteConsulta', () => {
  let component: LoteConsulta;
  let fixture: ComponentFixture<LoteConsulta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoteConsulta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoteConsulta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
