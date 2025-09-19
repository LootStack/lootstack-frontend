import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaCadastro } from './ficha-cadastro';

describe('FichaCadastro', () => {
  let component: FichaCadastro;
  let fixture: ComponentFixture<FichaCadastro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichaCadastro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichaCadastro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
