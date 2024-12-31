import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveTransferService } from '../../forms.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-saf-games-allocation',
  templateUrl: './saf-games-allocation.component.html',
  styleUrl: './saf-games-allocation.component.css'
})
export class SafGamesAllocationComponent implements OnInit{

  filterText :any;
  tableData:any[]=[];
  pageSize: number = 10; 
  pageSizeOptions: number[] = [5, 10, 15, 20];
  currentPage: number = 1;
  visiblePages: number[] = [];
  maxVisiblePages = 10;
  popupVisible = false;
  employeeAllocationHistory = new employeeAllocationHistory();
  updateVacateForm!:FormGroup;
  updateSafValue:any;
  submitted = false;
  allocationId : string = '';
  viewSafAllocationData = new viewSafAllocationData();
  url='';
  showAdd:boolean=false;
  showView:boolean=false;  
  showEdit:boolean=false;
  showApprove:boolean=false;

  constructor(private router:Router,private safService:LeaveTransferService,private fb:FormBuilder){}

  ngOnInit(): void {
    this.url = this.safService.fileUrl;
    this.safService.getSafAllocation().subscribe((res:any)=>{
      this.tableData = res.results;
    });
    this.checkAccess();
  }

  checkAccess(): void {
    this.safService.currentRoleData.subscribe((response: any[]) => {
      console.log(response)
      const safAllocationMenu = response.find(item => item.menu === 'SAF Games Village Allocation');
      this.showAdd = safAllocationMenu?.entryAccess ?? false;
      this.showEdit = safAllocationMenu?.editAccess ?? false;
      this.showView = safAllocationMenu?.viewAccess ?? false;
      this.showApprove = safAllocationMenu?.approvalAccess ?? false;
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

  pagedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
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

  addNew(){
    this.router.navigateByUrl('create-saf-allocation');
  }

  updateVacating(data:any){
    this.allocationId = data;
    this.popupVisible = true;
    this.safService.getSafAllocation(data).subscribe((res:any)=>{
      res.results.forEach((data:any)=>{
      this.employeeAllocationHistory.officerName = data.officerName;
      this.employeeAllocationHistory.employeeId = data.employeeId;
      this.employeeAllocationHistory.department = data.department;
      this.employeeAllocationHistory.designation = data.designation;
      this.employeeAllocationHistory.blockId = data.blockId;
      this.employeeAllocationHistory.dateOfAccomodation = data.dateOfAccomodation;
      this.employeeAllocationHistory.employeeProfileId = data.employeeProfileId;
      });
    });
    this.updateVacateForm = this.fb.group({
      dateOfVacating:['',Validators.required]
    })
  }

  onSubmit(){
    this.submitted = true;
    if(this.updateVacateForm.valid){
      this.updateSafValue = {
        ...this.updateVacateForm.value,
        employeeProfileId:this.employeeAllocationHistory.employeeProfileId,
        blockId: this.employeeAllocationHistory.blockId._id,
        id: this.allocationId
      }
      console.log(this.updateSafValue);
      this.safService.updateSafAllocation(this.updateSafValue).subscribe(
        response => {
          alert(response.message);
          this.popupVisible = false;
        },
        error => {
          console.error('API Error:', error);
        }
      );
    }
    }


    viewSafAllocation(data:any){
      this.safService.getSafVillageAllocationId(data).subscribe((res:any)=>{
        res.results.forEach((data:any)=>{
         this.safService.getData().subscribe((res: any[]) => {
           res.forEach((item) => {
             if(item.category_type == "order_type"){
               if(item._id == data.orderType){
                 this.viewSafAllocationData.orderType = item.category_name;
               }
             }
             if (item.category_type == "order_for") {
               if(item._id == data.orderFor){
                 this.viewSafAllocationData.orderFor = item.category_name;
               }          
             }
           });
         });
         this.viewSafAllocationData.name = data.officerName;
         this.viewSafAllocationData.department = data.department;
         this.viewSafAllocationData.designation = data.designation;
         this.viewSafAllocationData.employeeId = data.employeeId;
         this.viewSafAllocationData.blockId = data.blockId.FlatNumber;
         this.viewSafAllocationData.dateOfAccomodation = data.dateOfAccomodation;
         this.viewSafAllocationData.dateOfVacating = data.dateOfVacating;
         this.viewSafAllocationData.orderType = data.orderType;
         this.viewSafAllocationData.orderNo = data.orderNo;
         this.viewSafAllocationData.orderFor = data.orderFor;
         this.viewSafAllocationData.dateOfOrder = data.dateOfOrder;
         this.viewSafAllocationData.orderFile = data.orderFile;
         this.viewSafAllocationData.remarks = data.remarks;
        })
       })
    }
    
  }



export class employeeAllocationHistory{
  employeeId: string='';
  department:string='';
  designation:string='';
  blockId:any;
  dateOfAccomodation:string='';
  orderType:string='';
  orderNo:number = 0;
  orderFor:string='';
  dateOfOrder:string='';
  officerName:string='';
  employeeProfileId:string='';
}

export class viewSafAllocationData{
  name:string='';
  employeeId:string='';
  department:string='';
  designation:string='';
  blockId:string='';
  dateOfAccomodation:string='';
  dateOfVacating:string='';
  orderType:string='';
  orderNo:string='';
  orderFor:string='';
  dateOfOrder:string='';
  orderFile:string='';
  remarks:string='';
}
