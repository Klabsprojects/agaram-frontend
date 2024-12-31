import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveTransferService } from '../forms.service';
import { app } from '../../../../server';

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.css']
})
export class LeaveComponent implements OnInit {
  filterText : any;
  tableData:any[]=[];
  pageSize: number = 10; 
  pageSizeOptions: number[] = [5, 10, 15, 20];
  currentPage: number = 1; // Current page
  visiblePages: number[] = [];
  maxVisiblePages = 10;
  leaveType:any;
  viewLeaveData = new viewLeaveData();
  url='';
  showAdd:boolean=false;
  showView:boolean=false;
  showEdit:boolean=false;
  showApprove:boolean=false;
  showPopup = true;

  constructor(private router:Router,private leaveService:LeaveTransferService,private datePipe: DatePipe) { }

  ngOnInit(): void {
   this.url = this.leaveService.fileUrl;
   const loginId = localStorage.getItem('loginId');
   const loginAs = localStorage.getItem('loginAs');
    this.leaveService.getLeave(loginId,loginAs).subscribe((res:any)=>{
      this.tableData = res.results;
  this.leaveService.getData().subscribe((res: any[]) => {
  const typeMap = new Map(res.filter(item => item.category_type === "leave_type").map(item => [item._id, item.category_name]));
  const countryMap = new Map(res.filter(item => item.category_type === "country").map(item => [item._id, item.category_name]));
    this.tableData.forEach((data: any) => {
    data.typeOfLeave = typeMap.get(data.typeOfLeave) || data.typeOfLeave;
    data.foreignVisitOrDeftCountry = countryMap.get(data.foreignVisitOrDeftCountry) || data.foreignVisitOrDeftCountry;
  });
});

    });
    this.checkAccess();
  }

  checkAccess(): void {
    this.leaveService.currentRoleData.subscribe((response: any[]) => {
      const leaveMenu = response.find(item => item.menu === 'Leave');
      this.showAdd = leaveMenu?.entryAccess ?? false;
      this.showEdit = leaveMenu?.editAccess ?? false;
      this.showView = leaveMenu?.viewAccess ?? false;
      this.showApprove = leaveMenu?.approvalAccess ?? false;
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
    this.router.navigate(['apply-leave']);
  }

  editLeave(data:any){
    const encodedData = btoa(JSON.stringify(data));
    this.router.navigate(['edit-leave'],{queryParams:{id:encodedData}});
  }

  viewLeave(data:any){
    this.leaveService.getLeaveId(data).subscribe((res:any)=>{
      res.results.forEach((data:any)=>{
       this.leaveService.getData().subscribe((res: any[]) => {
         res.forEach((item) => {
           if(item.category_type == "order_type"){
             if(item._id == data.orderType){
               this.viewLeaveData.orderType = item.category_name;
             }
           }
           if (item.category_type == "order_for") {
             if(item._id == data.orderFor){
               this.viewLeaveData.orderFor = item.category_name;
             }          
           }
           if (item.category_type == "leave_type") {
            if(item._id == data.typeOfLeave){
              this.viewLeaveData.typeOfLeave = item.category_name;
            }          
          }
          if (item.category_type == "country") {
            if(item._id == data.foreignVisitOrDeftCountry){
              this.viewLeaveData.foreignVisitOrDeftCountry = item.category_name;
            }          
          }
         });
       });
       this.viewLeaveData.phone = "+91"+data.employeeProfileId.mobileNo1;
       this.viewLeaveData.id = data._id;
       this.viewLeaveData.approvalStatus = data.approvalStatus;
       this.viewLeaveData.name = data.fullName;
       this.viewLeaveData.employeeId = data.employeeId;
       this.viewLeaveData.fromDate = data.fromDate;
       this.viewLeaveData.endDate = data.endDate;
       this.viewLeaveData.foreignVisitOrDeftCountry = data.foreignVisitOrDeftCountry;
       this.viewLeaveData.typeOfLeave = data.typeOfLeave;
       this.viewLeaveData.orderType = data.orderType;
       this.viewLeaveData.orderNo = data.orderNo;
       this.viewLeaveData.orderFor = data.orderFor;
       this.viewLeaveData.dateOfOrder = data.dateOfOrder;
       this.viewLeaveData.orderFile = data.orderFile;
       this.viewLeaveData.remarks = data.remarks;
      })
     })
  }

  approveLeave(data:any){
    const confirmation = confirm("Are you sure want to approve this record?");
    if(confirmation){
      const filePath = data.orderFile;
    const fileName = filePath.split('\\').pop();
  
    const approve = {
      approvedBy: localStorage.getItem('loginId'),
      id: data.id,
      phone: data.phone,
      module: "Leave",
      dateOfOrder: data.dateOfOrder.split('T')[0],
      fileName: fileName
    }
      this.leaveService.approveLeave(approve).subscribe((res:any)=>{
        alert(res.message);
        window.location.reload();
        this.showPopup = false;
      })
     }
  }

}


export class viewLeaveData{
  id:string='';
  name:string='';
  employeeId:string='';
  fromDate:string='';
  endDate:string='';
  foreignVisitOrDeftCountry:string='';
  typeOfLeave:string='';
  orderType:string='';
  orderNo:string='';
  orderFor:string='';
  dateOfOrder:string='';
  orderFile:string='';
  remarks:string='';
  approvalStatus = false;
  phone:string='';
}