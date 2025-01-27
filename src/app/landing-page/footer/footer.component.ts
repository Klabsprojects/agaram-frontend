import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css','../landing-page.component.css']
})
export class FooterComponent {
  activeSubmenu: string | null = null;
  submenuTimeout: any;
  menu = false;
  toggle(){
    this.menu = !this.menu;
  }
  toggleSubmenu(submenu: string) {
    // Clear any existing timeout
    if (this.submenuTimeout) {
      clearTimeout(this.submenuTimeout);
    }
    this.activeSubmenu = submenu;
  }

  closeSubmenu(submenu: string) {
    // Add a delay to allow cursor to move between menu and submenu
    this.submenuTimeout = setTimeout(() => {
      if (this.activeSubmenu === submenu) {
        this.activeSubmenu = null;
      }
    }, 200);
  }

  preventSubmenuClose(event: MouseEvent) {
    // Prevent submenu from closing when mouse is over it
    if (this.submenuTimeout) {
      clearTimeout(this.submenuTimeout);
    }
  }
}
