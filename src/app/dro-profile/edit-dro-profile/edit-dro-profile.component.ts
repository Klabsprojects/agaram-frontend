import { Component, ElementRef, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveTransferService } from '../../forms/forms.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-dro-profile',
  templateUrl: './edit-dro-profile.component.html',
  styleUrl: './edit-dro-profile.component.css'
})
export class EditDroProfileComponent implements OnInit {
  droForm!: FormGroup;
   updateForm!: FormGroup;
   isReadOnly: boolean = true;
   emailIsReadOnly: boolean = true;
   mobileReadOnly: boolean = true;
   mobileReadOnly2: boolean = true;
   mobileReadOnly3: boolean = true;
   officerId: boolean = true;
   submitted: boolean = false;
   gender: any[] = [];
   state: any[] = [];
   recruitment: any[] = [];
   degree: any[] = [];
   community: any[] = [];
   grade: any[] = [];
   religion: any[] = [];
   serviceData: any[] = [];
   exam: string = '';
   degreeData: any[] = [];
   rows: any[] = [{}];
   id: any;
   base64String: any;
   base64ImageData: string = '';
   courseDuration: number[] = Array.from({ length: 5 }, (_, i) => i + 1);
   country: any[] = [];
   courseCompletedDateFormatted: any;
   seniorityReadOnly: boolean = true;
   dateOfJoiningReadOnly: boolean = true;
   selectedImage: string | ArrayBuffer | null = null;
   postingIn: any[] = [];
   postType: any[] = [];
   payScale: any[] = [];
   locationChange:any[]=[];
   department: any[] = [];
   designation: any[] = [];
   setValues:boolean=false;
   showPosting : boolean = false;
   selectedFile : File | null = null;
   orderFileUrl:string='';
   url:string='';
   orderType:any[]=[];
   orderFor:any[]=[];

   constructor(private fb: FormBuilder, private elementRef: ElementRef, private officerAction: LeaveTransferService, private router: Router, private route: ActivatedRoute, private datePipe: DatePipe) { }
 
