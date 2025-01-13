import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from './llaves/pages/dashboard/dashboard.component';
import {InventarioComponent} from './llaves/pages/inventario/inventario.component';
import {RegistroProductoComponent} from './llaves/pages/registro-producto/registro-producto.component';
import {LlavesModule} from './llaves/llaves.module';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'inventario',
    component: InventarioComponent
  },
  {
    path: 'registro-producto',
    component: RegistroProductoComponent
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
