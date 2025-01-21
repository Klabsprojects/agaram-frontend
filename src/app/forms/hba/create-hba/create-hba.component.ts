import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../../shared-services/common.service';
import { LeaveTransferService } from '../../forms.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-create-hba',
  templateUrl: './create-hba.component.html',
  styleUrl: './create-hba.component.css'
})
export class CreateHbaComponent implements OnInit{
  hbaForm!:FormGroup;
  selectedFile : File | null = null;
  submitted = false;
  orderFor:any[]=[];
  orderType:any[]=[];
  designation:any[]=[];
  department:any[]=[];
  showDropdown = false;
  selectedOption:string='';
  filteredOptions: any[] = [];
  employeeProfileId:string='';
  designationId:string='';
  departmentId:string='';
  phone:string='';
  module:string='';
  submittedBy:any;
  fromValue:any;
  toDateValue = true;
  leaveavailed:string[] = ['Casual Leave', 'Earned Leave'];
  category:string[] = ['Home Town','Anywhere in India','Conversion of Home Town LTC'];
  selfOrFamily:string[] = ['Self','Family']

  ifuserlogin = false;
  userdata: any;


  constructor(@Inject(PLATFORM_ID) private platformId: Object,private router:Router, private hbaService:LeaveTransferService,private fb:FormBuilder,private cs: CommonService){}
  ngAfterViewInit(): void {
    if (localStorage.getItem('loginAs') == 'Officer') {
      this.cs.data$.subscribe((data: any) => {
        if (data) {
          this.userdata = data;
          this.ifuserlogin = true;
          this.selectedOption = this.userdata.fullName;
  
          // Set the value and disable the control
          this.hbaForm.controls['officerName'].setValue(this.userdata.fullName);
          this.hbaForm.controls['officerName'].disable(); // Properly disables the control
          this.hbaForm.controls['department'].setValue(this.userdata.department);
          this.hbaForm.controls['department'].disable(); // Properly disables the control
          this.hbaForm.controls['designation'].setValue(this.userdata.designation);
          this.hbaForm.controls['designation'].disable(); // Properly disables the control
          console.log('chk',this.userdata);
        }
      });
    }
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.submittedBy = localStorage.getItem('loginId');
    }
    this.hbaForm = this.fb.group({
      officerName:['',Validators.required],
      department:['',Validators.required],
      designation:['',Validators.required],
      fromDate:['',Validators.required],
      toDate:['',Validators.required],
      proposedPlaceOfVisit:['',Validators.required],
      blockYear:['',Validators.required],
      selfOrFamily:['',Validators.required],
      fromPlace:['',Validators.required],
      toPlace:['',Validators.required],
      orderType:['',Validators.required],
      orderNo:['',Validators.required],
      orderFor:['',Validators.required],
      dateOfOrder:['',Validators.required],
      orderFile:[null,Validators.required],
      remarks:['',Validators.required],
      leaveavailed:['',Validators.required],
      category:['',Validators.required],
    });
    this.hbaService.getData().subscribe((res: any[]) => {
      res.forEach((item) => {
        if(item.category_type == "order_type"){
          this.orderType.push({label:item.category_name,value:item._id});
        }
        if (item.category_type == "order_for") {
          this.orderFor.push({ label: item.category_name, value: item._id });
        }
      });
    });
  }

  fromDateValue(data:any){
    this.fromValue = data.target.value;
    if(this.hbaForm.get('toDate')?.value < this.fromValue || this.hbaForm.get('fromDate')?.value == ''){
      this.hbaForm.get('toDate')?.setValue('');
      this.toDateValue = true;
    }
    if(this.fromValue){
      this.toDateValue = false;
    }
  }


  onInput(event: any, field: string) {
    const inputValue = event.target.value.trim();
    let mergedOptions: { name: string, id: string, empProfileId: any, mobileNo:string }[] = []; 
    this.hbaService.getEmployeeList().subscribe((res: any) => {
      res.results.forEach((item: any) => {
        const name: string = item.fullName;
        const id: string = item.employeeId;
        const empProfileId: any = item._id;
        const mobileNo = item.mobileNo1;
        mergedOptions.push({ name, id, empProfileId, mobileNo });
      });
      if (field === 'officerName') {
        this.filteredOptions = mergedOptions.filter((option: { name: string, id: string }) => option.name.toLowerCase().includes(inputValue.toLowerCase()));
      } 
      if (this.filteredOptions.length === 0) {
        this.showDropdown = false;
        this.hbaForm.get('officerName')?.setValue('');
      } else {
        this.showDropdown = true;
      }
    });
  }

  selectOption(option: any) {
    const payload = {name:option.name};
    this.selectedOption = option.name;
    this.phone="+91"+option.mobileNo;
    this.hbaForm.get('officerName')?.setValue(this.selectedOption);
    this.showDropdown = false;
    this.hbaService.employeeFilter(payload).subscribe((res:any)=>{
      res.results.empList.forEach((item:any)=>{
        this.employeeProfileId = item._id;
        this.hbaService.getDepartmentData().subscribe((departmentRes: any) => {
          departmentRes.filter((data: any) => {
            this.department.push({ label: data.department_name, value: data._id });
          });
          const matchingDepartment = this.department.filter(item => item.value == res.results.empList.find((data:any) => data.toDepartmentId)?.toDepartmentId);
          matchingDepartment.filter((item:any)=>{
            this.departmentId = item.value;
            this.hbaForm.get('department')?.setValue(item.label)
          });         
        });

        this.hbaService.getDesignations().subscribe((designationRes: any) => {
          designationRes.results.filter((data: any) => {
            this.designation.push({ label: data.designation_name, value: data._id });
          });
          const matchingDesignation = this.designation.filter(item => item.value == res.results.empList.find((data:any) => data.toDesignationId)?.toDesignationId);
          matchingDesignation.filter((item:any)=>{
            this.designationId = item.value;
            this.hbaForm.get('designation')?.setValue(item.label)
          });
         
        });
      })
    })
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.hbaForm.patchValue({ orderFile: this.selectedFile });
    }
    this.selectedFile = event.target.files[0];
    this.hbaForm.get('orderFile')?.setValue(this.selectedFile);
    if (this.selectedFile) {
      if (this.selectedFile.type !== 'application/pdf') {
        this.hbaForm.get('orderFile')?.setErrors({ 'incorrectFileType': true });
        return;
      }

      if (this.selectedFile.size > 5 * 1024 * 1024) { // 5MB in bytes
        this.hbaForm.get('orderFile')?.setErrors({ 'maxSize': true });
        return;
      }

      this.hbaForm.get('orderFile')?.setErrors(null);
    }
  }

  changeOrderFor(data:Event){

  }

  onKeyDown(event: KeyboardEvent){
    const key = event.key;
    if (!((key >= '0' && key <= '9') || 
          ['Backspace', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight'].includes(key))) {
      event.preventDefault();
    }
  }

   onSubmit(): void {
    this.submitted = true;
    console.log("hbaForm",this.hbaForm.valid);
    if (this.hbaForm.valid) {
      const formData = new FormData();
      const formValues = this.hbaForm.value;
      for (const key in formValues) {
        if (formValues.hasOwnProperty(key) && key !== 'orderFile') {
          formData.append(key, formValues[key]);
        }
      }
      if (this.selectedFile) {
        formData.append('orderFile', this.selectedFile);
      }
      this.module = "Leave Travel Concession";
      formData.append('employeeProfileId', this.employeeProfileId);
      formData.append('departmentId', this.departmentId);
      formData.append('designationId', this.designationId);
      formData.append('submittedBy',this.submittedBy);
      formData.append('phone',this.phone);
      formData.append('module',this.module);
      this.hbaService.createLtc(formData).subscribe(
        response => {
          alert(response.message);
          this.router.navigateByUrl('ltc');
         console.log('API Response:', response);
        },
        error => {
          console.error('API Error:', error);
        }
      );
    }
  }
}