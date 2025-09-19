import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaConsulta } from './ficha-consulta';

describe('FichaConsulta', () => {
  let component: FichaConsulta;
  let fixture: ComponentFixture<FichaConsulta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichaConsulta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichaConsulta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
