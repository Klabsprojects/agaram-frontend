import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LeaveTransferService } from '../../forms.service';

@Component({
  selector: 'app-edit-medical-reimbursement',
  templateUrl: './edit-medical-reimbursement.component.html',
  styleUrl: './edit-medical-reimbursement.component.css'
})
export class EditMedicalReimbursementComponent implements OnInit{
  medicalForm!:FormGroup;
  submitted = false;
  selectedFile:File | null = null;
  dischargeSelectedFile: File |null =null;
  showDropdown = false;
  filteredOptions:any[]=[];
  department:any[]=[];
  designation:any[]=[];
  orderFor:any[]=[];
  orderType:any[]=[];
  selectedOption:string='';
  employeeProfileId : string = '';
  departmentId:string='';
  designationId:string = '';
  phone:string='';
  module:string='';
  id:any;
  orderFileUrl:string='';
  DischargeFileUrl:string='';
  showDischargeFile = false;
  constructor(private fb:FormBuilder,private route:ActivatedRoute,private router:Router,private medicalService:LeaveTransferService){}

  ngOnInit(): void {
    const decodedId = this.route.snapshot.queryParamMap.get('id');
    if(decodedId){
      this.id = atob(decodedId);
      this.id = this.id.replace(/^"|"$/g, '');
    }
    this.medicalForm = this.fb.group({
      officerName:['',Validators.required],
      department:['',Validators.required],
      designation:['',Validators.required],
      detailsOfMedicalReimbursement:['',Validators.required],
      totalCostOfMedicalReimbursement:['',Validators.required],
      dmeConcurranceStatus:['',Validators.required],
      selfOrFamily:['',Validators.required],
      dateOfApplication:['',Validators.required],
      nameOfTheHospital:['',Validators.required],
      treatmentTakenFor:['',Validators.required],
      orderType:['',Validators.required],
      orderNo:['',Validators.required],
      orderFor:['',Validators.required],
      dateOfOrder:['',Validators.required],
      orderFile:[null,Validators.required],
      remarks:['',Validators.required],
      dischargeSummaryEndorsed: ['', Validators.required],
      // dischargeOrTestFile: ['', Validators.required]
    });
    this.medicalService.getMedicalReimbursementId(this.id).subscribe((res:any)=>{
      res.results.forEach((data:any)=>{
        console.log(data);
        this.medicalForm.get('officerName')?.setValue(data.officerName);
        this.medicalForm.get('department')?.setValue(data.department);
        this.medicalForm.get('designation')?.setValue(data.designation);
        this.medicalForm.get('detailsOfMedicalReimbursement')?.setValue(data.detailsOfMedicalReimbursement);
        this.medicalForm.get('totalCostOfMedicalReimbursement')?.setValue(data.totalCostOfMedicalReimbursement);
        this.medicalForm.get('dmeConcurranceStatus')?.setValue(data.dmeConcurranceStatus);
        this.medicalForm.get('selfOrFamily')?.setValue(data.selfOrFamily);
        var dateOfApplication = new Date(data.dateOfApplication);
        data.dateOfApplication = dateOfApplication.toISOString().split('T')[0];
        this.medicalForm.get('dateOfApplication')?.setValue(data.dateOfApplication);
        this.medicalForm.get('nameOfTheHospital')?.setValue(data.nameOfTheHospital);
        this.medicalForm.get('treatmentTakenFor')?.setValue(data.treatmentTakenFor);
        this.medicalForm.get('orderType')?.setValue(data.orderType);
        this.medicalForm.get('orderNo')?.setValue(data.orderNumber);
        this.medicalForm.get('orderFor')?.setValue(data.orderFor);
        var dateOfOrder = new Date(data.dateOfOrder);
        data.dateOfOrder = dateOfOrder.toISOString().split('T')[0];
        this.medicalForm.get('dateOfOrder')?.setValue(data.dateOfOrder);
        this.orderFileUrl = this.medicalService.fileUrl+data.orderFile;
        this.medicalForm.get('remarks')?.setValue(data.remarks);
        this.medicalForm.get('dischargeSummaryEndorsed')?.setValue(data.dischargeSummaryEndorsed);
        this.DischargeFileUrl = this.medicalService.fileUrl+data.dischargeOrTestFile;
        this.employeeProfileId = data.employeeProfileId._id;
        this.phone = "+91"+data.employeeProfileId.mobileNo1;
        this.departmentId = data.departmentId;
        this.designationId = data.designationId;
      })
    })
    this.medicalService.getData().subscribe((res: any[]) => {
      res.forEach((item) => {
        if(item.category_type == "order_type"){
          this.orderType.push({label:item.category_name,value:item._id});
        }
        if (item.category_type == "order_for") {
          this.orderFor.push({ label: item.category_name, value: item._id });
        }
      });
    });
    this.medicalForm.get('dischargeSummaryEndorsed')?.valueChanges.subscribe((value) => {
      this.showDischargeFile = value === 'yes' || value === 'others';
    });
    
  }


