import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoteVacinaCadastro } from './lote-vacina-cadastro';

describe('LoteVacinaCadastro', () => {
  let component: LoteVacinaCadastro;
  let fixture: ComponentFixture<LoteVacinaCadastro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoteVacinaCadastro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoteVacinaCadastro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