   ngOnInit(): void {
     this.id = this.route.snapshot.queryParamMap.get('profile');
     this.droForm = this.fb.group({
       employeeId: [''],
       fullName: ['', Validators.required],
       ifhrmsId: [''],
       gender: [''],
       dateOfBirth: [''],
       dateOfJoining: [''],
       dateOfRetirement: [''],
       state: [''],
       batch: [''],
       recruitmentType: [''],
       serviceStatus: [''],
       religion: [''],
       community: [''],
       caste: [''],
       personalEmail: [[]],
       mobileNo1: [''],
       mobileNo2: [''],
       mobileNo3: [''],
       addressLine: [''],
       city: [''],
       pincode: [''],
       promotionGrade: [''],
       payscale: [''],
       officeEmail: [''],
       // photo:[this.base64String],
       imagePath: [null],
       degreeData: this.fb.array([this.createRow()]),
       seniority: [''],
       toPostingInCategoryCode:[''],
       toDepartmentId:[''],
       toDesignationId:[''],
       postTypeCategoryCode:[''],
       locationChangeCategoryId:[''],
       languages:[''],
       deptAddress:[''],
       deptPhoneNumber:[''],
       deptFaxNumber:[''],
       deptOfficialMobileNo:[''],
       lastDateOfPromotion:[''],
       department:[''],
       department_name:[''],
       updatePost:[''],
       updateId:[''],
       serving:[''],
       orderType:[''],
       orderNo:[''],
       orderFor:[''],
       dateOfOrder:[''],
       orderFile:[null],
       remarks:[''],
     });
     this.officerAction.getData().subscribe((res: any[]) => {
       res.forEach((item) => {
         switch (item.category_type) {
           case "gender":
             this.gender.push({ label: item.category_name, value: item._id });
             break;
           case "state":
             this.state.push({ label: item.category_name, value: item._id });
             break;
           case "recruitment_type":
             this.recruitment.push({ label: item.category_name, value: item._id });
             break;
           case "class":
             this.community.push({ label: item.category_name, value: item._id });
             break;
           case "promotion_grade":
             this.grade.push({ label: item.category_name, value: item._id });
             this.payScale.push(item);
             break;
           case "religion":
             this.religion.push({ label: item.category_name, value: item._id });
             break;
           case "service_status":
             this.serviceData.push({ label: item.category_name, value: item._id });
             break;
           case "country":
             this.country.push({ label: item.category_name, value: item._id });
             break;
             case "posting_in":
               this.postingIn.push({label:item.category_name,value:item._id});
               break;
             case "post_type":
               this.postType.push({ label: item.category_name, value: item._id });
               break;
             case "location_change":
               this.locationChange.push({ label: item.category_name, value: item._id });
               break;
             case "order_type":
               this.orderType.push({label:item.category_name,value:item._id});
               break;
             case "order_for": 
                this.orderFor.push({ label: item.category_name, value: item._id });
              break;
           default:
             break;
         }
         
       })
     })
     this.officerAction.getDroId(this.id).subscribe((res: any) => {
       res.results.forEach((data: any) => {
         this.officerAction.getDepartmentData().subscribe((res: any[]) => {
           this.department = res.map((item: any) => ({ label: item.department_name, value: item._id }));
           
           if (data.toDepartmentId) {
             this.droForm.get('toDepartmentId')?.setValue(data.toDepartmentId);
             const selectedDepartment = res.find((item: any) => item._id === data.toDepartmentId);
             
             if (selectedDepartment) {
               this.droForm.get('department_name')?.setValue(selectedDepartment.department_name);
               this.droForm.get('department')?.setValue('yes');
               this.droForm.get('updatePost')?.setValue('yes');
               this.droForm.get('updateId')?.setValue(data.uniqueId);  // Only set updateId if department is found
             } else {
               const formValue = { ...this.droForm.value };
               delete formValue.updateId;
               console.log('Form data without updateId:', formValue);  // Log updated form data without updateId
             }
           }
         });
         
 
         this.officerAction.getDesignations().subscribe((response: any) => {
           this.designation = response.results.map((items: any) => ({
             label: items.designation_name,
             value: items._id
           }));
          if (data.toDesignationId) {
             this.droForm.get('toDesignationId')?.setValue(data.toDesignationId);
           }
         });        
         this.droForm.get('fullName')?.setValue(data.fullName);
         this.droForm.get('ifhrmsId')?.setValue(data.ifhrmsId);
         this.droForm.get('gender')?.setValue(data.gender);
         var dateOfBirth = new Date(data.dateOfBirth);
         data.dateOfBirth = dateOfBirth.toISOString().split('T')[0];
         this.droForm.get('dateOfBirth')?.setValue(data.dateOfBirth);
         this.droForm.get('state')?.setValue(data.state);
         this.droForm.get('community')?.setValue(data.community);
         this.droForm.get('religion')?.setValue(data.religion);
         this.droForm.get('caste')?.setValue(data.caste);
         this.droForm.get('mobileNo1')?.setValue(data.mobileNo1);
         this.droForm.get('mobileNo2')?.setValue(data.mobileNo2);
         this.droForm.get('mobileNo3')?.setValue(data.mobileNo3);
         this.droForm.get('personalEmail')?.setValue(data.personalEmail);
         this.droForm.get('addressLine')?.setValue(data.addressLine);
         this.droForm.get('city')?.setValue(data.city);
         this.droForm.get('pincode')?.setValue(data.pincode);
         this.droForm.get('employeeId')?.setValue(data.employeeId);
         var dateOfJoining = new Date(data.dateOfJoining);
         data.dateOfJoining = dateOfJoining.toISOString().split('T')[0];
         this.droForm.get('dateOfJoining')?.setValue(data.dateOfJoining);
         var dateOfRetirement = new Date(data.dateOfRetirement);
         data.dateOfRetirement = dateOfRetirement.toISOString().split('T')[0];
         this.droForm.get('dateOfRetirement')?.setValue(data.dateOfRetirement);
         this.droForm.get('batch')?.setValue(data.batch);
         this.droForm.get('recruitmentType')?.setValue(data.recruitmentType);
         this.droForm.get('serviceStatus')?.setValue(data.serviceStatus);
         this.droForm.get('promotionGrade')?.setValue(data.promotionGrade);
         this.droForm.get('payscale')?.setValue(data.payscale);
         this.droForm.get('officeEmail')?.setValue(data.officeEmail);
         this.droForm.get('seniority')?.setValue(data.seniority);
         this.selectedImage = `${this.officerAction.fileUrl}droProfileImages/${data.imagePath?.replace('\\', '/')}`;
         this.degreeData = data.degreeData;
         this.orderFileUrl = this.url+data.orderFile;
         this.url = this.officerAction.fileUrl;
        this.droForm.get('orderType')?.setValue(data.orderType);
        this.droForm.get('orderNo')?.setValue(data.orderNo);
        this.droForm.get('orderFor')?.setValue(data.orderFor);
        var dateOfOrder = new Date(data.dateOfOrder);
        data.dateOfOrder = dateOfOrder.toISOString().split('T')[0];
        this.droForm.get('dateOfOrder')?.setValue(data.dateOfOrder);
        this.droForm.get('remarks')?.setValue(data.remarks); 
 
         this.populateDegreeForm();
         this.droForm.get('toPostingInCategoryCode')?.setValue(data.toPostingInCategoryCode);
         this.droForm.get('postTypeCategoryCode')?.setValue(data.postTypeCategoryCode);
         this.droForm.get('locationChangeCategoryId')?.setValue(data.locationChangeCategoryId);
         this.droForm.get('languages')?.setValue(data.languages);
         if (data.departmentId) {
           this.droForm.get('deptAddress')?.setValue(data.departmentId.address);
           this.droForm.get('deptPhoneNumber')?.setValue(data.departmentId.phoneNumber);
           this.droForm.get('deptFaxNumber')?.setValue(data.departmentId.faxNumber);
           this.droForm.get('deptOfficialMobileNo')?.setValue(data.departmentId.officialMobileNo);
         }
         if (data.lastDateOfPromotion) {
           var lastDateOfPromotion = new Date(data.lastDateOfPromotion);
           data.lastDateOfPromotion = lastDateOfPromotion.toISOString().split('T')[0];
           this.droForm.get('lastDateOfPromotion')?.setValue(data.lastDateOfPromotion);
         } 
 
         this.officerAction.getData().subscribe((res: any[]) => {
           res.forEach((item) => {
             if (item.category_type == 'service_status') {
               this.serviceData.push({ label: item.category_name, value: item._id });
               this.serviceData.find((ele:any)=> {
                 if(ele.value == data.serviceStatus){
                   console.log(ele.label);
                   if(ele.label == "Retired") { this.showPosting = false; 
                     this.droForm.get('serving')?.setValue('no');
                   } else if(ele.label == "Serving") { this.showPosting = true;
                     this.droForm.get('serving')?.setValue('yes');
                   }
                 }
               })
             }
           });
         });
         
       });
     })
    
 
     this.officerAction.getDegree().subscribe((res: any) => {
       res.results.forEach((data: any) => {
         this.degree.push({ label: data.degree_name, value: data._id });
       });
     })
 
    this.viewCourseLevel();
   }
   course_level:any;
  viewCourseLevel(){
    this.officerAction.getData().subscribe((res:any)=>{
      this.course_level = res.filter((item:any) => item.category_type === "course_level");
    })
  }

