import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LeaveTransferService } from '../../forms/forms.service';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-officer-profile',
  templateUrl: './officer-profile.component.html',
  styleUrls: ['./officer-profile.component.css']
})
export class OfficerProfileComponent implements OnInit {
  officerForm!: FormGroup;
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

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private fb: FormBuilder, private officerAction: LeaveTransferService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.submittedBy = localStorage.getItem('loginId');
      console.log(this.submittedBy);
    }
    this.officerForm = this.fb.group({
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
      religion: ['', Validators.required],
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
      officeEmail: [''],
      payscale: [''],
      imagePath: [null],
      degreeData: this.fb.array([this.createRow()]),
      seniority: [''],
    });

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
          default:
            break;
        }
      })
    })
  }

  get rowsFormArray() {
    return this.officerForm.get('rows') as FormArray;
  }

  addEducation() {
    this.showEducation = true;
    if (this.officerForm.get('courseLevel')?.value != '' &&
      // this.officerForm.get('degree')?.value != '' &&
      this.officerForm.get('specialisation')?.value != '' &&
      this.officerForm.get('instituteName')?.value != '' &&
      this.officerForm.get('locationState')?.value != '' &&
      this.officerForm.get('locationCountry')?.value != '' &&
      this.officerForm.get('durationOfCourse')?.value != '' &&
      this.officerForm.get('fund')?.value != '' &&
      this.officerForm.get('fees')?.value != '' &&
      this.officerForm.get('courseCompletedDate')?.value != '' &&
      this.officerForm.get('courseCompletedYear')?.value != '') {

      const stateValue = this.state.find((pos: any) => pos.value === this.officerForm.get('locationState')?.value)?.label;
      const country = this.country.find((pos: any) => pos.value === this.officerForm.get('locationCountry')?.value)?.label;

      // console.log(stateValue);
      // console.log(country);
      const educationDet = {
        courseLevel: this.officerForm.get('courseLevel')?.value,
        degree: this.officerForm.get('degree')?.value,
        specialisation: this.officerForm.get('specialisation')?.value,
        instituteName: this.officerForm.get('instituteName')?.value,
        locationState: stateValue,
        locationCountry: country,
        durationOfCourse: this.officerForm.get('durationOfCourse')?.value,
        fund: this.officerForm.get('fund')?.value,
        fees: this.officerForm.get('fees')?.value,
        courseCompletedDate: this.officerForm.get('courseCompletedDate')?.value,
        courseCompletedYear: this.officerForm.get('courseCompletedYear')?.value
      };

      const educationDetails = {
        courseLevel: this.officerForm.get('courseLevel')?.value,
        degree: this.officerForm.get('degree')?.value,
        specialisation: this.officerForm.get('specialisation')?.value,
        instituteName: this.officerForm.get('instituteName')?.value,
        locationState: this.officerForm.get('locationState')?.value,
        locationCountry: this.officerForm.get('locationCountry')?.value,
        durationOfCourse: this.officerForm.get('durationOfCourse')?.value,
        fund: this.officerForm.get('fund')?.value,
        fees: this.officerForm.get('fees')?.value,
        courseCompletedDate: this.officerForm.get('courseCompletedDate')?.value,
        courseCompletedYear: this.officerForm.get('courseCompletedYear')?.value
      };
      this.educationDetail.push(educationDet);
      this.degreeData.push(educationDetails);
      this.officerForm.get('courseLevel')?.setValue('');
      this.officerForm.get('degree')?.setValue('');
      this.officerForm.get('specialisation')?.setValue('');
      this.officerForm.get('instituteName')?.setValue('');
      this.officerForm.get('locationState')?.setValue('');
      this.officerForm.get('locationCountry')?.setValue('');
      this.officerForm.get('durationOfCourse')?.setValue('');
      this.officerForm.get('fund')?.setValue('');
      this.officerForm.get('fees')?.setValue('');
      this.officerForm.get('courseCompletedDate')?.setValue('');
      this.officerForm.get('courseCompletedYear')?.setValue('');
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
    (this.officerForm.get('degreeData') as FormArray).push(newRow);
    const qualifications = this.officerForm.get('degreeData') as FormArray;
    // qualifications.push(this.createRow());
    this.row.push({});
    // this.rowsFormArray.push(this.createRow());
  }

  removeRow(index: number) {
    if (index !== 0) {
      const qualifications = this.officerForm.get('degreeData') as FormArray;
      qualifications.removeAt(index);
      this.row.splice(index, 1);
    }
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
  //       this.officerForm.get('photo')?.setValue(this.base64String);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const maxSizeInBytes = 1 * 1024 * 1024; // 2 MB
    if (file) {
      if (file.size > maxSizeInBytes) {
        this.removeImage();
        alert('File size exceeds 1 MB. Please select a smaller file.');
        return;  // Stop further execution
      }
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

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }


  calculateRetirementDate() {
    if (this.officerForm.get('serviceStatus')?.value == '65f43649a4a01c1cbbd6c9d6') {
      const dobValue = this.officerForm.get('dateOfBirth')?.value;
      if (dobValue) {
        const dob = new Date(dobValue);
        const retirementYear = dob.getFullYear() + 60;
        const retirementDate = new Date(retirementYear, dob.getMonth(), dob.getDate());
        const formattedDate = this.formatDate(retirementDate);
        this.officerForm.get('dateOfRetirement')?.setValue(formattedDate);
        console.log(formattedDate);
      }
    }
  }

  servingtype: string = '';
  calculateRetirement() {
    if (this.officerForm.get('serviceStatus')?.value == '65f43649a4a01c1cbbd6c9d6') {
      this.calculateRetirementDate();
      this.servingtype = '65f43649a4a01c1cbbd6c9d6';
    }
    else if (this.officerForm.get('serviceStatus')?.value == '65f43649a4a01c1cbbd6c9d7') {
      this.officerForm.get('dateOfRetirement')?.setValue('');
      this.servingtype = '65f43649a4a01c1cbbd6c9d7';
    }
    else if (this.officerForm.get('serviceStatus')?.value == '') {
      this.officerForm.get('dateOfRetirement')?.setValue('');
      this.servingtype = '65f43649a4a01c1cbbd6c9d6';
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
      this.officerForm.get('batch')?.setValue(retirementYear);
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

  // getCompletedYear(){
  //   const dojValue = this.officerForm.get('courseCompletedDate')?.value;
  //   if(dojValue){
  //     const dob = new Date(dojValue);
  //     const completedYear = dob.getFullYear(); 
  //     this.officerForm.get('courseCompletedYear')?.setValue(completedYear); 
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
        this.officerForm.get('payscale')?.setValue(item.payscale);

      }
    });
  }
  onSubmit() {
    this.submitted = true;
    if (this.officerForm.valid) {
      const formValue = this.officerForm.value;
      console.log('officerForm', formValue);
      // const formData = new FormData();
      // delete formValue.courseLevel;
      // delete formValue.specialisation;
      // delete formValue.instituteName;
      // delete formValue.locationState;
      // delete formValue.locationCountry;
      // delete formValue.durationOfCourse;
      // delete formValue.fund;
      // delete formValue.fees;
      // delete formValue.courseCompletedDate;
      // delete formValue.courseCompletedYear;
      // for (const key in formValue) {
      //   if (formValue.hasOwnProperty(key)) {
      //     formData.append(key, formValue[key]);
      //   }
      // }


      formValue.addedBy = 'employeeProfile';
      formValue.submittedBy = this.submittedBy;
      if (formValue.degreeData && Array.isArray(formValue.degreeData)) {
        formValue.degreeData.forEach((degree: any) => {
          degree.addedBy = 'employeeProfile';
        });
      }
      // console.log(this.degreeData);
      // formData.append('degreeData', JSON.stringify(this.degreeData));
      // formData.append('addedBy','employeeProfile');
      const formData = new FormData();

      // Append all form values
      Object.keys(formValue).forEach(key => {
        const value = this.officerForm.get(key)?.value;
      
        if (key === 'imagePath' && value instanceof File) {
          formData.append(key, value);  // Append file directly
        } else if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      
      // Manually append additional fields
      formData.append('addedBy', 'employeeProfile');
      formData.append('submittedBy', this.submittedBy);
      
      // Handle degreeData array
      if (formValue.degreeData && Array.isArray(formValue.degreeData)) {
        formValue.degreeData.forEach((degree: any, index: number) => {
          degree.addedBy = 'employeeProfile';
          formData.append(`degreeData[${index}]`, JSON.stringify(degree));
        });
      }

      // console.log('formData',formData);  // Check FormData in console
      for (let pair of (formData as any).entries()) {
        console.log(pair[0], pair[1]);
      }
      
      
      this.officerAction.createEmployeeProfile(formData).subscribe(
        response => {
          alert("Employee added Successfully..!")
          this.officerForm.reset();
          this.router.navigate(['officer-profile-list']);
          console.log('API Response:', response);
        },
        error => {
          console.error('API Error:', error);
        }
      );
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