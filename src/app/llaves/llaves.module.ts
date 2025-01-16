import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { VentasComponent } from './pages/ventas/ventas.component';
import { VentasHistorialComponent } from './pages/ventas/ventas-historial/ventas-historial.component';

@NgModule({
  declarations: [
    DashboardComponent,
    InventarioComponent,
    VentasComponent,
    VentasHistorialComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class LlavesModule { }
