import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeaveTransferService } from '../../forms.service';
import { off } from 'node:process';
import { isPlatformBrowser } from '@angular/common';
import { CommonService } from '../../../shared-services/common.service';

@Component({
  selector: 'app-create-promotion',
  templateUrl: './create-promotion.component.html',
  styleUrl: './create-promotion.component.css'
})
export class CreatePromotionComponent {
  [x: string]: any;

  promotionForm!:FormGroup;
  submitted:boolean = false;
  showPromotion : boolean = false;
  showAdditionalCharge : boolean = false;
  orderType: any[]=[];
  orderFor: any[] = [];
  postingIn: any[]=[];
  postType : any[]=[];
  selectedFile : File | null = null;
  promotionGrade: any[]=[];
  locationChange : any[]=[];
  department:any[]=[];
  designation:any[]=[];
  toDepartment:any[]=[];
  toDesignation:any[]=[];
  selectedItem :any;
  options: string[] = [];
  filteredOptions: any[] = [];
  filteredEmpOptions : string[] =[];
  showDropdown = false;
  selectedOption: string = '';
  selectedEmpOption:string = '';
  showEmpDropdown = false;
  removedItems : boolean = false;
  showFrom : boolean = false;
  showTo : boolean = false;
  showPost : boolean = false;
  showLocation : boolean = false;
  empProfileId:string='';
  employeeId:string='';
  selectedOfficers: any[] = [];
  showValidationError = false;
  showTable = false;
  phone:string='';
  promotionFormValue:any;
  submittedBy:any;

  ifuserlogin = false;
  userdata: any;


  constructor(@Inject(PLATFORM_ID) private platformId: Object,private fb:FormBuilder, private promotionService:LeaveTransferService,private router:Router,private cs: CommonService) {
    
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
          this.promotionForm.controls['fullName'].setValue(this.userdata.fullName);
          this.promotionForm.controls['fullName'].disable(); // Properly disables the control
          this.promotionForm.controls['employeeId'].setValue(this.userdata.employeeId);
          this.promotionForm.controls['employeeId'].disable(); // Properly disables the control
          // console.log('chk',this.userdata);
        }
      });
    }
  }

  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      this.submittedBy = localStorage.getItem('loginId');
    }

    this.promotionForm = this.fb.group({
      fullName:['',Validators.required],
      employeeId:[''],
      orderTypeCategoryCode: ['', Validators.required],
      orderNumber: ['', Validators.required],
      orderForCategoryCode:['', Validators.required],
      dateOfOrder:['', Validators.required],
      additionalCharge:[''],
      promotionGrade:['',Validators.required],
      promotedGrade:['',Validators.required],
      orderFile:[''],
      remarks:[''],
    });
    
    this.promotionService.getData().subscribe((res: any[]) => {
      res.forEach((item) => {
        if(item.category_type == "order_type"){
          this.orderType.push({label:item.category_name,value:item._id});
        }
        if (item.category_type == "order_for") {
          this.orderFor.push({ label: item.category_name, value: item._id });
        }
        if(item.category_type == "posting_in"){
          this.postingIn.push({label:item.category_name,value:item._id});
        }
        if(item.category_type == "post_type"){
          this.postType.push({ label: item.category_name, value: item._id });
        }
        if(item.category_type === "promotion_grade"){
          this.promotionGrade.push({label:item.category_name,value:item._id});
        }
        if(item.category_type == "location_change"){
          this.locationChange.push({label:item.category_name,value:item._id});
        }
      });
      
  });
}


  changeOrderFor(event:Event){
    const target = event.target as HTMLSelectElement;
    const selectedText = target.options[target.selectedIndex].text;
    // if(selectedText == 'Promotion'){
    //   this.showPromotion = true;
    // }
    // else{
    //   this.showPromotion = false;
    // }
    if(selectedText == "Additional Charge" || selectedText == "Full Additional Charge"){
      this.showAdditionalCharge = true;
    }
    else{
      this.showAdditionalCharge = false;
    }
  }
  
  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.promotionForm.patchValue({ orderFile: this.selectedFile });
    }
    this.selectedFile = event.target.files[0];
    this.promotionForm.get('orderFile')?.setValue(this.selectedFile);
    if (this.selectedFile) {
      if (this.selectedFile.type !== 'application/pdf') {
        this.promotionForm.get('orderFile')?.setErrors({ 'incorrectFileType': true });
        return;
      }

      if (this.selectedFile.size > 5 * 1024 * 1024) { // 5MB in bytes
        this.promotionForm.get('orderFile')?.setErrors({ 'maxSize': true });
        return;
      }
      this.promotionForm.get('orderFile')?.setErrors(null);
    }
  }


