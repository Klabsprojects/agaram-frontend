import { Component,OnInit } from '@angular/core';
import { LeaveTransferService } from '../../forms/forms.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css','../landing-page.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(private menuService:LeaveTransferService,private router:Router){}
  serviceEnable:any
  ngOnInit(): void {
    this.serviceEnable = localStorage.getItem('loginAs');
    this.get_bithday_count();
  }
  activeSubmenu: string | null = null;
  submenuTimeout: any;
  menu = false;
  birthdayCount:number=0;
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
  logout(){
    this.menuService.logout();
  }
  get_bithday_count(){
    this.menuService.get_no_header('getEmployeeProfileBydateOfBirth').subscribe((res:any)=>{
      this.birthdayCount = res.results.length;
    })
  }
}
