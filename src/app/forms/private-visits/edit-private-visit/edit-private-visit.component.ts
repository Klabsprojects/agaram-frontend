import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveTransferService } from '../../forms.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-private-visit',
  templateUrl: './edit-private-visit.component.html',
  styleUrl: './edit-private-visit.component.css'
})
export class EditPrivateVisitComponent implements OnInit{
  privateVisitForm!: FormGroup;
  submitted = false;
  country:any[]=[];
  orderFor:any[]=[];
  orderType:any[]=[];
  selectedFile : File | null = null;
  designation:any[]=[];
  department:any[]=[];
  selectedOption:string='';
  showDropdown = false;
  filteredOptions: any[] = [];
  employeeProfileId:string='';
  designationId:string='';
  departmentId:string='';
  phone:string='';
  module:string='';
  url:string='';
  id:any;
  fromValue:any;
  toDateValue = true;

  constructor(private route:ActivatedRoute,private fb:FormBuilder,private formsService:LeaveTransferService,private router:Router) { }

  ngOnInit(): void {
    const decodedId = this.route.snapshot.queryParamMap.get('id');
    if(decodedId){
      this.id = atob(decodedId);
      this.id = this.id.replace(/^"|"$/g, '');
    }
    this.formsService.getData().subscribe((res)=>{
     res.filter((item:any)=>{
      if(item.category_type=="country"){
        this.country.push({label:item.category_name,value:item._id});
      }
     })
    })

    this.privateVisitForm = this.fb.group({
      officerName:['',Validators.required],
      department:[''],
      designation:[''],
      fromDate:['',Validators.required],
      toDate:['',Validators.required],
      proposedCountry:['',Validators.required],
      //fundSource:['',Validators.required],
      selfOrFamily:['',Validators.required],
      orderType:['',Validators.required],
      orderNo:['',Validators.required],
      orderFor:['',Validators.required],
      dateOfOrder:['',Validators.required],
      status:['',Validators.required],
      orderFile:[null],
      remarks:[''],
      proposedAmountOfExpenditure:['',Validators.required]
    });

    this.formsService.getPrivateVisitId(this.id).subscribe((res:any)=>{
      res.results.forEach((data:any)=>{
        console.log(data);
        this.privateVisitForm.get('officerName')?.setValue(data.officerName);
        this.privateVisitForm.get('department')?.setValue(data.department);
        this.privateVisitForm.get('designation')?.setValue(data.designation);
        this.privateVisitForm.get('proposedCountry')?.setValue(data.proposedCountry);
        var fromDate = new Date(data.fromDate);
        data.fromDate= fromDate.toISOString().split('T')[0];
        this.privateVisitForm.get('fromDate')?.setValue(data.fromDate);
        var toDate = new Date(data.toDate);
        data.toDate= toDate.toISOString().split('T')[0];
        this.privateVisitForm.get('toDate')?.setValue(data.toDate);
        //this.privateVisitForm.get('fundSource')?.setValue(data.fundSource);
        this.privateVisitForm.get('selfOrFamily')?.setValue(data.selfOrFamily);
        this.url = this.formsService.fileUrl+data.orderFile;
        this.privateVisitForm.get('orderType')?.setValue(data.orderType);
        this.privateVisitForm.get('orderNo')?.setValue(data.orderNo);
        this.privateVisitForm.get('orderFor')?.setValue(data.orderFor);
        var dateOfOrder = new Date(data.dateOfOrder);
        data.dateOfOrder = dateOfOrder.toISOString().split('T')[0];
        this.privateVisitForm.get('dateOfOrder')?.setValue(data.dateOfOrder);
        this.privateVisitForm.get('status')?.setValue(data.status);
        this.privateVisitForm.get('remarks')?.setValue(data.remarks);
        this.privateVisitForm.get('proposedAmountOfExpenditure')?.setValue(data.proposedAmountOfExpenditure);
        this.employeeProfileId = data.employeeProfileId._id;
        this.phone = "+91"+data.employeeProfileId.mobileNo1;
        this.departmentId = data.departmentId;
        this.designationId = data.designationId;
      });
    });

    this.formsService.getData().subscribe((res: any[]) => {
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
    if(this.privateVisitForm.get('toDate')?.value < this.fromValue || this.privateVisitForm.get('fromDate')?.value == ''){
      this.privateVisitForm.get('toDate')?.setValue('');
      this.toDateValue = true;
    }
    if(this.fromValue){
      this.toDateValue = false;
    }
  }

  onInput(event: any, field: string) {
    const inputValue = event.target.value.trim();
    let mergedOptions: { name: string, id: string, empProfileId: any,mobileNo:string }[] = []; 
    this.formsService.getEmployeeList().subscribe((res: any) => {
      res.results.forEach((item: any) => {
        const name: string = item.fullName;
        const id: string = item.employeeId;
        const empProfileId: any = item._id;
        const mobileNo : string = item.mobileNo1;
        mergedOptions.push({ name, id, empProfileId, mobileNo });
      });
      if (field === 'officerName') {
        this.filteredOptions = mergedOptions.filter((option: { name: string, id: string }) => option.name.toLowerCase().includes(inputValue.toLowerCase()));
  
      } 
      if (this.filteredOptions.length === 0) {
        this.showDropdown = false;
        this.privateVisitForm.get('officerName')?.setValue('');
      } else {
        this.showDropdown = true;
      }
    });
  }

  selectOption(option: any) {
    const payload = {name:option.name};
    this.selectedOption = option.name;
    this.phone = "+91"+option.mobileNo;
    this.privateVisitForm.get('officerName')?.setValue(this.selectedOption);
    this.showDropdown = false;
    this.formsService.employeeFilter(payload).subscribe((res:any)=>{
      res.results.empList.forEach((item:any)=>{
        this.employeeProfileId = item._id;
        this.formsService.getDepartmentData().subscribe((departmentRes: any) => {
          departmentRes.filter((data: any) => {
            this.department.push({ label: data.department_name, value: data._id });
          });
          const matchingDepartment = this.department.filter(item => item.value == res.results.empList.find((data:any) => data.toDepartmentId)?.toDepartmentId);
         matchingDepartment.filter((item:any)=>{
            this.departmentId = item.value;
            this.privateVisitForm.get('department')?.setValue(item.label)
          });
         
        });

        this.formsService.getDesignations().subscribe((designationRes: any) => {
          designationRes.results.filter((data: any) => {
            this.designation.push({ label: data.designation_name, value: data._id });
          });
          const matchingDesignation = this.designation.filter(item => item.value == res.results.empList.find((data:any) => data.toDesignationId)?.toDesignationId);
          matchingDesignation.filter((item:any)=>{
            this.designationId = item.value;
            this.privateVisitForm.get('designation')?.setValue(item.label)
          });
         
        });
      })
    })
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.privateVisitForm.patchValue({ orderFile: this.selectedFile });
    }
    this.selectedFile = event.target.files[0];
    this.privateVisitForm.get('orderFile')?.setValue(this.selectedFile);
    if (this.selectedFile) {
      if (this.selectedFile.type !== 'application/pdf') {
        this.privateVisitForm.get('orderFile')?.setErrors({ 'incorrectFileType': true });
        return;
      }

      if (this.selectedFile.size > 5 * 1024 * 1024) { // 5MB in bytes
        this.privateVisitForm.get('orderFile')?.setErrors({ 'maxSize': true });
        return;
      }

      this.privateVisitForm.get('orderFile')?.setErrors(null);
    }
  }

  changeOrderFor(data:Event){
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
    if(this.privateVisitForm.valid){
      const formData = new FormData();
      const formValues = this.privateVisitForm.value;
      for (const key in formValues) {
        if (formValues.hasOwnProperty(key) && key !== 'orderFile') {
          formData.append(key, formValues[key]);
        }
      }
      if (this.selectedFile) {
        formData.append('orderFile', this.selectedFile);
      }
      this.module = "Private Visit";
      formData.append('employeeProfileId', this.employeeProfileId);
      formData.append('departmentId', this.departmentId);
      formData.append('designationId', this.designationId);
      formData.append('phone',this.phone);
      formData.append('module',this.module);
      formData.append('id',this.id);
      this.formsService.updatePrivateVisit(formData).subscribe((res:any)=>{
        alert(res.message);
        this.router.navigateByUrl('private-visits');
        console.log('API Response:', res);
      },
      error => {
        console.error('API Error:', error);
      });
    }
  }
}
