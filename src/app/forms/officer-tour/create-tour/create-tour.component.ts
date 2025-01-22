import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveTransferService } from '../../forms.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { CommonService } from '../../../shared-services/common.service';

@Component({
  selector: 'app-create-tour',
  templateUrl: './create-tour.component.html',
  styleUrl: './create-tour.component.css'
})
export class CreateTourComponent {
  ltcForm!: FormGroup;
  selectedFile: File | null = null;
  submitted = false;
  orderFor: any[] = [];
  orderType: any[] = [];
  designation: any[] = [];
  department: any[] = [];
  showDropdown = false;
  selectedOption: string = '';
  filteredOptions: any[] = [];
  employeeProfileId: string = '';
  designationId: string = '';
  departmentId: string = '';
  phone: string = '';
  module: string = '';
  submittedBy: any;
  fromValue: any;
  toDateValue = true;
  leaveavailed: string[] = ['Casual Leave', 'Earned Leave'];
  category: string[] = ['Home Town', 'Anywhere in India', 'Conversion of Home Town LTC'];
  selfOrFamily: string[] = ['Self', 'Family']

  ifuserlogin = false;
  userdata: any;
  states: any[] = [];
  disctricts: any[] = [];
  row: any[] = [{}];

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router, private ltcService: LeaveTransferService, private fb: FormBuilder, private cs: CommonService) { }
  ngAfterViewInit(): void {
    if (localStorage.getItem('loginAs') == 'Officer') {
      this.cs.data$.subscribe((data: any) => {
        if (data) {
          this.userdata = data;
          this.ifuserlogin = true;
          this.selectedOption = this.userdata.fullName;

          // Set the value and disable the control
          this.ltcForm.controls['officerName'].setValue(this.userdata.fullName);
          this.ltcForm.controls['officerName'].disable(); // Properly disables the control
          this.ltcForm.controls['department'].setValue(this.userdata.department);
          this.ltcForm.controls['department'].disable(); // Properly disables the control
          this.ltcForm.controls['designation'].setValue(this.userdata.designation);
          this.ltcForm.controls['designation'].disable(); // Properly disables the control
          console.log('chk', this.userdata);
        }
      });
    }
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.submittedBy = localStorage.getItem('loginId');
    }
    this.ltcForm = this.fb.group({
      OtherOfficers: this.fb.array([this.createRow()]),
      proposedState :['testing1', Validators.required],
      stateId: ['', Validators.required],
      state: ['', Validators.required],
      districtId: ['', Validators.required],
      district: ['', Validators.required],
      place: ['testing1', Validators.required],
      typeOfTour: ['testing1', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      purpose: ['', Validators.required],
      organisationHostName: ['', Validators.required],
      presentStatus: ['', Validators.required],
      orderType: ['', Validators.required],
      orderNo: ['', Validators.required],
      orderFor: ['', Validators.required],
      dateOfOrder: ['', Validators.required],
      rejectReasons: ['', Validators.required],
      remarks: ['testing1', Validators.required],
      orderFIle :[null, Validators.required]
    });
    this.ltcService.getData().subscribe((res: any[]) => {
      res.forEach((item) => {
        if (item.category_type == "order_type") {
          this.orderType.push({ label: item.category_name, value: item._id });
        }
        if (item.category_type == "order_for") {
          this.orderFor.push({ label: item.category_name, value: item._id });
        }
      });
    });
    this.get_states();
  }

  fromDateValue(data: any) {
    this.fromValue = data.target.value;
    if (this.ltcForm.get('toDate')?.value < this.fromValue || this.ltcForm.get('fromDate')?.value == '') {
      this.ltcForm.get('toDate')?.setValue('');
      this.toDateValue = true;
    }
    if (this.fromValue) {
      this.toDateValue = false;
    }
  }


  onInput(event: any, field: string) {
    const inputValue = event.target.value.trim();
    let mergedOptions: { name: string, id: string, empProfileId: any, mobileNo: string }[] = [];
    this.ltcService.getEmployeeList().subscribe((res: any) => {
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
        this.ltcForm.get('officerName')?.setValue('');
      } else {
        this.showDropdown = true;
      }
    });
  }

  selectOption(option: any, index: number) {
    console.log("option",option);
    const name = option.name;
    const payload = { name: option.name };
    this.selectedOption = option.name;
    this.phone = "+91" + option.mobileNo;
  
    // Access the 'OtherOfficers' FormArray
    const otherOfficersArray = this.ltcForm.get('OtherOfficers') as FormArray;
  
    // Ensure the index exists in the FormArray
    if (index < otherOfficersArray.length) {
      const officerGroup = otherOfficersArray.at(index) as FormGroup;
  
      // Set the 'officerName' value
      officerGroup.get('officerName')?.setValue(this.selectedOption);
  
      // Initialize department and designation as empty arrays for this function
      this.department = [];
      this.designation = [];
  
      this.showDropdown = false;
  
      // Fetch employee data
      this.ltcService.employeeFilter(payload).subscribe((res: any) => {
        res.results.empList.forEach((item: any) => {
          this.employeeProfileId = item._id;
  
          // Fetch department data
          this.ltcService.getDepartmentData().subscribe((departmentRes: any) => {
            departmentRes.forEach((data: any) => {
              this.department.push({ label: data.department_name, value: data._id });
            });
  
            // Match and set the department for this index
            const matchingDepartment = this.department.find(
              item => item.value === res.results.empList.find((data: any) => data.toDepartmentId)?.toDepartmentId
            );
            if (matchingDepartment) {
              console.log("matchingDepartment",matchingDepartment);
              officerGroup.get('department')?.setValue(matchingDepartment.label);
            }
          });
  
          // Fetch designation data
          this.ltcService.getDesignations().subscribe((designationRes: any) => {
            designationRes.results.forEach((data: any) => {
              this.designation.push({ label: data.designation_name, value: data._id });
            });
  
            // Match and set the designation for this index
            const matchingDesignation = this.designation.find(
              item => item.value === res.results.empList.find((data: any) => data.toDesignationId)?.toDesignationId
            );
            if (matchingDesignation) {
              console.log("matchingDesignation",matchingDesignation)
              officerGroup.get('designation')?.setValue(matchingDesignation.label);
            }
          });
        });
      });
    } else {
      console.error(`Index ${index} does not exist in OtherOfficers array.`);
    }
  }
  

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.ltcForm.patchValue({ orderFIle: this.selectedFile });
    }
    this.selectedFile = event.target.files[0];
    this.ltcForm.get('orderFIle')?.setValue(this.selectedFile);
    if (this.selectedFile) {
      if (this.selectedFile.type !== 'application/pdf') {
        this.ltcForm.get('orderFIle')?.setErrors({ 'incorrectFileType': true });
        return;
      }

      if (this.selectedFile.size > 5 * 1024 * 1024) { // 5MB in bytes
        this.ltcForm.get('orderFIle')?.setErrors({ 'maxSize': true });
        return;
      }

      this.ltcForm.get('orderFIle')?.setErrors(null);
    }
  }

  onKeyDown(event: KeyboardEvent) {
    const key = event.key;
    if (!((key >= '0' && key <= '9') ||
      ['Backspace', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight'].includes(key))) {
      event.preventDefault();
    }
  }

  onSubmit(): void {
    this.submitted = true;
    console.log("(this.ltcForm.valid",this.ltcForm.value)
    if (this.ltcForm.valid) {
      const formData = new FormData();
      const formValues = this.ltcForm.value;
      for (const key in formValues) {
        if (formValues.hasOwnProperty(key) && key !== 'orderFIle') {
          formData.append(key, formValues[key]);
        }
      }
      if (this.selectedFile) {
        formData.append('orderFIle', this.selectedFile);
      }
      this.module = "Leave Travel Concession";
      this.ltcService.uploadAdd(formData,'addOfficersTour').subscribe(
        response => {
          alert(response.message);
          this.router.navigateByUrl('officer-tour');
          // console.log('API Response:', response);
        },
        error => {
          console.error('API Error:', error);
        }
      );
    }
  }

  get_states() {
    this.ltcService.uploadGet('getState').subscribe((res: any) => {
      this.states = res.results;
    })
  }
  select_discrict(event: Event){
    const selectedStateId = (event.target as HTMLSelectElement).value;
    this.ltcForm.get('districtId')?.setValue(selectedStateId);
  }

  get_disctricts(event: Event) {
    const selectedStateId = (event.target as HTMLSelectElement).value;
    this.ltcForm.get('stateId')?.setValue(selectedStateId);
    this.ltcService.uploadGet(`getDistrict?stateId=${selectedStateId}`).subscribe((res: any) => {
      this.disctricts = res.results;
    })
  }
  get listofemployees() {
    return this.ltcForm.get('OtherOfficers') as FormArray;
  }
  addRow() {
    const newRow = this.fb.group({
      officerName: [''],
      department: [''],
      designation: [''],
    });
    (this.ltcForm.get('OtherOfficers') as FormArray).push(newRow);
    const qualifications = this.ltcForm.get('OtherOfficers') as FormArray;
    this.row.push({});
  }

  createRow() {
    return this.fb.group({
      officerName: [''],
      department: [''],
      designation: [''],
    });
  }
  removeRow(index: number) {
    if (index !== 0) {
      const qualifications = this.ltcForm.get('OtherOfficers') as FormArray;
      qualifications.removeAt(index);
      this.row.splice(index, 1);
    }
  }
}
