import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LeaveTransferService } from '../../forms.service';
import { CommonService } from '../../../shared-services/common.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-edit-gpf',
  templateUrl: './edit-gpf.component.html',
  styleUrl: './edit-gpf.component.css'
})
export class EditGpfComponent implements OnInit{

   gpfForm!:FormGroup;
   submitted = false;
   orderType:any[]=[];
   orderFor:any[]=[];
   showDropdown = false;
   filteredOptions: any[] = [];
   selectedOption: any;
   orderfileSelected: File | null = null;
   department:any[]=[];
   designation:any[]=[];
   employeeProfileId:string='';
   departmentId : string = '';
   designationId:string='';
   phone:string='';
   module:string='';
   id:any;
   url:string='';
   orderFileUrl:string='';
   ifuserlogin = false;
   gpfType:any[] = ['Temporary','Part Final','90 % Withdrawal'];
    purpose:any[]=['MEDICAL','HIGHER EDUCATION','MARRIAGE','RELIGIOUS VOW','HOUSE CONSTRUCTION','90 % WITHDRAWAL'];

   constructor(private router:Router, private fb:FormBuilder,private route:ActivatedRoute,private gpfService:LeaveTransferService) { }
 
   ngOnInit(): void {
     const decodedId = this.route.snapshot.queryParamMap.get('id');
     if(decodedId){
       this.id = atob(decodedId);
       this.id = this.id.replace(/^"|"$/g, '');
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
      remarks:[''],
   });
   this.gpfService.getGpfId(this.id).subscribe((res:any)=>{
     res.results.forEach((data:any)=>{
       this.gpfForm.get('officerName')?.setValue(data.officerName);
       this.gpfForm.get('department')?.setValue(data.department);
       this.gpfForm.get('designation')?.setValue(data.designation);
       this.gpfForm.get('gpfType')?.setValue(data.gpfType);
       this.gpfForm.get('availedAmount')?.setValue(data.availedAmount);
       this.gpfForm.get('purpose')?.setValue(data.purpose);
       this.gpfForm.get('remarks')?.setValue(data.remarks);
       var availedDate = new Date(data.availedDate);
       data.availedDate= availedDate.toISOString().split('T')[0];
       this.gpfForm.get('availedDate')?.setValue(data.availedDate);
       this.url = this.gpfService.fileUrl;
       this.gpfForm.get('orderType')?.setValue(data.orderType);
       this.gpfForm.get('orderNo')?.setValue(data.orderNo);
       this.gpfForm.get('orderFor')?.setValue(data.orderFor);
       var dateOfOrder = new Date(data.dateOfOrder);
       data.dateOfOrder = dateOfOrder.toISOString().split('T')[0];
       this.gpfForm.get('dateOfOrder')?.setValue(data.dateOfOrder);
       this.orderFileUrl = this.url+data.orderFile;
       this.employeeProfileId = data.employeeProfileId._id;
         this.phone = "+91"+data.employeeProfileId.mobileNo1;
         this.departmentId = data.departmentId;
         this.designationId = data.designationId;
     });
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
   this.viewgpftype();
 }
 viewgpftype(){
  this.gpfService.getData().subscribe((res)=>{
    this.gpfType = res.filter((item:any) => item.category_type === "gpf_type");
    this.purpose = res.filter((item:any) => item.category_type === "purpose_of_gpf");
  })
}
 
   getGpfType(data:any){
    if(data.target.value == "90 % Withdrawal"){
      this.purpose = ['90 % WITHDRAWAL'];
    }
    else{
      this.purpose = ['MEDICAL','HIGHER EDUCATION','MARRIAGE','RELIGIOUS VOW','HOUSE CONSTRUCTION','90 % WITHDRAWAL'];
    }
  }
 
   onInput(event: any, field: string) {
     const inputValue = event.target.value.trim();
     let mergedOptions: { name: string, id: string, empProfileId: any,mobileNo:string }[] = []; 
     this.gpfService.getEmployeeList().subscribe((res: any) => {
       res.results.forEach((item: any) => {
         const name: string = item.fullName;
         const id: string = item.employeeId;
         const mobileNo = item.mobileNo1;
         const empProfileId: any = item._id;
         mergedOptions.push({ name, id, empProfileId,mobileNo });
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
     this.phone = "+91"+option.mobileNo;
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
       this.orderfileSelected = input.files[0];
       this.gpfForm.patchValue({ orderFile: this.orderfileSelected });
     }
     this.orderfileSelected = event.target.files[0];
     if (this.orderfileSelected) {
       if (this.orderfileSelected.type !== 'application/pdf') {
         this.gpfForm.get('orderFile')?.setErrors({ 'incorrectFileType': true });
         return;
       }
       if (this.orderfileSelected.size > 5 * 1024 * 1024) { 
         this.gpfForm.get('orderFile')?.setErrors({ 'maxSize': true });
         return;
       }
       this.gpfForm.get('orderFile')?.setErrors(null);
     }
   }
 
   onKeyDown(event: KeyboardEvent){
    const key = event.key;
    if (!((key >= '0' && key <= '9') || 
          ['Backspace', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight'].includes(key))) {
      event.preventDefault();
    }
  } 
  
   onSubmit(){
     this.submitted = true;
     if(this.gpfForm.valid){
       const formData = new FormData();
       const formValues = this.gpfForm.value;
       for (const key in formValues) {
         if (formValues.hasOwnProperty(key) && key !== 'orderFile') {
           formData.append(key, formValues[key]);
         }
       }
       if (this.orderfileSelected) {
         formData.append('orderFile', this.orderfileSelected);
       }
       
       this.module = 'GPF';
       formData.append('employeeProfileId', this.employeeProfileId);
       formData.append('departmentId', this.departmentId);
       formData.append('designationId', this.designationId);
       formData.append('phone', this.phone);
       formData.append('module',this.module);
       formData.append('id',this.id);
     this.gpfService.updateGpf(formData).subscribe(
       response => {
         alert(response.message)
         this.router.navigateByUrl('gpf');
       },
       error => {
         console.error('API Error:', error);
       }
     );
   }
  }  
}
