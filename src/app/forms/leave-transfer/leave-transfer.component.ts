import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveTransferService } from '../forms.service';
import { Subscription,forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-leave-transfer',
  templateUrl: './leave-transfer.component.html',
  styleUrls: ['./leave-transfer.component.css']
})
export class leaveTransferComponent implements OnInit {

  transferForm!:FormGroup;
  submitted:boolean = false;
  showPromotion : boolean = false;
  showAdditionalCharge : boolean = false;
  orderType: any[]=[];
  orderFor: any[] = [];
  postingIn: any[]=[];
  postType : any[]=[];
  promotionGrade: any[]=[];
  locationChange : any[]=[];
  department:any[]=[];
  designation:any[]=[];
  toDepartment:any[]=[];
  toDesignation:any[]=[];
  selectedItem :any;
  private subscription!: Subscription;
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
  fromPostingIn: string = ''; 
  fromDepartment : string = '';
  fromDesignation : string = '';
  selectedOfficers: any[] = [];
  showValidationError = false;
  showTable = false;

  
  constructor(private fb:FormBuilder, private leaveTransfer:LeaveTransferService,private routes:ActivatedRoute) {
    
   }



  ngOnInit(): void {
    this.transferForm = this.fb.group({
      fullName:['',Validators.required],
      employeeId:[''],
      orderTypeCategoryCode: ['', Validators.required],
      orderNumber: ['', Validators.required],
      orderForCategoryCode:['', Validators.required],
      dateOfOrder:['', Validators.required],
      additionalCharge:[''],
      fromPostingInCategoryCode:[''],
      fromDepartmentId:[''],
      fromDesignationId:[''],
      toPostingInCategoryCode:['', Validators.required],
      toDepartmentId:['',Validators.required],
      toDesignationId:['', Validators.required],
      promotionGrade:[''],
      promotedGrade:[''],
      postTypeCategoryCode:[''],
      locationChangeCategoryId:[''],
      orderFile:[''],
      remarks:[''],
    });
 
    this.subscription = this.leaveTransfer.getSelectedItem().subscribe(item => {
      this.selectedItem = item;
      if (this.selectedItem == "Promotion"){
        this.showFrom = false;
        this.showTo = false;
        this.showPromotion = true;
        this.showPost = false;
        this.showLocation = false;
        this.transferForm.get('toPostingInCategoryCode')?.clearValidators();
        this.transferForm.get('toPostingInCategoryCode')?.updateValueAndValidity();
        this.transferForm.get('toDepartmentId')?.clearValidators();
        this.transferForm.get('toDepartmentId')?.updateValueAndValidity();
        this.transferForm.get('toDesignationId')?.clearValidators();
        this.transferForm.get('toDesignationId')?.updateValueAndValidity();
      }
      else{
        this.showFrom = true;
        this.showTo = true;
        this.showPromotion = false;
        this.showPost = true;
        this.showLocation = true;
        this.transferForm.get('toPostingInCategoryCode')?.setValidators(Validators.required);
        this.transferForm.get('toPostingInCategoryCode')?.updateValueAndValidity();
        this.transferForm.get('toDepartmentId')?.setValidators(Validators.required);
        this.transferForm.get('toDepartmentId')?.updateValueAndValidity();
        this.transferForm.get('toDesignationId')?.setValidators(Validators.required);
        this.transferForm.get('toDesignationId')?.updateValueAndValidity();
      }

      if (this.selectedItem == "Transfer / Posting" && !this.removedItems) {
         this.orderFor.splice(0, 2);
         this.removedItems = true;
      } 
      else if (this.selectedItem !== 'Transfer / Posting') {
        this.removedItems = false;
        this.orderFor = []; 
        this.leaveTransfer.getData().subscribe((res: any[]) => {
          res.forEach((item) => {
            if (item.category_type === "order_for") {
              this.orderFor.push({ label: item.category_name, value: item._id });
            }
          });
        });
      }
    });
    
    this.leaveTransfer.getData().subscribe((res: any[]) => {
      res.forEach((item) => {
        if(item.category_type == "order_type"){
          this.orderType.push({label:item.category_name,value:item._id});
        }
        // if (item.category_type == "order_for") {
        //   this.orderFor.push({ label: item.category_name, value: item._id });
        // }
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


  ngOnDestroy() {
    this.subscription.unsubscribe();
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
    const file: File = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        this.transferForm.get('orderFile')?.setErrors({ 'incorrectFileType': true });
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB in bytes
        this.transferForm.get('orderFile')?.setErrors({ 'maxSize': true });
        return;
      }

      this.transferForm.get('orderFile')?.setErrors(null);
    }
  }

//   onInput(event: any, field: string) {
//     const inputValue = event.target.value.toLowerCase();
//     let mergedOptions: { name: string, id: string, empProfileId:any }[] = []; // Assuming your options have both name and id properties
//     this.leaveTransfer.getEmployeeList().subscribe((res: any) => {
//         res.results.forEach((item: any) => {
//           console.log(item._id);
//             const name: string = item.fullName.toLowerCase();
//             const id: string = item.employeeId.toLowerCase(); 
//             const empProfileId:any = item._id;
//             this.empProfileId = empProfileId;
//             this.employeeId = id;
//             mergedOptions.push({ name, id, empProfileId});
//         });
//         if (field === 'fullName') {
//             this.filteredOptions = mergedOptions.filter((option: { name: string, id: string }) => option.name.includes(inputValue));
//         } else if (field === 'empId') {
//             this.filteredOptions = mergedOptions.filter((option: { name: string, id: string }) => option.id.includes(inputValue));
//         }
//         if (this.filteredOptions.length === 0) {
//             this.showDropdown = false;
//             this.transferForm.get('fullName')?.setValue('');
//             this.transferForm.get('empId')?.setValue('');
//         } else {
//             this.showDropdown = true;
//         }
//     });
// }



toGetDepartment(event:any){
  this.toDepartment = [];
  this.leaveTransfer.getData().subscribe((res: any[]) => {
    res.forEach((item)=>{
      if(event.target.value == item._id){
        this.leaveTransfer.getDepartmentData().subscribe((res:any[])=>{
            res.filter((data:any)=> {
              if(item.category_code == data.category_code){
                  this.toDepartment.push({label:data.department_name, value:data._id});
              } 
            });
         })
       }
     });
  })
}


getDesignation(event:any){
  this.designation = [];
  this.leaveTransfer.getDepartmentData().subscribe((res: any[]) => {
    res.forEach((item)=>{
      if(event.target.value == item._id){
        this.leaveTransfer.getDesignations().subscribe((res:any)=>{
          res.results.filter((data:any)=>{
            if(item.category_code == data.category_code){
            this.designation.push({label:data.designation_name, value:data._id});
            // this.designation = [];
            }
          })
        })
      }
    });
  });
}

toGetDesignation(event:any){
  this.toDesignation= [];
  this.leaveTransfer.getDepartmentData().subscribe((res: any[]) => {
    res.forEach((item)=>{
      if(event.target.value == item._id){
        this.leaveTransfer.getDesignations().subscribe((res:any)=>{
          res.results.filter((data:any)=>{
            if(item.category_code == data.category_code){
            this.toDesignation.push({label:data.designation_name, value:data._id});
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
  let mergedOptions: { name: string, id: string, empProfileId: any }[] = []; 
  this.leaveTransfer.getEmployeeList().subscribe((res: any) => {
    res.results.forEach((item: any) => {
      const name: string = item.fullName;
      const id: string = item.employeeId;
      const empProfileId: any = item._id;
      mergedOptions.push({ name, id, empProfileId });
    });
    if (field === 'fullName') {
      this.filteredOptions = mergedOptions.filter((option: { name: string, id: string }) => option.name.toLowerCase().includes(inputValue.toLowerCase()));

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
  

// this.leaveTransfer.getEmployeeUpdate().subscribe((res: any) => {
//     if (res.results.length === 0) {
//         this.fromPostingIn = "-";
//         this.fromDepartment = "-";
//         this.fromDesignation = "-";
//         return;
//     }

//     const item = res.results.find((item: any) => item.empProfileId === option.empProfileId);
//     if (!item) {
//         this.fromPostingIn = "-";
//         this.fromDepartment = "-";
//         this.fromDesignation = "-";
//         return;
//     }

//     forkJoin([
//         this.leaveTransfer.getDepartmentData(),
//         this.leaveTransfer.getDesignations()
//     ]).subscribe(([departments, designations]) => {
//         const department = departments.find((data: any) => data._id === item.toDepartmentId);
//         const designation = designations.results.find((ele: any) => ele._id === item.toDesignationId);
//         const postingIn = this.postingIn.find((data: any) => data.value === item.toPostingInCategoryCode);

//         this.fromPostingIn = postingIn ? postingIn.label : "-";
//         this.fromDepartment = department ? department.department_name : "-";
//         this.fromDesignation = designation ? designation.designation_name : "-";
//     });
// });

   
    this.transferForm.get('fullName')?.setValue(this.selectedOption);
    this.transferForm.get('empId')?.setValue(this.selectedEmpOption);
    this.showDropdown = false;
}

  onEmpId(data:any){
    const inputValue = data.target.value.toLowerCase();
    let mergedOptions: string[] = [];
    this.leaveTransfer.getEmployeeList().subscribe((res: any) => {
      res.results.forEach((item: any) => {
        console.log(item.employeeId);
        const empId: string[] =item.employeeId;
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
    if (this.transferForm.get('fullName')?.value!='' 
      && this.transferForm.get('toPostingInCategoryCode')?.value!=''
      && this.transferForm.get('toDepartmentId')?.value!=''
      && this.transferForm.get('toDesignationId')?.value!=''
      && this.transferForm.get('postTypeCategoryCode')?.value!=''
      && this.transferForm.get('locationChangeCategoryId')?.value!='') {
      this.showTable = true;
      this.postingIn.filter((pos:any)=>{
       if(pos.value == this.transferForm.get('toPostingInCategoryCode')?.value){
      this.toDepartment.filter((dept:any)=>{
          if(dept.value == this.transferForm.get('toDepartmentId')?.value){
       this.toDesignation.filter((des:any)=>{
        if(des.value == this.transferForm.get('toDesignationId')?.value){
       
        const officer = {
        fullName: this.selectedOption,
        employeeId: this.selectedEmpOption,
        toPostingInCategoryCode: pos.label,
        toDepartmentId: dept.label,
        toDesignationId: des.label
      };
      
      this.selectedOfficers.push(officer);
      this.transferForm.get('fullName')?.setValue('');
      this.transferForm.get('employeeId')?.setValue('');
      this.transferForm.get('toPostingInCategoryCode')?.setValue('');
      this.transferForm.get('toDepartmentId')?.setValue('');
      this.transferForm.get('toDesignationId')?.setValue('');
      this.transferForm.get('postTypeCategoryCode')?.setValue('');
      this.transferForm.get('locationChangeCategoryId')?.setValue('');
    }});
  }});
}});
    } else {
     alert("Please fill all Details");
    }
  }
  
  removeOfficer(index: number) {
    console.log(this.selectedOfficers.length);
    this.selectedOfficers.splice(index, 1);
    if(this.selectedOfficers.length == 0){
      this.showTable = false;
    }
  }

  getCurrentDate():string{
    return new Date().toISOString().split('T')[0];

  }

  onSubmit() {
      this.submitted = true;
      
  }
}
