import { AfterViewInit, Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LeaveTransferService } from '../../forms/forms.service';
import { isPlatformBrowser } from '@angular/common';
import { forkJoin } from 'rxjs';
import { CommonService } from '../../shared-services/common.service';

@Component({
  selector: 'app-create-posting',
  templateUrl: './create-posting.component.html',
  styleUrl: './create-posting.component.css'
})
export class CreatePostingComponent implements AfterViewInit {
  previousPostingForm!: FormGroup;
  submitted: boolean = false;
  postingIn: any[] = [];
  department: any[] = [];
  designation: any[] = [];
  toDepartment: any[] = [];
  toDesignation: any[] = [];
  options: string[] = [];
  filteredOptions: any[] = [];
  showDropdown = false;
  selectedOption: string = '';
  selectedEmpOption: string = '';
  empProfileId: string = '';
  phone: string = '';
  employeeId: string = '';
  submittedBy: any;
  ifuserlogin = false;
  userdata: any;
  row: any[] = [{}];
  

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private fb: FormBuilder, private router: Router, private previousPosting: LeaveTransferService, private routes: ActivatedRoute, private cs: CommonService) {
    
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
          this.previousPostingForm.controls['fullName'].setValue(this.userdata.fullName);
          this.previousPostingForm.controls['fullName'].disable(); // Properly disables the control
          this.previousPostingForm.controls['employeeId'].setValue(this.userdata.employeeId);
          this.previousPostingForm.controls['employeeId'].disable(); // Properly disables the control
          // console.log(this.userdata);
        }
      });
    }
  }
  

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.submittedBy = localStorage.getItem('loginId');
    }
    
    this.previousPostingForm = this.fb.group({
      fullName: ['',Validators.required],
      empProfileId: ['',Validators.required],
      previousPostingList: this.fb.array([this.createRow()]), 
      updateType: ['Previous'],
      submittedBy: [this.submittedBy]
    });
    this.previousPosting.getData().subscribe((res: any[]) => {
      res.forEach((item) => {
        if (item.category_type == "posting_in") {
          this.postingIn.push({ label: item.category_name, value: item._id });
        }
      });

    });
  }

  get previousPostingFormArray(): FormArray {
    return this.previousPostingForm.get('previousPostingList') as FormArray;
  }

  // Method to create a new row (form group)
  createRow(): FormGroup {
    return this.fb.group({
      toPostingInCategoryCode: ['',Validators.required],
      toDepartmentId: ['',Validators.required],
      toDesignationId: ['',Validators.required],
      fromDate: ['',Validators.required],
      toDate: [''],
      district: ['',Validators.required]
    });
  }

  // Add a new row (form group) to the form array
  addRow(): void {
    const newRow = this.createRow();
    this.previousPostingFormArray.push(newRow);
  }

  // Remove a row (form group) from the form array
  removeRow(index: number): void {
    if (this.previousPostingFormArray.length > 1) {
      this.previousPostingFormArray.removeAt(index);
    }
  }

  
  // toGetDepartment(event: any) {
  //   this.toDepartment = [];
  //   this.previousPosting.getData().subscribe((res: any[]) => {
  //     res.forEach((item) => {
  //       if (event.target.value == item._id) {
  //         this.previousPosting.getDepartmentData().subscribe((res: any[]) => {
  //           res.filter((data: any) => {
  //             if (item.category_code == data.category_code) {
  //               this.toDepartment.push({ label: data.department_name, value: data._id });
  //             }
  //           });
  //         })
  //       }
  //     });
  //   })
  // }

  // toGetDesignation(event: any) {
  //   this.toDesignation = [];
  //   this.previousPosting.getDepartmentData().subscribe((res: any[]) => {
  //     res.forEach((item) => {
  //       if (event.target.value == item._id) {
  //         this.previousPosting.getDesignations().subscribe((res: any) => {
  //           res.results.filter((data: any) => {
  //             if (item.category_code == data.category_code) {
  //               this.toDesignation.push({ label: data.designation_name, value: data._id });
  //               // this.designation = []; 
  //             }
  //           })
  //         })
  //       }
  //     });
  //   });
  // }

  toGetDepartment(event: any, index: number) {
    const selectedPostingInId = event.target.value;
    const departmentControl = this.previousPostingFormArray.controls[index].get('toDepartmentId');
    departmentControl?.setValue('');
    const designationControl = this.previousPostingFormArray.controls[index].get('toDesignationId');
    designationControl?.setValue('');
    this.previousPosting.getData().subscribe((res: any[]) => {
      res.forEach((item) => {
        if (selectedPostingInId === item._id) {
          this.previousPosting.getDepartmentData().subscribe((departmentData: any[]) => {
            const departments = departmentData.filter((data: any) => data.category_code === item.category_code);
              this.toDepartment[index] = departments.map((data) => ({
              label: data.department_name, 
              value: data._id
            }));
          });
        }
      });
    });
}

