import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasHistorialComponent } from './ventas-historial.component';

describe('VentasHistorialComponent', () => {
  let component: VentasHistorialComponent;
  let fixture: ComponentFixture<VentasHistorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VentasHistorialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentasHistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
