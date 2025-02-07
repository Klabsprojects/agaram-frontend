import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NotificationComponent } from './notification.component';

const routes : Routes = [
  { path : '', component:NotificationComponent}
]

@NgModule({
  declarations: [
    NotificationComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  
  ]
})
export class NotificationModule { }
