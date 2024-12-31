import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LeaveTransferService } from '../../forms.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-edit-ltc',
  templateUrl: './edit-ltc.component.html',
  styleUrl: './edit-ltc.component.css'
})
export class EditLtcComponent implements OnInit{
  ltcForm!:FormGroup;
  selectedFile : File | null = null;
  submitted = false;
  orderFor:any[]=[];
  orderType:any[]=[];
  designation:any[]=[];
  department:any[]=[];
  showDropdown = false;
  selectedOption:string='';
  filteredOptions: any[] = [];
  employeeProfileId:string='';
  designationId:string='';
  departmentId:string='';
  phone:string='';
  module:string='';
  id:any;
  orderFileUrl:string='';
  url:string='';
  fromValue:any;
  toDateValue = true;
  leaveavailed:string[] = ['Casual Leave', 'Earned Leave'];
  category:string[] = ['Home Town','Anywhere in India','Conversion of Home Town LTC'];
  selfOrFamily:string[] = ['Self','Family']
  constructor(private route:ActivatedRoute,private router:Router, private ltcService:LeaveTransferService,private fb:FormBuilder){}

  ngOnInit(): void {
    const decodedId = this.route.snapshot.queryParamMap.get('id');
    if(decodedId){
      this.id = atob(decodedId);
      this.id = this.id.replace(/^"|"$/g, '');
    }
    this.ltcForm = this.fb.group({
      officerName:['',Validators.required],
      department:['',Validators.required],
      designation:['',Validators.required],
      fromDate:['',Validators.required],
      toDate:['',Validators.required],
      proposedPlaceOfVisit:['',Validators.required],
      blockYear:['',Validators.required],
      selfOrFamily:['',Validators.required],
      fromPlace:['',Validators.required],
      toPlace:['',Validators.required],
      orderType:['',Validators.required],
      orderNo:['',Validators.required],
      orderFor:['',Validators.required],
      dateOfOrder:['',Validators.required],
      orderFile:[null],
      remarks:['',Validators.required],
      leaveavailed:['',Validators.required],
      category:['',Validators.required],
    });
    this.ltcService.getLtcId(this.id).subscribe((res:any)=>{
      res.results.forEach((data:any)=>{
        this.ltcForm.get('officerName')?.setValue(data.officerName);
        this.ltcForm.get('department')?.setValue(data.department);
        this.ltcForm.get('designation')?.setValue(data.designation);
        var fromDate = new Date(data.fromDate);
        data.fromDate = fromDate.toISOString().split('T')[0];
        this.ltcForm.get('fromDate')?.setValue(data.fromDate);
        var toDate = new Date(data.toDate);
        data.toDate = toDate.toISOString().split('T')[0];
        this.ltcForm.get('toDate')?.setValue(data.toDate);
        this.ltcForm.get('proposedPlaceOfVisit')?.setValue(data.proposedPlaceOfVisit);
        this.ltcForm.get('blockYear')?.setValue(data.blockYear);
        this.ltcForm.get('selfOrFamily')?.setValue(data.selfOrFamily);
        this.ltcForm.get('fromPlace')?.setValue(data.fromPlace);
        this.ltcForm.get('toPlace')?.setValue(data.toPlace);
        this.ltcForm.get('orderType')?.setValue(data.orderType);
        this.ltcForm.get('orderNo')?.setValue(data.orderNumber);
        this.ltcForm.get('orderFor')?.setValue(data.orderFor);
        var dateOfOrder = new Date(data.dateOfOrder);
        data.dateOfOrder = dateOfOrder.toISOString().split('T')[0];
        this.ltcForm.get('dateOfOrder')?.setValue(data.dateOfOrder);
        this.orderFileUrl = this.ltcService.fileUrl+data.orderFile;
        this.ltcForm.get('remarks')?.setValue(data.remarks);
        this.ltcForm.get('leaveavailed')?.setValue(data.leaveavailed);
        this.ltcForm.get('category')?.setValue(data.category);
        this.employeeProfileId = data.employeeProfileId._id;
        this.phone = "+91"+data.employeeProfileId.mobileNo1;
        this.departmentId = data.departmentId;
        this.designationId = data.designationId;
      });
    });
    this.ltcService.getData().subscribe((res: any[]) => {
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

  fromDateValue(data:any){
    this.fromValue = data.target.value;
    if(this.ltcForm.get('toDate')?.value < this.fromValue || this.ltcForm.get('fromDate')?.value == ''){
      this.ltcForm.get('toDate')?.setValue('');
      this.toDateValue = true;
    }
    if(this.fromValue){
      this.toDateValue = false;
    }
  }


  onInput(event: any, field: string) {
    const inputValue = event.target.value.trim();
    let mergedOptions: { name: string, id: string, empProfileId: any, mobileNo:string }[] = []; 
    this.ltcService.getEmployeeList().subscribe((res: any) => {
      res.results.forEach((item: any) => {
        const name: string = item.fullName;
        const id: string = item.employeeId;
        const empProfileId: any = item._id;
        const mobileNo = item.mobileNo1;
        mergedOptions.push({ name, id, empProfileId, mobileNo });
      });
      if (field === 'officerName') {
        this.filteredOptions = mergedOptions.filter((option: { name: string, id: string }) => option.name.toLowerCase().includes(inputValue.toLowerCase()));
      } 
      if (this.filteredOptions.length === 0) {
        this.showDropdown = false;
        this.ltcForm.get('officerName')?.setValue('');
      } else {
        this.showDropdown = true;
      }
    });
  }

  selectOption(option: any) {
    const payload = {name:option.name};
    this.selectedOption = option.name;
    this.phone="+91"+option.mobileNo;
    this.ltcForm.get('officerName')?.setValue(this.selectedOption);
    this.showDropdown = false;
    this.ltcService.employeeFilter(payload).subscribe((res:any)=>{
      res.results.empList.forEach((item:any)=>{
        this.employeeProfileId = item._id;
        this.ltcService.getDepartmentData().subscribe((departmentRes: any) => {
          departmentRes.filter((data: any) => {
            this.department.push({ label: data.department_name, value: data._id });
          });
          const matchingDepartment = this.department.filter(item => item.value == res.results.empList.find((data:any) => data.toDepartmentId)?.toDepartmentId);
          matchingDepartment.filter((item:any)=>{
            this.departmentId = item.value;
            this.ltcForm.get('department')?.setValue(item.label)
          });         
        });

        this.ltcService.getDesignations().subscribe((designationRes: any) => {
          designationRes.results.filter((data: any) => {
            this.designation.push({ label: data.designation_name, value: data._id });
          });
          const matchingDesignation = this.designation.filter(item => item.value == res.results.empList.find((data:any) => data.toDesignationId)?.toDesignationId);
          matchingDesignation.filter((item:any)=>{
            this.designationId = item.value;
            this.ltcForm.get('designation')?.setValue(item.label)
          });
         
        });
      })
    })
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.ltcForm.patchValue({ orderFile: this.selectedFile });
    }
    this.selectedFile = event.target.files[0];
    this.ltcForm.get('orderFile')?.setValue(this.selectedFile);
    if (this.selectedFile) {
      if (this.selectedFile.type !== 'application/pdf') {
        this.ltcForm.get('orderFile')?.setErrors({ 'incorrectFileType': true });
        return;
      }

      if (this.selectedFile.size > 5 * 1024 * 1024) { // 5MB in bytes
        this.ltcForm.get('orderFile')?.setErrors({ 'maxSize': true });
        return;
      }

      this.ltcForm.get('orderFile')?.setErrors(null);
    }
  }

  onKeyDown(data:Event){

  }

   onSubmit(): void {
    this.submitted = true;
    if (this.ltcForm.valid) {
      const formData = new FormData();
      const formValues = this.ltcForm.value;
      for (const key in formValues) {
        if (formValues.hasOwnProperty(key) && key !== 'orderFile') {
          formData.append(key, formValues[key]);
        }
      }
      if (this.selectedFile) {
        formData.append('orderFile', this.selectedFile);
      }
      this.module = "Leave Travel Concession";
      formData.append('employeeProfileId', this.employeeProfileId);
      formData.append('departmentId', this.departmentId);
      formData.append('designationId', this.designationId);
      formData.append('phone',this.phone);
      formData.append('module',this.module);
      formData.append('id',this.id);
      this.ltcService.updateLtc(formData).subscribe(
        response => {
          alert(response.message);
          this.router.navigateByUrl('ltc');
         console.log('API Response:', response);
        },
        error => {
          console.error('API Error:', error);
        }
      );
    }
  }
}
