import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoteVacinaConsulta } from './lote-vacina-consulta';

describe('LoteVacinaConsulta', () => {
  let component: LoteVacinaConsulta;
  let fixture: ComponentFixture<LoteVacinaConsulta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoteVacinaConsulta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoteVacinaConsulta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
