import { Component, ElementRef, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LeaveTransferService } from '../../forms/forms.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-edit-officer',
  templateUrl: './edit-officer.component.html',
  styleUrls: ['./edit-officer.component.css']
})
export class EditOfficerComponent implements OnInit {
  officerForm!: FormGroup;
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
  serviceStatus: any[] = [];
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
  locationChange:any[]=[];
  department: any[] = [];
  designation: any[] = [];
  setValues:boolean=false;

  constructor(private fb: FormBuilder, private elementRef: ElementRef, private officerAction: LeaveTransferService, private router: Router, private route: ActivatedRoute, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.queryParamMap.get('profile');
    this.officerForm = this.fb.group({
      employeeId: [''],
      fullName: ['', Validators.required],
      ifhrmsId: [''],
      gender: [''],
      dateOfBirth: [''],
      dateOfJoining: [''],
      dateOfRetirement: [''],
      state: ['', Validators.required],
      batch: [''],
      recruitmentType: ['', Validators.required],
      serviceStatus: ['', Validators.required],
      religion: [''],
      community: ['', Validators.required],
      caste: [''],
      personalEmail: [[]],
      mobileNo1: [''],
      mobileNo2: [''],
      mobileNo3: [''],
      addressLine: ['', Validators.required],
      city: ['', Validators.required],
      pincode: ['', Validators.required],
      promotionGrade: ['', Validators.required],
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
      lastDateOfPromotion:['',Validators.required],
      department:[''],
      department_name:[''],
      updatePost:[''],
      updateType:['Transfer / Posting'],
      updateId:[''],
    });
    this.officerAction.getEmployee(this.id).subscribe((res: any) => {
      res.results.forEach((data: any) => {
        this.officerAction.getDepartmentData().subscribe((res: any[]) => {
          this.department = res.map((item: any) => ({ label: item.department_name, value: item._id }));
          
          if (data.toDepartmentId) {
            this.officerForm.get('toDepartmentId')?.setValue(data.toDepartmentId);
            const selectedDepartment = res.find((item: any) => item._id === data.toDepartmentId);
            
            if (selectedDepartment) {
              this.officerForm.get('department_name')?.setValue(selectedDepartment.department_name);
              this.officerForm.get('department')?.setValue('yes');
              this.officerForm.get('updatePost')?.setValue('yes');
              this.officerForm.get('updateId')?.setValue(data.uniqueId);  // Only set updateId if department is found
            } else {
              const formValue = { ...this.officerForm.value };
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
            this.officerForm.get('toDesignationId')?.setValue(data.toDesignationId);
          }
        });        
        this.officerForm.get('fullName')?.setValue(data.fullName);
        this.officerForm.get('ifhrmsId')?.setValue(data.ifhrmsId);
        this.officerForm.get('gender')?.setValue(data.gender);
        var dateOfBirth = new Date(data.dateOfBirth);
        data.dateOfBirth = dateOfBirth.toISOString().split('T')[0];
        this.officerForm.get('dateOfBirth')?.setValue(data.dateOfBirth);
        this.officerForm.get('state')?.setValue(data.state);
        this.officerForm.get('community')?.setValue(data.community);
        this.officerForm.get('religion')?.setValue(data.religion);
        this.officerForm.get('caste')?.setValue(data.caste);
        this.officerForm.get('mobileNo1')?.setValue(data.mobileNo1);
        this.officerForm.get('mobileNo2')?.setValue(data.mobileNo2);
        this.officerForm.get('mobileNo3')?.setValue(data.mobileNo3);
        this.officerForm.get('personalEmail')?.setValue(data.personalEmail);
        this.officerForm.get('addressLine')?.setValue(data.addressLine);
        this.officerForm.get('city')?.setValue(data.city);
        this.officerForm.get('pincode')?.setValue(data.pincode);
        this.officerForm.get('employeeId')?.setValue(data.employeeId);
        var dateOfJoining = new Date(data.dateOfJoining);
        data.dateOfJoining = dateOfJoining.toISOString().split('T')[0];
        this.officerForm.get('dateOfJoining')?.setValue(data.dateOfJoining);
        var dateOfRetirement = new Date(data.dateOfRetirement);
        data.dateOfRetirement = dateOfRetirement.toISOString().split('T')[0];
        this.officerForm.get('dateOfRetirement')?.setValue(data.dateOfRetirement);
        this.officerForm.get('batch')?.setValue(data.batch);
        this.officerForm.get('recruitmentType')?.setValue(data.recruitmentType);
        this.officerForm.get('serviceStatus')?.setValue(data.serviceStatus);
        this.officerForm.get('promotionGrade')?.setValue(data.promotionGrade);
        this.officerForm.get('payscale')?.setValue(data.payscale);
        this.officerForm.get('officeEmail')?.setValue(data.officeEmail);
        this.officerForm.get('seniority')?.setValue(data.seniority);
        // this.officerForm.get('imagePath')?.setValue(data.imagePath);
        this.selectedImage = `${this.officerAction.fileUrl}profileImages/${data.imagePath?.replace('\\', '/')}`;
        // this.selectedImage = 'https://agaram.a2zweb.in/v1/uploads/1735638303345.png';
        // console.log("selectedImage", this.selectedImage);
        this.degreeData = data.degreeData;
        // const binaryData = data.photo.data;
        // this.base64ImageData = btoa(String.fromCharCode.apply(null, binaryData));
        // const binaryData = new Uint8Array(data.photo.data);
        // this.base64ImageData = this.arrayBufferToBase64(binaryData);

        this.populateDegreeForm();
        this.officerForm.get('toPostingInCategoryCode')?.setValue(data.toPostingInCategoryCode);
        this.officerForm.get('postTypeCategoryCode')?.setValue(data.postTypeCategoryCode);
        this.officerForm.get('locationChangeCategoryId')?.setValue(data.locationChangeCategoryId);
        this.officerForm.get('languages')?.setValue(data.languages);
        this.officerForm.get('deptAddress')?.setValue(data.departmentId.address);
        this.officerForm.get('deptPhoneNumber')?.setValue(data.departmentId.phoneNumber);
        this.officerForm.get('deptFaxNumber')?.setValue(data.departmentId.faxNumber);
        this.officerForm.get('deptOfficialMobileNo')?.setValue(data.departmentId.officialMobileNo);
        var lastDateOfPromotion = new Date(data.lastDateOfPromotion);
        data.lastDateOfPromotion = lastDateOfPromotion.toISOString().split('T')[0];
        this.officerForm.get('lastDateOfPromotion')?.setValue(data.lastDateOfPromotion);
      });
    })
   

    this.officerAction.getDegree().subscribe((res: any) => {
      res.results.forEach((data: any) => {
        this.degree.push({ label: data.degree_name, value: data._id });
      });
    })

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
            break;
          case "religion":
            this.religion.push({ label: item.category_name, value: item._id });
            break;
          case "service_status":
            this.serviceStatus.push({ label: item.category_name, value: item._id });
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
          default:
            break;
        }
      })
    })
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
    this.officerForm.get('department_name')?.setValue(selectedOptionText);
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
          this.officerForm.get('deptAddress')?.setValue(item.address || '');
          this.officerForm.get('deptFaxNumber')?.setValue(item.faxNumber || '');
          this.officerForm.get('deptOfficialMobileNo')?.setValue(item.officialMobileNo || '');
          this.officerForm.get('deptPhoneNumber')?.setValue(item.phoneNumber || '');
          const isFilled = item.address || item.faxNumber || item.phoneNumber || item.officialMobileNo;
          this.officerForm.get('department')?.setValue(isFilled ? 'No' : 'yes');
          this.officerForm.get('updatePost')?.setValue(isFilled ? 'yes' : 'No');
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
    const formArray = this.officerForm.get('degreeData') as FormArray;
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
    return this.officerForm.get('degreeData') as FormArray;
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
      //   this.officerForm.get('imagePath')?.setValue(null);
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
      this.officerForm.get('imagePath')?.setValue(file);  // Set file directly to form
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
    this.officerForm.get('imagePath')?.setValue(null);
    this.base64String = null;
  }

  // onFileSelected(event: any) {
  //   const file: File = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e: ProgressEvent<FileReader>) => {
  //       this.base64String = e.target?.result;
  //       this.officerForm.get('photo')?.setValue(this.base64String);
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
    const degreeDetailsFormArray = this.officerForm.get('degreeData') as FormArray;
    const selectedDate = degreeDetailsFormArray.at(index).get('courseCompletedDate')?.value;

    if (selectedDate) {
      const year = new Date(selectedDate).getFullYear();
      degreeDetailsFormArray.at(index).get('courseCompletedYear')?.setValue(year);
    }
  }

  addRow() {
    const newRow = this.fb.group({
      courseLevel: ['', Validators.required],
      degree: ['', Validators.required],
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
    (this.officerForm.get('degreeData') as FormArray).push(newRow);
    this.rows.push({});
  }

  removeRow(index: number) {
    if (index !== 0) {
      const qualifications = this.officerForm.get('degreeData') as FormArray;
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
    const dobValue = this.officerForm.get('dateOfBirth')?.value;
    if (dobValue) {
      const dob = new Date(dobValue);
      const retirementYear = dob.getFullYear() + 60;
      const retirementDate = new Date(retirementYear, dob.getMonth(), dob.getDate());
      const formattedDate = this.formatDate(retirementDate);
      this.officerForm.get('dateOfRetirement')?.setValue(formattedDate);
    }
  }

  hideFutureDate() {
    return new Date().toISOString().split('T')[0];
  }

  getYear() {
    const dojValue = this.officerForm.get('dateOfJoining')?.value;
    if (dojValue) {
      const dob = new Date(dojValue);
      const retirementYear = dob.getFullYear();
      this.officerForm.get('batch')?.markAsDirty(); // Mark the control as dirty
      this.officerForm.get('batch')?.markAsTouched(); // Optionally mark as touched
      this.officerForm.get('batch')?.setValue(retirementYear);
    }
  }

  onSubmit() {
    this.submitted = true;
    const formValue = this.officerForm.value;
    if (formValue.degreeData && Array.isArray(formValue.degreeData)) {
      formValue.degreeData.forEach((degree: any) => {
        degree.addedBy = 'employeeProfile';
      });
    }
    // console.log("formValue.degreeData",formValue.degreeData);
    const formData = new FormData();

    // Append all form values
    Object.keys(formValue).forEach(key => {
      const value = this.officerForm.get(key)?.value;
      if(key === 'degreeData'){
        formData.append('degreeData',JSON.stringify(formValue.degreeData));
      }
      else if (key === 'imagePath' && value instanceof File) {
        formData.append(key, value);  // Append file directly
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    // Handle degreeData array
    // if (formValue.degreeData && Array.isArray(formValue.degreeData)) {
    //   formValue.degreeData.forEach((degree: any, index: number) => {
    //     degree.addedBy = 'employeeProfile';
    //     formData.append(`degreeData[${index}]`, JSON.stringify(degree));
    //   });
    // }

    if (formValue.updatePost !== 'yes') {
      formData.delete('updateId');  // Remove updateId if not applicable
    }
    formData.append('id',this.id);

    // console.log('formData',formData);  // Check FormData in console
    for (let pair of (formData as any).entries()) {
      console.log(pair[0], pair[1]);
    }
    // const dataToSend = {
    //   id:this.id,
    //   fullName: formData.fullName,
    //   mobileNo1: formData.mobileNo1,
    //   mobileNo2: formData.mobileNo2,
    //   mobileNo3: formData.mobileNo3,
    //   personalEmail: formData.personalEmail,
    //   religion: formData.religion,
    //   employeeId:formData.employeeId,
    //   ifhrmsId:formData.ifhrmsId,
    //   degreeData: formData.degreeData,
    //   seniority: formData.seniority,
    //   dateOfJoining: formData.dateOfJoining
    // };
    // console.log(dataToSend);
    if (this.officerForm.valid) {
      this.officerAction.updateEmployeeProfile(formData).subscribe((response:any) => {
          alert(response.message)
          this.officerForm.reset();
          this.router.navigate(['officer-profile-list']);
          console.log('API Response:', response);
        },
        error => {
          console.error('API Error:', error);
        }
      );
    }
    else {
      console.log('Form is invalid');
      
      // Collect invalid fields
      const invalidFields = [];
    
      // Check for invalid fields in the main form
      for (const controlName in this.officerForm.controls) {
        if (this.officerForm.controls[controlName].invalid) {
          const label = this.getLabelText(controlName);
          invalidFields.push(label); // Add label to the list
        }
      }
    
      // Check for invalid fields in the degreeData form array
      const degreeDataArray = this.officerForm.get('degreeData') as FormArray;
      if (degreeDataArray) {
        degreeDataArray.controls.forEach((degreeGroup, index) => {
          if (degreeGroup instanceof FormGroup) {
            Object.keys(degreeGroup.controls).forEach((controlName) => {
              const control = degreeGroup.get(controlName);
              if (control?.invalid) {
                const label = this.getLabelText(controlName);
                invalidFields.push(`Degree ${index + 1} - ${label}`);
              }
            });
          }
        });
      }
    
      // Show the invalid fields in a popup/alert
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
    this.router.navigateByUrl('officer-profile-list');
  }

}
