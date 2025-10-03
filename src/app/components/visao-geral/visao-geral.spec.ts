import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaoGeral } from './visao-geral';

describe('VisaoGeral', () => {
  let component: VisaoGeral;
  let fixture: ComponentFixture<VisaoGeral>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisaoGeral]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisaoGeral);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
