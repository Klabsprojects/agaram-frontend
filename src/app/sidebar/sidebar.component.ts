import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveTransferService } from '../forms/forms.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  messageCount:number=5;
  showSubMenu = false;
  activeSubMenu: string | null = null;
  roleData:any[]=[];
  menus:any[]=[];
  hasDashboardMenu: boolean = false;
  allAccess: boolean = false;
  entryAccess: boolean = false;
  viewAccess: boolean = false;
  approvalAccess: boolean = false;
  roleName : string | null  = null;
  username : string | null  = null;
  constructor(private router: Router, private menuService:LeaveTransferService) { }

  ngOnInit(): void {
    this.menuService.currentRoleData.subscribe((res:any) => {
      this.roleData = res;
    });
    this.roleName = localStorage.getItem('loginAs');
    this.username = localStorage.getItem('username');
  }
  
  showMenu(menuName: string): boolean {
    // console.log(this.roleData);
    const role = this.roleData.find(item => item.menu === menuName);
    const hasAccess = role ? (role.allAccess || role.entryAccess || role.viewAccess || role.approvalAccess) : false;
    // console.log(`Menu: ${menuName}, Access: ${hasAccess}`); // Log menu access check
    return hasAccess;
  }
  
  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }

  onItemClick(item: string) {
    this.menuService.setSelectedItem(item);
  }

  logout(){
    this.menuService.logout();
  }
 

  toggleSubMenu(section: string) {
    this.showSubMenu = true;
    this.activeSubMenu = section;
  }

}
