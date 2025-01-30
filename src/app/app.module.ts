import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormModule } from './forms/forms.module';
import { MasterCreationModule } from './master-creation/master-creation.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AdvanceSearchComponent } from './advance-search/advance-search.component';
import { DatePipe } from '@angular/common';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { HeaderComponent } from './Landing-page/header/header.component';
import { HeroComponent } from './Landing-page/hero/hero.component';
import { ServicesComponent } from './Landing-page/services/services.component';
import { FooterComponent } from './Landing-page/footer/footer.component';
import { MarqueeComponent } from './landing-page/marquee/marquee.component';
import { HomeComponent } from './landing-page/components/home/home.component';
import { DetailComponent } from './landing-page/components/home/detail/detail.component';
import { AnnouncementsUpdatesComponent } from './landing-page/components/home/announcements-updates/announcements-updates.component';
import { OverviewCardComponent } from './landing-page/components/home/overview-card/overview-card.component';
import { HonourComponent } from './landing-page/components/honour/honour.component';
import { ServiceInfoComponent } from './landing-page/components/honour/service-info/service-info.component';
import { PersonComponent } from './landing-page/components/honour/person/person.component';
import { TransferComponent } from './landing-page/components/transfer/transfer.component';
import { DetailsComponent } from './landing-page/components/transfer/details/details.component';
import { SearchComponent } from './landing-page/components/transfer/search/search.component';
import { PaginationComponent } from './landing-page/components/transfer/pagination/pagination.component';
import { CurrentPostingComponent } from './landing-page/components/current-posting/current-posting.component';
import { OfficerDetailComponent } from './landing-page/components/current-posting/officer-detail/officer-detail.component';
import { PagesComponent } from './landing-page/components/current-posting/pages/pages.component';
import { SearchingComponent } from './landing-page/components/current-posting/search/search.component';
import { DashboardComponentCP } from './landing-page/components/current-posting/dashboard/dashboard.component';
import { ServicesLnComponent } from './landing-page/components/services-ln/services-ln.component';
import { DashboardSeriveComponent } from './landing-page/components/services-ln/dashboard-serive/dashboard-serive.component';
import { AdmininstrativeDashboardComponent } from './landing-page/components/services-ln/admininstrative-dashboard/admininstrative-dashboard.component';
import { ContactComponent } from './landing-page/components/contact/contact.component';
import { DashboardContactComponent } from './landing-page/components/contact/dashboard-contact/dashboard-contact.component';
import { FormContactComponent } from './landing-page/components/contact/form-contact/form-contact.component';
import { ActrulesComponentLanding } from './landing-page/components/service-components/actrulesLanding/actruleslanding.component';
import { CircularsComponentlanding } from './landing-page/components/service-components/circularslanding/circularslanding.component';
import { FaqComponentlanding } from './landing-page/components/service-components/faqlanding/faqlanding.component';
import { UtilityformsComponentlanding } from './landing-page/components/service-components/utilityformslanding/utilityformslanding.component';
import { CarouselComponent } from './landing-page/components/home/carousel/carousel.component';
import { OfficialsComponent } from './landing-page/components/home/officials/officials.component';
import { BirthdaysComponent } from './landing-page/components/birthdays/birthdays.component';
import { PersonBirthdayComponent } from './landing-page/components/birthdays/person-birthday/person-birthday.component';
@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    DashboardComponent,
    LoginComponent,
    AdvanceSearchComponent,
    ProfileComponent,
    LandingPageComponent,
    HeaderComponent,
    HeroComponent,
    ServicesComponent,
    FooterComponent,
    MarqueeComponent,
    HomeComponent,
    DetailComponent,
    AnnouncementsUpdatesComponent,
    OverviewCardComponent,
    HonourComponent,
    ServiceInfoComponent,
    PersonComponent,
    TransferComponent,
    DetailsComponent,
    SearchComponent,
    SearchingComponent,
    PaginationComponent,
    CurrentPostingComponent,
    OfficerDetailComponent,
    PagesComponent,
    DashboardComponentCP,
    ServicesLnComponent,
    DashboardSeriveComponent,
    AdmininstrativeDashboardComponent,
    ContactComponent,
    DashboardContactComponent,
    FormContactComponent,
    ActrulesComponentLanding,
    CircularsComponentlanding,
    FaqComponentlanding,
    UtilityformsComponentlanding,
    CarouselComponent,
    OfficialsComponent,
    BirthdaysComponent,
    PersonBirthdayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    FormModule,
    MasterCreationModule,
    RoleModule,
    UserModule,
    BrowserAnimationsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
