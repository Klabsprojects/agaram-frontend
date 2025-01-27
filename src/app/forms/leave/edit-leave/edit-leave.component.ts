import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveTransferService } from '../../forms.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-leave',
  templateUrl: './edit-leave.component.html',
  styleUrl: './edit-leave.component.css'
})
export class EditLeaveComponent implements OnInit{
  applyLeaveForm!:FormGroup;
  submitted = false;
  filteredOptions:any[]=[];
  showDropdown = false;
  selectedOption : string = '';
  selectedFile : File | null = null;
  orderFor:any[]=[];
  orderType:any[]=[];
  leaveType:any[]=[];
  country:any[]=[];
  employeeProfileId:string='';
  phone:string='';
  module:string='';
  id:any;
  url:string='';

  constructor(private leaveService:LeaveTransferService,private route:ActivatedRoute,private fb:FormBuilder,private router:Router){}

  ngOnInit(): void {
    const decodedId = this.route.snapshot.queryParamMap.get('id');
    if (decodedId) {
      this.id = atob(decodedId);
      this.id = this.id.replace(/^"|"$/g, '');
    }

    this.leaveService.getLeaveId(this.id).subscribe((res:any)=>{
      res.results.forEach((data:any)=>{
        this.applyLeaveForm.get('fullName')?.setValue(data.fullName);
        this.applyLeaveForm.get('employeeId')?.setValue(data.employeeId);
        this.applyLeaveForm.get('typeOfLeave')?.setValue(data.typeOfLeave);
        var fromDate = new Date(data.fromDate);
        data.fromDate= fromDate.toISOString().split('T')[0];
        this.applyLeaveForm.get('fromDate')?.setValue(data.fromDate); 
        var endDate = new Date(data.endDate);
        data.endDate= endDate.toISOString().split('T')[0];
        this.applyLeaveForm.get('endDate')?.setValue(data.endDate); 
        this.applyLeaveForm.get('foreignVisitOrDeftCountry')?.setValue(data.foreignVisitOrDeftCountry);
        this.applyLeaveForm.get('orderType')?.setValue(data.orderType); 
        this.applyLeaveForm.get('orderNo')?.setValue(data.orderNo); 
        this.applyLeaveForm.get('orderFor')?.setValue(data.orderFor); 
        var dateOfOrder = new Date(data.dateOfOrder);
        data.dateOfOrder = dateOfOrder.toISOString().split('T')[0];
        this.applyLeaveForm.get('dateOfOrder')?.setValue(data.dateOfOrder);
        this.applyLeaveForm.get('remarks')?.setValue(data.remarks); 
        this.url = this.leaveService.fileUrl+data.orderFile;
        this.phone = "+91"+data.employeeProfileId.mobileNo1;
        this.employeeProfileId = data.employeeProfileId._id;
        console.log(this.employeeProfileId);
      })
    })
    this.applyLeaveForm = this.fb.group({
      fullName:['',Validators.required],
      employeeId:['',Validators.required],
      typeOfLeave:['',Validators.required],
      fromDate:['',Validators.required],
      endDate:['',Validators.required],
      foreignVisitOrDeftCountry:['',Validators.required],
      orderType:['',Validators.required],
      orderNo:['',Validators.required],
      orderFor:['',Validators.required],
      dateOfOrder:['',Validators.required],
      remarks:[''],
      orderFile:[null]
    });
    this.leaveService.getData().subscribe((res:any)=>{
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
        if(item.category_type == "leave_type") {
          this.leaveType.push({ label: item.category_name, value: item._id });
        }
      })
    })
  }

  onInput(event: any, field: string) {
    const inputValue = event.target.value.trim();
    let mergedOptions: { name: string, id: string, empProfileId: any, mobileNo:string }[] = []; 
    this.leaveService.getEmployeeList().subscribe((res: any) => {
      res.results.forEach((item: any) => {
        const name: string = item.fullName;
        const id: string = item.employeeId;
        const empProfileId: any = item._id;
        const mobileNo:string = item.mobileNo1;
        this.employeeProfileId = empProfileId;
        mergedOptions.push({ name, id, empProfileId, mobileNo });
      });
      if (field === 'fullName') {
        this.filteredOptions = mergedOptions.filter((option: { name: string, id: string }) => option.name.toLowerCase().includes(inputValue.toLowerCase()));
      } 
      if (this.filteredOptions.length === 0) {
        this.showDropdown = false;
        this.applyLeaveForm.get('fullName')?.setValue('');
      } else {
        this.showDropdown = true;
      }
    });
  }

  selectOption(option: any) {
    this.selectedOption = option.name;
    this.applyLeaveForm.get('fullName')?.setValue(this.selectedOption);
    this.applyLeaveForm.get('employeeId')?.setValue(option.id)
    this.showDropdown = false;
    this.phone = "+91"+option.mobileNo;
    this.employeeProfileId = option.empProfileId;
    // console.log(this.phone);
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.applyLeaveForm.patchValue({ orderFile: this.selectedFile });
    }
    this.selectedFile = event.target.files[0];
    this.applyLeaveForm.get('orderFile')?.setValue(this.selectedFile);
    if (this.selectedFile) {
      if (this.selectedFile.type !== 'application/pdf') {
        this.applyLeaveForm.get('orderFile')?.setErrors({ 'incorrectFileType': true });
        return;
      }

      if (this.selectedFile.size > 5 * 1024 * 1024) { // 5MB in bytes
        this.applyLeaveForm.get('orderFile')?.setErrors({ 'maxSize': true });
        return;
      }

      this.applyLeaveForm.get('orderFile')?.setErrors(null);
    }
  }

  onKeyDown(data:Event){

  }

  onSubmit(){
    this.submitted = true;
    console.log(this.applyLeaveForm);
    if(this.applyLeaveForm.valid){
      const formData = new FormData();
      const formValues = this.applyLeaveForm.value;
      for (const key in formValues) {
        if (formValues.hasOwnProperty(key) && key !== 'orderFile') {
          formData.append(key, formValues[key]);
        }
      }
      if (this.selectedFile) {
        formData.append('orderFile', this.selectedFile);
      }
      this.module = 'Leave';
      formData.append('module',this.module);
      formData.append('id',this.id);
      formData.append('phone',this.phone);
      formData.append('employeeProfileId',this.employeeProfileId);
      this.leaveService.updateLeave(formData).subscribe(
        response => {
          alert(response.message);
          this.router.navigateByUrl('leave');
          console.log('API Response:', response);
        },
        error => {
          console.error('API Error:', error);
        }
      );
  }
}
}
