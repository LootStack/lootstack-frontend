import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AplicacaoRegistro } from './aplicacao-registro';

describe('AplicacaoRegistro', () => {
  let component: AplicacaoRegistro;
  let fixture: ComponentFixture<AplicacaoRegistro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AplicacaoRegistro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AplicacaoRegistro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
