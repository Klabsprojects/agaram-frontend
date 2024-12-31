import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveTransferService } from '../../forms.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-training',
  templateUrl: './edit-training.component.html',
  styleUrl: './edit-training.component.css'
})
export class EditTrainingComponent implements OnInit{
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
  id:any;
  url:string='';

  constructor(private trainingService:LeaveTransferService,private route:ActivatedRoute,private fb:FormBuilder,private router:Router){}

  ngOnInit(): void {
    const decodedId = this.route.snapshot.queryParamMap.get('id');
    if(decodedId){
      this.id = atob(decodedId);
      this.id = this.id.replace(/^"|"$/g, '');
    }

    this.trainingService.getTrainingId(this.id).subscribe((res:any)=>{
      res.results.forEach((data:any)=>{
        this.trainingForm.get('fullName')?.setValue(data.fullName);
        this.trainingForm.get('employeeId')?.setValue(data.employeeId);
        this.trainingForm.get('typeOfTraining')?.setValue(data.typeOfTraining);
        var fromDate = new Date(data.fromDate);
        data.fromDate= fromDate.toISOString().split('T')[0];
        this.trainingForm.get('fromDate')?.setValue(data.fromDate); 
        var endDate = new Date(data.endDate);
        data.endDate= endDate.toISOString().split('T')[0];
        this.trainingForm.get('endDate')?.setValue(data.endDate); 
        this.trainingForm.get('foreignVisitOrDeftCountry')?.setValue(data.foreignVisitOrDeftCountry);
        this.trainingForm.get('nameOfInstitute')?.setValue(data.nameOfInstitute);
        this.trainingForm.get('orderType')?.setValue(data.orderType); 
        this.trainingForm.get('orderNo')?.setValue(data.orderNo); 
        this.trainingForm.get('orderFor')?.setValue(data.orderFor); 
        var dateOfOrder = new Date(data.dateOfOrder);
        data.dateOfOrder = dateOfOrder.toISOString().split('T')[0];
        this.trainingForm.get('dateOfOrder')?.setValue(data.dateOfOrder);
        this.trainingForm.get('remarks')?.setValue(data.remarks); 
        this.url = this.trainingService.fileUrl+data.orderFile;
        this.phone = "+91"+data.employeeProfileId.mobileNo1;
        this.employeeProfileId = data.employeeProfileId._id;
        console.log(this.phone);
      })
    })

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
      remarks:['',Validators.required],
      orderFile:[null],
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
    });
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
    this.employeeProfileId = option.empProfileId;
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
      formData.append('module',this.module);
      formData.append('id',this.id);
      formData.append('phone',this.phone);
      formData.append('employeeProfileId',this.employeeProfileId);
      this.trainingService.updateTraining(formData).subscribe(
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
