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
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private fb: FormBuilder, private droAction: LeaveTransferService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.submittedBy = localStorage.getItem('loginId');
      console.log(this.submittedBy);
    }
    this.droForm = this.fb.group({
      employeeId: [''],
      ifhrmsId: [''],
      fullName: ['', Validators.required],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      dateOfJoining: ['', Validators.required],
      dateOfRetirement: [''],
      state: ['', Validators.required],
      batch: [''],
      recruitmentType: ['', Validators.required],
      serviceStatus: ['', Validators.required],
      religion: [''],
      community: [''],
      caste: [''],
      personalEmail: [[]],
      mobileNo1: [''],
      mobileNo2: [''],
      mobileNo3: [''],
      addressLine: ['', Validators.required],
      city: ['', Validators.required],
      pincode: ['', Validators.required],
      promotionGrade: ['', Validators.required],
      officeEmail: [''],
      payscale: [''],
      imagePath: [null],
      degreeData: this.fb.array([this.createRow()]),
      seniority: [''],
      toPostingInCategoryCode:['',Validators.required],
      toDepartmentId:['',Validators.required],
      toDesignationId:['',Validators.required],
      postTypeCategoryCode:['',Validators.required],
      locationChangeCategoryId:['',Validators.required],
      languages:['',Validators.required],
      deptAddress:['',Validators.required],
      deptPhoneNumber:['',Validators.required],
      deptFaxNumber:[''],
      deptOfficialMobileNo:[''],
      lastDateOfPromotion:['',Validators.required],
      department:[''],
      department_name:[''],
      updateType:[''],
      serving:['']
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


  removeImage() {
    this.selectedImage = null;
    // You may also want to clear the file input here to allow selecting the same image again
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
  
  // calculateRetirement() {
  //   if (this.droForm.get('serviceStatus')?.value == '65f43649a4a01c1cbbd6c9d6') {
  //     this.calculateRetirementDate();
  //     this.servingtype = '65f43649a4a01c1cbbd6c9d6';
  //     this.showPosting = true;
  //   }
  //   else if (this.droForm.get('serviceStatus')?.value == '65f43649a4a01c1cbbd6c9d7') {
  //     this.droForm.get('dateOfRetirement')?.setValue('');
  //     this.servingtype = '65f43649a4a01c1cbbd6c9d7';
  //     this.showPosting = false;
  //   }
  //   else if (this.droForm.get('serviceStatus')?.value == '') {
  //     this.droForm.get('dateOfRetirement')?.setValue('');
  //     this.servingtype = '65f43649a4a01c1cbbd6c9d6';
  //     this.showPosting = false;
  //   }
  // }

  calculateRetirement() {
    const serviceStatus = this.droForm.get('serviceStatus')?.value;
  
    if (serviceStatus === '65f43649a4a01c1cbbd6c9d6') {
      this.calculateRetirementDate();
      this.servingtype = serviceStatus;
      this.showPosting = true;
      this.toggleFieldValidation(true);
      this.setDepartmentAndServing('yes', 'yes', 'Transfer / Posting'); 
    } else if (serviceStatus === '65f43649a4a01c1cbbd6c9d7') {
      this.droForm.get('dateOfRetirement')?.setValue('');
      this.servingtype = serviceStatus;
      this.showPosting = false;
      this.toggleFieldValidation(false);
      this.setDepartmentAndServing('no', 'no', ''); 
    } else if (serviceStatus === '') {
      this.droForm.get('dateOfRetirement')?.setValue('');
      this.servingtype = '65f43649a4a01c1cbbd6c9d6';
      this.showPosting = false;
      this.toggleFieldValidation(false);
      this.setDepartmentAndServing('no', 'no', ''); 
    }
  }
  
  toggleFieldValidation(isRequired: boolean) {
    const fieldsToValidate = [
      'toPostingInCategoryCode',
      'toDepartmentId',
      'toDesignationId',
      'postTypeCategoryCode',
      'locationChangeCategoryId',
      'languages',
      'deptAddress',
      'deptPhoneNumber',
      'lastDateOfPromotion',
      'department',
      'updateType',
      'serving'
    ];
  
    fieldsToValidate.forEach((field) => {
      const control = this.droForm.get(field);
  
      if (control) {
        if (isRequired) {
          control.setValidators(Validators.required);
        } else {
          control.clearValidators();
          control.setValue(''); // Clear the value if not required
        }
        control.updateValueAndValidity();
      }
    });
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

  // getCompletedYear(){
  //   const dojValue = this.droForm.get('courseCompletedDate')?.value;
  //   if(dojValue){
  //     const dob = new Date(dojValue);
  //     const completedYear = dob.getFullYear(); 
  //     this.droForm.get('courseCompletedYear')?.setValue(completedYear); 
  //   }
  // }

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
  onSubmit() {
    this.submitted = true;
    if (this.droForm.valid) {
      const formValue = this.droForm.value;
      console.log('droForm', formValue);
      
  }
}
}

export class educationDetails {
  courseLevel: string = '';
  degree: string = '';
  specialisation: string = '';
  instituteName: string = '';
  locationState: string = '';
  locationCountry: string = '';
  durationOfCourse: string = '';
  fund: string = '';
  fees: number = 0;
  courseCompletedDate: string = '';
  courseCompletedYear: number = 0;
}
