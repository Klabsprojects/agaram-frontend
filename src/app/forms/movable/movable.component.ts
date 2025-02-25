import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveTransferService } from '../forms.service';

@Component({
  selector: 'app-movable',
  templateUrl: './movable.component.html',
  styleUrl: './movable.component.css'
})
export class MovableComponent implements OnInit{
  filterText : any;
  tableData:any[]=[];
  tableDataConst: any[] = [];
  pageSize: number = 10; 
  pageSizeOptions: number[] = [5, 10, 15, 20];
  currentPage: number = 1; 
  visiblePages: number[] = [];
  maxVisiblePages = 10;
  viewMovableData = new viewMovableData();
  url:string='';
  showAdd:boolean=false;
  showEdit:boolean=false;
  showView:boolean=false;
  showApprove:boolean=false;
  showPopup = true;

  constructor(private router:Router,private movableService:LeaveTransferService) { }

  ngOnInit(): void {
    this.url = this.movableService.fileUrl;
    const loginId = localStorage.getItem('loginId');
   const loginAs = localStorage.getItem('loginAs');
    this.movableService.getMovable(loginId,loginAs).subscribe((res:any)=>{
      this.tableData = res.results;
      this.tableDataConst = structuredClone(this.tableData);
    });
    this.checkAccess();
  }

  checkAccess(): void {
    this.movableService.currentRoleData.subscribe((response: any[]) => {
      const movableMenu = response.find(item => item.menu === 'Movable');
      this.showAdd = movableMenu?.entryAccess ?? false;
      this.showEdit = movableMenu?.editAccess ?? false;
      this.showView = movableMenu?.viewAccess ?? false;
      this.showApprove = movableMenu?.approvalAccess ?? false;
    });
  }

  addNew(){
    this.router.navigate(['create-movable']);
  }

  editMovable(data:any){
    const encodedData = btoa(JSON.stringify(data));
    this.router.navigate(['edit-movable'],{queryParams:{id:encodedData}});
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

  viewMovable(data:any){
    this.movableService.getMovableId(data).subscribe((res:any)=>{
      res.results.forEach((data:any)=>{
       this.movableService.getData().subscribe((res: any[]) => {
         res.forEach((item) => {
           if(item.category_type == "order_type"){
             if(item._id == data.orderType){
               this.viewMovableData.orderType = item.category_name;
             }
           }
           if (item.category_type == "order_for") {
             if(item._id == data.orderFor){
               this.viewMovableData.orderFor = item.category_name;
             }          
           }
         });
       });
       this.viewMovableData.phone = "+91"+data.employeeProfileId.mobileNo1;
       this.viewMovableData.id = data._id;
       this.viewMovableData.approvalStatus = data.approvalStatus;
       this.viewMovableData.name = data.officerName;
       this.viewMovableData.department = data.department;
       this.viewMovableData.designation = data.designation;
       this.viewMovableData.typeOfMovableProperty = data.typeOfMovableProperty;
       this.viewMovableData.detailsOfMovableProperty = data.detailsOfMovableProperty;
       this.viewMovableData.sourceOfFunding = data.sourceOfFunding;
       this.viewMovableData.totalCostOfProperty = data.totalCostOfProperty;
       this.viewMovableData.boughtFromName = data.boughtFromName;
       this.viewMovableData.boughtFromContactNumber = data.boughtFromContactNumber;
       this.viewMovableData.boughtFromAddress = data.boughtFromAddress;
       this.viewMovableData.propertyShownInIpr = data.propertyShownInIpr;
       this.viewMovableData.selfOrFamily = data.selfOrFamily;
       this.viewMovableData.movableDateOfOrder = data.movableDateOfOrder;
       this.viewMovableData.previousSanctionOrder = data.previousSanctionOrder;
       this.viewMovableData.orderType = data.orderType;
       this.viewMovableData.orderNo = data.orderNo;
       this.viewMovableData.orderFor = data.orderFor;
       this.viewMovableData.dateOfOrder = data.dateOfOrder;
       this.viewMovableData.orderFile = data.orderFile;
       this.viewMovableData.remarks = data.remarks;
      })
     })
  }

  approveMovable(data:any){
    const confirmation = confirm("Are you sure want to approve this record?");
    if(confirmation){
      const filePath = data.orderFile;
    const fileName = filePath.split('\\').pop();
  
    const approve = {
      approvedBy: localStorage.getItem('loginId'),
      id: data.id,
      phone: data.phone,
      module: "Movable Property",
      dateOfOrder: data.dateOfOrder.split('T')[0],
      fileName: fileName
    }
      this.movableService.approveMovable(approve).subscribe((res:any)=>{
        alert(res.message);
        window.location.reload();
        this.showPopup = false;
      })
     }
  }

  isDropdownOpen = false;
  fromdate: any;
  todate: any;
  propertyType: any;

  // Toggle the dropdown open/close state
  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation(); // Prevent event from bubbling and closing the dropdown
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Optional: Handle closing dropdown when clicking outside of it (if needed)
  closeDropdown(): void {
    this.isDropdownOpen = false;
    this.fromdate = undefined;
    this.todate = undefined;
    this.propertyType = undefined;
  }
  filter() {
    this.tableData = [];
    const loginAs = localStorage.getItem('loginAs');
    if (this.fromdate && this.todate && this.propertyType) {
      this.movableService.uploadGet(`getMovable?loginAs=${loginAs}&fromdate=${this.fromdate}&todate=${this.todate}&typeOfMovableProperty=${this.propertyType}`).subscribe((res: any) => {
        this.createTable(res);
      })
    }
    else if (this.fromdate && this.todate) {
      this.movableService.uploadGet(`getMovable?loginAs=${loginAs}&fromdate=${this.fromdate}&todate=${this.todate}`).subscribe((res: any) => {
        this.createTable(res);
      })
    }
    else if (this.propertyType) {
      this.movableService.uploadGet(`getMovable?loginAs=${loginAs}&typeOfMovableProperty=${this.propertyType}`).subscribe((res: any) => {
        this.createTable(res);
      })
    }
  }
  createTable(res: any) {
    this.tableData = res.results;
  }
  clear() {
    this.fromdate = undefined;
    this.todate = undefined;
    this.propertyType = undefined;
  }
  clearFilter() {
    this.tableData = this.tableDataConst;
  }
}

export class viewMovableData{
  id:string='';
  name:string='';
  department:string='';
  designation:string='';
  typeOfMovableProperty:string='';
  detailsOfMovableProperty:string='';
  sourceOfFunding:string='';
  totalCostOfProperty:string='';
  boughtFromName:string='';
  boughtFromContactNumber:string='';
  boughtFromAddress:string='';
  propertyShownInIpr:string='';
  movableDateOfOrder:string='';
  previousSanctionOrder:string='';
  selfOrFamily:string='';
  orderType:string='';
  orderNo:string='';
  orderFor:string='';
  dateOfOrder:string='';
  orderFile:string='';
  remarks:string='';
  phone:string='';
  approvalStatus = false;
}