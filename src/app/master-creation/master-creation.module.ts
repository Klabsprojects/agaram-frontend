import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterCreationComponent } from './master-creation.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';


const routes : Routes = [
  { path : '', component:MasterCreationComponent}
]

@NgModule({
  declarations: [
    MasterCreationComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class MasterCreationModule { }
