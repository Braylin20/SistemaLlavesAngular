import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SharedModule} from './shared/components/shared.module';
import {LlavesModule} from './llaves/llaves.module';
import {provideHttpClient} from '@angular/common/http';
import {appConfig} from './app.config';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    LlavesModule
  ],
  providers:[provideHttpClient(),appConfig.providers ],
  bootstrap: [AppComponent]
})
export class AppModule { }
