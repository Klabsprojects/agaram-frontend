import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePostingComponent } from './create-posting/create-posting.component';
import { EditPostingComponent } from './edit-posting/edit-posting.component';
import { RouterModule, Routes } from '@angular/router';
import { PreviousPostingComponent } from './previous-posting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes : Routes = [
  { path : '', component:PreviousPostingComponent},
  { path : 'create-previous-posting', component:CreatePostingComponent},
  { path : 'edit-previous-posting', component:EditPostingComponent}
]

@NgModule({
  declarations: [
    PreviousPostingComponent,
    CreatePostingComponent,
    EditPostingComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule
  ]
})
export class PreviousPostingModule { }
