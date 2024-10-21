import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VentasPage } from './ventas.page';

describe('VentasPage', () => {
  let component: VentasPage;
  let fixture: ComponentFixture<VentasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
