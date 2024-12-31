import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeaveTransferService } from '../forms/forms.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  roleForm!:FormGroup;
  showPopup = true;
  submitted = false;
  roleData:any[]=[];
  showAdd:boolean=false;
  showEdit:boolean=false;

  constructor(private fb:FormBuilder,private router:Router,private roleService:LeaveTransferService) { }

  ngOnInit(): void {
    // this.roleForm = this.fb.group({
    //   roleName : ['',Validators.required],
    //   access: this.fb.array([]),
    //   status: [false, Validators.required]
    // })
    this.roleService.getRoleClassified().subscribe((res:any)=>{
      this.roleData = res.results;
    });
    this.checkAccess();
  }

  checkAccess(): void {
    this.roleService.currentRoleData.subscribe((response: any[]) => {
      const foreignVisitMenu = response.find(item => item.menu === 'Role');
      this.showAdd = foreignVisitMenu?.entryAccess ?? false;
      this.showEdit = foreignVisitMenu?.editAccess ?? false
    });
  }

  toggleStatus(): void {
    this.roleForm.patchValue({
      status: !this.roleForm.get('status')?.value
    });
  }
  
  onRoleSubmit(){
    this.submitted = true;
  }

  addNew(){
    this.router.navigateByUrl('create-role');
  }

  viewRole(data:any){
    this.router.navigate(['view-role'], { queryParams: { user: data } })
    // this.router.navigateByUrl('view-role', { state: { roleData: data } });
  }

}
