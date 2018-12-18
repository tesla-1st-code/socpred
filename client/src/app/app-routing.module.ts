import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PredictionComponent } from './prediction/prediction.component';
import { ResultComponent } from './result/result.component';
import { CalculationComponent } from './calculation/calculation.component';

const routes: Routes = [ 
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'prediction', component: PredictionComponent },
  { path: 'result', component: ResultComponent },
  { path: 'calculation', component: CalculationComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes,  {
    useHash: false,
    preloadingStrategy: PreloadAllModules,
    initialNavigation: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
