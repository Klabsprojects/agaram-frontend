import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveTransferService } from '../../forms.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { CommonService } from '../../../shared-services/common.service';
@Component({
  selector: 'app-create-education',
  templateUrl: './create-education.component.html',
  styleUrl: './create-education.component.css'
})
export class CreateEducationComponent implements OnInit{
  showTable = false;
  educationForm!:FormGroup;
  submitted = false;
  department:any[]=[];
  designation:any[]=[];
  orderType:any[]=[];
  orderFor:any[]=[];
  place:any[]=[];
  filteredOptions:any[]=[];
  showDropdown = false;
  employeeProfileId:string='';
  departmentId:string = '';
  designationId:string = '';
  selectedOption:string = '';
  tenureOptions: number[] = Array.from({length: 10}, (_, i) => i + 1);
  courseDuration:number[] = Array.from({length:5},(_,i)=>i+1);
  selectedFile:File | null = null;
  minYear: number = 1900;
  maxYear: number = new Date().getFullYear();
  row: any[] = [{}];
  degree: any[]=[];
  state:any[]=[];
  country:any[]=[];
  educationDet:any[]=[];
  phone:string = '';
  module:string = '';
  degreeData:any[]=[];
  submittedBy:any;

  ifuserlogin = false;
  userdata: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private fb:FormBuilder,private educationService:LeaveTransferService,private router:Router,private cs: CommonService){}
  ngAfterViewInit(): void {
    if (localStorage.getItem('loginAs') == 'Officer') {
      this.cs.data$.subscribe((data: any) => {
        if (data) {
          this.userdata = data;
          this.ifuserlogin = true;
          this.selectedOption = this.userdata.fullName;
  
          // Set the value and disable the control
          this.educationForm.controls['officerName'].setValue(this.userdata.fullName);
          this.educationForm.controls['officerName'].disable(); // Properly disables the control
          this.educationForm.controls['department'].setValue(this.userdata.department);
          this.educationForm.controls['department'].disable(); // Properly disables the control
          this.educationForm.controls['designation'].setValue(this.userdata.designation);
          this.educationForm.controls['designation'].disable(); // Properly disables the control
          console.log('chk',this.userdata);
        }
      });
    }
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.submittedBy = localStorage.getItem('loginId');
      }
    this.educationForm = this.fb.group({
      officerName:['',Validators.required],
      department:['',Validators.required],
      designation:['',Validators.required],
      // detailsOfCourse:['',Validators.required],
      // place:['',Validators.required],
      // tenure:['',Validators.required],
      // fundSource:['',Validators.required],
      // approximateFund:['',Validators.required],
      // courseCompletedYear: ['', [Validators.required, Validators.min(this.minYear), Validators.max(this.maxYear)]],
      // courseCompletedDate:['',Validators.required],
      orderType:['',Validators.required],
      orderNo:['',Validators.required],
      orderFor:['',Validators.required],
      dateOfOrder:['',Validators.required],
      orderFile:[null,Validators.required],
      remarks:[''],
      degreeData: this.fb.array([this.createRow()])
    });

    this.educationService.getData().subscribe((res: any[]) => {
      res.forEach((item) => {
        if(item.category_type == "order_type"){
          this.orderType.push({label:item.category_name,value:item._id});
        }
        if (item.category_type == "order_for") {
          this.orderFor.push({ label: item.category_name, value: item._id });
        }
        if (item.category_type == "district") {
          this.place.push({ label: item.category_name, value: item.category_name });
        }
       if(item.category_type == "state"){
            this.state.push({ label: item.category_name, value: item._id });
       }
       if(item.category_type == "country"){
        this.country.push({ label: item.category_name, value: item._id });
      }
    });
      this.educationService.getDegree().subscribe((res:any)=>{
        res.results.forEach((data:any)=>{
          this.degreeData.push({label:data.degree_name, value:data._id});
        });
      })
    });

    
  }

  onInput(event: any, field: string) {
    const inputValue = event.target.value.trim();
    let mergedOptions: { name: string, id: string, empProfileId: any, degreeData:any[],mobileNo:string }[] = []; 
    this.educationService.getEmployeeList().subscribe((res: any) => {
      res.results.forEach((item: any) => {
        const name: string = item.fullName;
        const id: string = item.employeeId;
        const empProfileId: any = item._id;
        const degreeData:any[]=item.degreeData;
        const mobileNo = item.mobileNo1;
        mergedOptions.push({ name, id, empProfileId,degreeData,mobileNo });
      });
      if (field === 'officerName') {
        this.filteredOptions = mergedOptions.filter((option: { name: string, id: string }) => option.name.toLowerCase().includes(inputValue.toLowerCase()));
      } 
      if (this.filteredOptions.length === 0) {
        this.showDropdown = false;
        this.educationForm.get('officerName')?.setValue('');
      } else {
        this.showDropdown = true;
      }
    });
  }

  selectOption(option: any) {
    const payload = {name:option.name};
    this.selectedOption = option.name;
    this.phone = "+91"+option.mobileNo;
    this.educationDet = option.degreeData;
    if(this.educationDet.length>0){
      this.showTable = true;
    }
    this.educationService.getData().subscribe((res: any[]) => {
      const locationState = new Map(res.filter(item => item.category_type === "state").map(item => [item._id, item.category_name]));
      const countryMap = new Map(res.filter(item => item.category_type === "country").map(item => [item._id, item.category_name]));
      const degreeMap = new Map(this.degreeData.map((item) => [item.value, item.label]));
      this.educationDet.forEach((data: any) => {
        data.locationState = locationState.get(data.locationState) || data.locationState;
        data.locationCountry = countryMap.get(data.locationCountry) || data.locationCountry;
        data.degree = degreeMap.get(data.degree) || data.degree;

      });
    });
    
    this.educationForm.get('officerName')?.setValue(this.selectedOption);
    this.showDropdown = false;
    this.educationService.employeeFilter(payload).subscribe((res:any)=>{
      res.results.empList.forEach((item:any)=>{
        this.employeeProfileId = item._id;
        this.educationService.getDepartmentData().subscribe((departmentRes: any) => {
          departmentRes.filter((data: any) => {
            this.department.push({ label: data.department_name, value: data._id });
          });
          const matchingDepartment = this.department.filter(item => item.value == res.results.empList.find((data:any) => data.toDepartmentId)?.toDepartmentId);
          matchingDepartment.filter((item:any)=>{
            this.departmentId = item.value;
            this.educationForm.get('department')?.setValue(item.label)
          });         
        });

        this.educationService.getDesignations().subscribe((designationRes: any) => {
          designationRes.results.filter((data: any) => {
            this.designation.push({ label: data.designation_name, value: data._id });
          });
          const matchingDesignation = this.designation.filter(item => item.value == res.results.empList.find((data:any) => data.toDesignationId)?.toDesignationId);
          matchingDesignation.filter((item:any)=>{
            this.designationId = item.value;
            this.educationForm.get('designation')?.setValue(item.label)
          });
         
        });
      })
    })
  }

  getCompletedYear(index: number) {
    const degreeDetailsFormArray = this.educationForm.get('degreeData') as FormArray;
    const selectedDate = degreeDetailsFormArray.at(index).get('courseCompletedDate')?.value;
  
    if (selectedDate) {
      const year = new Date(selectedDate).getFullYear();
      degreeDetailsFormArray.at(index).get('courseCompletedYear')?.setValue(year);
    }
  }

  hideFutureDate(){
    return new Date().toISOString().split('T')[0];
  }

  addRow() {
    const newRow = this.fb.group({
      courseLevel: ['',Validators.required],
      degree: [''],
      specialisation: ['',Validators.required],
      instituteName:['',Validators.required],
      locationState:['',Validators.required],
      locationCountry:['',Validators.required],
      durationOfCourse:[null,Validators.required],
      fund:['',Validators.required],
      fees:['',Validators.required],
      courseCompletedYear: ['', Validators.required],
      courseCompletedDate:['',Validators.required]
    });
    (this.educationForm.get('degreeData') as FormArray).push(newRow);
    const qualifications = this.educationForm.get('degreeData') as FormArray;
     this.row.push({});

  }

  

  removeRow(index: number) {
    if (index !== 0) { 
      const qualifications = this.educationForm.get('degreeData') as FormArray;
      qualifications.removeAt(index);
      this.row.splice(index, 1);
    }
  }

  get degreeDetailsFormArray() {
    return this.educationForm.get('degreeData') as FormArray;
  }

  createRow() {
    return this.fb.group({
      courseLevel: [''],
      degree: [''],
      specialisation: [''],
      instituteName:[''],
      locationState:[''],
      locationCountry:[''],
      durationOfCourse:[null],
      fund:[''],
      fees:[''],
      courseCompletedYear:[''],
      courseCompletedDate:['']
    });
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.educationForm.patchValue({ orderFile: this.selectedFile });
    }
    this.selectedFile = event.target.files[0];
    this.educationForm.get('orderFile')?.setValue(this.selectedFile);
    if (this.selectedFile) {
      if (this.selectedFile.type !== 'application/pdf') {
        this.educationForm.get('orderFile')?.setErrors({ 'incorrectFileType': true });
        return;
      }

      if (this.selectedFile.size > 5 * 1024 * 1024) { // 5MB in bytes
        this.educationForm.get('orderFile')?.setErrors({ 'maxSize': true });
        return;
      }

      this.educationForm.get('orderFile')?.setErrors(null);
    }
  }

  onKeyDown(event: KeyboardEvent){
    const key = event.key;
    if (!((key >= '0' && key <= '9') || 
          ['Backspace', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight'].includes(key))) {
      event.preventDefault();
    }
  }

  // onSubmit(){
  //   this.submitted = true;
  //   const degreeDataFormArray = this.educationForm.get('degreeData') as FormArray;
  //   for (let i = 0; i < degreeDataFormArray.length; i++) {
  //       const degreeFormGroup = degreeDataFormArray.at(i) as FormGroup;
  //       const durationOfCourseControl = degreeFormGroup.get('durationOfCourse');
  //       if (durationOfCourseControl?.value !== null) {
  //           const numberValue = Number(durationOfCourseControl?.value);
  //           if (!isNaN(numberValue)) {
  //               durationOfCourseControl?.setValue(numberValue);
  //           }
  //       }
  //   }
  //   console.log(this.educationForm.value);
  //   if (this.educationForm.valid) {
  //     const formData = new FormData();
  //     const formValues = this.educationForm.value;
  //     for (const key in formValues) {
  //       if (formValues.hasOwnProperty(key) && key !== 'orderFile') {
  //         formData.append(key, formValues[key]);
  //       }
  //     }
  //     if (this.selectedFile) {
  //       formData.append('orderFile', this.selectedFile);
  //     }
  //     formData.append('employeeProfileId', this.employeeProfileId);
  //     formData.append('departmentId', this.departmentId);
  //     formData.append('designationId', this.designationId);
  //     console.log(formData);
  //     this.educationService.createEducation(formData).subscribe(
  //       response => {
  //         alert("Added Successfully...");
  //         this.router.navigateByUrl('education');
  //        console.log('API Response:', response);
  //       },
  //       error => {
  //         console.error('API Error:', error);
  //       }
  //     );
  //   }
  // }

  onSubmit() {
    this.submitted = true;
    console.log(this.educationForm.value);
    if (this.educationForm.valid) {
        const formData = new FormData();

        // Append scalar values
        const formValues = this.educationForm.value;
        for (const key in formValues) {
            if (formValues.hasOwnProperty(key) && key !== 'orderFile' && key !== 'degreeData') {
                formData.append(key, formValues[key]);
            }
        }

        // Append degreeData fields separately
        formValues.degreeData.forEach((degree: any, index: number) => {
            for (const degreeKey in degree) {
                if (degree.hasOwnProperty(degreeKey)) {
                    formData.append(`degreeData[${index}][${degreeKey}]`, degree[degreeKey]);
                }
            }
        });

        // Append file if selected
        if (this.selectedFile) {
            formData.append('orderFile', this.selectedFile);
        }
        

        // Append additional data
        this.module = "Eduation";
        formData.append('employeeProfileId', this.employeeProfileId);
        formData.append('departmentId', this.departmentId);
        formData.append('designationId', this.designationId);
        formData.append('submittedBy',this.submittedBy);
        formData.append('phone', this.phone);
        formData.append('module',this.module);
        console.log(formData);

        // Send form data to the backend
        this.educationService.createEducation(formData).subscribe(
            response => {
                alert(response.message);
                this.router.navigateByUrl('education');
                console.log('API Response:', response);
            },
            error => {
                console.error('API Error:', error);
            }
        );
    }
}

}
