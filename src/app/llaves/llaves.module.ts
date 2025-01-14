import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { RegistroProductoComponent } from './pages/registro-producto/registro-producto.component';
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    DashboardComponent,
    InventarioComponent,
    RegistroProductoComponent,
  ],
    imports: [
        CommonModule,
        FormsModule
    ]
})
export class LlavesModule { }
