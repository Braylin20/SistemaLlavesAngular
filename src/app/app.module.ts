import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {appConfig} from './app.config';
import {Button} from "primeng/button";
import { NavMenuComponent } from './shared/components/nav-menu/nav-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        Button
    ],
  providers: appConfig.providers,
  bootstrap: [AppComponent]
})
export class AppModule { }
