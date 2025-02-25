import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { LeaveTransferService } from '../../forms/forms.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrl: './create-role.component.css'
})
export class CreateRoleComponent implements OnInit{

  roleForm!:FormGroup;
  showAll = true;
  showEntry = true;
  showView = true;
  showApprove = true;
  submitted = false;
  readonly = false;
  roleData:any[]=[];

  constructor(private fb:FormBuilder, private roleService:LeaveTransferService,private router:Router) {}
  
  ngOnInit(): void {
    this.roleForm = this.fb.group({
      roleName: ['',Validators.required],
      checkAll: [false],
      roles: this.fb.array([], this.atLeastOneCheckboxCheckedValidator())
    });
    this.addRoles();
    this.roleService.getRoleUserList().subscribe((res:any)=>{
      this.roleData = res.results;
    })
  }
  
  addRoles() {
    const roles = [
      'Dashboard',
      'Officer Profile',
      'Transfer / Posting',
      'Promotion',
      'Leave',
      'Training',
      'Foreign Visit',
      'SAF Games Village Application',
      'SAF Games Village Allocation',
      'Leave Travel Concession',
      'Medical Reimbursement',
      'Private Visits',
      'Immovable',
      'Movable',
      'Officer Tour',
      'House Building Advance',
      'GPF',
      'MHA ID Card',
      'Education',
      'Intimation',
      'Master Creation',
      'User',
      'Role'
    ];
  
    roles.forEach(role => {
      const roleGroup = this.fb.group({
        menu: role,
        allAccess: [false],
        entryAccess: [{ value: false, disabled: false }],
        editAccess: [{ value: false, disabled: false }],
        viewAccess: [{ value: false, disabled: false }],
        approveAccess: [{ value: false, disabled: false }]
      });
      (this.roleForm.get('roles') as FormArray).push(roleGroup);
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
  
  // onAllChange(index: number) {
  //   const roleGroup = (this.roleForm.get('roles') as FormArray).at(index) as FormGroup;
  //   const allChecked = roleGroup.get('allAccess')?.value;
  //   Object.keys(roleGroup.controls).forEach(key => {
  //     if (key !== 'menu' && key !== 'allAccess') {
  //       roleGroup.get(key)?.setValue(allChecked);
  //       this.readonly = true;
  //       console.log("if");
  //     }
  //     else{
  //       this.readonly = false;
  //       console.log("else");
  //     }
  //   });
  // }

  // preventCheck(event: Event, index: number) {
  //   const roleGroup = (this.roleForm.get('roles') as FormArray).at(index) as FormGroup;
  //   if (roleGroup.get('all')?.value) {
  //     event.preventDefault();
  //   }
  // }

  preventCheck(event: Event, index: number) {
    const roleGroup = (this.roleForm.get('roles') as FormArray).at(index) as FormGroup;
    const allAccessControl = roleGroup.get('allAccess');
    if (allAccessControl?.value) {
      const allChecked = Object.keys(roleGroup.controls).every(key => {
        if (key !== 'menu' && key !== 'allAccess') {
          return roleGroup.get(key)?.value === true; 
        }
        return true;
      });
  
      if (!allChecked) {
        allAccessControl?.setValue(false);
        this.readonly = false;  
      }
    }
  }
  

  onAllChange(index: number) {
    const roleGroup = (this.roleForm.get('roles') as FormArray).at(index) as FormGroup;
    const allChecked = roleGroup.get('allAccess')?.value;
  
    // If "All" is checked, mark all other checkboxes as checked
    Object.keys(roleGroup.controls).forEach(key => {
      if (key !== 'menu' && key !== 'allAccess') {
        roleGroup.get(key)?.setValue(allChecked);
        this.readonly = allChecked;  // Apply readonly based on "All" checkbox state
      }
    });
    
    // If "All" is unchecked, reset the readonly state and uncheck everything else
    if (!allChecked) {
      this.readonly = false;
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
    console.log(this.roleForm.valid);
    if (this.roleForm.invalid) {
      if (this.roleFormArray.errors?.['noCheckboxSelected']) {
        alert('Select at least one role');
      }
      return;
    } else {
      const formValue = this.roleForm.value;
      delete formValue['checkAll'];
      const roles = formValue.roles;
      const roleName = formValue.roleName;
  
      const formattedRoles = roles.map((role: any) => {
        if (role.menu === 'Dashboard') {
            return {
                roleName: roleName,
                menu: role.menu,
                allAccess: false,
                entryAccess: false,
                editAccess: false,
                viewAccess: role.viewAccess,
                approvalAccess: false
            };
        }
        else if (role.menu === 'User' || role.menu === 'Role') {
            return {
                roleName: roleName,
                menu: role.menu,
                allAccess: role.allAccess,
                entryAccess: role.entryAccess,
                editAccess: role.editAccess,
                viewAccess: role.viewAccess,
                approvalAccess: false
            };
        }
        else if (role.menu === 'Master Creation') {
          return {
              roleName: roleName,
              menu: role.menu,
              allAccess: role.allAccess,
              entryAccess: role.entryAccess,
              editAccess:false,
              viewAccess: role.viewAccess,
              approvalAccess: false
          };
      }
      else if (role.menu === 'Role') {
        return {
            roleName: roleName,
            menu: role.menu,
            allAccess: role.allAccess,
            entryAccess: role.entryAccess,
            editAccess:false,
            viewAccess: false,
            approvalAccess: false
        };
    }
        else {
            return {
                roleName: roleName,
                menu: role.menu,
                allAccess: role.allAccess ?? false,
                entryAccess: role.entryAccess ?? false,
                editAccess: role.editAccess ?? false,
                viewAccess: role.viewAccess,
                approvalAccess: role.approveAccess ?? false
            };
        }
    });
    
      this.roleService.createRole(formattedRoles).subscribe((res:any)=>{
        alert("Roles Created Successfully");
        this.router.navigateByUrl('role');
      })
    }
  }
}