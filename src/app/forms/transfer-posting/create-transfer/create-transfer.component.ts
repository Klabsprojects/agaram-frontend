import { Component, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { LeaveTransferService } from '../../forms.service';
import { isPlatformBrowser } from '@angular/common';
import { CommonService } from '../../../shared-services/common.service';
@Component({
  selector: 'app-create-transfer',
  templateUrl: './create-transfer.component.html',
  styleUrl: './create-transfer.component.css'
})
export class CreateTransferComponent implements AfterViewInit {
  transferForm!: FormGroup;
  submitted: boolean = false;
  showAdditionalCharge: boolean = false;
  orderType: any[] = [];
  orderFor: any[] = [];
  postingIn: any[] = [];
  postType: any[] = [];
  promotionGrade: any[] = [];
  locationChange: any[] = [];
  department: any[] = [];
  designation: any[] = [];
  toDepartment: any[] = [];
  toDesignation: any[] = [];
  selectedItem: any;
  options: string[] = [];
  filteredOptions: any[] = [];
  filteredEmpOptions: string[] = [];
  showDropdown = false;
  selectedOption: string = '';
  selectedEmpOption: string = '';
  showEmpDropdown = false;
  removedItems: boolean = false;
  showFrom: boolean = false;
  empProfileId: string = '';
  phone: string = '';
  module: string = '';
  employeeId: string = '';
  fromPostingIn: string = '';
  fromDepartment: string = '';
  fromDesignation: string = '';
  fromPostingInId: string = '';
  fromDepartmentId: string = '';
  fromDesignationId: string = '';
  selectedOfficers: any[] = [];
  selectedOfficersDetails: any[] = [];
  showValidationError = false;
  showTable = false;
  officer: any;
  transferFormValue: any;
  selectedFile: File | null = null;
  submittedBy: any;

  ifuserlogin = false;
  userdata: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private fb: FormBuilder, private router: Router, private leaveTransfer: LeaveTransferService, private routes: ActivatedRoute, private cs: CommonService) {
  }

  ngAfterViewInit(): void {
    if (localStorage.getItem('loginAs') == 'Officer') {
      this.cs.data$.subscribe((data: any) => {
        if (data) {
          this.userdata = data;
          this.ifuserlogin = true;
          this.selectedOption = this.userdata.fullName;
          this.selectedEmpOption = this.userdata.employeeId;
  
          // Set the value and disable the control
          this.transferForm.controls['fullName'].setValue(this.userdata.fullName);
          this.transferForm.controls['fullName'].disable(); // Properly disables the control
          this.transferForm.controls['employeeId'].setValue(this.userdata.employeeId);
          this.transferForm.controls['employeeId'].disable(); // Properly disables the control
          // console.log(this.userdata);
        }
      });
    }
  }
  

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.submittedBy = localStorage.getItem('loginId');
    }
    this.transferForm = this.fb.group({
      fullName: [''],
      employeeId: [''],
      orderTypeCategoryCode: ['', Validators.required],
      orderNumber: ['', Validators.required],
      orderForCategoryCode: ['', Validators.required],
      dateOfOrder: ['', Validators.required],
      additionalCharge: [''],
      toPostingInCategoryCode: [''],
      toDepartmentId: [''],
      toDesignationId: [''],
      postTypeCategoryCode: [''],
      locationChangeCategoryId: [''],
      orderFile: [null, Validators.required],
      remarks: [''],
    });

    this.leaveTransfer.getData().subscribe((res: any[]) => {
      res.forEach((item) => {
        if (item.category_type == "order_type") {
          this.orderType.push({ label: item.category_name, value: item._id });
        }
        if (item.category_type == "order_for") {
          this.orderFor.push({ label: item.category_name, value: item._id });
        }
        if (item.category_type == "posting_in") {
          this.postingIn.push({ label: item.category_name, value: item._id });
        }
        if (item.category_type == "post_type") {
          this.postType.push({ label: item.category_name, value: item._id });
        }
        if (item.category_type === "promotion_grade") {
          this.promotionGrade.push({ label: item.category_name, value: item._id });
        }
        if (item.category_type == "location_change") {
          this.locationChange.push({ label: item.category_name, value: item._id });
        }
      });

    });
  }

  changeOrderFor(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedText = target.options[target.selectedIndex].text;
    if (selectedText == "Additional Charge" || selectedText == "Full Additional Charge") {
      this.showAdditionalCharge = true;
    }
    else {
      this.showAdditionalCharge = false;
    }
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.transferForm.patchValue({ orderFile: this.selectedFile });
    }
    this.selectedFile = event.target.files[0];
    this.transferForm.get('orderFile')?.setValue(this.selectedFile);
    if (this.selectedFile) {
      if (this.selectedFile.type !== 'application/pdf') {
        this.transferForm.get('orderFile')?.setErrors({ 'incorrectFileType': true });
        return;
      }

      if (this.selectedFile.size > 5 * 1024 * 1024) { // 5MB in bytes
        this.transferForm.get('orderFile')?.setErrors({ 'maxSize': true });
        return;
      }

      this.transferForm.get('orderFile')?.setErrors(null);
    }
  }


  toGetDepartment(event: any) {
    this.toDepartment = [];
    this.leaveTransfer.getData().subscribe((res: any[]) => {
      res.forEach((item) => {
        if (event.target.value == item._id) {
          this.leaveTransfer.getDepartmentData().subscribe((res: any[]) => {
            res.filter((data: any) => {
              if (item.category_code == data.category_code) {
                this.toDepartment.push({ label: data.department_name, value: data._id });
              }
            });
          })
        }
      });
    })
  }


  getDesignation(event: any) {
    this.designation = [];
    this.leaveTransfer.getDepartmentData().subscribe((res: any[]) => {
      res.forEach((item) => {
        if (event.target.value == item._id) {
          this.leaveTransfer.getDesignations().subscribe((res: any) => {
            res.results.filter((data: any) => {
              if (item.category_code == data.category_code) {
                this.designation.push({ label: data.designation_name, value: data._id });
                // this.designation = [];
              }
            })
          })
        }
      });
    });
  }

  toGetDesignation(event: any) {
    this.toDesignation = [];
    this.leaveTransfer.getDepartmentData().subscribe((res: any[]) => {
      res.forEach((item) => {
        if (event.target.value == item._id) {
          this.leaveTransfer.getDesignations().subscribe((res: any) => {
            res.results.filter((data: any) => {
              if (item.category_code == data.category_code) {
                this.toDesignation.push({ label: data.designation_name, value: data._id });
                // this.designation = [];
              }
            })
          })
        }
      });
    });
  }


  onInput(event: any, field: string) {
    const inputValue = event.target.value.trim();
    let mergedOptions: { name: string, id: string, empProfileId: any, mobileNo: any }[] = [];
    this.leaveTransfer.getEmployeeList().subscribe((res: any) => {
      res.results.forEach((item: any) => {
        const name: string = item.fullName;
        const id: string = item.employeeId;
        const empProfileId: any = item._id;
        const mobileNo: any = item.mobileNo1;
        mergedOptions.push({ name, id, empProfileId, mobileNo });
      });
      if (field === 'fullName') {
        // this.filteredOptions = mergedOptions.filter((option: { name: string, id: string }) => option.name.toLowerCase().includes(inputValue.toLowerCase()));
        this.filteredOptions = mergedOptions.filter((option: { name: string, id: string }) =>
          option.name && option.name.toLowerCase().includes(inputValue.toLowerCase())
        );
      } else if (field === 'empId') {
        this.filteredOptions = mergedOptions.filter((option: { name: string, id: string }) => option.id.includes(inputValue));
      }
      if (this.filteredOptions.length === 0) {
        this.showDropdown = false;
        this.transferForm.get('fullName')?.setValue('');
        this.transferForm.get('empId')?.setValue('');
      } else {
        this.showDropdown = true;
      }
    });
  }

  onKeyDown(event: KeyboardEvent) {
    // const key = event.key;
    // if (!((key >= '0' && key <= '9') || 
    //       ['Backspace', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight'].includes(key))) {
    //   event.preventDefault();
    // }
  }


  selectOption(option: any) {
    this.selectedOption = option.name;
    this.selectedEmpOption = option.id;
    this.empProfileId = option.empProfileId;
    this.employeeId = option.id;
    this.phone = "+91" + option.mobileNo;

    this.leaveTransfer.getEmployeeCurrentPosting(option.empProfileId).subscribe((res: any) => {
      if (res.results.length === 0) {
        this.fromPostingIn = "-";
        this.fromDepartment = "-";
        this.fromDesignation = "-";
        return;
      }
      res.results.forEach((ele: any) => {
        console.log(ele);
        if (ele.employeeHistory && ele.employeeHistory.transferOrPostingEmployeesList) {
          forkJoin([
            this.leaveTransfer.getDepartmentData(),
            this.leaveTransfer.getDesignations()
          ]).subscribe(([departments, designations]) => {
            const department = departments.find((data: any) => data._id === ele.employeeHistory.transferOrPostingEmployeesList.toDepartmentId);
            const designation = designations.results.find((data: any) => data._id === ele.employeeHistory.transferOrPostingEmployeesList.toDesignationId);
            const postingIn = this.postingIn.find((data: any) => data.value === ele.employeeHistory.transferOrPostingEmployeesList.toPostingInCategoryCode);

            this.fromPostingIn = postingIn ? postingIn.label : "-";
            this.fromDepartment = department ? department.department_name : "-";
            this.fromDesignation = designation ? designation.designation_name : "-";

            this.fromPostingInId = postingIn ? postingIn.value : null;
            this.fromDepartmentId = department ? department._id : null;
            this.fromDesignationId = designation ? designation._id : null;
          });
        } else {
          this.fromPostingIn = "-";
          this.fromDepartment = "-";
          this.fromDesignation = "-";
        }
      });

    });


    this.transferForm.get('fullName')?.setValue(this.selectedOption);
    this.transferForm.get('empId')?.setValue(this.selectedEmpOption);
    this.showDropdown = false;
  }

  onEmpId(data: any) {
    const inputValue = data.target.value.toLowerCase();
    let mergedOptions: string[] = [];
    this.leaveTransfer.getEmployeeList().subscribe((res: any) => {
      res.results.forEach((item: any) => {
        console.log(item.employeeId);
        const empId: string[] = item.employeeId;
        mergedOptions = mergedOptions.concat(empId);


        this.filteredEmpOptions = mergedOptions.filter((option: string) => option.toLowerCase().includes(inputValue));
        this.showEmpDropdown = true;
        const selectedOption = mergedOptions.find((option: string) => option.toLowerCase() === inputValue);
        if (selectedOption) {
          this.selectEmpOption(selectedOption);
          console.log(item.employeeId);
        }
      });
    });
  }

  selectEmpOption(option: string) {
    this.selectedEmpOption = option;
    this.showEmpDropdown = false;
  }

  addOfficer() {
    console.log('this.transferForm.get.value',this.transferForm.get('fullName')?.value)

    if (this.transferForm.get('fullName')?.value != '' &&
      this.transferForm.get('toPostingInCategoryCode')?.value != '' &&
      this.transferForm.get('toDepartmentId')?.value != '' &&
      this.transferForm.get('toDesignationId')?.value != '' &&
      this.transferForm.get('postTypeCategoryCode')?.value != '' &&
      this.transferForm.get('locationChangeCategoryId')?.value != '') {

      this.showTable = true;

      const selectedToPostingIn = this.postingIn.find((pos: any) => pos.value === this.transferForm.get('toPostingInCategoryCode')?.value)?.label;
      const selectedToDepartment = this.toDepartment.find((dept: any) => dept.value === this.transferForm.get('toDepartmentId')?.value)?.label;
      const selectedToDesignation = this.toDesignation.find((des: any) => des.value === this.transferForm.get('toDesignationId')?.value)?.label;
      const selectedPostType = this.postType.find((post: any) => post.value === this.transferForm.get('postTypeCategoryCode')?.value)?.label;
      const selectedLocationChange = this.locationChange.find((loc: any) => loc.value === this.transferForm.get('locationChangeCategoryId')?.value)?.label;

      const selectedToPostingInValue = this.postingIn.find((pos: any) => pos.value === this.transferForm.get('toPostingInCategoryCode')?.value)?.value;
      const selectedToDepartmentValue = this.toDepartment.find((dept: any) => dept.value === this.transferForm.get('toDepartmentId')?.value)?.value;
      const selectedToDesignationValue = this.toDesignation.find((des: any) => des.value === this.transferForm.get('toDesignationId')?.value)?.value;
      const selectedPostTypeValue = this.postType.find((post: any) => post.value === this.transferForm.get('postTypeCategoryCode')?.value)?.value;
      const selectedLocationChangeValue = this.locationChange.find((loc: any) => loc.value === this.transferForm.get('locationChangeCategoryId')?.value)?.value;

      const officerDet = {
        empProfileId: this.empProfileId,
        employeeId: this.selectedEmpOption,
        fullName: this.selectedOption,
        toPostingInCategoryCode: selectedToPostingIn,
        toDepartmentId: selectedToDepartment,
        toDesignationId: selectedToDesignation,
        postTypeCategoryCode: selectedPostType,
        locationChangeCategoryId: selectedLocationChange
      };

      if (this.fromPostingIn != '-' && this.fromDepartment != '-' && this.fromDesignation != '-') {
        this.officer = {
          empProfileId: this.empProfileId,
          employeeId: this.selectedEmpOption,
          fullName: this.selectedOption,
          fromPostingInCategoryCode: this.fromPostingInId,
          fromDepartmentId: this.fromDepartmentId,
          fromDesignationId: this.fromDesignationId,
          toPostingInCategoryCode: selectedToPostingInValue,
          toDepartmentId: selectedToDepartmentValue,
          toDesignationId: selectedToDesignationValue,
          postTypeCategoryCode: selectedPostTypeValue,
          locationChangeCategoryId: selectedLocationChangeValue,
          phone: this.phone
        };
      } else {
        this.officer = {
          empProfileId: this.empProfileId,
          employeeId: this.selectedEmpOption,
          fullName: this.selectedOption,
          toPostingInCategoryCode: selectedToPostingInValue,
          toDepartmentId: selectedToDepartmentValue,
          toDesignationId: selectedToDesignationValue,
          postTypeCategoryCode: selectedPostTypeValue,
          locationChangeCategoryId: selectedLocationChangeValue,
          phone: this.phone
        };
      }


      this.selectedOfficersDetails.push(officerDet);
      this.selectedOfficers.push(this.officer);
      //this.transferForm.reset();
      this.transferForm.get('fullName')?.setValue('');
      this.transferForm.get('employeeId')?.setValue('');
      this.transferForm.get('toPostingInCategoryCode')?.setValue('');
      this.transferForm.get('toDepartmentId')?.setValue('');
      this.transferForm.get('toDesignationId')?.setValue('');
      this.transferForm.get('postTypeCategoryCode')?.setValue('');
      this.transferForm.get('locationChangeCategoryId')?.setValue('');
      this.fromPostingIn = '';
      this.fromDepartment = '';
      this.fromDesignation = '';
    } else {
      alert("Please fill all Details");
    }
  }

  removeOfficer(index: number) {
    const confirmation = window.confirm("Are you sure you want to remove this officer?");

    if (confirmation) {
      this.selectedOfficersDetails.splice(index, 1);
      if (this.selectedOfficersDetails.length == 0) {
        this.showTable = false;
      }
    }
  }

  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }


  // onSubmit() {
  //   this.submitted = true;
  //   // console.log(this.selectedOfficers);
  //   if (this.transferForm.valid) {
  //     // for (let i = 0; i < this.selectedOfficersDetails.length; i++) {
  //     //   const officerDetails = this.selectedOfficers[i];
  //     //   const formData = new FormData();
  //     //   const formValues = this.transferForm.value;
  //     //   for (const key in formValues) {
  //     //     if (formValues.hasOwnProperty(key) && key !== 'orderFile') {
  //     //       formData.append(key, formValues[key]);
  //     //     }
  //     //   }
  //     //   if (this.selectedFile) {
  //     //     formData.append('orderFile', this.selectedFile);
  //     //   }
  //     // }
  //     // console.log(this.selectedFile);

  //     // if(this.fromPostingIn && this.fromDepartment && this.fromDepartment == '-'){
  //     //     this.transferFormValue = { 
  //     //       ...this.transferForm.value, 
  //     //       fullName: officerDetails.fullName,
  //     //       employeeId: officerDetails.employeeId,
  //     //       empProfileId : officerDetails.empProfileId,
  //     //       toDepartmentId:officerDetails.toDepartmentId,
  //     //       toDesignationId:officerDetails.toDesignationId,
  //     //       toPostingInCategoryCode:officerDetails.toPostingInCategoryCode,
  //     //       locationChangeCategoryId:officerDetails.locationChangeCategoryId,
  //     //       postTypeCategoryCode:officerDetails.postTypeCategoryCode,
  //     //       updateType:'Transfer / Posting'
  //     //   };
  //     //   console.log("if");
  //     // }


  //       const formData = new FormData();
  //       this.transferFormValue = { 
  //         updateType:'Transfer / Posting', 
  //         module:'Transfer / Posting',
  //         orderFile:this.selectedFile,
  //         orderTypeCategoryCode:this.transferForm.get('orderTypeCategoryCode')?.value,
  //         orderNumber:this.transferForm.get('orderNumber')?.value,
  //         orderForCategoryCode:this.transferForm.get('orderForCategoryCode')?.value,
  //         dateOfOrder:this.transferForm.get('dateOfOrder')?.value,
  //         transferOrPostingEmployeesList:this.selectedOfficers,
  //         remarks:this.transferForm.get('remarks')?.value,
  //       };
  //       const formValues = this.transferFormValue;
  //       for (const key in formValues) {
  //         if (formValues.hasOwnProperty(key) && key !== 'orderFile') {
  //           formData.append(key, formValues[key]);
  //         }
  //       }
  //       if (this.selectedFile) {
  //         formData.append('orderFile', this.selectedFile);
  //       }
  //       console.log(formData);
  //       this.leaveTransfer.transferPosting(formData).subscribe(res => {
  //         console.log(res.results);
  //         alert("Created Successfully");
  //         this.router.navigateByUrl('transfer-posting');
  //     }, error => {
  //         console.log(error.error);
  //     });
  //     }
  // }  


  onSubmit(): void {
    this.submitted = true;
    if (this.transferForm.valid) {
      const formData = new FormData();
      const formValues = this.transferForm.value;
      delete formValues.fullName;
      delete formValues.employeeId;
      delete formValues.toPostingInCategoryCode;
      delete formValues.toDepartmentId;
      delete formValues.toDesignationId;
      delete formValues.postTypeCategoryCode;
      delete formValues.locationChangeCategoryId;
      delete formValues.orderForCategoryCode;
      delete formValues.orderTypeCategoryCode;
      delete formValues.orderNumber;
      delete formValues.dateOfOrder;
      delete formValues.remarks;
      this.transferFormValue = {
        // updateType: 'Transfer / Posting', 
        // module: 'Transfer / Posting',
        // orderTypeCategoryCode: this.transferForm.get('orderTypeCategoryCode')?.value,
        // orderNumber: this.transferForm.get('orderNumber')?.value,
        // orderForCategoryCode: this.transferForm.get('orderForCategoryCode')?.value,
        // dateOfOrder: this.transferForm.get('dateOfOrder')?.value,
        // transferOrPostingEmployeesList: this.selectedOfficers,
        // remarks: this.transferForm.get('remarks')?.value,
        ...this.transferForm.value

      };
      for (const key in formValues) {
        if (formValues.hasOwnProperty(key) && key !== 'orderFile') {
          formData.append(key, JSON.stringify(formValues[key]));
        }
      }
      if (this.selectedFile) {
        formData.append('orderFile', this.selectedFile);
      }

      formData.append('orderTypeCategoryCode', this.transferForm.get('orderTypeCategoryCode')?.value);
      formData.append('orderNumber', this.transferForm.get('orderNumber')?.value);
      formData.append('orderForCategoryCode', this.transferForm.get('orderForCategoryCode')?.value);
      formData.append('dateOfOrder', this.transferForm.get('dateOfOrder')?.value);
      formData.append('remarks', this.transferForm.get('remarks')?.value);
      formData.append('transferOrPostingEmployeesList', JSON.stringify(this.selectedOfficers));
      formData.append('submittedBy', this.submittedBy);
      formData.append('updateType', 'Transfer / Posting');
      formData.append('module', 'Transfer / Posting');
      this.leaveTransfer.transferPosting(formData).subscribe(
        res => {
          alert("Created Successfully");
          this.router.navigateByUrl('transfer-posting');
        },
        error => {
          console.log(error.error);
        }
      );
    }
  }
}