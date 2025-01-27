import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LeaveTransferService } from '../../forms.service';

@Component({
  selector: 'app-edit-id',
  templateUrl: './edit-id.component.html',
  styleUrl: './edit-id.component.css'
})
export class EditIdComponent implements OnInit{
   idForm!:FormGroup;
   submitted = false;
   orderType:any[]=[];
   orderFor:any[]=[];
   showDropdown = false;
   filteredOptions: any[] = [];
   selectedOption: any;
   orderfileSelected: File | null = null;
   selectedIdCardFile : File | null = null;
   selectedFinalIdFile : File | null = null;
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
   idCardUrl:string='';
   finalIdUrl:string='';
   ifuserlogin = false;
  
   constructor(private router:Router, private fb:FormBuilder,private route:ActivatedRoute,private idService:LeaveTransferService) { }
 
   ngOnInit(): void {
     const decodedId = this.route.snapshot.queryParamMap.get('id');
     if(decodedId){
       this.id = atob(decodedId);
       this.id = this.id.replace(/^"|"$/g, '');
     }
 
     
 
     this.idForm = this.fb.group({
      officerName:['',Validators.required],
      department:['',Validators.required],
      designation:['',Validators.required],
      idCardNo:['',Validators.required],
      availedDate:['',Validators.required],
      expiryDate:['',Validators.required],
      idCardApplication:[null],
      finalIdCard:[null],
      orderType:['',Validators.required],
      orderNo:['',Validators.required],
      orderFor:['',Validators.required],
      dateOfOrder:['',Validators.required],
      orderFile:[null],
      remarks:[''],
   });
   this.idService.getMhaId(this.id).subscribe((res:any)=>{
     res.results.forEach((data:any)=>{
       this.idForm.get('officerName')?.setValue(data.officerName);
       this.idForm.get('department')?.setValue(data.department);
       this.idForm.get('designation')?.setValue(data.designation);
       this.idForm.get('idCardNo')?.setValue(data.idCardNo);
       this.idForm.get('remarks')?.setValue(data.remarks);
       var availedDate = new Date(data.availedDate);
       data.availedDate= availedDate.toISOString().split('T')[0];
       this.idForm.get('availedDate')?.setValue(data.availedDate);
       var expiryDate = new Date(data.expiryDate);
       data.expiryDate= expiryDate.toISOString().split('T')[0];
       this.idForm.get('expiryDate')?.setValue(data.expiryDate);
       this.url = this.idService.fileUrl;
       this.idForm.get('orderType')?.setValue(data.orderType);
       this.idForm.get('orderNo')?.setValue(data.orderNo);
       this.idForm.get('orderFor')?.setValue(data.orderFor);
       var dateOfOrder = new Date(data.dateOfOrder);
       data.dateOfOrder = dateOfOrder.toISOString().split('T')[0];
       this.idForm.get('dateOfOrder')?.setValue(data.dateOfOrder);
       this.orderFileUrl = this.url+data.orderFile;
       this.idCardUrl = this.url+data.idCardApplication;
       this.finalIdUrl = this.url+data.finalIdCard;
       this.employeeProfileId = data.employeeProfileId._id;
         this.phone = "+91"+data.employeeProfileId.mobileNo1;
         this.departmentId = data.departmentId;
         this.designationId = data.designationId;
     });
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
     let mergedOptions: { name: string, id: string, empProfileId: any,mobileNo:string }[] = []; 
     this.idService.getEmployeeList().subscribe((res: any) => {
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
         this.idForm.get('officerName')?.setValue('');
       } else {
         this.showDropdown = true;
       }
     });
   }
 
   selectOption(option: any) {
     const payload = {name:option.name};
     this.selectedOption = option.name;
     this.phone = "+91"+option.mobileNo;
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
       this.orderfileSelected = input.files[0];
       this.idForm.patchValue({ orderFile: this.orderfileSelected });
     }
     this.orderfileSelected = event.target.files[0];
     if (this.orderfileSelected) {
       if (this.orderfileSelected.type !== 'application/pdf') {
         this.idForm.get('orderFile')?.setErrors({ 'incorrectFileType': true });
         return;
       }
       if (this.orderfileSelected.size > 5 * 1024 * 1024) { 
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
  
  onSubmit(){
    this.submitted = true;
    // console.log(this.idForm.controls);
    // Object.keys(this.idForm.controls).forEach(control => {
    //   const errors = this.idForm.get(control)?.errors;
    //   if (errors) {
    //     console.log(`Control: ${control}, Errors: ${JSON.stringify(errors)}`);
    //   }
    // });
    if(this.idForm.valid){
      const formData = new FormData();
      const formValues = this.idForm.value;
      for (const key in formValues) {
        if (formValues.hasOwnProperty(key) && key !== 'orderFile' && key !=='idCardApplication' && key !=='finalIdCard') {
          formData.append(key, formValues[key]);
        }
      }
      if (this.orderfileSelected) {
        formData.append('orderFile', this.orderfileSelected);
      }
      if (this.selectedIdCardFile) {
        formData.append('idCardApplication', this.selectedIdCardFile);
      }
      if (this.selectedFinalIdFile) {
        formData.append('finalIdCard', this.selectedFinalIdFile);
      }
      
      this.module = 'Ministry of Home Affairs ID Card';
      formData.append('employeeProfileId', this.employeeProfileId);
      formData.append('departmentId', this.departmentId);
      formData.append('designationId', this.designationId);
      formData.append('phone', this.phone);
      formData.append('module',this.module);
      formData.append('id',this.id);
    this.idService.updateMhaId(formData).subscribe(
      response => {
        alert(response.message)
        this.router.navigateByUrl('mha-idcard');
      },
      error => {
        console.error('API Error:', error);
      }
    );
  }
 }  
}