onInput(event: any, field: string) {
  const inputValue = event.target.value.trim();
  let mergedOptions: { name: string, id: string, empProfileId: any, mobileNo:any }[] = []; 
  this.promotionService.getEmployeeList().subscribe((res: any) => {
    res.results.forEach((item: any) => {
      const name: string = item.fullName;
      const id: string = item.employeeId;
      const empProfileId: any = item._id;
      const mobileNo: any = item.mobileNo1;
      mergedOptions.push({ name, id, empProfileId,mobileNo });
    });
    if (field === 'fullName') {
      this.filteredOptions = mergedOptions.filter((option: { name: string, id: string }) => option.name.toLowerCase().includes(inputValue.toLowerCase()));

    } else if (field === 'empId') {
      this.filteredOptions = mergedOptions.filter((option: { name: string, id: string }) => option.id.includes(inputValue));
    }
    if (this.filteredOptions.length === 0) {
      this.showDropdown = false;
      this.promotionForm.get('fullName')?.setValue('');
      this.promotionForm.get('empId')?.setValue('');
    } else {
      this.showDropdown = true;
    }
  });
}

onKeyDown(event: KeyboardEvent) {
  const key = event.key;
  if (!((key >= '0' && key <= '9') || 
        ['Backspace', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight'].includes(key))) {
    event.preventDefault();
  }
}


selectOption(option: any) {
  this.selectedOption = option.name;
  this.selectedEmpOption = option.id;
  this.empProfileId = option.empProfileId;
  this.employeeId = option.id;
  this.phone = "+91"+option.mobileNo;

this.promotionService.getEmployeeCurrentPosting(this.empProfileId).subscribe((res: any) => {
  res.results.filter((item:any)=>{
    if(item.updateType == 'Promotion'){
      const item = res.results.find((item: any) => item.empProfileId === option.empProfileId);
      if(item.empProfileId == option.empProfileId){
        console.log(item.promotionGrade);
        this.promotionGrade.forEach((data:any)=>{
          if(data.value == item.promotionGrade){
            console.log(data.label);
            const promotionGradeControl = this.promotionForm.get('promotionGrade');
            if(promotionGradeControl){
              promotionGradeControl.disable();
              promotionGradeControl.setValue(data.value);
              const selectedOption = promotionGradeControl?.value;
              console.log(selectedOption);
              const optionLabel = this['getOptionLabel'](selectedOption);
            }

          }
          else{
            this.promotionForm.get('promotionGrade')?.enable();
            this.promotionForm.get('promotionGrade')?.setValue('');
            console.log("else");
          }
        })
      }
    }
  });
    if (res.results.length === 0) {
        this.promotionGrade = [];
    }

});
    this.promotionForm.get('fullName')?.setValue(this.selectedOption);
    this.promotionForm.get('empId')?.setValue(this.selectedEmpOption);
    this.showDropdown = false;
}
  
  getCurrentDate():string{
    return new Date().toISOString().split('T')[0];

  }

  onSubmit() {
      this.submitted = true;
      if (this.promotionForm.valid) {
        const formData = new FormData();
        const formValues = this.promotionForm.value;
        delete formValues.fullName;
        delete formValues.employeeId;
        delete formValues.promotionGrade;
        delete formValues.promotedGrade;
        delete formValues.orderForCategoryCode;
        delete formValues.orderTypeCategoryCode;
        delete formValues.orderNumber;
        delete formValues.dateOfOrder;
        delete formValues.remarks;
      const officer = {
        empProfileId : this.empProfileId,
        fullName : this.promotionForm.get('fullName')?.value,
        employeeId : this.employeeId,
        promotionGrade : this.promotionForm.get('promotionGrade')?.value,
        promotedGrade : this.promotionForm.get('promotedGrade')?.value,
        phone:this.phone
      }

      this.selectedOfficers.push(officer);
        console.log('this.selectedOfficers',this.selectedOfficers);
        for (const key in formValues) {
          if (formValues.hasOwnProperty(key) && key !== 'orderFile') {
              formData.append(key, JSON.stringify(formValues[key]));
          }
      }
      if (this.selectedFile) {
          formData.append('orderFile', this.selectedFile);
      }
      // formData.append('employeeId',this.employeeId);
      // formData.append('empProfileId',this.empProfileId);
      formData.append('orderTypeCategoryCode',this.promotionForm.get('orderTypeCategoryCode')?.value);
      formData.append('orderNumber',this.promotionForm.get('orderNumber')?.value);
      formData.append('orderForCategoryCode', this.promotionForm.get('orderForCategoryCode')?.value);
      formData.append('dateOfOrder',this.promotionForm.get('dateOfOrder')?.value);
      formData.append('remarks',this.promotionForm.get('remarks')?.value);
      formData.append('transferOrPostingEmployeesList', JSON.stringify(this.selectedOfficers));
      formData.append('submittedBy',this.submittedBy);
      formData.append('updateType','Promotion');
      formData.append('module','Promotion');
        this.promotionService.transferPosting(formData).subscribe(res=>{
          console.log(res);
            alert("Successfully Submitted");
            this.promotionForm.reset();
            this.router.navigateByUrl('promotion');
        },error=>{
            console.log(error.error);
        })
      } else {
        Object.keys(this.promotionForm.controls).forEach(key => {
          const controlErrors = this.promotionForm.get(key)?.errors;
          if (controlErrors != null) {
            console.log('Form control:', key, 'has errors:', controlErrors);
          }
        });
      }
  }

}
