import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveTransferService } from '../../forms.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { CommonService } from '../../../shared-services/common.service';
@Component({
  selector: 'app-create-training',
  templateUrl: './create-training.component.html',
  styleUrl: './create-training.component.css'
})
export class CreateTrainingComponent implements OnInit{

  trainingForm!:FormGroup;
  submitted = false;
  filteredOptions:any[]=[];
  showDropdown = false;
  selectedOption : string = '';
  selectedFile : File | null = null;
  orderFor:any[]=[];
  orderType:any[]=[];
  trainingType:any[]=[];
  country:any[]=[];
  employeeProfileId:string='';
  phone:string='';
  module:string='';
  submittedBy:any;

  ifuserlogin = false;
  userdata: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private trainingService:LeaveTransferService,private fb:FormBuilder,private router:Router,private cs: CommonService){}

  ngAfterViewInit(): void {
    if (localStorage.getItem('loginAs') == 'Officer') {
      this.cs.data$.subscribe((data: any) => {
        if (data) {
          this.userdata = data;
          this.ifuserlogin = true;
          this.selectedOption = this.userdata.fullName;
          // this.selectedEmpOption = this.userdata.employeeId;
  
          // Set the value and disable the control
          this.trainingForm.controls['fullName'].setValue(this.userdata.fullName);
          this.trainingForm.controls['fullName'].disable(); // Properly disables the control
          this.trainingForm.controls['employeeId'].setValue(this.userdata.employeeId);
          this.trainingForm.controls['employeeId'].disable(); // Properly disables the control
          // console.log('chk',this.userdata);
        }
      });
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.submittedBy = localStorage.getItem('loginId');
    }
  this.trainingForm = this.fb.group({
      fullName:['',Validators.required],
      employeeId:['',Validators.required],
      typeOfTraining:['',Validators.required],
      fromDate:['',Validators.required],
      endDate:['',Validators.required],
      foreignVisitOrDeftCountry:['',Validators.required],
      orderType:['',Validators.required],
      orderNo:['',Validators.required],
      orderFor:['',Validators.required],
      dateOfOrder:['',Validators.required],
      remarks:[''],
      orderFile:[null,Validators.required],
      nameOfInstitute:['']
    });
    this.trainingService.getData().subscribe((res:any)=>{
      res.forEach((item:any)=>{
        if(item.category_type == 'country'){
          this.country.push({label:item.category_name,value:item._id});
        }
        if(item.category_type == "order_type"){
          this.orderType.push({label:item.category_name,value:item._id});
        }
        if (item.category_type == "order_for") {
          this.orderFor.push({ label: item.category_name, value: item._id });
        }
        if (item.category_type == "training_type") {
          this.trainingType.push({ label: item.category_name, value: item._id });
        }
      })
    })
  }

  onInput(event: any, field: string) {
    const inputValue = event.target.value.trim();
    let mergedOptions: { name: string, id: string, empProfileId: any, mobileNo:string }[] = []; 
    this.trainingService.getEmployeeList().subscribe((res: any) => {
      res.results.forEach((item: any) => {
        const name: string = item.fullName;
        const id: string = item.employeeId;
        const empProfileId: any = item._id;
        const mobileNo = item.mobileNo1;
        this.employeeProfileId = empProfileId;
        mergedOptions.push({ name, id, empProfileId,mobileNo });
      });
      if (field === 'fullName') {
        this.filteredOptions = mergedOptions.filter((option: { name: string, id: string }) => option.name.toLowerCase().includes(inputValue.toLowerCase()));
      } 
      if (this.filteredOptions.length === 0) {
        this.showDropdown = false;
        this.trainingForm.get('fullName')?.setValue('');
      } else {
        this.showDropdown = true;
      }
    });
  }

  selectOption(option: any) {
    this.selectedOption = option.name;
    this.trainingForm.get('fullName')?.setValue(this.selectedOption);
    this.trainingForm.get('employeeId')?.setValue(option.id);
    this.phone = "+91"+option.mobileNo;
    this.showDropdown = false;
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.trainingForm.patchValue({ orderFile: this.selectedFile });
    }
    this.selectedFile = event.target.files[0];
    this.trainingForm.get('orderFile')?.setValue(this.selectedFile);
    if (this.selectedFile) {
      if (this.selectedFile.type !== 'application/pdf') {
        this.trainingForm.get('orderFile')?.setErrors({ 'incorrectFileType': true });
        return;
      }

      if (this.selectedFile.size > 5 * 1024 * 1024) { // 5MB in bytes
        this.trainingForm.get('orderFile')?.setErrors({ 'maxSize': true });
        return;
      }

      this.trainingForm.get('orderFile')?.setErrors(null);
    }
  }

  onKeyDown(data:Event){

  }

  onSubmit(){
    this.submitted = true;
    if(this.trainingForm.valid){
      const formData = new FormData();
      const formValues = this.trainingForm.value;
      for (const key in formValues) {
        if (formValues.hasOwnProperty(key) && key !== 'orderFile') {
          formData.append(key, formValues[key]);
        }
      }
      if (this.selectedFile) {
        formData.append('orderFile', this.selectedFile);
      }
      this.module = 'Training';
      formData.append('employeeProfileId', this.employeeProfileId);
      formData.append('submittedBy',this.submittedBy);
      formData.append('phone', this.phone);
      formData.append('module',this.module);
      this.trainingService.createTraining(formData).subscribe(
        response => {
          alert(response.message);
          this.router.navigateByUrl('training');
          console.log('API Response:', response);
        },
        error => {
          console.error('API Error:', error);
        }
      );
  }
}

}
