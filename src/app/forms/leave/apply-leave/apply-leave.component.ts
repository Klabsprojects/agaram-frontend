import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveTransferService } from '../../forms.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { CommonService } from '../../../shared-services/common.service';

@Component({
  selector: 'app-apply-leave',
  templateUrl: './apply-leave.component.html',
  styleUrl: './apply-leave.component.css'
})
export class ApplyLeaveComponent implements OnInit{

  applyLeaveForm!:FormGroup;
  submitted = false;
  filteredOptions:any[]=[];
  showDropdown = false;
  selectedOption : string = '';
  selectedFile : File | null = null;
  orderFor:any[]=[];
  orderType:any[]=[];
  leaveType:any[]=[];
  country:any[]=[];
  employeeProfileId:string='';
  phone:string='';
  module:string='';
  submittedBy:any;
  ifuserlogin = false;
  userdata: any;


  constructor(@Inject(PLATFORM_ID) private platformId: Object,private leaveService:LeaveTransferService,private fb:FormBuilder,private router:Router,private cs: CommonService){}
  ngAfterViewInit(): void {
    if (localStorage.getItem('loginAs') == 'Officer') {
      this.cs.data$.subscribe((data: any) => {
        if (data) {
          this.userdata = data;
          this.ifuserlogin = true;
          this.selectedOption = this.userdata.fullName;
          // this.selectedEmpOption = this.userdata.employeeId;
  
          // Set the value and disable the control
          this.applyLeaveForm.controls['fullName'].setValue(this.userdata.fullName);
          this.applyLeaveForm.controls['fullName'].disable(); // Properly disables the control
          this.applyLeaveForm.controls['employeeId'].setValue(this.userdata.employeeId);
          this.applyLeaveForm.controls['employeeId'].disable(); // Properly disables the control
          // console.log('chk',this.userdata);
        }
      });
    }
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.submittedBy = localStorage.getItem('loginId');
      }
    this.applyLeaveForm = this.fb.group({
      fullName:['',Validators.required],
      employeeId:['',Validators.required],
      typeOfLeave:['',Validators.required],
      fromDate:['',Validators.required],
      endDate:['',Validators.required],
      foreignVisitOrDeftCountry:['',Validators.required],
      orderType:['',Validators.required],
      orderNo:['',Validators.required],
      orderFor:['',Validators.required],
      dateOfOrder:['',Validators.required],
      remarks:['',Validators.required],
      orderFile:[null,Validators.required]
    });
    this.leaveService.getData().subscribe((res:any)=>{
      res.forEach((item:any)=>{
        if(item.category_type == 'country'){
          this.country.push({label:item.category_name,value:item._id});
        }
        if(item.category_type == "order_type"){
          this.orderType.push({label:item.category_name,value:item._id});
        }
        if (item.category_type == "order_for") {
          this.orderFor.push({ label: item.category_name, value: item._id });
        }
        if(item.category_type == "leave_type") {
          this.leaveType.push({ label: item.category_name, value: item._id });
        }
      })
    })
  }

  onInput(event: any, field: string) {
    const inputValue = event.target.value.trim();
    let mergedOptions: { name: string, id: string, empProfileId: any, mobileNo:string }[] = []; 
    this.leaveService.getEmployeeList().subscribe((res: any) => {
      res.results.forEach((item: any) => {
        const name: string = item.fullName;
        const id: string = item.employeeId;
        const empProfileId: any = item._id;
        const mobileNo:string = item.mobileNo1;
        // console.log(mobileNo);
        this.employeeProfileId = empProfileId;
        mergedOptions.push({ name, id, empProfileId, mobileNo });
      });
      if (field === 'fullName') {
        this.filteredOptions = mergedOptions.filter((option: { name: string, id: string }) => option.name.toLowerCase().includes(inputValue.toLowerCase()));
      } 
      if (this.filteredOptions.length === 0) {
        this.showDropdown = false;
        this.applyLeaveForm.get('fullName')?.setValue('');
      } else {
        this.showDropdown = true;
      }
    });
  }

  selectOption(option: any) {
    this.selectedOption = option.name;
    this.applyLeaveForm.get('fullName')?.setValue(this.selectedOption);
    this.applyLeaveForm.get('employeeId')?.setValue(option.id)
    this.showDropdown = false;
    this.phone = "+91"+option.mobileNo;
    // console.log(this.phone);
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.applyLeaveForm.patchValue({ orderFile: this.selectedFile });
    }
    this.selectedFile = event.target.files[0];
    this.applyLeaveForm.get('orderFile')?.setValue(this.selectedFile);
    if (this.selectedFile) {
      if (this.selectedFile.type !== 'application/pdf') {
        this.applyLeaveForm.get('orderFile')?.setErrors({ 'incorrectFileType': true });
        return;
      }

      if (this.selectedFile.size > 5 * 1024 * 1024) { // 5MB in bytes
        this.applyLeaveForm.get('orderFile')?.setErrors({ 'maxSize': true });
        return;
      }

      this.applyLeaveForm.get('orderFile')?.setErrors(null);
    }
  }

  onKeyDown(data:Event){

  }

  onSubmit(){
    this.submitted = true;
    if(this.applyLeaveForm.valid){
      const formData = new FormData();
      const formValues = this.applyLeaveForm.value;
      for (const key in formValues) {
        if (formValues.hasOwnProperty(key) && key !== 'orderFile') {
          formData.append(key, formValues[key]);
        }
      }
      if (this.selectedFile) {
        formData.append('orderFile', this.selectedFile);
      }
      this.module = 'Leave';
      formData.append('employeeProfileId', this.employeeProfileId);
      formData.append('submittedBy',this.submittedBy);
      formData.append('phone', this.phone);
      formData.append('module',this.module);
      this.leaveService.applyLeave(formData).subscribe(
        response => {
          alert(response.message);
          this.router.navigateByUrl('leave');
        },
        error => {
          console.error('API Error:', error);
        }
      );
  }
}
}