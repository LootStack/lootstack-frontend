import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaConsultaTotal } from './ficha-consulta-total';

describe('FichaConsultaTotal', () => {
  let component: FichaConsultaTotal;
  let fixture: ComponentFixture<FichaConsultaTotal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichaConsultaTotal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichaConsultaTotal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
