import { Component,ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveTransferService } from '../forms.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-saf-village',
  templateUrl: './saf-village.component.html',
  styleUrls: ['./saf-village.component.css']
})
export class SafVillageComponent implements OnInit {
  filterText :any;
  tableData:any[]=[];
  pageSize: number = 10; 
  pageSizeOptions: number[] = [5, 10, 15, 20];
  currentPage: number = 1;
  visiblePages: number[] = [];
  maxVisiblePages = 10;
  showAdd:boolean=false;
  showEdit:boolean=false;
  safForm!:FormGroup;
  submitted = false;
  designationId:string='';
  departmentId:string='';
  filteredOptions: any[] = [];
  showDropdown = false;
  selectedOption:string='';
  employeeId:string='';
  phone:string='';
  employeeProfileId:string='';
  department:any[]=[];
  designation:any[]=[];
  safFormValue:any;
  showPopup = true;
  id:string='';

  constructor(private router:Router,private safService:LeaveTransferService,private fb:FormBuilder,private ElementRef:ElementRef) { }

  ngOnInit(): void {
    this.safForm = this.fb.group({
      officerName:['',Validators.required],
      designation:['',Validators.required],
      department:['',Validators.required]
    })
    const loginId = localStorage.getItem('loginId');
   const loginAs = localStorage.getItem('loginAs');
    this.safService.getSafApplication(loginId,loginAs).subscribe((res:any)=>{
      this.tableData = res.results;
    });
    this.checkAccess();
  }

  checkAccess(): void {
    this.safService.currentRoleData.subscribe((response: any[]) => {
      const safApplicationMenu = response.find(item => item.menu === 'SAF Games Village Application');
      this.showAdd = safApplicationMenu?.entryAccess ?? false;
      this.showEdit = safApplicationMenu?.editAccess ?? false;
    });
  }


  get filteredEmployeeList() {
    const filterText = (this.filterText || '').trim().toLowerCase();
    if (filterText === '') {
      return this.tableData;
    } else {
      return this.tableData.filter(employee =>
        Object.values(employee).some((value: any) =>
          value && value.toString().toLowerCase().includes(filterText)));
    }
  }
  public startIndex:any;
  pagedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.startIndex = startIndex;
    const endIndex = startIndex + this.pageSize;
    return this.filteredEmployeeList.slice(startIndex, endIndex);
  }
  get totalPages(): number {
    return Math.ceil(this.filteredEmployeeList.length / this.pageSize);
  }
  
  get pages(): number[] {
    const pagesCount = Math.min(5, this.totalPages); // Display up to 5 pages
    const startPage = Math.max(1, this.currentPage - Math.floor(pagesCount / 2));
    const endPage = Math.min(this.totalPages, startPage + pagesCount - 1);
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }
  
  
  changePageSize(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
  }

  updateVisiblePages() {
    const maxVisiblePages = this.maxVisiblePages;
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    
    if (totalPages <= maxVisiblePages + 2) {
      this.visiblePages = Array.from({length: totalPages}, (_, i) => i + 1);
    } else {
      const rangeStart = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const rangeEnd = Math.min(totalPages, rangeStart + maxVisiblePages - 1);
  
      if (rangeEnd === totalPages) {
        this.visiblePages = Array.from({length: maxVisiblePages}, (_, i) => totalPages - maxVisiblePages + i + 1);
      } else {
        this.visiblePages = Array.from({length: maxVisiblePages}, (_, i) => rangeStart + i);
      }
    }
  }
  
  // Call updateVisiblePages whenever the page changes
  nextPage() {
    this.currentPage++;
    this.updateVisiblePages();
  }
  
  prevPage() {
    this.currentPage--;
    this.updateVisiblePages();
  }
  
  goToPage(page: number) {
    this.currentPage = page;
    this.updateVisiblePages();
  }
  
  // addNew(){
  //   this.router.navigate(['create-saf-games-village']);
  // }

  
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

  editSafApplication(data:any){
    console.log(data);
    this.id = data;
    this.safService.getSafVillageApplicationId(data).subscribe((res:any)=>{
      console.log(res.results);
      res.results.forEach((data:any)=>{
        this.safForm.get('officerName')?.setValue(data.officerName);
        this.safForm.get('department')?.setValue(data.department);
        this.safForm.get('designation')?.setValue(data.designation);
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
        id:this.id
      }
      this.safService.updateSafApplication(this.safFormValue).subscribe((res:any)=>{
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
