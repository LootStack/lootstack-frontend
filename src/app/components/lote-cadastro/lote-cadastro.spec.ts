import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoteCadastro } from './lote-cadastro';

describe('LoteCadastro', () => {
  let component: LoteCadastro;
  let fixture: ComponentFixture<LoteCadastro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoteCadastro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoteCadastro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
