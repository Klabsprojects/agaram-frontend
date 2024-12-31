import { Component, OnInit } from '@angular/core';
import { LeaveTransferService } from '../../forms/forms.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-role',
  templateUrl: './view-role.component.html',
  styleUrl: './view-role.component.css'
})
export class ViewRoleComponent implements OnInit{

  roleForm!:FormGroup;
  showAll = true;
  showEntry = true;
  showView = true;
  showApprove = true;
  submitted = false;
  readonly = false;
  roleData:any[]=[];
  user:any;
  roleIds: string[] = [];

  constructor(private fb:FormBuilder, private roleService:LeaveTransferService,private router:Router,private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    this.user = this.route.snapshot.queryParamMap.get('user');
    this.roleForm = this.fb.group({
      roleName: ['',Validators.required],
      checkAll: [false],
      roles: this.fb.array([], this.atLeastOneCheckboxCheckedValidator())
    });

    this.roleService.getRoleUserList().subscribe((res:any)=>{
      this.roleData = res.results;
    });

    this.roleService.viewRole(this.user).subscribe((res: any) => {
      console.log(res.results);
      this.roleForm.get('roleName')?.setValue(this.user);
      this.initializeForm(res.results);
      this.roleIds = [];
      res.results.forEach((ele: any) => {
        this.roleIds.push(ele._id);
      });
     
    });
    
  }
  

  initializeForm(roles: any[]) {
    const roleFormArray = this.roleForm.get('roles') as FormArray;
    roles.forEach(role => {
      roleFormArray.push(this.fb.group({
        menu: [role.menu],
        allAccess: [role.allAccess],
        entryAccess: [role.entryAccess],
        editAccess: [role.editAccess],
        viewAccess: [role.viewAccess],
        approveAccess: [role.approvalAccess]
      }));
    });
  }
  
  onCheckAllChange() {
    const checkAllValue = this.roleForm.get('checkAll')?.value;
    (this.roleForm.get('roles') as FormArray).controls.forEach(roleGroup => {
      Object.keys(roleGroup.value).forEach(key => {
        if (key !== 'menu') {
          roleGroup.get(key)?.setValue(checkAllValue);
        }
      });
    });
  }
  
  onAllChange(index: number) {
    const roleGroup = (this.roleForm.get('roles') as FormArray).at(index) as FormGroup;
    const allChecked = roleGroup.get('allAccess')?.value;
    Object.keys(roleGroup.controls).forEach(key => {
      if (key !== 'menu' && key !== 'allAccess') {
        roleGroup.get(key)?.setValue(allChecked);
        this.readonly = true;
      }
      else{
        this.readonly = false;
      }
    });
  }

  preventCheck(event: Event, index: number) {
    const roleGroup = (this.roleForm.get('roles') as FormArray).at(index) as FormGroup;
    if (roleGroup.get('all')?.value) {
      event.preventDefault();
    }
  }

  atLeastOneCheckboxCheckedValidator(): ValidatorFn {
    return (formArray: AbstractControl): { [key: string]: any } | null => {
      const atLeastOneChecked = (formArray as FormArray).controls.some(group => 
        group.get('entryAccess')?.value || 
        group.get('editAccess')?.value || 
        group.get('viewAccess')?.value || 
        group.get('approveAccess')?.value
      );
  
      return atLeastOneChecked ? null : { noCheckboxSelected: true };
    };
  }
  
  resetValues(){

  }

  get roleFormArray() {
    return this.roleForm.get('roles') as FormArray;
  }

  onRoleSubmit() {
    this.submitted = true;
  
    if (this.roleForm.invalid) {
      if (this.roleFormArray.errors?.['noCheckboxSelected']) {
        alert('Select at least one role');
      }
      return;
    }
  
    const formValue = this.roleForm.value;
    delete formValue['checkAll'];
    const roles = formValue.roles;
    const roleName = formValue.roleName;
  
    const formattedRoles = roles.map((role: any, index: number) => {
      const roleId = this.roleIds[index]; // Get corresponding _id from roleIds array
  
      // Define the base structure for the role
      const baseRole = {
        id:roleId,
        roleName: roleName,
        menu: role.menu,
        allAccess: role.allAccess ?? false,
        entryAccess: role.entryAccess ?? false,
        editAccess: role.editAccess ?? false,
        viewAccess: role.viewAccess,
        approvalAccess: role.approveAccess ?? false
      };
  
      // Add or exclude id based on the menu value
      if (role.menu === 'Dashboard') {
        return {
          ...baseRole,
          allAccess: false,
          entryAccess: false,
          editAccess: false,
          approvalAccess: false
        };
      } else if (role.menu === 'User' || role.menu === 'Role') {
        return {
          ...baseRole,
          approvalAccess: false
        };
      }else if (role.menu === 'Master Creation') {
        return {
          ...baseRole,
          editAccess:false,
          approvalAccess: false
        };
      }
      else if (role.menu === 'Role') {
        return {
          ...baseRole,
          editAccess:false,
          viewAccess: false,
          approvalAccess: false
        };
      }
       else {
        return {
          ...baseRole,
        };
      }
    });
  
    // console.log(formattedRoles);
    this.roleService.updateRole(formattedRoles).subscribe((res: any) => {
      alert("Roles Updated Successfully");
      this.router.navigateByUrl('role');
    });
  }
  
}
