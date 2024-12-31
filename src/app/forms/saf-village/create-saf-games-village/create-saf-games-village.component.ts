import { Component, OnInit, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveTransferService } from '../../forms.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-create-saf-games-village',
  templateUrl: './create-saf-games-village.component.html',
  styleUrls: ['./create-saf-games-village.component.css']
})
export class CreateSafGamesVillageComponent implements OnInit {

  safForm!:FormGroup;
  submitted = false;
  showDropdown = false;
  selectedOption:string='';
  filteredOptions: any[] = [];
  employeeProfileId:string='';
  employeeId:string='';
  designationId:string='';
  departmentId:string='';
  department:any[]=[];
  designation:any[]=[];
  safFormValue:any;
  showPopup = true;
  phone:string='';
  submittedBy:any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private fb:FormBuilder,private safService:LeaveTransferService,private router:Router,private ElementRef:ElementRef) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.submittedBy = localStorage.getItem('loginId');
    }
    this.safForm = this.fb.group({
      officerName:['',Validators.required],
      designation:['',Validators.required],
      department:['',Validators.required]
    })
  }

  onInput(event: any, field: string) {
    const inputValue = event.target.value.trim();
    let mergedOptions: { name: string, id: string, empProfileId: any,mobileNo:string }[] = []; 
    this.safService.getEmployeeList().subscribe((res: any) => {
      res.results.forEach((item: any) => {
        const name: string = item.fullName;
        const id: string = item.employeeId;
        const empProfileId: any = item._id;
        const mobileNo=item.mobileNo1;
        mergedOptions.push({ name, id, empProfileId,mobileNo });
      });
      if (field === 'officerName') {
        this.filteredOptions = mergedOptions.filter((option: { name: string, id: string }) => option.name.toLowerCase().includes(inputValue.toLowerCase()));
      } 
      if (this.filteredOptions.length === 0) {
        this.showDropdown = false;
        this.safForm.get('officerName')?.setValue('');
      } else {
        this.showDropdown = true;
      }
    });
  }

  selectOption(option: any) {
    console.log(option);
    const payload = {name:option.name};
    this.selectedOption = option.name;
    this.employeeId = option.id;
    this.phone = "+91"+option.mobileNo;
    this.safForm.get('officerName')?.setValue(this.selectedOption);
    this.showDropdown = false;
    this.safService.employeeFilter(payload).subscribe((res:any)=>{
      res.results.empList.forEach((item:any)=>{
        this.employeeProfileId = item._id;
        this.safService.getDepartmentData().subscribe((departmentRes: any) => {
          departmentRes.filter((data: any) => {
            this.department.push({ label: data.department_name, value: data._id });
          });
          const matchingDepartment = this.department.filter(item => item.value == res.results.empList.find((data:any) => data.toDepartmentId)?.toDepartmentId);
          matchingDepartment.filter((item:any)=>{
            this.departmentId = item.value;
            this.safForm.get('department')?.setValue(item.label)
          });         
        });

        this.safService.getDesignations().subscribe((designationRes: any) => {
          designationRes.results.filter((data: any) => {
            this.designation.push({ label: data.designation_name, value: data._id });
          });
          const matchingDesignation = this.designation.filter(item => item.value == res.results.empList.find((data:any) => data.toDesignationId)?.toDesignationId);
          matchingDesignation.filter((item:any)=>{
            this.designationId = item.value;
            this.safForm.get('designation')?.setValue(item.label)
          });
         
        });
      })
    })
  }


  Submit(){
    this.submitted = true;
    if(this.safForm.valid){
      this.safFormValue = {
        ...this.safForm.value,
        employeeProfileId : this.employeeProfileId,
        departmentId:this.departmentId,
        designationId:this.designationId,
        employeeId :this.employeeId,
        phone:this.phone,
        submittedBy:this.submittedBy
      }
      this.safService.applySaf(this.safFormValue).subscribe((res:any)=>{
        alert(res.message);
        this.router.navigateByUrl('saf-village-application');
        this.showPopup = false;
        setTimeout(() => {
          this.ElementRef.nativeElement.ownerDocument.querySelector('.modal-backdrop.fade').style.opacity = '0';
          window.location.reload();
        });
      })
    }
  }

}
