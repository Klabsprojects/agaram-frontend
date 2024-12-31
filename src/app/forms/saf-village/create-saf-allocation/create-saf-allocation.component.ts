import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveTransferService } from '../../forms.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-create-saf-allocation',
  templateUrl: './create-saf-allocation.component.html',
  styleUrl: './create-saf-allocation.component.css'
})
export class CreateSafAllocationComponent implements OnInit{

  safAllocationForm!:FormGroup;
  selectedFile : File | null = null;
  submitted = false;
  orderFor:any[]=[];
  orderType:any[]=[];
  officerNames:any[]=[];
  block:any[]=[];
  employeeProfileId:string='';
  departmentId:string='';
  designationId:string='';
  officerName:string='';
  module:string='';
  submittedBy:any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private fb:FormBuilder,private safService:LeaveTransferService,private router:Router){}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.submittedBy = localStorage.getItem('loginId');
    }
    this.safAllocationForm = this.fb.group({
      officerName:['',Validators.required],
      employeeId:['',Validators.required],
      department:['',Validators.required],
      designation:['',Validators.required],
      blockId:['',Validators.required],
      dateOfAccomodation:['',Validators.required],
      orderType:['',Validators.required],
      orderNo:['',Validators.required],
      orderFor:['',Validators.required],
      dateOfOrder:['',Validators.required],
      orderFile:[null,Validators.required],
      remarks:['']
    });
    const loginId = localStorage.getItem('loginId');
   const loginAs = localStorage.getItem('loginAs');
    this.safService.getSafApplication(loginId,loginAs).subscribe((res:any)=>{
      res.results.filter((item:any)=>{
        if(item.applicationStatus == 'open'){
          this.officerNames.push({label:item.officerName,value:item.employeeProfileId._id});
        }
      });
    });

    this.safService.getBlock().subscribe((res:any)=>{
     res.results.filter((item:any)=>{
      if(item.allocationStatus == false){
        this.block.push({label:item.FlatNumber,value:item._id});
      }
     })
   });
   this.safService.getData().subscribe((res: any[]) => {
    res.forEach((item) => {
      if(item.category_type == "order_type"){
        this.orderType.push({label:item.category_name,value:item._id});
      }
      if (item.category_type == "order_for") {
        this.orderFor.push({ label: item.category_name, value: item._id });
      }
    });
  });
  }

  selectName(event:any){
    if(event.target.value){
      const loginId = localStorage.getItem('loginId');
   const loginAs = localStorage.getItem('loginAs');
      this.officerName = event.target.options[event.target.options.selectedIndex].text;
      this.safService.getSafApplication(loginId,loginAs).subscribe((res:any)=>{
        res.results.forEach((item:any)=>{
          if(item.employeeProfileId._id === event.target.value){
            this.safAllocationForm.get('department')?.setValue(item.department);
            this.safAllocationForm.get('designation')?.setValue(item.designation);
            this.safAllocationForm.get('employeeId')?.setValue(item.employeeId);
            this.employeeProfileId = item.employeeProfileId._id;
            this.departmentId = item.departmentId;
            this.designationId = item.designationId;
          }
        });
      });
    }
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.safAllocationForm.patchValue({ orderFile: this.selectedFile });
    }
    this.selectedFile = event.target.files[0];
    this.safAllocationForm.get('orderFile')?.setValue(this.selectedFile);
    if (this.selectedFile) {
      if (this.selectedFile.type !== 'application/pdf') {
        this.safAllocationForm.get('orderFile')?.setErrors({ 'incorrectFileType': true });
        return;
      }

      if (this.selectedFile.size > 5 * 1024 * 1024) { 
        this.safAllocationForm.get('orderFile')?.setErrors({ 'maxSize': true });
        return;
      }

      this.safAllocationForm.get('orderFile')?.setErrors(null);
    }
  }

  onKeyDown(data:Event){
  }

  onSubmit(){
    this.submitted = true;
    if(this.safAllocationForm.valid){
      const formData = new FormData();
      const formValues = this.safAllocationForm.value;
      delete formValues.officerName;
      for (const key in formValues) {
        if (formValues.hasOwnProperty(key) && key !== 'orderFile') {
          formData.append(key, formValues[key]);
        }
      }
      if (this.selectedFile) {
        formData.append('orderFile', this.selectedFile);
      }
      this.module = "SAF Games Village Allocation";
      formData.append('employeeProfileId', this.employeeProfileId);
      formData.append('departmentId', this.departmentId);
      formData.append('designationId', this.designationId);
      formData.append('submittedBy',this.submittedBy);
      formData.append('officerName',this.officerName);
      formData.append('module',this.module);
      this.safService.safAllocation(formData).subscribe(
        response => {
          console.log(response);
          alert(response.message);
          this.router.navigateByUrl('saf-village-allocation');
        },
        error => {
          console.error('API Error:', error);
        }
      );
    }
    }
  }