  onInput(event: any, field: string) {
    const inputValue = event.target.value.trim();
    let mergedOptions: { name: string, id: string, empProfileId: any, mobileNo:string }[] = []; 
    this.medicalService.getEmployeeList().subscribe((res: any) => {
      res.results.forEach((item: any) => {
        const name: string = item.fullName;
        const id: string = item.employeeId;
        const empProfileId: any = item._id;
        const mobileNo:string = item.mobileNo1;
        mergedOptions.push({ name, id, empProfileId,mobileNo });
      });
      if (field === 'officerName') {
        this.filteredOptions = mergedOptions.filter((option: { name: string, id: string }) => option.name.toLowerCase().includes(inputValue.toLowerCase()));
      } 
      if (this.filteredOptions.length === 0) {
        this.showDropdown = false;
        this.medicalForm.get('officerName')?.setValue('');
      } else {
        this.showDropdown = true;
      }
    });
  }

  selectOption(option: any) {
    const payload = {name:option.name};
    this.selectedOption = option.name;
    this.phone = "+91"+option.mobileNo;
    this.medicalForm.get('officerName')?.setValue(this.selectedOption);
    this.showDropdown = false;
    this.medicalService.employeeFilter(payload).subscribe((res:any)=>{
      res.results.empList.forEach((item:any)=>{
        this.employeeProfileId = item._id;
        this.medicalService.getDepartmentData().subscribe((departmentRes: any) => {
          departmentRes.filter((data: any) => {
            this.department.push({ label: data.department_name, value: data._id });
          });
          const matchingDepartment = this.department.filter(item => item.value == res.results.empList.find((data:any) => data.toDepartmentId)?.toDepartmentId);
          matchingDepartment.filter((item:any)=>{
            this.departmentId = item.value;
            this.medicalForm.get('department')?.setValue(item.label)
          });         
        });

        this.medicalService.getDesignations().subscribe((designationRes: any) => {
          designationRes.results.filter((data: any) => {
            this.designation.push({ label: data.designation_name, value: data._id });
          });
          const matchingDesignation = this.designation.filter(item => item.value == res.results.empList.find((data:any) => data.toDesignationId)?.toDesignationId);
          matchingDesignation.filter((item:any)=>{
            this.designationId = item.value;
            this.medicalForm.get('designation')?.setValue(item.label)
          });
         
        });
      })
    })
  }

  onFileSelected(event: any,docfield:string) {

    if (docfield === 'order') {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        this.selectedFile = input.files[0];
        this.medicalForm.patchValue({ orderFile: this.selectedFile });
      }
      this.selectedFile = event.target.files[0];
      this.medicalForm.get('orderFile')?.setValue(this.selectedFile);
      if (this.selectedFile) {
        if (this.selectedFile.type !== 'application/pdf') {
          this.medicalForm.get('orderFile')?.setErrors({ 'incorrectFileType': true });
          return;
        }
        
        if (this.selectedFile.size > 5 * 1024 * 1024) { // 5MB in bytes
          this.medicalForm.get('orderFile')?.setErrors({ 'maxSize': true });
          return;
        }
        
        this.medicalForm.get('orderFile')?.setErrors(null);
      }
    }else if (docfield === 'discharge') {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        this.dischargeSelectedFile = input.files[0];
        this.medicalForm.patchValue({ dischargeOrTestFile: this.dischargeSelectedFile });
      }
      this.dischargeSelectedFile = event.target.files[0];
      this.medicalForm.get('dischargeOrTestFile')?.setValue(this.dischargeSelectedFile);
      if (this.dischargeSelectedFile) {
        if (this.dischargeSelectedFile.type !== 'application/pdf') {
          this.medicalForm.get('dischargeOrTestFile')?.setErrors({ 'incorrectFileType': true });
          return;
        }

        if (this.dischargeSelectedFile.size > 5 * 1024 * 1024) { // 5MB in bytes
          this.medicalForm.get('dischargeOrTestFile')?.setErrors({ 'maxSize': true });
          return;
        }

        this.medicalForm.get('dischargeOrTestFile')?.setErrors(null);
      }
    }
  }

  onKeyDown(event:KeyboardEvent){
    
  }

  onSubmit(){
    this.submitted  = true;
    if (this.medicalForm.valid) {
      const formData = new FormData();
      const formValues = this.medicalForm.value;
      for (const key in formValues) {
        if (formValues.hasOwnProperty(key) && key !== 'orderFile') {
          formData.append(key, formValues[key]);
        }
      }
      if (this.selectedFile) {
        formData.append('orderFile', this.selectedFile);
      }
      if(this.dischargeSelectedFile){
        formData.append('dischargeOrTestFile',this.dischargeSelectedFile);
      }
      this.module = "Medical Reimbursement";
      formData.append('employeeProfileId', this.employeeProfileId);
      formData.append('departmentId', this.departmentId);
      formData.append('designationId', this.designationId);
      formData.append('phone',this.phone);
      formData.append('module',this.module);
      formData.append('id',this.id);
      this.medicalService.updateMedicalReimbursement(formData).subscribe(
        response => {
          alert("Added Successfully...");
          this.router.navigateByUrl('medical-reimbursement');
         console.log('API Response:', response);
        },
        error => {
          console.error('API Error:', error);
        }
      );
    }
  }
}
