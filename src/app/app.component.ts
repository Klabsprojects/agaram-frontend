import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ApiLoadingService } from './landing-page/landing-services/loading.serivce';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'agaram';
  currentRoute:string='';
  Showmenu:boolean = false;
  showLogin:boolean = false;
  showRegister:boolean = false;
  showLanding:boolean = true;
  loading$ = this.apiloading.loading$;
  
  constructor(private router:Router, private apiloading:ApiLoadingService){}

  ngOnInit(){
    this.router.events
    .pipe(filter((event) => event instanceof NavigationEnd))
    .subscribe(() => {
       this.currentRoute = this.router.url;
      if(this.currentRoute == "/login"){
        this.showLogin = true;
        this.Showmenu = false;
        this.showRegister = false;
        this.showLanding = false;
      }
      else if(this.currentRoute == "/register"){
        this.showRegister = true;
        this.showLogin = false;
        this.Showmenu = false;
        this.showLanding = false;
      }
      else if(this.currentRoute == "/Landing"){
        this.Showmenu = false;
        this.showRegister = false;
        this.showLogin = false;
        this.showLanding = true;
      }
      else if(this.currentRoute.includes('/Landing')){
        this.Showmenu = false;
        this.showRegister = false;
        this.showLogin = false;
        this.showLanding = true;
      }
      else{
        this.Showmenu = true;
        this.showRegister = false;
        this.showLogin = false;
        this.showLanding = false;
      }
    });
  }
  showScroll: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Show button when scrolled down 200px
    this.showScroll = window.scrollY > 200;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
