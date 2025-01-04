import {NgModule} from '@angular/core';
import {Menu, MenuModule} from 'primeng/menu';
import {NavMenuComponent} from './nav-menu/nav-menu.component';


@NgModule({
  declarations: [
    NavMenuComponent
  ],
  imports: [
    Menu
  ],
  exports: [
    NavMenuComponent
  ]
})
export class SharedModule{

}
