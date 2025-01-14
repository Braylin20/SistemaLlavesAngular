import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { RegistroProductoComponent } from './pages/registro-producto/registro-producto.component';
import {FormsModule} from "@angular/forms";
import {Select} from 'primeng/select';
import {InputNumber} from 'primeng/inputnumber';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {Textarea} from 'primeng/textarea';
import {IftaLabel} from 'primeng/iftalabel';



@NgModule({
  declarations: [
    DashboardComponent,
    InventarioComponent,
    RegistroProductoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    Select,
    InputNumber,
    FloatLabel,
    InputText,
    Textarea,
    IftaLabel
  ]
})
export class LlavesModule { }
