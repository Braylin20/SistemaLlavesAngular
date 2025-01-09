import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import { InventarioComponent } from './pages/inventario/inventario.component';



@NgModule({
  declarations: [
    DashboardComponent,
    InventarioComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class LlavesModule { }