   changeGrade(data: any) {
    this.payScale.filter((item: any) => {
      if (data.target.value == item._id) {
        this.droForm.get('payscale')?.setValue(item.payscale);

      }
    });
  }
 
 
   // arrayBufferToBase64(buffer: Uint8Array): string {
   //   let binary = '';
   //   const len = buffer.byteLength;
   //   for (let i = 0; i < len; i++) {
   //       binary += String.fromCharCode(buffer[i]);
   //   }
   //   return window.btoa(binary);
   // }
  
   onKeyDown(event: KeyboardEvent) {
     const key = event.key;
     if (!((key >= '0' && key <= '9') ||
       ['Backspace', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight'].includes(key))) {
       event.preventDefault();
     }
   }
 
   getDepartment(event: any) {
     this.department = [];
     this.officerAction.getData().subscribe((res: any[]) => {
       res.forEach((item) => {
         if (event.target.value == item._id) {
           this.officerAction.getDepartmentData().subscribe((res: any[]) => {
             res.filter((data: any) => {
               if (item.category_code == data.category_code) {
                 this.department.push({ label: data.department_name, value: data._id });
               }
             });
           })
         }
       });
     })
   }
 
   getDesignation(event: any) {
     this.designation = [];
     const input = event.target as HTMLSelectElement; 
     const selectedOptionText = input.options[input.selectedIndex].text;
     this.droForm.get('department_name')?.setValue(selectedOptionText);
     this.officerAction.getDepartmentData().subscribe((res: any[]) => {
       res.forEach((item) => {
         if (event.target.value == item._id) {
           this.officerAction.getDesignations().subscribe((res: any) => {
             res.results.filter((data: any) => {
               if (item.category_code == data.category_code) {
                 this.designation.push({ label: data.designation_name, value: data._id });
                 // this.designation = [];
               }
             })
           })
           this.droForm.get('deptAddress')?.setValue(item.address || '');
           this.droForm.get('deptFaxNumber')?.setValue(item.faxNumber || '');
           this.droForm.get('deptOfficialMobileNo')?.setValue(item.officialMobileNo || '');
           this.droForm.get('deptPhoneNumber')?.setValue(item.phoneNumber || '');
           const isFilled = item.address || item.faxNumber || item.phoneNumber || item.officialMobileNo;
           this.droForm.get('department')?.setValue(isFilled ? 'No' : 'yes');
           this.droForm.get('updatePost')?.setValue(isFilled ? 'yes' : 'No');
           this.setValues = isFilled;
         }
       });
     });
   }
 
 
   arrayBufferToBase64(buffer: Uint8Array): string {
     let binary = '';
     const len = buffer.byteLength;
     for (let i = 0; i < len; i++) {
       binary += String.fromCharCode(buffer[i]);
     }
     return btoa(binary);
   }
 
 
   getImageSource(base64ImageData: string): string {
     const imageType = base64ImageData.startsWith('data:image/png') ? 'png' :
       base64ImageData.startsWith('data:image/jpeg') ? 'jpeg' :
         base64ImageData.startsWith('data:image/jpg') ? 'jpg' : '';
     return `data:image/${imageType};base64,${base64ImageData}`;
   }
 
 
 
   populateDegreeForm() {
     const formArray = this.droForm.get('degreeData') as FormArray;
     while (formArray.length) {
       formArray.removeAt(0);
     }
     this.degreeData.forEach(degreeItem => {
       this.courseCompletedDateFormatted = this.datePipe.transform(degreeItem.courseCompletedDate, 'yyyy-MM-dd');
 
       formArray.push(this.fb.group({
         courseLevel: [degreeItem.courseLevel],
         degree: [degreeItem.degree],
         specialisation: [degreeItem.specialisation],
         instituteName: [degreeItem.instituteName],
         locationState: [degreeItem.locationState],
         locationCountry: [degreeItem.locationCountry],
         durationOfCourse: [degreeItem.durationOfCourse],
         fund: [degreeItem.fund],
         fees: [degreeItem.fees],
         courseCompletedYear: [degreeItem.courseCompletedYear],
         courseCompletedDate: [this.courseCompletedDateFormatted]
 
       }));
     });
   }
 
   mobileToggleReadOnly() {
     this.toggleReadOnly('mobile');
   }
 
   get degreeDetailsFormArray() {
     return this.droForm.get('degreeData') as FormArray;
   }
 
   createRow() {
     return this.fb.group({
       courseLevel: [''],
       degree: [''],
       specialisation: [''],
       instituteName: [''],
       locationState: [''],
       locationCountry: [''],
       durationOfCourse: [null],
       fund: [''],
       fees: [''],
       courseCompletedYear: [''],
       courseCompletedDate: ['']
     });
   }
 
   onFileSelected(event: any) {
     const file: File = event.target.files[0];
     // const maxSizeInBytes = 1 * 1024 * 1024; // 2 MB
     if (file) {
       // if (file.size > maxSizeInBytes) {
       //   this.base64String = null;
       //   this.droForm.get('imagePath')?.setValue(null);
       //   alert('File size exceeds 1 MB. Please select a smaller file.');
       //   return;  // Stop further execution
       // }
       const reader = new FileReader();
       reader.onload = (e: ProgressEvent<FileReader>) => {
         this.base64String = reader.result as string;
       };
       reader.readAsDataURL(file);
     }
     // const file: File = event.target.files[0];
     if (file) {
       this.droForm.get('imagePath')?.setValue(file);  // Set file directly to form
       const reader = new FileReader();
 
       reader.onload = (e: ProgressEvent<FileReader>) => {
         this.selectedImage = reader.result as string;  // Display preview
       };
 
       reader.readAsDataURL(file);  // For preview purpose only
     }
   }
 
 
   removeImage() {
     this.selectedImage = null;
     // You may also want to clear the file input here to allow selecting the same image again
     this.droForm.get('imagePath')?.setValue(null);
     this.base64String = null;
   }
 
   // onFileSelected(event: any) {
   //   const file: File = event.target.files[0];
   //   if (file) {
   //     const reader = new FileReader();
   //     reader.onload = (e: ProgressEvent<FileReader>) => {
   //       this.base64String = e.target?.result;
   //       this.droForm.get('photo')?.setValue(this.base64String);
   //     };
   //     reader.readAsDataURL(file);
   //   }
   // }
 
   toggleReadOnly(field: string) {
     if (field === 'mobile') {
       this.mobileReadOnly = !this.mobileReadOnly;
       if (!this.mobileReadOnly) {
         const inputField = this.elementRef.nativeElement.querySelector('input[name="mobileNo1"]') as HTMLInputElement;
         if (inputField) {
           inputField.focus();
         }
       }
     }
     else if (field === 'name') {
       this.isReadOnly = !this.isReadOnly;
       if (!this.isReadOnly) {
         const inputField = this.elementRef.nativeElement.querySelector('input[name="fullName"]') as HTMLInputElement;
         if (inputField) {
           inputField.focus();
         }
       }
     }
     else if (field === 'mobileTwo') {
       this.mobileReadOnly2 = !this.mobileReadOnly2;
       if (!this.mobileReadOnly2) {
         const inputField = this.elementRef.nativeElement.querySelector('input[name="mobileNo2"]') as HTMLInputElement;
         if (inputField) {
           inputField.focus();
         }
       }
     }
     else if (field === 'mobileThree') {
       this.mobileReadOnly3 = !this.mobileReadOnly3;
       if (!this.mobileReadOnly3) {
         const inputField = this.elementRef.nativeElement.querySelector('input[name="mobileNo3"]') as HTMLInputElement;
         if (inputField) {
           inputField.focus();
         }
       }
     }
     else if (field === 'officerId') {
       this.officerId = !this.officerId;
       if (!this.officerId) {
         const inputField = this.elementRef.nativeElement.querySelector('input[name="officerId"]') as HTMLInputElement;
         if (inputField) {
           inputField.focus();
         }
       }
     }
     else if (field === 'seniority') {
       this.seniorityReadOnly = !this.seniorityReadOnly;
       if (!this.seniorityReadOnly) {
         const inputField = this.elementRef.nativeElement.querySelector('input[name="seniority"]') as HTMLInputElement;
         if (inputField) {
           inputField.focus();
         }
       }
     }
     else if (field === 'dateOfJoining') {
       this.dateOfJoiningReadOnly = !this.dateOfJoiningReadOnly;
       if (!this.dateOfJoiningReadOnly) {
         const inputField = this.elementRef.nativeElement.querySelector('input[name="dateOfJoining"]') as HTMLInputElement;
         if (inputField) {
           inputField.focus();
         }
       }
     }
 
   }
 
 
 
   emailToggleReadOnly() {
     this.emailIsReadOnly = !this.emailIsReadOnly;
     if (!this.emailIsReadOnly) {
       const inputField = this.elementRef.nativeElement.querySelector('input[type="email"]') as HTMLInputElement;
       if (inputField) {
         inputField.focus();
       }
     }
   }
 
   getCompletedYear(index: number) {
     const degreeDetailsFormArray = this.droForm.get('degreeData') as FormArray;
     const selectedDate = degreeDetailsFormArray.at(index).get('courseCompletedDate')?.value;
 
     if (selectedDate) {
       const year = new Date(selectedDate).getFullYear();
       degreeDetailsFormArray.at(index).get('courseCompletedYear')?.setValue(year);
     }
   }
 
   addRow() {
     const newRow = this.fb.group({
       courseLevel: [''],
       degree: [''],
       specialisation: [''],
       instituteName: [''],
       locationState: [''],
       locationCountry: [''],
       durationOfCourse: [null],
       fund: [''],
       fees: [''],
       courseCompletedYear: [''],
       courseCompletedDate: ['']
     });
     (this.droForm.get('degreeData') as FormArray).push(newRow);
     this.rows.push({});
   }
 
   removeRow(index: number) {
     if (index !== 0) {
       const qualifications = this.droForm.get('degreeData') as FormArray;
       qualifications.removeAt(index);
       this.rows.splice(index, 1);
     }
   }
 
 
   formatDate(date: Date): string {
     const day = date.getDate().toString().padStart(2, '0');
     const month = (date.getMonth() + 1).toString().padStart(2, '0');
     const year = date.getFullYear();
     return `${day}-${month}-${year}`;
   }
 
 
   calculateRetirementDate() {
     const dobValue = this.droForm.get('dateOfBirth')?.value;
     if (dobValue) {
       const dob = new Date(dobValue);
       const retirementYear = dob.getFullYear() + 60;
       const retirementDate = new Date(retirementYear, dob.getMonth(), dob.getDate());
       const formattedDate = this.formatDate(retirementDate);
       this.droForm.get('dateOfRetirement')?.setValue(formattedDate);
     }
   }
 
   hideFutureDate() {
     return new Date().toISOString().split('T')[0];
   }
 
   getYear() {
     const dojValue = this.droForm.get('dateOfJoining')?.value;
     if (dojValue) {
       const dob = new Date(dojValue);
       const retirementYear = dob.getFullYear();
       this.droForm.get('batch')?.markAsDirty(); // Mark the control as dirty
       this.droForm.get('batch')?.markAsTouched(); // Optionally mark as touched
       this.droForm.get('batch')?.setValue(retirementYear);
     }
   }

   onPdfFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.droForm.patchValue({ orderFile: this.selectedFile });
    }
    this.selectedFile = event.target.files[0];
    this.droForm.get('orderFile')?.setValue(this.selectedFile);
    if (this.selectedFile) {
      if (this.selectedFile.type !== 'application/pdf') {
        this.droForm.get('orderFile')?.setErrors({ 'incorrectFileType': true });
        return;
      }

      if (this.selectedFile.size > 5 * 1024 * 1024) { // 5MB in bytes
        this.droForm.get('orderFile')?.setErrors({ 'maxSize': true });
        return;
      }

      this.droForm.get('orderFile')?.setErrors(null);
    }
  }
 
