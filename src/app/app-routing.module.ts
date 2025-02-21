import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfficerProfileComponent } from './officer-profile/create-officer/officer-profile.component';
import { EditOfficerComponent } from './officer-profile/edit-officer/edit-officer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AdvanceSearchComponent } from './advance-search/advance-search.component';
import { AuthGuard } from './auth-guard';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { HomeComponent } from './landing-page/components/home/home.component';
import { HonourComponent } from './landing-page/components/honour/honour.component';
import { TransferComponent } from './landing-page/components/transfer/transfer.component';
import { CurrentPostingComponent } from './landing-page/components/current-posting/current-posting.component';
import { ServicesLnComponent } from './landing-page/components/services-ln/services-ln.component';
import { ContactComponent } from './landing-page/components/contact/contact.component';
import { ActrulesComponentLanding } from './landing-page/components/service-components/actrulesLanding/actruleslanding.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { CircularsComponentlanding } from './landing-page/components/service-components/circularslanding/circularslanding.component';
import { FaqComponentlanding } from './landing-page/components/service-components/faqlanding/faqlanding.component';
import { UtilityformsComponentlanding } from './landing-page/components/service-components/utilityformslanding/utilityformslanding.component';
import { OfficialInfoComponent } from './dashboard/profile/official-info/official-info.component';
import { BirthdaysComponent } from './landing-page/components/birthdays/birthdays.component';
import { RetirementsComponent } from './landing-page/components/retirements/retirements.component';
import { ActiveOfficersComponent } from './landing-page/components/home/active-officers/active-officers.component';
import { RetiredOfficersComponent } from './landing-page/components/home/retired-officers/retired-officers.component';
import { ApiLoaderInterceptor } from './landing-page/landing-services/api-loader.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
const routes: Routes = [
  {path:'Landing',component:LandingPageComponent,children:[
    { path: '', redirectTo: 'home', pathMatch: 'full' }, 
    {path:'home',component:HomeComponent},
    {path:'honour',component:HonourComponent},
    {path:'transfer',component:TransferComponent},
    {path:'posting',component:CurrentPostingComponent},
    {path:'ActiveOfficers',component:ActiveOfficersComponent},
    {path:'RetiredOfficers',component:RetiredOfficersComponent},
    {path:'contact',component:ContactComponent},
    {path:'actnrulz',component:ActrulesComponentLanding,canActivate: [AuthGuard]},
    {path:'circular-landing',component:CircularsComponentlanding},
    {path:'faq-landing',component:FaqComponentlanding,canActivate: [AuthGuard]},
    {path:'utility-landing',component:UtilityformsComponentlanding,canActivate: [AuthGuard]},
    {path:'birthday',component:BirthdaysComponent},
    {path:'retirments',component:RetirementsComponent}
  ]},
  { path:'login',component:LoginComponent },
  { path:'advance-search',component:AdvanceSearchComponent,canActivate: [AuthGuard]},
  { path:'dashboard',component:DashboardComponent,canActivate: [AuthGuard]},
  { path:'profile',component:ProfileComponent,canActivate:[AuthGuard],data: { role: 'Officer' }},
  { path:'official-info',component:OfficialInfoComponent,canActivate:[AuthGuard],data: { role: 'Officer' }},
  { path: 'create-officer', component: OfficerProfileComponent,canActivate: [AuthGuard] },
  { path: 'edit-officer', component:EditOfficerComponent,canActivate: [AuthGuard]},
  { path:'officer-profile-list',
    loadChildren:()=>import('./officer-profile/officer-profile.module').then(m=>m.OfficerProfileModule),
    canActivate: [AuthGuard]
  },
  {
    path:'forms',
    loadChildren:()=>import('./forms/forms.module').then(m=>m.FormModule),
    canActivate: [AuthGuard]
  },
  {
    path:'master-creation',
    loadChildren:()=>import('./master-creation/master-creation.module').then(m=>m.MasterCreationModule),
    canActivate: [AuthGuard]
  },
  {
    path:'notification',
    loadChildren:()=>import('./notification/notification.module').then(m=>m.NotificationModule),
    canActivate: [AuthGuard]
  },
  {
    path:'previous-posting',
    loadChildren:()=>import('./previous-posting/previous-posting.module').then(m=>m.PreviousPostingModule),
    canActivate: [AuthGuard]
  },
  {
    path:'check-status',
    loadChildren:()=>import('./status/status.module').then(m=>m.StatusModule),
    canActivate: [AuthGuard]
  },
  {
    path:'role',
    loadChildren:()=>import('./role/role.module').then(m=>m.RoleModule),
    canActivate: [AuthGuard]
  },
  {
    path:'user',
    loadChildren:()=>import('./user/user.module').then(m=>m.UserModule),
    canActivate: [AuthGuard]
  },
  {
    path:'Messages',
    loadChildren:()=>import('./messages/messages.module').then(m=>m.MessagesModule),
    canActivate:[AuthGuard]
  },
  {
    path:'leave-credit',
    loadChildren:()=>import('./leave-credit/leave-credit.module').then(m=>m.LeaveCreditModule),
    canActivate:[AuthGuard]
  },
  {
    path:'',
    redirectTo:'Landing',
    pathMatch:'full'
  },
  // { path: '**', redirectTo: 'Landing', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiLoaderInterceptor, multi: true }
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
