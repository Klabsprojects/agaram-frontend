import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeaveTransferService } from '../../forms.service';
import { isPlatformBrowser } from '@angular/common';
import { CommonService } from '../../../shared-services/common.service';

@Component({
  selector: 'app-create-medical-reimbursement',
  templateUrl: './create-medical-reimbursement.component.html',
  styleUrl: './create-medical-reimbursement.component.css'
})
export class CreateMedicalReimbursementComponent implements OnInit {

  medicalForm!: FormGroup;
  submitted = false;
  selectedFile: File | null = null;
  dischargeSelectedFile: File |null =null;
  showDropdown = false;
  filteredOptions: any[] = [];
  department: any[] = [];
  designation: any[] = [];
  orderFor: any[] = [];
  orderType: any[] = [];
  selectedOption: string = '';
  employeeProfileId: string = '';
  departmentId: string = '';
  designationId: string = '';
  phone: string = '';
  module: string = '';
  submittedBy: any;
  showDischargeFile = false;

  ifuserlogin = false;
  userdata: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private fb: FormBuilder, private router: Router, private medicalService: LeaveTransferService,private cs: CommonService) { }

  ngAfterViewInit(): void {
    if (localStorage.getItem('loginAs') == 'Officer') {
      this.cs.data$.subscribe((data: any) => {
        if (data) {
          this.userdata = data;
          this.ifuserlogin = true;
          this.selectedOption = this.userdata.fullName;
  
          // Set the value and disable the control
          this.medicalForm.controls['officerName'].setValue(this.userdata.fullName);
          this.medicalForm.controls['officerName'].disable(); // Properly disables the control
          this.medicalForm.controls['department'].setValue(this.userdata.department);
          this.medicalForm.controls['department'].disable(); // Properly disables the control
          this.medicalForm.controls['designation'].setValue(this.userdata.designation);
          this.medicalForm.controls['designation'].disable(); // Properly disables the control
          console.log('chk',this.userdata);
        }
      });
    }
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.submittedBy = localStorage.getItem('loginId');
    }
    this.medicalForm = this.fb.group({
      officerName: ['', Validators.required],
      department: ['', Validators.required],
      designation: ['', Validators.required],
      detailsOfMedicalReimbursement: ['', Validators.required],
      totalCostOfMedicalReimbursement: ['', Validators.required],
      dmeConcurranceStatus: ['', Validators.required],
      selfOrFamily: ['', Validators.required],
      dateOfApplication: ['', Validators.required],
      nameOfTheHospital: ['', Validators.required],
      treatmentTakenFor: ['', Validators.required],
      orderType: ['', Validators.required],
      orderNo: ['', Validators.required],
      orderFor: ['', Validators.required],
      dateOfOrder: ['', Validators.required],
      orderFile: [null, Validators.required],
      remarks: ['', Validators.required],
      dischargeSummaryEndorsed: ['', Validators.required],
      // dischargeOrTestFile: [null, Validators.required]
    });
    this.medicalService.getData().subscribe((res: any[]) => {
      res.forEach((item) => {
        if (item.category_type == "order_type") {
          this.orderType.push({ label: item.category_name, value: item._id });
        }
        if (item.category_type == "order_for") {
          this.orderFor.push({ label: item.category_name, value: item._id });
        }
      });
    });

    this.medicalForm.get('dischargeSummaryEndorsed')?.valueChanges.subscribe((value) => {
      this.showDischargeFile = value === 'yes' || value === 'others';
    });

  }


  onInput(event: any, field: string) {
    const inputValue = event.target.value.trim();
    let mergedOptions: { name: string, id: string, empProfileId: any, mobileNo: string }[] = [];
    this.medicalService.getEmployeeList().subscribe((res: any) => {
      res.results.forEach((item: any) => {
        const name: string = item.fullName;
        const id: string = item.employeeId;
        const empProfileId: any = item._id;
        const mobileNo: string = item.mobileNo1;
        mergedOptions.push({ name, id, empProfileId, mobileNo });
      });
      if (field === 'officerName') {
        this.filteredOptions = mergedOptions.filter((option: { name: string, id: string }) => option.name.toLowerCase().includes(inputValue.toLowerCase()));
      }
      if (this.filteredOptions.length === 0) {
        this.showDropdown = false;
        this.medicalForm.get('officerName')?.setValue('');
      } else {
        this.showDropdown = true;
      }
    });
  }

  selectOption(option: any) {
    const payload = { name: option.name };
    this.selectedOption = option.name;
    this.phone = "+91" + option.mobileNo;
    this.medicalForm.get('officerName')?.setValue(this.selectedOption);
    this.showDropdown = false;
    this.medicalService.employeeFilter(payload).subscribe((res: any) => {
      res.results.empList.forEach((item: any) => {
        this.employeeProfileId = item._id;
        this.medicalService.getDepartmentData().subscribe((departmentRes: any) => {
          departmentRes.filter((data: any) => {
            this.department.push({ label: data.department_name, value: data._id });
          });
          const matchingDepartment = this.department.filter(item => item.value == res.results.empList.find((data: any) => data.toDepartmentId)?.toDepartmentId);
          matchingDepartment.filter((item: any) => {
            this.departmentId = item.value;
            this.medicalForm.get('department')?.setValue(item.label)
          });
        });

        this.medicalService.getDesignations().subscribe((designationRes: any) => {
          designationRes.results.filter((data: any) => {
            this.designation.push({ label: data.designation_name, value: data._id });
          });
          const matchingDesignation = this.designation.filter(item => item.value == res.results.empList.find((data: any) => data.toDesignationId)?.toDesignationId);
          matchingDesignation.filter((item: any) => {
            this.designationId = item.value;
            this.medicalForm.get('designation')?.setValue(item.label)
          });

        });
      })
    })
  }

  onFileSelected(event: any, docfield: string) {
    
    if (docfield === 'order') {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        this.selectedFile = input.files[0];
        this.medicalForm.patchValue({ orderFile: this.selectedFile });
      }
      this.selectedFile = event.target.files[0];
      this.medicalForm.get('orderFile')?.setValue(this.selectedFile);
      if (this.selectedFile) {
        if (this.selectedFile.type !== 'application/pdf') {
          this.medicalForm.get('orderFile')?.setErrors({ 'incorrectFileType': true });
          return;
        }

        if (this.selectedFile.size > 5 * 1024 * 1024) { // 5MB in bytes
          this.medicalForm.get('orderFile')?.setErrors({ 'maxSize': true });
          return;
        }

        this.medicalForm.get('orderFile')?.setErrors(null);
      }
    } else if (docfield === 'discharge') {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        this.dischargeSelectedFile = input.files[0];
        this.medicalForm.patchValue({ dischargeOrTestFile: this.dischargeSelectedFile });
      }
      this.dischargeSelectedFile = event.target.files[0];
      this.medicalForm.get('dischargeOrTestFile')?.setValue(this.dischargeSelectedFile);
      if (this.dischargeSelectedFile) {
        if (this.dischargeSelectedFile.type !== 'application/pdf') {
          this.medicalForm.get('dischargeOrTestFile')?.setErrors({ 'incorrectFileType': true });
          return;
        }

        if (this.dischargeSelectedFile.size > 5 * 1024 * 1024) { // 5MB in bytes
          this.medicalForm.get('dischargeOrTestFile')?.setErrors({ 'maxSize': true });
          return;
        }

        this.medicalForm.get('dischargeOrTestFile')?.setErrors(null);
      }
    }
  }

  onKeyDown(event: KeyboardEvent){
    const key = event.key;
    if (!((key >= '0' && key <= '9') || 
          ['Backspace', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight'].includes(key))) {
      event.preventDefault();
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.medicalForm.valid) {
      const formData = new FormData();
      const formValues = this.medicalForm.value;
      for (const key in formValues) {
        if (formValues.hasOwnProperty(key) && key !== 'orderFile') {
          formData.append(key, formValues[key]);
        }
      }
      if (this.selectedFile) {
        formData.append('orderFile', this.selectedFile);
      }
      if(this.dischargeSelectedFile){
        formData.append('dischargeOrTestFile',this.dischargeSelectedFile);
      }
      this.module = "Medical Reimbursement";
      formData.append('employeeProfileId', this.employeeProfileId);
      formData.append('departmentId', this.departmentId);
      formData.append('designationId', this.designationId);
      formData.append('submittedBy', this.submittedBy);
      formData.append('phone', this.phone);
      formData.append('module', this.module);
      this.medicalService.createMedicalReimbursement(formData).subscribe(
        response => {
          alert(response.message);
          this.router.navigateByUrl('medical-reimbursement');
          console.log('API Response:', response);
        },
        error => {
          console.error('API Error:', error);
        }
      );
    }
  }

}
