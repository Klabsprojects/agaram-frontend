import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveTransferService } from '../../forms.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-immovable',
  templateUrl: './edit-immovable.component.html',
  styleUrl: './edit-immovable.component.css'
})
export class EditImmovableComponent implements OnInit{
  immvovableForm!:FormGroup;
  submitted = false;
  showDetail = false;
  filteredOptions: any[] = [];
  showDropdown = false;
  selectedOption:string='';
  department:any[]=[];
  designation:any[]=[];
  selectedFile : File | null = null;
  orderFor:any[]=[];
  orderType:any[]=[];
  employeeProfileId:string='';
  departmentId:string='';
  designationId:string='';
  phone:string='';
  module:string='';
  id:any;
  url:string='';

  constructor(private route:ActivatedRoute,private fb:FormBuilder,private immovableService:LeaveTransferService,private router:Router) { }

  ngOnInit(): void {
    const decodedId = this.route.snapshot.queryParamMap.get('id');
    if(decodedId){
      this.id = atob(decodedId);
      this.id = this.id.replace(/^"|"$/g, '');
    }
    this.immvovableForm = this.fb.group({
      officerName:['',Validators.required],
      department:['',Validators.required],
      designation:['',Validators.required],
      typeOfImmovableProperty:['',Validators.required],
      detailsOfImovableProperty:['',Validators.required],
      sourceOfFunding:['',Validators.required],
      totalCostOfProperty:['',Validators.required],
      boughtFromName:['',Validators.required],
      boughtFromContactNumber:['',Validators.required],
      boughtFromAddress:['',Validators.required],
      propertyShownInIpr:['',Validators.required],
      selfOrFamily:['',Validators.required],
      remarks:[''],
      immovableDateOfOrder:['',Validators.required],
      orderType:['',Validators.required],
      orderNo:['',Validators.required],
      orderFor:['',Validators.required],
      dateOfOrder:['',Validators.required],
      orderFile:[null],
      previousSanctionOrder:['',Validators.required],
    });

    this.immovableService.getImmovableId(this.id).subscribe((res:any)=>{
      res.results.forEach((data:any)=>{
        console.log(data);
        this.immvovableForm.get('officerName')?.setValue(data.officerName);
        this.immvovableForm.get('department')?.setValue(data.department);
        this.immvovableForm.get('designation')?.setValue(data.designation);
        this.immvovableForm.get('typeOfImmovableProperty')?.setValue(data.typeOfImmovableProperty);
        this.immvovableForm.get('detailsOfImovableProperty')?.setValue(data.detailsOfImovableProperty);
        this.immvovableForm.get('sourceOfFunding')?.setValue(data.sourceOfFunding);
        this.immvovableForm.get('totalCostOfProperty')?.setValue(data.totalCostOfProperty);
        this.immvovableForm.get('boughtFromName')?.setValue(data.boughtFromName);
        this.immvovableForm.get('boughtFromContactNumber')?.setValue(data.boughtFromContactNumber);
        this.immvovableForm.get('boughtFromAddress')?.setValue(data.boughtFromAddress);
        this.immvovableForm.get('propertyShownInIpr')?.setValue(data.propertyShownInIpr);
        this.immvovableForm.get('selfOrFamily')?.setValue(data.selfOrFamily);
        var immovableDateOfOrder = new Date(data.immovableDateOfOrder);
        data.immovableDateOfOrder = immovableDateOfOrder.toISOString().split('T')[0];
        this.immvovableForm.get('immovableDateOfOrder')?.setValue(data.immovableDateOfOrder);
        this.immvovableForm.get('previousSanctionOrder')?.setValue(data.previousSanctionOrder);
        this.url = this.immovableService.fileUrl+data.orderFile;
        this.immvovableForm.get('orderType')?.setValue(data.orderType);
        this.immvovableForm.get('orderNo')?.setValue(data.orderNo);
        this.immvovableForm.get('orderFor')?.setValue(data.orderFor);
        var dateOfOrder = new Date(data.dateOfOrder);
        data.dateOfOrder = dateOfOrder.toISOString().split('T')[0];
        this.immvovableForm.get('dateOfOrder')?.setValue(data.dateOfOrder);
        this.immvovableForm.get('status')?.setValue(data.status);
        this.immvovableForm.get('remarks')?.setValue(data.remarks);
        this.employeeProfileId = data.employeeProfileId._id;
        this.phone = "+91"+data.employeeProfileId.mobileNo1;
        this.departmentId = data.departmentId;
        this.designationId = data.designationId;
      });
    });

    this.immovableService.getData().subscribe((res: any[]) => {
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

  onInput(event: any, field: string) {
    const inputValue = event.target.value.trim();
    let mergedOptions: { name: string, id: string, empProfileId: any,mobileNo:string }[] = []; 
    this.immovableService.getEmployeeList().subscribe((res: any) => {
      res.results.forEach((item: any) => {
        const name: string = item.fullName;
        const id: string = item.employeeId;
        const empProfileId: any = item._id;
        const mobileNo : string = item.mobileNo1;
        mergedOptions.push({ name, id, empProfileId,mobileNo });
      });
      if (field === 'officerName') {
        this.filteredOptions = mergedOptions.filter((option: { name: string, id: string }) => option.name.toLowerCase().includes(inputValue.toLowerCase()));
      } 
      if (this.filteredOptions.length === 0) {
        this.showDropdown = false;
        this.immvovableForm.get('officerName')?.setValue('');
      } else {
        this.showDropdown = true;
      }
    });
  }

  selectOption(option: any) {
    const payload = {name:option.name};
    this.selectedOption = option.name;
    this.phone = "+91"+option.mobileNo;
    this.immvovableForm.get('officerName')?.setValue(this.selectedOption);
    this.showDropdown = false;
    this.immovableService.employeeFilter(payload).subscribe((res:any)=>{
      res.results.empList.forEach((item:any)=>{
        this.employeeProfileId = item._id;
        this.immovableService.getDepartmentData().subscribe((departmentRes: any) => {
          departmentRes.filter((data: any) => {
            this.department.push({ label: data.department_name, value: data._id });
          });
          const matchingDepartment = this.department.filter(item => item.value == res.results.empList.find((data:any) => data.toDepartmentId)?.toDepartmentId);
          matchingDepartment.filter((item:any)=>{
            this.departmentId = item.value;
            this.immvovableForm.get('department')?.setValue(item.label)
          });         
        });

        this.immovableService.getDesignations().subscribe((designationRes: any) => {
          designationRes.results.filter((data: any) => {
            this.designation.push({ label: data.designation_name, value: data._id });
          });
          const matchingDesignation = this.designation.filter(item => item.value == res.results.empList.find((data:any) => data.toDesignationId)?.toDesignationId);
          matchingDesignation.filter((item:any)=>{
            this.designationId = item.value;
            this.immvovableForm.get('designation')?.setValue(item.label)
          });
         
        });
      })
    })
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.immvovableForm.patchValue({ orderFile: this.selectedFile });
    }
    this.selectedFile = event.target.files[0];
    this.immvovableForm.get('orderFile')?.setValue(this.selectedFile);
    if (this.selectedFile) {
      if (this.selectedFile.type !== 'application/pdf') {
        this.immvovableForm.get('orderFile')?.setErrors({ 'incorrectFileType': true });
        return;
      }

      if (this.selectedFile.size > 5 * 1024 * 1024) { // 5MB in bytes
        this.immvovableForm.get('orderFile')?.setErrors({ 'maxSize': true });
        return;
      }

      this.immvovableForm.get('orderFile')?.setErrors(null);
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
    console.log(this.immvovableForm.valid);
    if(this.immvovableForm.valid){
      const formData = new FormData();
      const formValues = this.immvovableForm.value;
      for (const key in formValues) {
        if (formValues.hasOwnProperty(key) && key !== 'orderFile') {
          formData.append(key, formValues[key]);
        }
      }
      if (this.selectedFile) {
        formData.append('orderFile', this.selectedFile);
      }
      this.module = "Immovable Property";
      formData.append('employeeProfileId', this.employeeProfileId);
      formData.append('departmentId', this.departmentId);
      formData.append('designationId', this.designationId);
      formData.append('phone',this.phone);
      formData.append('module',this.module);
      formData.append('id',this.id);
      this.immovableService.updateImmovable(formData).subscribe((res:any)=>{
        alert(res.message);
        this.router.navigateByUrl('immovable');
      },
      error => {
        console.error('API Error:', error.error);
      });
    }
  }

}