  //  onSubmit() {
  //    this.submitted = true;
  //    const formValue = this.droForm.value;
  //    if (formValue.degreeData && Array.isArray(formValue.degreeData)) {
  //      formValue.degreeData.forEach((degree: any) => {
  //        degree.addedBy = 'DRO Profile';
  //      });
  //    }
  //    const formData = new FormData();
  //    Object.keys(formValue).forEach(key => {
  //      const value = this.droForm.get(key)?.value;
  //      if(key === 'degreeData'){
  //        formData.append('degreeData',JSON.stringify(formValue.degreeData));
  //      }
  //      else if (key === 'imagePath' && value instanceof File) {
  //        formData.append(key, value);  // Append file directly
  //      } else if (value !== null && value !== undefined) {
  //        formData.append(key, value);
  //      }
  //    });
 
 
  //    if (formValue.updatePost !== 'yes') {
  //      formData.delete('updateId');
  //    }
  //    formData.append('id',this.id);
  //    for (let pair of (formData as any).entries()) {
  //      console.log(pair[0], pair[1]);
  //    }
    
  //    if (this.droForm.valid) {
  //      this.officerAction.updateDroProfile(formData).subscribe((response:any) => {
  //          alert(response.message)
  //          this.droForm.reset();
  //          this.router.navigate(['droprofile']);
  //          console.log('API Response:', response);
  //        },
  //        error => {
  //          console.error('API Error:', error);
  //        }
  //      );
  //    }
  //    else {
  //      console.log('Form is invalid');
       
