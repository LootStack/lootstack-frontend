import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AplicacaoConsulta } from './aplicacao-consulta';

describe('AplicacaoConsulta', () => {
  let component: AplicacaoConsulta;
  let fixture: ComponentFixture<AplicacaoConsulta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AplicacaoConsulta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AplicacaoConsulta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
