import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {
  currentRoute: string = ''
  routeurls:any[]=[];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Get the initial route on page load
    this.currentRoute = this.router.url;
    // console.log('Initial Route:', this.currentRoute);
    this.routeurls = this.currentRoute.split('/');
    console.log('routeurls',this.routeurls);

    // Subscribe to route changes with correct typing
    this.router.events.pipe().subscribe((event) => {
      const navEndEvent = event as NavigationEnd;  // Ensure TypeScript understands the type
      this.currentRoute = navEndEvent.urlAfterRedirects;
      if(this.currentRoute){
        this.routeurls = this.currentRoute.split('/');
      }
      // console.log('Route Changed To:', this.currentRoute);
    });
  }
}
