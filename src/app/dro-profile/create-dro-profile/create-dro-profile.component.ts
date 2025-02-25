import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveTransferService } from '../../forms/forms.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-dro-profile',
  templateUrl: './create-dro-profile.component.html',
  styleUrl: './create-dro-profile.component.css'
})
export class CreateDroProfileComponent implements OnInit{
droForm!: FormGroup;
  submitted: boolean = false;
  gender: any[] = [];
  state: any[] = [];
  recruitment: any[] = [];
  qualification: any[] = [];
  community: any[] = [];
  grade: any[] = [];
  payScale: any[] = [];
  religion: any[] = [];
  serviceStatus: any[] = [];
  degree: any[] = [];
  exam: string = '';
  base64String: any;
  row: any[] = [{}];
  selectedImage: string | ArrayBuffer | null = null;
  courseDuration: number[] = Array.from({ length: 5 }, (_, i) => i + 1);
  country: any[] = [];
  formValue: any;
  showEducation = false;
  // educationDetails = new educationDetails();
  degreeData: any[] = [];
  educationDetail: any[] = [];
  qualificationDet: any[] = [];
  submittedBy: any;
  postingIn: any[] = [];
  postType: any[] = [];
  locationChange:any[]=[];
  department: any[] = [];
  designation: any[] = [];
  setValues:boolean=false;
  showPosting:boolean=false;
  servingtype: string = '';
  orderFor:any[]=[];
  orderType:any[]=[];
  selectedFile : File | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private fb: FormBuilder, private droAction: LeaveTransferService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.submittedBy = localStorage.getItem('loginId');
      console.log(this.submittedBy);
    }
    this.droForm = this.fb.group({
      employeeId: [''],
      ifhrmsId: [''],
      fullName: [''],
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
      officeEmail: [''],
      payscale: [''],
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
      updateType:[''],
      serving:[''],
      orderType:[''],
      orderNo:[''],
      orderFor:[''],
      dateOfOrder:[''],
      remarks:[''],
      orderFile:[null]

    });

    this.droAction.getDegree().subscribe((res: any) => {
      res.results.forEach((data: any) => {
        this.degree.push({ label: data.degree_name, value: data._id });
      });
    })

    this.droAction.getData().subscribe((res: any[]) => {
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
          case "qualifications_theme":
            this.qualification.push({ label: item.category_name, value: item._id });
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
  }

  getDepartment(event: any) {
    this.department = [];
    this.droAction.getData().subscribe((res: any[]) => {
      res.forEach((item) => {
        if (event.target.value == item._id) {
          this.droAction.getDepartmentData().subscribe((res: any[]) => {
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
    const input = event.target as HTMLSelectElement; 
    const selectedOptionText = input.options[input.selectedIndex].text;
    this.droForm.get('department_name')?.setValue(selectedOptionText);
    console.log(selectedOptionText);
    this.designation = [];
    this.droAction.getDepartmentData().subscribe((res: any[]) => {
      res.forEach((item) => {
        if (event.target.value == item._id) {
          this.droAction.getDesignations().subscribe((res: any) => {
            res.results.filter((data: any) => {
              if (item.category_code == data.category_code) {
                this.designation.push({ label: data.designation_name, value: data._id });
              }
            })
          })

          // Get Address Details
          this.droForm.get('deptAddress')?.setValue(item.address || '');
          this.droForm.get('deptFaxNumber')?.setValue(item.faxNumber || '');
          this.droForm.get('deptOfficialMobileNo')?.setValue(item.officialMobileNo || '');
          this.droForm.get('deptPhoneNumber')?.setValue(item.phoneNumber || '');
          const isFilled = item.address || item.faxNumber || item.phoneNumber || item.officialMobileNo;
          this.droForm.get('department')?.setValue(isFilled ? 'No' : 'yes');
          this.setValues = isFilled;

        }
        this.designation = [];
      });
    });
  }



  get rowsFormArray() {
    return this.droForm.get('rows') as FormArray;
  }

  addEducation() {
    this.showEducation = true;
    if (this.droForm.get('courseLevel')?.value != '' &&
      // this.droForm.get('degree')?.value != '' &&
      this.droForm.get('specialisation')?.value != '' &&
      this.droForm.get('instituteName')?.value != '' &&
      this.droForm.get('locationState')?.value != '' &&
      this.droForm.get('locationCountry')?.value != '' &&
      this.droForm.get('durationOfCourse')?.value != '' &&
      this.droForm.get('fund')?.value != '' &&
      this.droForm.get('fees')?.value != '' &&
      this.droForm.get('courseCompletedDate')?.value != '' &&
      this.droForm.get('courseCompletedYear')?.value != '') {

      const stateValue = this.state.find((pos: any) => pos.value === this.droForm.get('locationState')?.value)?.label;
      const country = this.country.find((pos: any) => pos.value === this.droForm.get('locationCountry')?.value)?.label;

      // console.log(stateValue);
      // console.log(country);
      const educationDet = {
        courseLevel: this.droForm.get('courseLevel')?.value,
        degree: this.droForm.get('degree')?.value,
        specialisation: this.droForm.get('specialisation')?.value,
        instituteName: this.droForm.get('instituteName')?.value,
        locationState: stateValue,
        locationCountry: country,
        durationOfCourse: this.droForm.get('durationOfCourse')?.value,
        fund: this.droForm.get('fund')?.value,
        fees: this.droForm.get('fees')?.value,
        courseCompletedDate: this.droForm.get('courseCompletedDate')?.value,
        courseCompletedYear: this.droForm.get('courseCompletedYear')?.value
      };

      const educationDetails = {
        courseLevel: this.droForm.get('courseLevel')?.value,
        degree: this.droForm.get('degree')?.value,
        specialisation: this.droForm.get('specialisation')?.value,
        instituteName: this.droForm.get('instituteName')?.value,
        locationState: this.droForm.get('locationState')?.value,
        locationCountry: this.droForm.get('locationCountry')?.value,
        durationOfCourse: this.droForm.get('durationOfCourse')?.value,
        fund: this.droForm.get('fund')?.value,
        fees: this.droForm.get('fees')?.value,
        courseCompletedDate: this.droForm.get('courseCompletedDate')?.value,
        courseCompletedYear: this.droForm.get('courseCompletedYear')?.value
      };
      this.educationDetail.push(educationDet);
      this.degreeData.push(educationDetails);
      this.droForm.get('courseLevel')?.setValue('');
      this.droForm.get('degree')?.setValue('');
      this.droForm.get('specialisation')?.setValue('');
      this.droForm.get('instituteName')?.setValue('');
      this.droForm.get('locationState')?.setValue('');
      this.droForm.get('locationCountry')?.setValue('');
      this.droForm.get('durationOfCourse')?.setValue('');
      this.droForm.get('fund')?.setValue('');
      this.droForm.get('fees')?.setValue('');
      this.droForm.get('courseCompletedDate')?.setValue('');
      this.droForm.get('courseCompletedYear')?.setValue('');
      console.log(this.educationDetail);
    } else if (this.educationDetail.length >= 1) {
      alert("Please fill all Details");
    }
    else if (this.educationDetail.length == 0) {
      alert("Please fill all Details");
      this.showEducation = false;
    }
  }

  deleteEducation(index: number) {
    this.educationDetail.splice(index, 1);
    if (this.educationDetail.length == 0) {
      this.showEducation = false;
    }
  }

  confirmDelete(index: number) {
    if (confirm('Are you sure you want to delete this education detail?')) {
      this.deleteEducation(index);
    }
  }



  addRow() {
    const newRow = this.fb.group({
      // courseLevel: ['',Validators.required],
      // degree: [''],
      // specialisation: ['',Validators.required],
      // instituteName:['',Validators.required],
      // locationState:['',Validators.required],
      // locationCountry:['',Validators.required],
      // durationOfCourse:[null,Validators.required],
      // fund:['',Validators.required],
      // fees:['',Validators.required],
      // courseCompletedYear: ['', Validators.required],
      // courseCompletedDate:['',Validators.required]
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
    const qualifications = this.droForm.get('degreeData') as FormArray;
    // qualifications.push(this.createRow());
    this.row.push({});
    // this.rowsFormArray.push(this.createRow());
  }

  removeRow(index: number) {
    if (index !== 0) {
      const qualifications = this.droForm.get('degreeData') as FormArray;
      qualifications.removeAt(index);
      this.row.splice(index, 1);
    }
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
      courseCompletedDate: [''],
    });
  }

  // onFileSelected(event: any) {
  //   const file: File = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e: ProgressEvent<FileReader>) => {
  //       this.selectedImage = reader.result;
  //       this.base64String = e.target?.result;
  //       this.droForm.get('photo')?.setValue(this.base64String);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    // const maxSizeInBytes = 1 * 1024 * 1024; // 2 MB
    if (file) {
      // if (file.size > maxSizeInBytes) {
      //   this.removeImage();
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

  removeImage() {
    this.selectedImage = null;
    this.droForm.get('imagePath')?.setValue(null);
    this.base64String = null;
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }


  calculateRetirementDate() {
    if (this.droForm.get('serviceStatus')?.value == '65f43649a4a01c1cbbd6c9d6') {
      const dobValue = this.droForm.get('dateOfBirth')?.value;
      if (dobValue) {
        const dob = new Date(dobValue);
        const retirementYear = dob.getFullYear() + 60;
        const retirementDate = new Date(retirementYear, dob.getMonth(), dob.getDate());
        const formattedDate = this.formatDate(retirementDate);
        this.droForm.get('dateOfRetirement')?.setValue(formattedDate);
        console.log(formattedDate);
      }
    }
  }
  
  calculateRetirement() {
    const serviceStatus = this.droForm.get('serviceStatus')?.value;
  
    if (serviceStatus === '65f43649a4a01c1cbbd6c9d6') {
      this.calculateRetirementDate();
      this.servingtype = serviceStatus;
      this.showPosting = true;
      this.setDepartmentAndServing('yes', 'yes', 'Transfer / Posting'); 
    } else if (serviceStatus === '65f43649a4a01c1cbbd6c9d7') {
      this.droForm.get('dateOfRetirement')?.setValue('');
      this.servingtype = serviceStatus;
      this.showPosting = false;
      this.setDepartmentAndServing('no', 'no', 'Transfer / Posting'); 
    } else if (serviceStatus === '') {
      this.droForm.get('dateOfRetirement')?.setValue('');
      this.servingtype = '65f43649a4a01c1cbbd6c9d6';
      this.showPosting = false;
      this.setDepartmentAndServing('no', 'no', 'Transfer / Posting'); 
    }
  }
  
 
  
  setDepartmentAndServing(departmentValue: string, servingValue: string, updateTypeValue: string) {
    const departmentControl = this.droForm.get('department');
    const servingControl = this.droForm.get('serving');
    const updateTypeControl = this.droForm.get('updateType');
  
    if (departmentControl) {
      departmentControl.setValue(departmentValue);
    }
  
    if (servingControl) {
      servingControl.setValue(servingValue);
    }
  
    if (updateTypeControl) {
      updateTypeControl.setValue(updateTypeValue);
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
      this.droForm.get('batch')?.setValue(retirementYear);
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

  onKeyDown(event: KeyboardEvent) {
    const key = event.key;
    if (!((key >= '0' && key <= '9') ||
      ['Backspace', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight'].includes(key))) {
      event.preventDefault();
    }
  }

  onKeyDownPincode(event: KeyboardEvent) {
    const key = event.key;

    // Allow numeric values (0-9), letters (A-Z, a-z), and some special keys like Backspace, Tab, Enter, etc.
    if (!(
      (key >= '0' && key <= '9') ||       // Numbers
      (key >= 'A' && key <= 'Z') ||       // Uppercase letters
      (key >= 'a' && key <= 'z') ||       // Lowercase letters
      ['Backspace', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight'].includes(key)
    )) {
      event.preventDefault();  // Prevent other characters from being typed
    }
  }


  changeGrade(data: any) {
    this.payScale.filter((item: any) => {
      if (data.target.value == item._id) {
        this.droForm.get('payscale')?.setValue(item.payscale);

      }
    });
  }
 
  // onSubmit() {
  //   this.submitted = true;
    
  //   if (this.droForm.valid) {
  //     const formValue = this.droForm.value;
  
  //     console.log('droForm', formValue);
  //     formValue.addedBy = 'DRO Profile';
  //     formValue.submittedBy = this.submittedBy;
  
  //     // Check if degreeData exists, is an array, and has values
  //     if (formValue.degreeData && Array.isArray(formValue.degreeData)) {
  //       formValue.degreeData.forEach((degree: any) => {
  //         degree.addedBy = 'DRO Profile';
  //       });
  //     } else {
  //       formValue.degreeData = []; // Set to empty array if no degreeData
  //     }
  
  //     console.log("formValue.degreeData", formValue.degreeData);
  
  //     const formData = new FormData();
      
  //     // Append the non-file fields (except degreeData and submittedBy)
  //     for (const key in formValue) {
  //       if (formValue.hasOwnProperty(key) && key !== 'orderFile' && key !== 'imagePath' && key !== 'degreeData' && key !== 'submittedBy') {
  //         formData.append(key, formValue[key] !== null && formValue[key] !== undefined ? formValue[key] : '');
  //       }
  //     }
      
  //     // Handle orderFile (append only if a file is selected)
  //     if (this.selectedFile) {
  //       formData.append('orderFile', this.selectedFile);
  //     } else {
  //       formData.append('orderFile', '');  // If no file, append empty value
  //     }
  
  //     // Handle imagePath (append only if a file is selected)
  //     const imagePathValue = this.droForm.get('imagePath')?.value;
  //     if (imagePathValue instanceof File) {
  //       formData.append('imagePath', imagePathValue);
  //     } else {
  //       formData.append('imagePath', '');  // If no file, append empty value
  //     }
  
  //     // Append degreeData as JSON string if it's not empty
  //     if (formValue.degreeData.length > 0) {
  //       formData.append('degreeData', JSON.stringify(formValue.degreeData));
  //     } else {
  //       formData.append('degreeData', ''); // Append empty string if degreeData is empty
  //     }
  
  //     // Append addedBy and submittedBy only once
  //     formData.append('addedBy', 'DRO Profile');
  //     formData.append('submittedBy', this.submittedBy);
  
  //     // Log form data entries for debugging (cast formData to any to use entries())
  //     (formData as any).entries().forEach((pair: [string, FormDataEntryValue]) => {
  //       console.log(pair[0], pair[1]);
  //     });
  
  //     // Submit the form data
  //     this.droAction.createDroProfile(formData).subscribe(
  //       (response: any) => {
  //         alert(response.message);
  //         this.droForm.reset();
  //         // this.router.navigate(['droprofile']);
  //         console.log('API Response:', response);
  //       },
  //       error => {
  //         console.error('API Error:', error);
  //         alert(error.message);
  //       }
  //     );
  //   } else {
  //     console.log(this.droForm.value);
  //   }
  // }

  onSubmit() {
    this.submitted = true;
  
    if (this.droForm.valid) {
      const formValue = this.droForm.value;
      // console.log('droForm', formValue);
  
      formValue.addedBy = 'DRO Profile';
      formValue.submittedBy = this.submittedBy;
  
      // Ensure degreeData is valid
      if (formValue.degreeData && Array.isArray(formValue.degreeData)) {
        formValue.degreeData.forEach((degree: any) => {
          degree.addedBy = 'DRO Profile';
        });
      } else {
        formValue.degreeData = [];
      }
  
     console.log("formValue.degreeData", formValue.degreeData);
  
      const formData = new FormData();
  
      // Append only fields with valid values
      Object.keys(formValue).forEach(key => {
        if (
          key !== 'orderFile' &&
          key !== 'imagePath' &&
          key !== 'degreeData' &&
          key !== 'submittedBy' &&
          formValue[key] !== null &&
          formValue[key] !== undefined &&
          formValue[key] !== ''
        ) {
          formData.append(key, formValue[key]);
        }
      });
  
      // Handle orderFile (append only if a file is selected)
      if (this.selectedFile) {
        formData.append('orderFile', this.selectedFile);
      }
  
      // Handle imagePath (append only if a file is selected)
      const imagePathValue = this.droForm.get('imagePath')?.value;
      if (imagePathValue instanceof File) {
        formData.append('imagePath', imagePathValue);
      }
  
      // Append degreeData as JSON string if it's not empty
      if (formValue.degreeData.length > 0) {
        formData.append('degreeData', JSON.stringify(formValue.degreeData));
      }
  
      // Append addedBy and submittedBy only if they have values
      if (formValue.addedBy) formData.append('addedBy', formValue.addedBy);
      if (formValue.submittedBy) formData.append('submittedBy', formValue.submittedBy);
  
      // Log form data entries for debugging
      (formData as any).entries().forEach((pair: [string, FormDataEntryValue]) => {
        // console.log(pair[0], pair[1]);
      });
  
      // Submit the form data
      this.droAction.createDroProfile(formData).subscribe(
        (response: any) => {
          alert(response.message);
          this.droForm.reset();
          this.router.navigate(['droprofile']);
          console.log('API Response:', response);
        },
        error => {
          console.error('API Error:', error);
          alert(error.message);
        }
      );
    } else {
      console.log(this.droForm.value);
    }
  }
}