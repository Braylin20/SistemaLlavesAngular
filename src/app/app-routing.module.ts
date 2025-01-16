import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './llaves/pages/dashboard/dashboard.component';
import {InventarioComponent} from './llaves/pages/inventario/inventario.component';
import {VentasComponent} from './llaves/pages/ventas/ventas.component';
import {VentasHistorialComponent} from './llaves/pages/ventas/ventas-historial/ventas-historial.component';

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
    path: 'ventas',
    component: VentasComponent,
  },
  {
    path: 'ventas-historial',
    component: VentasHistorialComponent,
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