  //      // Collect invalid fields
  //      const invalidFields = [];
     
  //      // Check for invalid fields in the main form
  //      for (const controlName in this.droForm.controls) {
  //        if (this.droForm.controls[controlName].invalid) {
  //          const label = this.getLabelText(controlName);
  //          invalidFields.push(label); // Add label to the list
  //        }
  //      }
     
  //      // Check for invalid fields in the degreeData form array
  //      const degreeDataArray = this.droForm.get('degreeData') as FormArray;
  //      if (degreeDataArray) {
  //        degreeDataArray.controls.forEach((degreeGroup, index) => {
  //          if (degreeGroup instanceof FormGroup) {
  //            Object.keys(degreeGroup.controls).forEach((controlName) => {
  //              const control = degreeGroup.get(controlName);
  //              if (control?.invalid) {
  //                const label = this.getLabelText(controlName);
  //                invalidFields.push(`Degree ${index + 1} - ${label}`);
  //              }
  //            });
  //          }
  //        });
  //      }
     
  //      // Show the invalid fields in a popup/alert
  //      if (invalidFields.length > 0) {
  //        alert(`The following fields are invalid: ${invalidFields.join(', ')}`);
  //      }
  //    }
  //  }
  // onSubmit() {
  //   this.submitted = true;
  //   const formValue = this.droForm.value;
    
  
  //   if (formValue.degreeData && Array.isArray(formValue.degreeData)) {
  //     formValue.degreeData.forEach((degree: any) => {
  //       degree.addedBy = 'DRO Profile'; // Add additional field
  //     });
  //   }
  
