import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css','../landing-page.component.css']
})
export class HeaderComponent {
  menu = false;
  toggle(){
    this.menu = !this.menu;
  }
}
