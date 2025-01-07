import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {appConfig} from './app.config';
import {Button} from "primeng/button";
import { NavMenuComponent } from './shared/components/nav-menu/nav-menu.component';
import {Menu} from 'primeng/menu';
import {SharedModule} from './shared/components/shared.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    Menu
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