  //   const formData = new FormData();
  //   Object.keys(formValue).forEach(key => {
  //     const value = this.droForm.get(key)?.value;
  
  //     if (key === 'degreeData' && Array.isArray(formValue.degreeData) && formValue.degreeData.length > 0) {
  //       formData.append('degreeData', JSON.stringify(formValue.degreeData));
  //     }
  //     else if (key === 'imagePath' && value instanceof File) {
  //       formData.append(key, value); // Append file directly
  //     }
  //     else if (value !== null && value !== undefined) {
  //       formData.append(key, value); // Only append non-null/undefined values
  //     }
  //   });
  //   if (formValue.updatePost !== 'yes') {
  //     formData.delete('updateId');
  //   }
  //   formData.append('id', this.id);
  //   if (this.droForm.valid) {
  //     this.officerAction.updateDroProfile(formData).subscribe(
  //       (response: any) => {
  //         alert(response.message);
  //         this.router.navigate(['droprofile']);
  //         console.log('API Response:', response);
  //       },
  //       error => {
  //         console.error('API Error:', error);
  //       }
  //     );
  //   } else {
  //     console.log('Form is invalid');
      
  //     // Collect invalid fields for display
  //     const invalidFields = [];
  
  //     // Check invalid fields in the main form
  //     for (const controlName in this.droForm.controls) {
  //       if (this.droForm.controls[controlName].invalid) {
  //         const label = this.getLabelText(controlName);
  //         invalidFields.push(label); // Add label to the list of invalid fields
  //       }
  //     }
  
