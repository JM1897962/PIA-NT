import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarteraPage } from './cartera.page';

describe('CarteraPage', () => {
  let component: CarteraPage;
  let fixture: ComponentFixture<CarteraPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CarteraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
