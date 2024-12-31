import { Component, OnInit,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveTransferService } from '../forms/forms.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit{
  userForm!:FormGroup;
  showPopup = true;
  submitted = false;
  showPassword = false;
  showFields = false;
  showNew = false;
  showExisting = false;
  userData:any[]=[];
  userTypeData:any[]=[];
  showAdd:boolean=false;
  showEdit:boolean=false;
  showName:boolean = true;
  showDropdownUsername:boolean = false;
  officerDet:any[]=[];
  id:any;
  username:string = '';
  userTypeValue : string = '';

  constructor(private fb:FormBuilder,private userService:LeaveTransferService,private ElementRef:ElementRef) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      loginAs : ['',Validators.required],
      username : ['',Validators.required],
      password : ['',Validators.required],
      checkValue:['']
    });
    this.userService.getUserList().subscribe((res:any)=>{
      this.userData = res.results;
    })
    this.checkAccess();
  }

  checkAccess(): void {
    this.userService.currentRoleData.subscribe((response: any[]) => {
      const userMenu = response.find(item => item.menu === 'User');
      this.showAdd = userMenu?.entryAccess ?? false;
      this.showEdit = userMenu?.editAccess ?? false;
    });
  }

  checkType(data:any){
    console.log(data.target.value);
    if(data.target.value == 'New'){
      this.showFields = true;
      this.showNew = true;
      this.showExisting = false;
    }
    else{
      this.showFields = true;
      this.showNew = false;
      this.showExisting = true;
      this.userService.getUniqueUser().subscribe((res:any)=>{
        this.userTypeData = res.results;
        console.log(this.userTypeData);
      });
    }
  } 

  toggleStatus(data:any): void {
    const message = data.activeStatus
      ? 'Are you sure you want to inactivate this user?'
      : 'Are you sure you want to activate this user?';

    if (window.confirm(message)) {
      data.activeStatus = !data.activeStatus;
      this.userService.getUpdateActive(data).subscribe((res: any) => {
        console.log(res);
      });
    }
  }



  addUser(){
    this.showFields = false;
    this.userForm.reset();
  }

  getUsername(event:Event){
    // this.id = event.target.value;
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;
    this.id = selectedId;
    const selectedOfficer = this.officerDet.find(officer => officer._id === selectedId);
    
    if (selectedOfficer) {
      this.username = selectedOfficer.fullName;
    }
  }
  
  onSubmit(){
    this.submitted = true;
    if(this.userForm.valid)
    {
      
      if(this.userTypeValue == "Officer"){
        const formValues = { ...this.userForm.value,
          username : this.username,
          employeeProfileId : this.id
         };
         delete formValues['checkValue'];
        formValues['activeStatus'] = true;
        this.userService.createUser(formValues).subscribe((res:any)=>{
          alert("New User Created Successfully");
          this.showPopup = false;
          setTimeout(() => {
            this.ElementRef.nativeElement.ownerDocument.querySelector('.modal-backdrop.fade').style.opacity = '0';
            window.location.reload();
          });
        })
      }
      else{
        const formValues = { ...this.userForm.value}
        delete formValues['checkValue'];
        formValues['activeStatus'] = true;
        this.userService.createUser(formValues).subscribe((res:any)=>{
          alert("New User Created Successfully");
          this.showPopup = false;
          setTimeout(() => {
            this.ElementRef.nativeElement.ownerDocument.querySelector('.modal-backdrop.fade').style.opacity = '0';
            window.location.reload();
          });
        })
      }
      
      // delete this.userForm.value['checkValue']; 
      
    }
  }

  userType(data:any){
    console.log(data.target.value);
    this.userTypeValue = data.target.value;
    if(data.target.value == "Officer"){
      this.showName = false;
      this.showDropdownUsername = true;
      this.userService.getEmployeeForLogin().subscribe((res:any)=>{
          this.officerDet = res.results;
      })
    }
    else{
      this.showName = true;
      this.showDropdownUsername = false;
    }
  }

  cancel(){
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}
