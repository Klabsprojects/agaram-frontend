import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  conductRulePermissionAttachmentFile : File | null = null;
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
  State:any[]=[];
  district:any[]=[];
  hbaAvailed:any[]=['Nerkundram Phase - I' , 'Nerkundram Phase - II' , 'Other TNHB Projects / Private'];
  typeOfProperty:any[]=['Ready Build','Construction'];
  existingResidence:string[]=['yes','No'];
  totalNumberOfInstallments:any[]=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
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
    this.hbaService.getState().subscribe((res:any)=>{
      this.State = res;
    })
    this.hbaForm = this.fb.group({
      officerName:['',Validators.required],
      department:[''],
      designation:[''],
      state:[''],
      district:[''],
      hbaAvailedFor:[''],
      typeOfProperty:[''],
      dateOfApplication:[''],
      totalCostOfProperty:[''],
      isExisingResidenceAvailable:[''],
      twoBRelacation:[''],
      totalHbaAvailed:[''],
      totalNumberOfInstallments:[''],
      totalNumberOfRecoveryMonths:[''],
      conductRulePermissionAttachment: [''],
      installments: this.fb.array([
        this.fb.group({
          installmentNumber: [''],
          conductRulePermission: [''],
          amount:[''],
          installmentDate:['']
        }),
      ]),
      orderType:[''],
      orderNo:[''],
      orderFor:[''],
      dateOfOrder:[''],
      orderFile:[null],
      remarks:[''],
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
    this.viewhbtypes();
  }

  get installments(): FormArray {
    return this.hbaForm.get('installments') as FormArray;
  }

  viewhbtypes(){
    this.hbaService.getData().subscribe((res:any)=>{
      this.typeOfProperty = res.filter((item:any) => item.category_type === "hba_typeofproperty");
      this.hbaAvailed = res.filter((item:any) => item.category_type === "hba_availed_for");
    })
  }

  getDistrict(event:any){
    const id = event.target.value;
    this.hbaService.getDistrict(id).subscribe((res:any)=>{
      this.district = res;
    })
  }

  getResidence(data:any){
    this.hbaForm.get('twoBRelacation')?.setValue(data.target.value);
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
      this.hbaForm.get('orderFile')?.setErrors(null);
    }
  }

  getPermissionFile(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.conductRulePermissionAttachmentFile = input.files[0];
      this.hbaForm.patchValue({ conductRulePermissionAttachment: this.conductRulePermissionAttachmentFile });
    }
    this.conductRulePermissionAttachmentFile = event.target.files[0];
    this.hbaForm.get('conductRulePermissionAttachment')?.setValue(this.conductRulePermissionAttachmentFile);
    if (this.conductRulePermissionAttachmentFile) {
      if (this.conductRulePermissionAttachmentFile.type !== 'application/pdf') {
        this.hbaForm.get('conductRulePermissionAttachment')?.setErrors({ 'incorrectFileType': true });
        return;
      }
      this.hbaForm.get('conductRulePermissionAttachment')?.setErrors(null);
    }
  }

  // getPermissionFile(event: any, index: number) {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     this.installmentFileSelected = input.files[0];
  //     const installmentFormGroup = (this.hbaForm.get('installments') as FormArray).at(index) as FormGroup;
  //     installmentFormGroup.get('conductRulePermissionAttachment')?.setValue(this.installmentFileSelected);
  //     if (this.installmentFileSelected.type !== 'application/pdf') {
  //       installmentFormGroup.get('conductRulePermissionAttachment')?.setErrors({ incorrectFileType: true });
  //       return;
  //     }
     
  //     installmentFormGroup.get('conductRulePermissionAttachment')?.setErrors(null);
  //   }
  // }
  

  onKeyDown(event: KeyboardEvent){
    const key = event.key;
    if (!((key >= '0' && key <= '9') || 
          ['Backspace', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight'].includes(key))) {
      event.preventDefault();
    }
  }

  onSubmit(): void {
    this.submitted = true;
    console.log('Form Values:', this.hbaForm.value);
    console.log('Form Valid:', this.hbaForm.valid);
  
    if (this.hbaForm.valid) {
      const formData = new FormData();
      const formValues = this.hbaForm.value;
  
      // Append top-level fields except 'installments'
      Object.keys(formValues).forEach((key) => {
        if (key !== 'installments') {
          if (key === 'orderFile' && this.selectedFile) {
            formData.append(key, this.selectedFile); // Append binary file
          } else if (key === 'conductRulePermissionAttachment' && this.conductRulePermissionAttachmentFile) {
            formData.append(key, this.conductRulePermissionAttachmentFile); // Append binary file
          } else {
            formData.append(key, formValues[key]); // Append other fields
          }
        }
      });
  
      // Append 'installments' in the required format
      formValues.installments.forEach((installment: any, index: number) => {
        Object.keys(installment).forEach((field) => {
          formData.append(`installments[${index}][${field}]`, installment[field]);
        });
      });
  
      // Append additional static fields only once
      formData.append('employeeProfileId', this.employeeProfileId);
      formData.append('departmentId', this.departmentId);
      formData.append('designationId', this.designationId);
      formData.append('submittedBy', this.submittedBy);
      formData.append('phone', this.phone);
      formData.append('module', 'House Building Advance');
  
      // Log final FormData for debugging
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });
  
      // Call the API
      this.hbaService.createHba(formData).subscribe(
        (response) => {
          alert(response.message);
          this.router.navigateByUrl('hba');
          console.log('API Response:', response);
        },
        (error) => {
          console.error('API Error:', error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }
    
}
