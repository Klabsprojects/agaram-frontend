import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LeaveTransferService } from '../../forms.service';
import { CommonService } from '../../../shared-services/common.service';
import { DatePipe, isPlatformBrowser } from '@angular/common';

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
     hbaAvailed:any[]=['Nerkundram Phase - I' , 'Nerkundram Phase - II' , 'Other TNHB Projects / Private'];
     typeOfProperty:any[]=['Ready Build','Construction'];
     existingResidence:string[]=['yes','No'];
     totalNumberOfInstallments:any[]=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
     ifuserlogin = false;
     userdata: any;
     id:any;
     url:string='';
     orderFileUrl:string='';
     installment:any[]=[];
     showTable = false;
     installmentdate:any;
     conductRulePermissionAttachment: string | null = null;
     installmentFileSelected : any;
     installmentId:any;
     totalHbaAvailed:number=0;
     alreadyPaidAmount:number=0;
   
     constructor(@Inject(PLATFORM_ID) private platformId: Object,private datePipe:DatePipe,private router:Router,private route:ActivatedRoute, private hbaService:LeaveTransferService,private fb:FormBuilder,private cs: CommonService){}
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
       const decodedId = this.route.snapshot.queryParamMap.get('id');
     if(decodedId){
       this.id = atob(decodedId);
       this.id = this.id.replace(/^"|"$/g, '');
     }
    
     this.hbaService.getHbaId(this.id).subscribe((res:any)=>{
      res.results.forEach((data:any)=>{
        console.log(data.installments);
        // if (data.installments && Array.isArray(data.installments)) {
        //   const hasValidInstallments = data.installments.some((ele: any) => {
        //     return ele.installmentNumber !== "" && ele.amount !== null && ele.conductRulePermission !== "" && ele.installmentDate !== null;
        //   });
        //   this.showTable = hasValidInstallments;
        //   if (hasValidInstallments) {
        //     this.installment.push(...data.installments);
        //     console.log(this.installment);
        //   }else{
        //     this.installment.push(...data.installments);
        //   }
        // }
        if (data.installments && Array.isArray(data.installments)) {
          this.installment.push(...data.installments); // Directly push all installments without checking for non-empty fields
          this.showTable = this.installment.length > 0; // Show table if there are any installments
          console.log(this.installment);
        }
        this.hbaForm.get('officerName')?.setValue(data.officerName);
        this.hbaForm.get('department')?.setValue(data.department);
        this.hbaForm.get('designation')?.setValue(data.designation);
        this.hbaForm.get('state')?.setValue(data.state);
        this.getDistrict(data.state);
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
        this.totalHbaAvailed = data.totalHbaAvailed;
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
       this.employeeProfileId = data.employeeProfileId?._id;
         this.phone = "+91"+data.employeeProfileId?.mobileNo1;
         this.departmentId = data.departmentId;
         this.designationId = data.designationId;
      })
      this.populateInstallmentForm();
      this.addInstallment();
      this.installmentDetailsFormArray.valueChanges.subscribe((values) => {
        this.calculateAlreadyPaidAmount(values);
      });
    });
       
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
         installments: this.fb.array([this.createRow()]),
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
     viewhbtypes(){
      this.hbaService.getData().subscribe((res:any)=>{
        this.typeOfProperty = res.filter((item:any) => item.category_type === "hba_typeofproperty");
        this.hbaAvailed = res.filter((item:any) => item.category_type === "hba_availed_for");
      })
    }

    //  addInstallment(): void {
    //   const installmentGroup = this.fb.group({
    //     installmentNumber: [''],
    //     conductRulePermission: [''],
    //     conductRulePermissionAttachment: [''],
    //     amount: [''],
    //     installmentDate: [''],
    //   });
  
    //   this.installmentDetailsFormArray.push(installmentGroup);
    // }

    addInstallment(): void {
      const totalNumberOfInstallments = this.hbaForm.get('totalNumberOfInstallments')?.value;
    
      // Ensure `totalNumberOfInstallments` is valid
      if (totalNumberOfInstallments === '16') {
        // If "Final", ensure only one row is present
        if (this.installmentDetailsFormArray.length < 1) {
          const installmentGroup = this.fb.group({
            installmentNumber: [''],
            conductRulePermission: [''],
            conductRulePermissionAttachment: [''],
            amount: [''],
            installmentDate: [''],
          });
          this.installmentDetailsFormArray.push(installmentGroup);
        }
      } else if (!isNaN(Number(totalNumberOfInstallments)) && Number(totalNumberOfInstallments) > 0) {
        // Convert to numeric
        const maxInstallments = Number(totalNumberOfInstallments);
    
        // Add one row only if current count is less than totalNumberOfInstallments
        if (this.installmentDetailsFormArray.length < maxInstallments) {
          const installmentGroup = this.fb.group({
            installmentNumber: [''],
            conductRulePermission: [''],
            conductRulePermissionAttachment: [''],
            amount: [''],
            installmentDate: [''],
          });
          this.installmentDetailsFormArray.push(installmentGroup);
        }
      }
    }
    
    getTotalNoInstallment(event: any): void {
      const totalNumberOfInstallments = Number(event.target.value);
      const currentInstallments = this.installmentDetailsFormArray.length;  
      console.log(currentInstallments);
      if (!isNaN(totalNumberOfInstallments)) {
        if (totalNumberOfInstallments < currentInstallments) {
          alert(`The total number of installments cannot be less than the already added installments (${currentInstallments}).`);
          this.hbaForm.get('totalNumberOfInstallments')?.setValue(currentInstallments);
        } else {
          console.log(`Total number of installments updated to ${totalNumberOfInstallments}`);
        }
      } else {
        alert('Please enter a valid number for the total number of installments.');
      }
    }
    
    validateInstallmentAmount(): void {
      const formArrayValues = this.installmentDetailsFormArray.value;
      const totalAmount = formArrayValues.reduce((sum: number, installment: { amount: any }) => {
        return sum + (Number(installment.amount) || 0);
      }, 0);
    
      // const balanceAmount = this.totalHbaAvailed - totalAmount;
      // console.log("Balance:", balanceAmount);
    
      if (totalAmount > this.totalHbaAvailed) {
        alert(`The total payable amount cannot exceed the total HBA availed amount (${this.totalHbaAvailed}).`);
    
        // Reset the last entered value
        const lastIndex = formArrayValues.length - 1;
        const lastControl = this.installmentDetailsFormArray.at(lastIndex).get('amount');
        lastControl?.setValue(0);
      }
    }
    
    calculateAlreadyPaidAmount(values: any[]): void {
      // Sum up all installment amounts
      this.alreadyPaidAmount = values.reduce((sum, installment) => {
        return sum + (Number(installment.amount) || 0); // Ensure valid number
      }, 0);
    }

     get installmentDetailsFormArray() {
      return this.hbaForm.get('installments') as FormArray;
    }

    populateInstallmentForm() {
      const formArray = this.hbaForm.get('installments') as FormArray;
      while (formArray.length) {
        formArray.removeAt(0);
      }
      this.installment.forEach(installmentItem => {
        this.installmentdate = this.datePipe.transform(installmentItem.installmentDate, 'yyyy-MM-dd');
        this.installmentId = installmentItem._id;
        this.conductRulePermissionAttachment = installmentItem.conductRulePermissionAttachment,
        formArray.push(this.fb.group({
          installmentNumber: [installmentItem.installmentNumber],
          conductRulePermission: [installmentItem.conductRulePermission],
          conductRulePermissionAttachment: [installmentItem.conductRulePermissionAttachment],
          amount:[installmentItem.amount],
          installmentDate:[this.installmentdate]
          
        }));
      });
    }
  
   
     createRow() {
      return this.fb.group({
        installmentNumber: [''],
        conductRulePermission: [''],
        conductRulePermissionAttachment:[''],
        amount:[''],
        installmentDate:[''],
      });
    }
  
    getDistrict(event:any){
      let id;
      if(!event.target?.value){
        id = event;
      }
      else{
        id = event.target.value;
      }
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
   
    //  getInstallmentTitle(index: number): string {
    //   switch (index) {
    //     case 0:
    //       return '1st Installment';
    //     case 1:
    //       return '2nd Installment';
    //     case 2:
    //       return '3rd Installment';
    //     case 3:
    //       return '4th Installment';
    //     case 4:
    //       return '5th Installment';
    //     case 5:
    //       return '6th Installment';
    //     case 6:
    //       return '7th Installment';
    //     case 7:
    //       return '8th Installment';
    //     case 8:
    //       return '9th Installment';
    //     case 9:
    //       return '10th Installment';
    //     default:
    //       return `Final Installment`;
    //   }
    // }

    getInstallmentTitle(index: number): string {
      const totalInstallments = this.hbaForm.get('totalNumberOfInstallments')?.value;
    
      if (totalInstallments === '16' && index === 0) {
        return 'Final Installment';
      }
    
      switch (index) {
        case 0:
          return '1st Installment';
        case 1:
          return '2nd Installment';
        case 2:
          return '3rd Installment';
        case 3:
          return '4th Installment';
        case 4:
          return '5th Installment';
        case 5:
          return '6th Installment';
        case 6:
          return '7th Installment';
        case 7:
          return '8th Installment';
        case 8:
          return '9th Installment';
        case 9:
          return '10th Installment';
        case 10:
            return '11th Installment';
        case 11:
            return '12th Installment';
        case 12:
            return '13th Installment';
        case 13:
            return '14th Installment';
        case 14:
            return '15th Installment';
        default:
          return `Installment ${index + 1}`;
      }
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
   
    
   
    //  getPermissionFile(event: any, index: number) {
    //    const input = event.target as HTMLInputElement;
    //    if (input.files && input.files.length > 0) {
    //      this.installmentFileSelected = input.files[0];
    //      const installmentFormGroup = (this.hbaForm.get('installments') as FormArray).at(index) as FormGroup;
    //      installmentFormGroup.get('conductRulePermissionAttachment')?.setValue(this.installmentFileSelected);
    //      if (this.installmentFileSelected.type !== 'application/pdf') {
    //        installmentFormGroup.get('conductRulePermissionAttachment')?.setErrors({ incorrectFileType: true });
    //        return;
    //      }
        
    //      installmentFormGroup.get('conductRulePermissionAttachment')?.setErrors(null);
    //    }
    //  }

    getPermissionFile(event: any, index: number) {
      const input = event.target as HTMLInputElement;
    
      if (input.files && input.files.length > 0) {
        this.installmentFileSelected = input.files[0];
    
        const installmentFormGroup = (this.hbaForm.get('installments') as FormArray).at(index) as FormGroup;
    
        // Set the file value in the FormGroup
        installmentFormGroup.get('conductRulePermissionAttachment')?.setValue(this.installmentFileSelected);
    
        // Validate file type
        if (this.installmentFileSelected.type !== 'application/pdf') {
          installmentFormGroup.get('conductRulePermissionAttachment')?.setErrors({ incorrectFileType: true });
          return;
        }
    
        // Clear errors if the file type is valid
        installmentFormGroup.get('conductRulePermissionAttachment')?.setErrors(null);
      }
    }
     
   
     onKeyDown(event: KeyboardEvent){
       const key = event.key;
       if (!((key >= '0' && key <= '9') || 
             ['Backspace', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight'].includes(key))) {
         event.preventDefault();
       }
     }
   
    
    // onSubmit(): void {
    //   this.submitted = true;
    //   console.log(this.hbaForm.value, this.hbaForm.valid);
    
    //   if (this.hbaForm.valid) {
    //     const formData = new FormData();
    //     const formValues = this.hbaForm.value;
    //     console.log(this.installment);
    //     const formInstallments = formValues.installments;
    //     formInstallments.forEach((installment: any, index: number) => {
    //       const currentInstallment = this.installment[index]; 
    //       console.log(currentInstallment);
    //       console.log(currentInstallment?._id);
    
    //       if (currentInstallment && currentInstallment._id) {
    //         const isEqual = installment.installmentNumber === currentInstallment.installmentNumber &&
    //                         installment.amount === currentInstallment.amount &&
    //                         installment.conductRulePermission === currentInstallment.conductRulePermission &&
    //                         installment.installmentDate === new Date(currentInstallment.installmentDate).toISOString().split('T')[0];
    
    //         installment.edited = isEqual ? 'no' : 'yes';
    
    //         formData.append(`installments[${index}][_id]`, currentInstallment._id);
    //       } else {
    //         installment.edited = 'no';
    //       }
    
    //       formData.append(`installments[${index}][installmentNumber]`, installment.installmentNumber);
    //       formData.append(`installments[${index}][amount]`, installment.amount);
    //       formData.append(`installments[${index}][conductRulePermission]`, installment.conductRulePermission);
    //       formData.append(`installments[${index}][conductRulePermissionAttachment]`, installment.conductRulePermissionAttachment || ''); // Ensure empty values are handled properly
    
    //       const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    //       if (fileInput && fileInput.files && fileInput.files[0]) {
    //         formData.append(`installments[${index}][conductRulePermissionAttachment]`, fileInput.files[0]);  // Append the actual file
    //       }
    
    //       formData.append(`installments[${index}][installmentDate]`, installment.installmentDate);
    //       formData.append(`installments[${index}][edited]`, installment.edited); 
    //     });
    
    //     Object.keys(formValues).forEach((key) => {
    //       if (key !== 'installments' && key !== 'orderFile') {
    //         formData.append(key, formValues[key]);
    //       }
    //     });
    
    //     if (this.selectedFile) {
    //       formData.append('orderFile', this.selectedFile);
    //     }
    
    //     const fixedFields = {
    //       employeeProfileId: this.employeeProfileId,
    //       departmentId: this.departmentId,
    //       designationId: this.designationId,
    //       phone: this.phone,
    //       module: 'House Building Advance',
    //       id: this.id,
    //     };
    
    //     Object.entries(fixedFields).forEach(([key, value]) => {
    //       formData.append(key, value);
    //     });
    
    //     // Log formData contents for debugging
    //     // console.log('Form Data Contents:');
    //     // formData.forEach((value, key) => {
    //     //   console.log(`${key}:`, value);
    //     // });
    
    //     this.hbaService.updateHba(formData).subscribe(
    //       (response) => {
    //         alert(response.message);
    //         this.router.navigateByUrl('hba');
    //       },
    //       (error) => {
    //         console.error('API Error:', error);
    //       }
    //     );
    //   }
    // }
    
    onSubmit(): void {
      this.submitted = true;
    
      // Log the form values and validity for debugging
      console.log(this.hbaForm.value, this.hbaForm.valid);
    
      if (this.hbaForm.valid) {
        const formData = new FormData();
        const formValues = this.hbaForm.value;
    
        // Iterate through the installments
        const formInstallments = formValues.installments;
        formInstallments.forEach((installment: any, index: number) => {
          const currentInstallment = this.installment[index]; // Existing installment data (if any)
          let edited = 'no'; // Default edited value
    
          if (currentInstallment && currentInstallment._id) {
            // Check if the current installment values match the existing values
            const isEqual =
              installment.installmentNumber === currentInstallment.installmentNumber &&
              installment.amount === currentInstallment.amount &&
              installment.conductRulePermission === currentInstallment.conductRulePermission &&
              installment.installmentDate ===
                new Date(currentInstallment.installmentDate).toISOString().split('T')[0] &&
              (!installment.conductRulePermissionAttachment || // Check for file change
                (typeof installment.conductRulePermissionAttachment === 'string' &&
                  installment.conductRulePermissionAttachment === currentInstallment.conductRulePermissionAttachment));
    
            edited = isEqual ? 'no' : 'yes';
    
            // Append the existing `_id` field for the installment
            formData.append(`installments[${index}][_id]`, currentInstallment._id);
          }
    
          // Append all other fields of the installment to FormData
          formData.append(`installments[${index}][installmentNumber]`, installment.installmentNumber);
          formData.append(`installments[${index}][amount]`, installment.amount);
          formData.append(`installments[${index}][conductRulePermission]`, installment.conductRulePermission);
    
          // Check if a new file has been uploaded
          const fileInput = document.getElementById(`fileInput-${index}`) as HTMLInputElement;
          if (fileInput && fileInput.files && fileInput.files[0]) {
            formData.append(`installments[${index}][conductRulePermissionAttachment]`, fileInput.files[0]); // New file
            edited = 'yes'; // Mark as edited since a new file was uploaded
          } else {
            // Append existing file path or an empty string
            formData.append(
              `installments[${index}][conductRulePermissionAttachment]`,
              installment.conductRulePermissionAttachment || ''
            );
          }
    
          formData.append(`installments[${index}][installmentDate]`, installment.installmentDate);
          formData.append(`installments[${index}][edited]`, edited); // Add the `edited` field
        });
    
        // Append other form fields except `installments` and `orderFile`
        Object.keys(formValues).forEach((key) => {
          if (key !== 'installments' && key !== 'orderFile') {
            formData.append(key, formValues[key]);
          }
        });
    
        // Append `orderFile` if selected
        if (this.selectedFile) {
          formData.append('orderFile', this.selectedFile);
        }
    
        // Add fixed fields
        const fixedFields = {
          employeeProfileId: this.employeeProfileId,
          departmentId: this.departmentId,
          designationId: this.designationId,
          phone: this.phone,
          module: 'House Building Advance',
          id: this.id,
        };
    
        Object.entries(fixedFields).forEach(([key, value]) => {
          formData.append(key, value);
        });
    
        // Log FormData contents for debugging (optional)
        // console.log('Form Data Contents:');
        // formData.forEach((value, key) => {
        //   console.log(`${key}:`, value);
        // });
    
        // Send the FormData to the API
        this.hbaService.updateHba(formData).subscribe(
          (response) => {
            alert(response.message);
            this.router.navigateByUrl('hba'); // Navigate to the desired route
          },
          (error) => {
            console.error('API Error:', error);
          }
        );
      }
    }
    

    // onSubmit(): void {
    //   this.submitted = true;
    
    //   console.log(this.hbaForm.value, this.hbaForm.valid);
    
    //   if (this.hbaForm.valid) {
    //     const formData = new FormData();
    //     const formValues = this.hbaForm.value;
    
    //     // Iterate through the installments
    //     const formInstallments = formValues.installments;
    //     formInstallments.forEach((installment: any, index: number) => {
    //       const currentInstallment = this.installment[index]; // Existing installment data (if any)
    //       let edited = 'no'; // Default edited value
    //       console.log(this.installment,currentInstallment ,formValues.totalNumberOfInstallments);
    //       if (currentInstallment && currentInstallment._id) {
    //         if ((formValues.totalNumberOfInstallments === 1 || formValues.totalNumberOfInstallments === 16) &&
    //           (!installment.installmentNumber || !installment.amount || !installment.installmentDate)) {
    //           edited = 'yes';
    //         } else {
    //           // Check if the current installment values match the existing values
    //           const isEqual =
    //             installment.installmentNumber === currentInstallment.installmentNumber &&
    //             installment.amount === currentInstallment.amount &&
    //             installment.conductRulePermission === currentInstallment.conductRulePermission &&
    //             installment.installmentDate ===
    //               new Date(currentInstallment.installmentDate).toISOString().split('T')[0] &&
    //             (!installment.conductRulePermissionAttachment || // Check for file change
    //               (typeof installment.conductRulePermissionAttachment === 'string' &&
    //                 installment.conductRulePermissionAttachment === currentInstallment.conductRulePermissionAttachment));
    
    //           edited = isEqual ? 'no' : 'yes';
    //         }
    
    //         // Append the existing `_id` field for the installment
    //         formData.append(`installments[${index}][_id]`, currentInstallment._id);
    //       }
    
    //       // Append all other fields of the installment to FormData
    //       formData.append(`installments[${index}][installmentNumber]`, installment.installmentNumber || '');
    //       formData.append(`installments[${index}][amount]`, installment.amount || '');
    //       formData.append(`installments[${index}][conductRulePermission]`, installment.conductRulePermission || '');
    
    //       // Check if a new file has been uploaded
    //       const fileInput = document.getElementById(`fileInput-${index}`) as HTMLInputElement;
    //       if (fileInput && fileInput.files && fileInput.files[0]) {
    //         formData.append(`installments[${index}][conductRulePermissionAttachment]`, fileInput.files[0]); // New file
    //         edited = 'yes'; // Mark as edited since a new file was uploaded
    //       } else {
    //         // Append existing file path or an empty string
    //         formData.append(
    //           `installments[${index}][conductRulePermissionAttachment]`,
    //           installment.conductRulePermissionAttachment || ''
    //         );
    //       }
    
    //       formData.append(`installments[${index}][installmentDate]`, installment.installmentDate || '');
    //       formData.append(`installments[${index}][edited]`, edited); // Add the `edited` field
    //     });
    
    //     // Append other form fields except `installments` and `orderFile`
    //     Object.keys(formValues).forEach((key) => {
    //       if (key !== 'installments' && key !== 'orderFile') {
    //         formData.append(key, formValues[key]);
    //       }
    //     });
    
    //     // Append `orderFile` if selected
    //     if (this.selectedFile) {
    //       formData.append('orderFile', this.selectedFile);
    //     }
    
    //     // Add fixed fields
    //     const fixedFields = {
    //       employeeProfileId: this.employeeProfileId,
    //       departmentId: this.departmentId,
    //       designationId: this.designationId,
    //       phone: this.phone,
    //       module: 'House Building Advance',
    //       id: this.id,
    //     };
    
    //     Object.entries(fixedFields).forEach(([key, value]) => {
    //       formData.append(key, value);
    //     });
    
    //     // Send the FormData to the API
    //     // this.hbaService.updateHba(formData).subscribe(
    //     //   (response) => {
    //     //     alert(response.message);
    //     //     this.router.navigateByUrl('hba'); // Navigate to the desired route
    //     //   },
    //     //   (error) => {
    //     //     console.error('API Error:', error);
    //     //   }
    //     // );
    //   }
    // }
    
    
}
