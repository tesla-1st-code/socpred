import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ProgressHttpModule } from 'angular-progress-http';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import { LocationStrategy, HashLocationStrategy } from '../../node_modules/@angular/common';
import { SharedService } from './shared.service';
import { DataService } from './data.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PredictionComponent } from './prediction/prediction.component';
import { ResultComponent } from './result/result.component';
import { CalculationComponent } from './calculation/calculation.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    PredictionComponent,
    ResultComponent,
    CalculationComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    ProgressHttpModule,
    ChartModule
  ],
  providers: [{provide: HIGHCHARTS_MODULES, useFactory: () => []}, SharedService, DataService, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
