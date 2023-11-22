import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { SharedModule } from 'src/app/shared/shared.module';
import { InboxComponent } from './inbox.component';

const routes: Routes = [
  // {
  //     path: '',
  //     component: InboxComponent
  //   },
  //   {
  //     path: '/{prams}',
  //     component: InboxComponent
  //   }
  ]


@NgModule({
  declarations: [
    InboxComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    MatStepperModule,
    SharedModule,
    CommonModule
  ]
})
export class InboxModule { }
