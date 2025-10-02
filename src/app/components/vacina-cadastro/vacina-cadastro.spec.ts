import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacinaCadastro } from './vacina-cadastro';

describe('VacinaCadastro', () => {
  let component: VacinaCadastro;
  let fixture: ComponentFixture<VacinaCadastro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacinaCadastro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacinaCadastro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
