import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaReservasPage } from './lista-reservas.page';

describe('ListaReservasPage', () => {
  let component: ListaReservasPage;
  let fixture: ComponentFixture<ListaReservasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaReservasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
