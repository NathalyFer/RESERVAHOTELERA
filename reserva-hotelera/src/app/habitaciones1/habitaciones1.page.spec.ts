import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Habitaciones1Page } from './habitaciones1.page';

describe('Habitaciones1Page', () => {
  let component: Habitaciones1Page;
  let fixture: ComponentFixture<Habitaciones1Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Habitaciones1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
