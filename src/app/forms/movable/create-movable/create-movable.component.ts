import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveTransferService } from '../../forms.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { CommonService } from '../../../shared-services/common.service';
@Component({
  selector: 'app-create-movable',
  templateUrl: './create-movable.component.html',
  styleUrl: './create-movable.component.css'
})
export class CreateMovableComponent {

  movableForm!:FormGroup;
  submitted = false;
  showDetail = false;
  filteredOptions: any[] = [];
  showDropdown = false;
  selectedOption:string='';
  department:any[]=[];
  designation:any[]=[];
  selectedFile!:File;
  orderFor:any[]=[];
  orderType:any[]=[];
  employeeProfileId:string='';
  departmentId:string='';
  designationId:string='';
  phone:string='';
  module:string='';
  submittedBy:any;

  ifuserlogin = false;
  userdata: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private fb:FormBuilder,private movableService:LeaveTransferService,private router:Router,private cs: CommonService) { }
  ngAfterViewInit(): void {
    if (localStorage.getItem('loginAs') == 'Officer') {
      this.cs.data$.subscribe((data: any) => {
        if (data) {
          this.userdata = data;
          this.ifuserlogin = true;
          this.selectedOption = this.userdata.fullName;
  
          // Set the value and disable the control
          this.movableForm.controls['officerName'].setValue(this.userdata.fullName);
          this.movableForm.controls['officerName'].disable(); // Properly disables the control
          this.movableForm.controls['department'].setValue(this.userdata.department);
          this.movableForm.controls['department'].disable(); // Properly disables the control
          this.movableForm.controls['designation'].setValue(this.userdata.designation);
          this.movableForm.controls['designation'].disable(); // Properly disables the control
          console.log('chk',this.userdata);
        }
      });
    }
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.submittedBy = localStorage.getItem('loginId');
    }
    this.movableForm = this.fb.group({
      officerName:['',Validators.required],
      department:['',Validators.required],
      designation:['',Validators.required],
      typeOfMovableProperty:['',Validators.required],
      detailsOfMovableProperty:['',Validators.required],
      sourceOfFunding:['',Validators.required],
      totalCostOfProperty:['',Validators.required],
      boughtFromName:['',Validators.required],
      boughtFromContactNumber:['',Validators.required],
      boughtFromAddress:['',Validators.required],
      propertyShownInIpr:['',Validators.required],
      selfOrFamily:['',Validators.required],
      remarks:[''],
      movableDateOfOrder:['',Validators.required],
      orderType:['',Validators.required],
      orderNo:['',Validators.required],
      orderFor:['',Validators.required],
      dateOfOrder:['',Validators.required],
      orderFile:['',Validators.required],
      previousSanctionOrder:['',Validators.required],
    });
    this.movableService.getData().subscribe((res: any[]) => {
      res.forEach((item) => {
        if(item.category_type == "order_type"){
          this.orderType.push({label:item.category_name,value:item._id});
        }
        if (item.category_type == "order_for") {
          this.orderFor.push({ label: item.category_name, value: item._id });
        }
      });
    });
    this.viewmovable();
  }

  onInput(event: any, field: string) {
    const inputValue = event.target.value.trim();
    let mergedOptions: { name: string, id: string, empProfileId: any,mobileNo:string }[] = []; 
    this.movableService.getEmployeeList().subscribe((res: any) => {
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
        this.movableForm.get('officerName')?.setValue('');
      } else {
        this.showDropdown = true;
      }
    });
  }
  movable:any;
  viewmovable(){
    console.log("hi")
    this.movableService.getData().subscribe((res)=>{
      this.movable = res.filter((item:any) => item.category_type === "movable_type");
      console.log("movable",this.movable);
    })
  }

  selectOption(option: any) {
    const payload = {name:option.name};
    this.selectedOption = option.name;
    this.phone = "+91"+option.mobileNo;
    this.movableForm.get('officerName')?.setValue(this.selectedOption);
    this.showDropdown = false;
    this.movableService.employeeFilter(payload).subscribe((res:any)=>{
      res.results.empList.forEach((item:any)=>{
        this.employeeProfileId = item._id;
        this.movableService.getDepartmentData().subscribe((departmentRes: any) => {
          departmentRes.filter((data: any) => {
            this.department.push({ label: data.department_name, value: data._id });
          });
          const matchingDepartment = this.department.filter(item => item.value == res.results.empList.find((data:any) => data.toDepartmentId)?.toDepartmentId);
          matchingDepartment.filter((item:any)=>{
            this.departmentId = item.value;
            this.movableForm.get('department')?.setValue(item.label)
          });         
        });

        this.movableService.getDesignations().subscribe((designationRes: any) => {
          designationRes.results.filter((data: any) => {
            this.designation.push({ label: data.designation_name, value: data._id });
          });
          const matchingDesignation = this.designation.filter(item => item.value == res.results.empList.find((data:any) => data.toDesignationId)?.toDesignationId);
          matchingDesignation.filter((item:any)=>{
            this.designationId = item.value;
            this.movableForm.get('designation')?.setValue(item.label)
          });
         
        });
      })
    })
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.movableForm.patchValue({ orderFile: this.selectedFile });
    }
    this.selectedFile = event.target.files[0];
    this.movableForm.get('orderFile')?.setValue(this.selectedFile);
    if (this.selectedFile) {
      if (this.selectedFile.type !== 'application/pdf') {
        this.movableForm.get('orderFile')?.setErrors({ 'incorrectFileType': true });
        return;
      }

      if (this.selectedFile.size > 5 * 1024 * 1024) { // 5MB in bytes
        this.movableForm.get('orderFile')?.setErrors({ 'maxSize': true });
        return;
      }

      this.movableForm.get('orderFile')?.setErrors(null);
    }
  }



  inherited(event:any){
   if(event.target.value == 'Yes'){
    this.showDetail = true;
   }
   else{
    this.showDetail=false;
   }
  }

  onKeyDown(event: KeyboardEvent){
    const key = event.key;
    if (!((key >= '0' && key <= '9') || 
          ['Backspace', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight'].includes(key))) {
      event.preventDefault();
    }
  }

  onSubmit(){
    this.submitted = true;
    console.log(this.movableForm.value);
    if(this.movableForm.valid){
      const formData = new FormData();
      const formValues = this.movableForm.value;
      for (const key in formValues) {
        if (formValues.hasOwnProperty(key) && key !== 'orderFile') {
          formData.append(key, formValues[key]);
        }
      }
      if (this.selectedFile) {
        formData.append('orderFile', this.selectedFile);
      }
      this.module = "Movable Property";
      formData.append('employeeProfileId', this.employeeProfileId);
      formData.append('departmentId', this.departmentId);
      formData.append('designationId', this.designationId);
      formData.append('submittedBy',this.submittedBy);
      formData.append('phone', this.phone);
      formData.append('module', this.module);
      // console.log(formData);
      this.movableService.createMovable(formData).subscribe((res:any)=>{
        alert(res.message);
        this.router.navigateByUrl('movable');
        console.log('API Response:', res);
      },
      error => {
        console.error('API Error:', error.error);
      });
    }
  }
}
