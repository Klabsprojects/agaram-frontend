import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveTransferService } from '../../forms.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { CommonService } from '../../../shared-services/common.service';

@Component({
  selector: 'app-create-foreign-visit',
  templateUrl: './create-foreign-visit.component.html',
  styleUrls: ['./create-foreign-visit.component.css']
})
export class CreateForeignVisitComponent implements OnInit {

  foreignForm!:FormGroup;
  submitted = false;
  country:any[]=[];
  orderType:any[]=[];
  orderFor:any[]=[];
  showDropdown = false;
  filteredOptions: any[] = [];
  selectedOption: any;
  policalFileSelected:File | null = null;
  fcraFileSelected:File | null = null;
  orderfileSelected: File | null = null;
  invitationfileselected: File | null = null;
  department:any[]=[];
  designation:any[]=[];
  employeeProfileId:string='';
  departmentId : string = '';
  designationId:string='';
  showRejection = false;
  phone:string='';
  module:string='';
  submittedBy:any;
  fromValue:any;
  toDateValue:boolean=true;
  invitationEndorsed:string[]=['yes','no'];
  showInvitation=false;

  ifuserlogin = false;
  userdata: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private router:Router, private fb:FormBuilder, private foreignVisitService:LeaveTransferService,private cs: CommonService) { }


  
  ngAfterViewInit(): void {
    if (localStorage.getItem('loginAs') == 'Officer') {
      this.cs.data$.subscribe((data: any) => {
        if (data) {
          this.userdata = data;
          this.ifuserlogin = true;
          this.selectedOption = this.userdata.fullName;
  
          // Set the value and disable the control
          this.foreignForm.controls['officerName'].setValue(this.userdata.fullName);
          this.foreignForm.controls['officerName'].disable(); // Properly disables the control
          this.foreignForm.controls['department'].setValue(this.userdata.department);
          this.foreignForm.controls['department'].disable(); // Properly disables the control
          this.foreignForm.controls['designation'].setValue(this.userdata.designation);
          this.foreignForm.controls['designation'].disable(); // Properly disables the control
          console.log('chk',this.userdata);
        }
      });
    }
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.submittedBy = localStorage.getItem('loginId');
      }

      this.foreignVisitService.getData().subscribe((res)=>{
        res.filter((item:any)=>{
         if(item.category_type=="country"){
           this.country.push({label:item.category_name,value:item._id});
         }
        })
       })

    this.foreignForm = this.fb.group({
      officerName:['',Validators.required],
      department:['',Validators.required],
      designation:['',Validators.required],
      proposedCountry:['',Validators.required],
      fromDate:['',Validators.required],
      toDate:['',Validators.required],
      otherDelegates:['',Validators.required],
      presentStatus:[''],
      rejectReason:[''],
      faxMessageLetterNo:['',Validators.required],
      dateOfOrderofFaxMessage:['',Validators.required],
      fundsSanctionedBy:['',Validators.required],
      politicalClearance:[null],
      fcraClearance:[null],
      fundsSanctioned:['',Validators.required],
      orderType:['',Validators.required],
      orderNo:['',Validators.required],
      orderFor:['',Validators.required],
      dateOfOrder:['',Validators.required],
      orderFile:[null],
      invitingAuthority:['',Validators.required],
      invitationEndorsed:['',Validators.required]
  });
  
  this.foreignVisitService.getData().subscribe((res: any[]) => {
    res.forEach((item) => {
      if(item.category_type == "order_type"){
        this.orderType.push({label:item.category_name,value:item._id});
      }
      if (item.category_type == "order_for") {
        this.orderFor.push({ label: item.category_name, value: item._id });
      }
    });
  });

  this.foreignForm.get('invitationEndorsed')?.valueChanges.subscribe((value)=>{
    this.showInvitation = value === 'yes' || value === 'others';
  })
  
  }


  fromDateValue(data:any){
    this.fromValue = data.target.value;
    if(this.foreignForm.get('toDate')?.value < this.fromValue || this.foreignForm.get('fromDate')?.value == ''){
      this.foreignForm.get('toDate')?.setValue('');
      this.toDateValue = true;
    }
    if(this.fromValue){
      this.toDateValue = false;
    }
  }

  onInput(event: any, field: string) {
    const inputValue = event.target.value.trim();
    let mergedOptions: { name: string, id: string, empProfileId: any,mobileNo:string }[] = []; 
    this.foreignVisitService.getEmployeeList().subscribe((res: any) => {
      res.results.forEach((item: any) => {
        const name: string = item.fullName;
        const id: string = item.employeeId;
        const mobileNo = item.mobileNo1;
        const empProfileId: any = item._id;
        mergedOptions.push({ name, id, empProfileId,mobileNo });
      });
      // if (field === 'officerName') {
      //   this.filteredOptions = mergedOptions.filter((option: { name: string, id: string }) => option.name.toLowerCase().includes(inputValue.toLowerCase()));
  
      // } 
      if (field === 'officerName' && mergedOptions) {
        this.filteredOptions = mergedOptions.filter((option: { name: string, id: string }) =>
          option.name && option.name.toLowerCase().includes(inputValue?.toLowerCase() || '')
        );
      }
      
      if (this.filteredOptions.length === 0) {
        this.showDropdown = false;
        this.foreignForm.get('officerName')?.setValue('');
      } else {
        this.showDropdown = true;
      }
    });
  }

  selectOption(option: any) {
    const payload = {name:option.name};
    this.selectedOption = option.name;
    this.phone = "+91"+option.mobileNo;
    this.foreignForm.get('officerName')?.setValue(this.selectedOption);
    this.showDropdown = false;
    this.foreignVisitService.employeeFilter(payload).subscribe((res:any)=>{
      res.results.empList.forEach((item:any)=>{
        this.employeeProfileId = item._id;
        this.foreignVisitService.getDepartmentData().subscribe((departmentRes: any) => {
          departmentRes.filter((data: any) => {
            this.department.push({ label: data.department_name, value: data._id });
          });
          const matchingDepartment = this.department.filter(item => item.value == res.results.empList.find((data:any) => data.toDepartmentId)?.toDepartmentId);
         matchingDepartment.filter((item:any)=>{
          this.departmentId = item.value;
            this.foreignForm.get('department')?.setValue(item.label)
          });
         
        });

        this.foreignVisitService.getDesignations().subscribe((designationRes: any) => {
          designationRes.results.filter((data: any) => {
            this.designation.push({ label: data.designation_name, value: data._id });
          });
          const matchingDesignation = this.designation.filter(item => item.value == res.results.empList.find((data:any) => data.toDesignationId)?.toDesignationId);
          matchingDesignation.filter((item:any)=>{
            this.designationId = item.value;
            this.foreignForm.get('designation')?.setValue(item.label)
          });
         
        });
      })
    })
  }

  politicalClearanceSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.policalFileSelected = input.files[0];
      this.foreignForm.patchValue({ politicalClearance: this.policalFileSelected });
    }
    this.policalFileSelected = event.target.files[0];
    if (this.policalFileSelected) {
      if (this.policalFileSelected.type !== 'application/pdf') {
        this.foreignForm.get('politicalClearance')?.setErrors({ 'incorrectFileType': true });
        return;
      }
      // if (this.policalFileSelected.size > 5 * 1024 * 1024) { 
      //   this.foreignForm.get('politicalClearance')?.setErrors({ 'maxSize': true });
      //   return;
      // }
      this.foreignForm.get('politicalClearance')?.setErrors(null);
    }
  }


  fcraClearanceSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fcraFileSelected = input.files[0];
      this.foreignForm.patchValue({ fcraClearance: this.fcraFileSelected });
    }
    this.fcraFileSelected = event.target.files[0];
    if (this.fcraFileSelected) {
      if (this.fcraFileSelected.type !== 'application/pdf') {
        this.foreignForm.get('fcraClearance')?.setErrors({ 'incorrectFileType': true });
        return;
      }
      // if (this.fcraFileSelected.size > 5 * 1024 * 1024) { 
      //   this.foreignForm.get('fcraClearance')?.setErrors({ 'maxSize': true });
      //   return;
      // }
      this.foreignForm.get('fcraClearance')?.setErrors(null);
    }
  }

  orderFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.orderfileSelected = input.files[0];
      this.foreignForm.patchValue({ orderFile: this.orderfileSelected });
    }
    this.orderfileSelected = event.target.files[0];
    if (this.orderfileSelected) {
      if (this.orderfileSelected.type !== 'application/pdf') {
        this.foreignForm.get('orderFile')?.setErrors({ 'incorrectFileType': true });
        return;
      }
      // if (this.orderfileSelected.size > 5 * 1024 * 1024) { 
      //   this.foreignForm.get('orderFile')?.setErrors({ 'maxSize': true });
      //   return;
      // }
      this.foreignForm.get('orderFile')?.setErrors(null);
    }
  }

  invitationselected(event:any){
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.invitationfileselected = input.files[0];
      this.foreignForm.patchValue({ orderFile: this.invitationfileselected });
    }
    this.invitationfileselected = event.target.files[0];
    if (this.invitationfileselected) {
      if (this.invitationfileselected.type !== 'application/pdf') {
        this.foreignForm.get('invitationFile')?.setErrors({ 'incorrectFileType': true });
        return;
      }
      // if (this.invitationfileselected.size > 5 * 1024 * 1024) { 
      //   this.foreignForm.get('invitationFile')?.setErrors({ 'maxSize': true });
      //   return;
      // }
      this.foreignForm.get('invitationFile')?.setErrors(null);
    }
    console.log("invitationfileselected",this.invitationfileselected)
  }

  statusText(event:any){
    if(event.target.value == "Rejected"){
      this.showRejection = true;
    }
    else{
      this.showRejection = false;
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
    console.log(this.foreignForm);
    if(this.foreignForm.valid){
      const formData = new FormData();
      const formValues = this.foreignForm.value;
      for (const key in formValues) {
        if (formValues.hasOwnProperty(key) && key !== 'orderFile' && key !=='politicalClearance' && key !=='fcraClearance') {
          formData.append(key, formValues[key]);
        }
      }
      if (this.policalFileSelected) {
        formData.append('politicalClearance', this.policalFileSelected);
      }
      if (this.fcraFileSelected) {
        formData.append('fcraClearance', this.fcraFileSelected);
      }
      if (this.orderfileSelected) {
        formData.append('orderFile', this.orderfileSelected);
      }
      if(this.invitationfileselected){
        formData.append('invitationFile',this.invitationfileselected)
      }
      this.module = 'Foreign Visit';
      formData.append('employeeProfileId', this.employeeProfileId);
      formData.append('departmentId', this.departmentId);
      formData.append('designationId', this.designationId);
      formData.append('submittedBy',this.submittedBy);
      formData.append('phone', this.phone);
      formData.append('module',this.module);
    this.foreignVisitService.createForeignVisit(formData).subscribe(
      response => {
        alert(response.message)
        this.router.navigateByUrl('foreign-visit');
         console.log('API Response:', response);
      },
      error => {
        console.error('API Error:', error);
      }
    );
  }
 }
}