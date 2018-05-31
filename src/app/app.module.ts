import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AnalysisComponent } from './analysis/analysis.component';

import { RouterModule, Routes } from '@angular/router';

import { RxjsInteractiveService } from './analysis/rxjs-interactive.service';

import { HttpModule, Http } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';

const routes: Routes = [
  { path: '', component: AnalysisComponent },
  { path: 'analysis', component: AnalysisComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    AnalysisComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpModule,
    HttpClientModule
  ],
  providers: [ RxjsInteractiveService ],
  bootstrap: [ AppComponent ],
  exports: [ RouterModule ]
})
export class AppModule { }
