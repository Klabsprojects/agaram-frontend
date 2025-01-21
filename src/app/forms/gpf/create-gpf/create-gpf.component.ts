import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeaveTransferService } from '../../forms.service';
import { isPlatformBrowser } from '@angular/common';
import { CommonService } from '../../../shared-services/common.service';

@Component({
  selector: 'app-create-gpf',
  templateUrl: './create-gpf.component.html',
  styleUrl: './create-gpf.component.css'
})
export class CreateGpfComponent implements OnInit{

  gpfForm!:FormGroup;
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
    gpfType:string[] = ['Temporary','Part Final','90 % Withdrawal'];
    purpose:any[]=['MEDICAL','HIGHER EDUCATION','MARRIAGE','RELIGIOUS VOW','HOUSE CONSTRUCTION','90 % WITHDRAWAL'];
  
    ifuserlogin = false;
    userdata: any;
  
  
    constructor(@Inject(PLATFORM_ID) private platformId: Object,private router:Router, private gpfService:LeaveTransferService,private fb:FormBuilder,private cs: CommonService){}
   
    ngOnInit(): void {
      if (isPlatformBrowser(this.platformId)) {
        this.submittedBy = localStorage.getItem('loginId');
      }
      this.gpfForm = this.fb.group({
        officerName:['',Validators.required],
        department:['',Validators.required],
        designation:['',Validators.required],
        gpfType:['',Validators.required],
        availedDate:['',Validators.required],
        availedAmount:['',Validators.required],
        purpose:['',Validators.required],
        orderType:['',Validators.required],
        orderNo:['',Validators.required],
        orderFor:['',Validators.required],
        dateOfOrder:['',Validators.required],
        orderFile:[null,Validators.required],
        remarks:['',Validators.required],
      });
      this.gpfService.getData().subscribe((res: any[]) => {
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
  
   
    onInput(event: any, field: string) {
      const inputValue = event.target.value.trim();
      let mergedOptions: { name: string, id: string, empProfileId: any, mobileNo:string }[] = []; 
      this.gpfService.getEmployeeList().subscribe((res: any) => {
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
          this.gpfForm.get('officerName')?.setValue('');
        } else {
          this.showDropdown = true;
        }
      });
    }
  
    selectOption(option: any) {
      const payload = {name:option.name};
      this.selectedOption = option.name;
      this.phone="+91"+option.mobileNo;
      this.gpfForm.get('officerName')?.setValue(this.selectedOption);
      this.showDropdown = false;
      this.gpfService.employeeFilter(payload).subscribe((res:any)=>{
        res.results.empList.forEach((item:any)=>{
          this.employeeProfileId = item._id;
          this.gpfService.getDepartmentData().subscribe((departmentRes: any) => {
            departmentRes.filter((data: any) => {
              this.department.push({ label: data.department_name, value: data._id });
            });
            const matchingDepartment = this.department.filter(item => item.value == res.results.empList.find((data:any) => data.toDepartmentId)?.toDepartmentId);
            matchingDepartment.filter((item:any)=>{
              this.departmentId = item.value;
              this.gpfForm.get('department')?.setValue(item.label)
            });         
          });
  
          this.gpfService.getDesignations().subscribe((designationRes: any) => {
            designationRes.results.filter((data: any) => {
              this.designation.push({ label: data.designation_name, value: data._id });
            });
            const matchingDesignation = this.designation.filter(item => item.value == res.results.empList.find((data:any) => data.toDesignationId)?.toDesignationId);
            matchingDesignation.filter((item:any)=>{
              this.designationId = item.value;
              this.gpfForm.get('designation')?.setValue(item.label)
            });
           
          });
        })
      })
    }
  
    onFileSelected(event: any) {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        this.selectedFile = input.files[0];
        this.gpfForm.patchValue({ orderFile: this.selectedFile });
      }
      this.selectedFile = event.target.files[0];
      this.gpfForm.get('orderFile')?.setValue(this.selectedFile);
      if (this.selectedFile) {
        if (this.selectedFile.type !== 'application/pdf') {
          this.gpfForm.get('orderFile')?.setErrors({ 'incorrectFileType': true });
          return;
        }
  
        if (this.selectedFile.size > 5 * 1024 * 1024) { // 5MB in bytes
          this.gpfForm.get('orderFile')?.setErrors({ 'maxSize': true });
          return;
        }
  
        this.gpfForm.get('orderFile')?.setErrors(null);
      }
    }
  
    getGpfType(data:any){
      console.log(data.target.value);
      if(data.target.value == "90 % Withdrawal"){
        this.purpose = ['90 % WITHDRAWAL'];
      }
      else{
        this.purpose = ['MEDICAL','HIGHER EDUCATION','MARRIAGE','RELIGIOUS VOW','HOUSE CONSTRUCTION','90 % WITHDRAWAL'];
      }
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
      console.log("gpfForm",this.gpfForm.valid);
      if (this.gpfForm.valid) {
        const formData = new FormData();
        const formValues = this.gpfForm.value;
        for (const key in formValues) {
          if (formValues.hasOwnProperty(key) && key !== 'orderFile') {
            formData.append(key, formValues[key]);
          }
        }
        if (this.selectedFile) {
          formData.append('orderFile', this.selectedFile);
        }
        this.module = "GPF";
        formData.append('employeeProfileId', this.employeeProfileId);
        formData.append('departmentId', this.departmentId);
        formData.append('designationId', this.designationId);
        formData.append('submittedBy',this.submittedBy);
        formData.append('phone',this.phone);
        formData.append('module',this.module);
        this.gpfService.createGpf(formData).subscribe(
          response => {
            alert(response.message);
            this.router.navigateByUrl('gpf');
           console.log('API Response:', response);
          },
          error => {
            console.error('API Error:', error);
          }
        );
      }
    }

}
