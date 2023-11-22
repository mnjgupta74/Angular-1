
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DummyTokenComponent } from './dummy-token/dummy-token.component';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./bill-process/commonapp.module').then(m => m.CommonappModule)
   },

  //  {
  //   path:'dummyToken',
  //   component:DummyTokenComponent

  // },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true, relativeLinkResolution: 'legacy'})],
  exports: [RouterModule]

})
export class AppRoutingModule { }