  //     // Check invalid fields in the degreeData form array
  //     const degreeDataArray = this.droForm.get('degreeData') as FormArray;
  //     if (degreeDataArray) {
  //       degreeDataArray.controls.forEach((degreeGroup, index) => {
  //         if (degreeGroup instanceof FormGroup) {
  //           Object.keys(degreeGroup.controls).forEach((controlName) => {
  //             const control = degreeGroup.get(controlName);
  //             if (control?.invalid) {
  //               const label = this.getLabelText(controlName);
  //               invalidFields.push(`Degree ${index + 1} - ${label}`);
  //             }
  //           });
  //         }
  //       });
  //     }
  
  //     // Display a popup/alert if there are invalid fields
  //     if (invalidFields.length > 0) {
  //       alert(`The following fields are invalid: ${invalidFields.join(', ')}`);
  //     }
  //   }
  // }

  onSubmit() {
    this.submitted = true;
    const formValue = this.droForm.value;
    
    // Ensure degreeData has the additional field if it exists
    if (formValue.degreeData && Array.isArray(formValue.degreeData)) {
      formValue.degreeData.forEach((degree: any) => {
        degree.addedBy = 'DRO Profile';
      });
    }
  
    const formData = new FormData();
  
    // Append only non-empty, non-null, non-undefined fields
    Object.keys(formValue).forEach(key => {
      const value = this.droForm.get(key)?.value;
  
      if (key === 'degreeData' && Array.isArray(value) && value.length > 0) {
        formData.append('degreeData', JSON.stringify(value)); // Convert to JSON and append
      } else if (key === 'imagePath' && value instanceof File) {
        formData.append(key, value); // Append file directly
      } else if (value !== null && value !== undefined && value !== '') { 
        formData.append(key, value); // Append only non-empty values
      }
    });
  
    if (formValue.updatePost !== 'yes') {
      formData.delete('updateId');
    }
  
    formData.append('id', this.id);
  
    if (this.droForm.valid) {
      this.officerAction.updateDroProfile(formData).subscribe(
        (response: any) => {
          alert(response.message);
          this.router.navigate(['droprofile']);
          console.log('API Response:', response);
        },
        error => {
          console.error('API Error:', error);
        }
      );
    } else {
      console.log('Form is invalid');
      
      const invalidFields: string[] = [];
  
      // Find invalid fields in the main form
      Object.keys(this.droForm.controls).forEach(controlName => {
        if (this.droForm.controls[controlName].invalid) {
          invalidFields.push(this.getLabelText(controlName));
        }
      });
  
      // Find invalid fields in the degreeData form array
      const degreeDataArray = this.droForm.get('degreeData') as FormArray;
      if (degreeDataArray) {
        degreeDataArray.controls.forEach((degreeGroup, index) => {
          if (degreeGroup instanceof FormGroup) {
            Object.keys(degreeGroup.controls).forEach(controlName => {
              const control = degreeGroup.get(controlName);
              if (control?.invalid) {
                invalidFields.push(`Degree ${index + 1} - ${this.getLabelText(controlName)}`);
              }
            });
          }
        });
      }
  
      if (invalidFields.length > 0) {
        alert(`The following fields are invalid: ${invalidFields.join(', ')}`);
      }
    }
  }
  
  
 
   getLabelText(controlName: string): string {
     const label = document.querySelector(`label[for=${controlName}]`) as HTMLLabelElement;
     return label ? label.innerText : controlName;
   }
 
   goBack() {
     this.router.navigateByUrl('droprofile');
   }
 
 }
