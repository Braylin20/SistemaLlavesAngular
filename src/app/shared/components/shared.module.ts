import {NgModule} from '@angular/core';
import {NavMenuComponent} from './nav-menu/nav-menu.component';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    NavMenuComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NavMenuComponent
  ]
})
export class SharedModule{

}
