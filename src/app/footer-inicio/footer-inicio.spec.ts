import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterInicio } from './footer-inicio';

describe('FooterInicio', () => {
  let component: FooterInicio;
  let fixture: ComponentFixture<FooterInicio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterInicio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterInicio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
