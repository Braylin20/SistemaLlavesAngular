import {NgModule} from '@angular/core';
import {NavMenuComponent} from './nav-menu/nav-menu.component';
import {CommonModule} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';

@NgModule({
  declarations: [
    NavMenuComponent
  ],
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  exports: [
    NavMenuComponent
  ]
})
export class SharedModule{

}
