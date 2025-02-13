import { Component } from '@angular/core';
import { LeaveTransferService } from '../../forms/forms.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css', '../landing-page.component.css']
})
export class FooterComponent {
  activeSubmenu: string | null = null;
  submenuTimeout: any;
  menu = false;
  serviceEnable: any
  visitors: any = 0;
  year: number = new Date().getFullYear();
  updatedYear:any;
  constructor(private leaveTransferService: LeaveTransferService) { }
  ngOnInit(): void {
    this.serviceEnable = localStorage.getItem('loginAs');
    this.getVisitors();
  }
  toggle() {
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
  getVisitors(){
    this.leaveTransferService.uploadGet('getLatestVisitor').subscribe((res:any)=>{
      this.visitors = res.results.count;
      this.updatedYear = res.results.visitUpdateDate.split("T")[0]
      this.increaseVisitor();
    })
  }
  increaseVisitor() {
    var body = {
      "count": this.visitors += 1
    }
    this.leaveTransferService.uploadAdd(body, 'addOrUpdateVisitor').subscribe((res: any) => {
      this.visitors = res.results.count;
    })
  }
}
