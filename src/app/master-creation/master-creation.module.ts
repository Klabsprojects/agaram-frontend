import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterCreationComponent } from './master-creation.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AddMasterComponent } from './add-master/add-master.component';
import { ViewMasterComponent } from './view-master/view-master.component';

const routes : Routes = [
  { path : '', component:MasterCreationComponent}
]

@NgModule({
  declarations: [
    MasterCreationComponent,
    AddMasterComponent,
    ViewMasterComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class MasterCreationModule { }
