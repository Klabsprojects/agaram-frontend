import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OfficerProfileListComponent } from './officer-profile-list/officer-profile-list.component';
import { OfficerProfileComponent } from './create-officer/officer-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditOfficerComponent } from './edit-officer/edit-officer.component';

const routes: Routes = [
  { path: '', component: OfficerProfileListComponent },
];

@NgModule({
  declarations: [
    OfficerProfileComponent,
    EditOfficerComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [RouterModule]

})
export class OfficerProfileModule { }
