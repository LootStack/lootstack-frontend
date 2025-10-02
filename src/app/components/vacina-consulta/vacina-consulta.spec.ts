import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacinaConsulta } from './vacina-consulta';

describe('VacinaConsulta', () => {
  let component: VacinaConsulta;
  let fixture: ComponentFixture<VacinaConsulta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacinaConsulta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacinaConsulta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
