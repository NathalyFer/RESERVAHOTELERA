import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoClienteModalPage } from './info-cliente-modal.page';

describe('InfoClienteModalPage', () => {
  let component: InfoClienteModalPage;
  let fixture: ComponentFixture<InfoClienteModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoClienteModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