toGetDesignation(event: any, index: number) {
    const selectedDepartmentId = event.target.value;
    const designationControl = this.previousPostingFormArray.controls[index].get('toDesignationId');

    // Clear the previous designation list
    designationControl?.setValue(''); // Clear designation field if department changes

    this.previousPosting.getDepartmentData().subscribe((res: any[]) => {
      res.forEach((item) => {
        if (selectedDepartmentId === item._id) {
          this.previousPosting.getDesignations().subscribe((designationData: any) => {
            const designations = designationData.results.filter((data: any) => data.category_code === item.category_code);
            
            // Set the designation options for this row
            this.toDesignation[index] = designations.map((data:any) => ({
              label: data.designation_name, 
              value: data._id
            }));
          });
        }
      });
    });
}


  onInput(event: any, field: string) {
    const inputValue = event.target.value.trim();
    let mergedOptions: { name: string, id: string, empProfileId: any }[] = [];
    this.previousPosting.getEmployeeList().subscribe((res: any) => {
      res.results.forEach((item: any) => {
        const name: string = item.fullName;
        const id: string = item.employeeId;
        const empProfileId: any = item._id;
        console.log(name,id,empProfileId);
        mergedOptions.push({ name, id, empProfileId });
      });
      if (field === 'fullName') {
        this.filteredOptions = mergedOptions.filter((option: { name: string, id: string }) =>
          option.name && option.name.toLowerCase().includes(inputValue.toLowerCase())
        );
      } else if (field === 'empProfileId') {
        this.filteredOptions = mergedOptions.filter((option: { name: string, id: string }) => option.id.includes(inputValue));
      }
      if (this.filteredOptions.length === 0) {
        this.showDropdown = false;
        this.previousPostingForm.get('fullName')?.setValue('');
        this.previousPostingForm.get('empProfileId')?.setValue('');
      } else {
        this.showDropdown = true;
      }
    });
  }

 
  selectOption(option: any) {
    this.selectedOption = option.name;
    this.selectedEmpOption = option.id;
    this.empProfileId = option.empProfileId;
    console.log(option);
    this.previousPostingForm.get('fullName')?.setValue(this.selectedOption);
    this.previousPostingForm.get('empProfileId')?.setValue(this.selectedEmpOption);
    this.showDropdown = false;
  }

  onSubmit(): void {
    this.submitted = true;
  
    if (this.previousPostingForm.valid) {
      // Create the payload object in the required format
      const formValue = this.previousPostingForm.value;
      const payload = {
        updateType: 'Previous',
        empProfileId: this.empProfileId, // Assuming empProfileId is part of the form
        previousPostingList: formValue.previousPostingList.map((row:any) => ({
          toPostingInCategoryCode: row.toPostingInCategoryCode,
          toDepartmentId: row.toDepartmentId,
          toDesignationId: row.toDesignationId,
          fromDate: row.fromDate,
          toDate: row.toDate,
          district: row.district
        })),
        submittedBy: formValue.submittedBy // Assuming submittedBy is part of the form
      };
  
      // Log the payload for debugging
      console.log('Payload:', payload);
  
      // Now send the payload as a JSON object to the backend
      this.previousPosting.addPreviousPosting(payload).subscribe(
        (response: any) => {
          alert(response.message);
          this.previousPostingForm.reset();
          this.router.navigate(['previous-posting']);
          console.log('API Response:', response);
        },
        error => {
          console.error('API Error:', error);
          alert(error.message);
        }
      );
    } else {
      console.log(this.previousPostingForm.value);
    }
  }
  
  

}
