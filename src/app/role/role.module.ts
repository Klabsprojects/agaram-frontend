import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleComponent } from './role.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateRoleComponent } from './create-role/create-role.component';
import { ViewRoleComponent } from './view-role/view-role.component';

const routes : Routes = [
  { path : '', component:RoleComponent},
  { path : 'create-role', component:CreateRoleComponent},
  { path : 'view-role', component:ViewRoleComponent}
]

@NgModule({
  declarations: [
    RoleComponent,
    CreateRoleComponent,
    ViewRoleComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class RoleModule { }
