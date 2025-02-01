import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LeaveTransferService } from '../../forms.service';
import { CommonService } from '../../../shared-services/common.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-edit-hba',
  templateUrl: './edit-hba.component.html',
  styleUrl: './edit-hba.component.css'
})
export class EditHbaComponent implements OnInit{
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
     hbaAvailed:string[]=['Nerkundram Phase - I' , 'Nerkundram Phase - II' , 'Other TNHB Projects / Private'];
     typeOfProperty:string[]=['Ready Build','Construction'];
     existingResidence:string[]=['yes','No'];
     totalNumberOfInstallments:any[]=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,"Final"];
     ifuserlogin = false;
     userdata: any;
     id:any;
     url:string='';
     orderFileUrl:string='';
     installment:any[]=[];
     showTable = false;
   
     constructor(@Inject(PLATFORM_ID) private platformId: Object,private router:Router,private route:ActivatedRoute, private hbaService:LeaveTransferService,private fb:FormBuilder,private cs: CommonService){}
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
         res.results.forEach((item:any)=>{
           this.State.push({label:item.stateName,value:item._id});
         })
       })

       

       const decodedId = this.route.snapshot.queryParamMap.get('id');
     if(decodedId){
       this.id = atob(decodedId);
       this.id = this.id.replace(/^"|"$/g, '');
     }
     
     this.hbaService.getHbaId(this.id).subscribe((res:any)=>{
      res.results.forEach((data:any)=>{
        if (data.installments && Array.isArray(data.installments)) {
          const hasValidInstallments = data.installments.some((ele: any) => {
            return ele.installmentNumber !== "" && ele.amount !== null && ele.conductRulePermission !== "" && ele.installmentDate !== null;
          });
          this.showTable = hasValidInstallments;
          if (hasValidInstallments) {
            this.installment.push(...data.installments);
          }
        }
        this.hbaService.getDistrict(data.state).subscribe((response: any) => {
          this.district = response.results.map((items: any) => ({
            label:items.districtName,value:items._id
          }));
         if (data.district) {
            this.hbaForm.get('district')?.setValue(data.district);
          }
        });
        this.hbaForm.get('officerName')?.setValue(data.officerName);
        this.hbaForm.get('department')?.setValue(data.department);
        this.hbaForm.get('designation')?.setValue(data.designation);
        this.hbaForm.get('state')?.setValue(data.state);
        this.hbaForm.get('district')?.setValue(data.district);
        this.hbaForm.get('hbaAvailedFor')?.setValue(data.hbaAvailedFor);
        this.hbaForm.get('typeOfProperty')?.setValue(data.typeOfProperty);
        var dateOfApplication = new Date(data.dateOfApplication);
        data.dateOfApplication= dateOfApplication.toISOString().split('T')[0];
        this.hbaForm.get('dateOfApplication')?.setValue(data.dateOfApplication);
        this.hbaForm.get('totalCostOfProperty')?.setValue(data.totalCostOfProperty);
        this.hbaForm.get('isExisingResidenceAvailable')?.setValue(data.isExisingResidenceAvailable);
        this.hbaForm.get('twoBRelacation')?.setValue(data.twoBRelacation);
        this.hbaForm.get('totalHbaAvailed')?.setValue(data.totalHbaAvailed);
        this.hbaForm.get('totalNumberOfInstallments')?.setValue(data.totalNumberOfInstallments);
        this.hbaForm.get('totalNumberOfRecoveryMonths')?.setValue(data.totalNumberOfRecoveryMonths);
        this.url = this.hbaService.fileUrl;
       this.hbaForm.get('orderType')?.setValue(data.orderType);
       this.hbaForm.get('orderNo')?.setValue(data.orderNo);
       this.hbaForm.get('orderFor')?.setValue(data.orderFor);
       this.hbaForm.get('remarks')?.setValue(data.remarks);
       var dateOfOrder = new Date(data.dateOfOrder);
       data.dateOfOrder = dateOfOrder.toISOString().split('T')[0];
       this.hbaForm.get('dateOfOrder')?.setValue(data.dateOfOrder);
       this.orderFileUrl = this.url+data.orderFile;
       this.employeeProfileId = data.employeeProfileId._id;
         this.phone = "+91"+data.employeeProfileId.mobileNo1;
         this.departmentId = data.departmentId;
         this.designationId = data.designationId;
      })
    });
       
       this.hbaForm = this.fb.group({
         officerName:['',Validators.required],
         department:['',Validators.required],
         designation:['',Validators.required],
         state:['',Validators.required],
         district:['',Validators.required],
         hbaAvailedFor:['',Validators.required],
         typeOfProperty:['',Validators.required],
         dateOfApplication:['',Validators.required],
         totalCostOfProperty:['',Validators.required],
         isExisingResidenceAvailable:['',Validators.required],
         twoBRelacation:['',Validators.required],
         totalHbaAvailed:['',Validators.required],
         totalNumberOfInstallments:['',Validators.required],
         totalNumberOfRecoveryMonths:['',Validators.required],
         conductRulePermissionAttachment: [''],
         installments: this.fb.array([
           this.fb.group({
             installmentNumber: [''],
             conductRulePermission: [''],
             amount:[''],
             installmentDate:['']
           }),
         ]),
         orderType:['',Validators.required],
         orderNo:['',Validators.required],
         orderFor:['',Validators.required],
         dateOfOrder:['',Validators.required],
         orderFile:[null,Validators.required],
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
     }
   
     get installments(): FormArray {
       return this.hbaForm.get('installments') as FormArray;
     }
   
     getState(event:any){
       this.district=[];
       const id = event.target.value;
       this.hbaService.getDistrict(id).subscribe((res:any)=>{
         res.results.forEach((item:any)=>{
           if(id == item.stateId){
             this.district.push({label:item.districtName,value:item._id})
           }
         })
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
     }   
}
