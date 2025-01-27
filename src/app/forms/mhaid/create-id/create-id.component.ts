import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeaveTransferService } from '../../forms.service';
import { CommonService } from '../../../shared-services/common.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-create-id',
  templateUrl: './create-id.component.html',
  styleUrl: './create-id.component.css'
})
export class CreateIdComponent implements OnInit{
  idForm!:FormGroup;
  selectedFile : File | null = null;
  selectedIdCardFile : File | null = null;
  selectedFinalIdFile : File | null = null;
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
 
  ifuserlogin = false;
  userdata: any;


  constructor(@Inject(PLATFORM_ID) private platformId: Object,private router:Router, private idService:LeaveTransferService,private fb:FormBuilder,private cs: CommonService){}
 
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.submittedBy = localStorage.getItem('loginId');
    }
    this.idForm = this.fb.group({
      officerName:['',Validators.required],
      department:['',Validators.required],
      designation:['',Validators.required],
      idCardNo:['',Validators.required],
      availedDate:['',Validators.required],
      expiryDate:['',Validators.required],
      idCardApplication:[null,Validators.required],
      finalIdCard:[null,Validators.required],
      orderType:['',Validators.required],
      orderNo:['',Validators.required],
      orderFor:['',Validators.required],
      dateOfOrder:['',Validators.required],
      orderFile:[null,Validators.required],
      remarks:[''],
    });
    this.idService.getData().subscribe((res: any[]) => {
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
    this.idService.getEmployeeList().subscribe((res: any) => {
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
        this.idForm.get('officerName')?.setValue('');
      } else {
        this.showDropdown = true;
      }
    });
  }

  selectOption(option: any) {
    const payload = {name:option.name};
    this.selectedOption = option.name;
    this.phone="+91"+option.mobileNo;
    this.idForm.get('officerName')?.setValue(this.selectedOption);
    this.showDropdown = false;
    this.idService.employeeFilter(payload).subscribe((res:any)=>{
      res.results.empList.forEach((item:any)=>{
        this.employeeProfileId = item._id;
        this.idService.getDepartmentData().subscribe((departmentRes: any) => {
          departmentRes.filter((data: any) => {
            this.department.push({ label: data.department_name, value: data._id });
          });
          const matchingDepartment = this.department.filter(item => item.value == res.results.empList.find((data:any) => data.toDepartmentId)?.toDepartmentId);
          matchingDepartment.filter((item:any)=>{
            this.departmentId = item.value;
            this.idForm.get('department')?.setValue(item.label)
          });         
        });

        this.idService.getDesignations().subscribe((designationRes: any) => {
          designationRes.results.filter((data: any) => {
            this.designation.push({ label: data.designation_name, value: data._id });
          });
          const matchingDesignation = this.designation.filter(item => item.value == res.results.empList.find((data:any) => data.toDesignationId)?.toDesignationId);
          matchingDesignation.filter((item:any)=>{
            this.designationId = item.value;
            this.idForm.get('designation')?.setValue(item.label)
          });
         
        });
      })
    })
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.idForm.patchValue({ orderFile: this.selectedFile });
    }
    this.selectedFile = event.target.files[0];
    this.idForm.get('orderFile')?.setValue(this.selectedFile);
    if (this.selectedFile) {
      if (this.selectedFile.type !== 'application/pdf') {
        this.idForm.get('orderFile')?.setErrors({ 'incorrectFileType': true });
        return;
      }

      if (this.selectedFile.size > 5 * 1024 * 1024) { // 5MB in bytes
        this.idForm.get('orderFile')?.setErrors({ 'maxSize': true });
        return;
      }

      this.idForm.get('orderFile')?.setErrors(null);
    }
  }

  idCardFile(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedIdCardFile = input.files[0];
      this.idForm.patchValue({ idCardApplication: this.selectedIdCardFile });
    }
    this.selectedIdCardFile = event.target.files[0];
    this.idForm.get('idCardApplication')?.setValue(this.selectedIdCardFile);
    if (this.selectedIdCardFile) {
      if (this.selectedIdCardFile.type !== 'application/pdf') {
        this.idForm.get('idCardApplication')?.setErrors({ 'incorrectFileType': true });
        return;
      }

      if (this.selectedIdCardFile.size > 5 * 1024 * 1024) { // 5MB in bytes
        this.idForm.get('idCardApplication')?.setErrors({ 'maxSize': true });
        return;
      }

      this.idForm.get('idCardApplication')?.setErrors(null);
    }
  }

  finalIdFile(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFinalIdFile = input.files[0];
      this.idForm.patchValue({ finalIdCard: this.selectedFinalIdFile });
    }
    this.selectedFinalIdFile = event.target.files[0];
    this.idForm.get('finalIdCard')?.setValue(this.selectedFinalIdFile);
    if (this.selectedFinalIdFile) {
      if (this.selectedFinalIdFile.type !== 'application/pdf') {
        this.idForm.get('finalIdCard')?.setErrors({ 'incorrectFileType': true });
        return;
      }

      if (this.selectedFinalIdFile.size > 5 * 1024 * 1024) { // 5MB in bytes
        this.idForm.get('finalIdCard')?.setErrors({ 'maxSize': true });
        return;
      }

      this.idForm.get('finalIdCard')?.setErrors(null);
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
    console.log("idForm",this.idForm.valid);
    if (this.idForm.valid) {
      const formData = new FormData();
      const formValues = this.idForm.value;
      for (const key in formValues) {
        if (formValues.hasOwnProperty(key) && key !== 'orderFile' && key !=='idCardApplication' && key !=='finalIdCard') {
          formData.append(key, formValues[key]);
        }
      }
      if (this.selectedFile) {
        formData.append('orderFile', this.selectedFile);
      }
      if (this.selectedIdCardFile) {
        formData.append('idCardApplication', this.selectedIdCardFile);
      }
      if (this.selectedFinalIdFile) {
        formData.append('finalIdCard', this.selectedFinalIdFile);
      }
      this.module = "MInistry of Home Affairs ID Card";
      formData.append('employeeProfileId', this.employeeProfileId);
      formData.append('departmentId', this.departmentId);
      formData.append('designationId', this.designationId);
      formData.append('submittedBy',this.submittedBy);
      formData.append('phone',this.phone);
      formData.append('module',this.module);
      this.idService.createMhaId(formData).subscribe(
        response => {
          alert(response.message);
          this.router.navigateByUrl('mha-idcard');
         console.log('API Response:', response);
        },
        error => {
          console.error('API Error:', error);
        }
      );
    }
  }

}
