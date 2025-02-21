import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveCreditComponent } from './leave-credit.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


const routes : Routes = [
  { path : '', component:LeaveCreditComponent}
]

@NgModule({
  declarations: [
    LeaveCreditComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule
  ]
})
export class LeaveCreditModule { }
