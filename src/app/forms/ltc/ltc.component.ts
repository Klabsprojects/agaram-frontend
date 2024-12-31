import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveTransferService } from '../forms.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-ltc',
  templateUrl: './ltc.component.html',
  styleUrls: ['./ltc.component.css']
})
export class LtcComponent implements OnInit {
  filterText : any;
  tableData:any[]=[];
  pageSize: number = 10; 
  pageSizeOptions: number[] = [5, 10, 15, 20];
  currentPage: number = 1; // Current page
  visiblePages: number[] = [];
  maxVisiblePages = 10;
  viewLtcData = new viewLtcData();
  url='';
  showAdd:boolean=false;
  showView:boolean=false;
  showEdit:boolean=false;
  showApprove:boolean=false;  
  showPopup = true;

  constructor(private router:Router,private ltcService:LeaveTransferService,private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.url = this.ltcService.fileUrl;
    const loginId = localStorage.getItem('loginId');
   const loginAs = localStorage.getItem('loginAs');
    this.ltcService.getLtc(loginId,loginAs).subscribe((res:any)=>{
      this.tableData = res.results;
    });
    this.checkAccess();
  }

  checkAccess(): void {
    this.ltcService.currentRoleData.subscribe((response: any[]) => {
      const ltcMenu = response.find(item => item.menu === 'Leave Travel Concession');
      this.showAdd = ltcMenu?.entryAccess ?? false;
      this.showEdit = ltcMenu?.editAccess ?? false;
      this.showView = ltcMenu?.viewAccess ?? false;
      this.showApprove = ltcMenu?.approvalAccess ?? false;
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
  changeValue(data:any){
    if(data.target.value == "Print"){
      const printableElement = document.querySelector('.printable-content');
      console.log(printableElement);
      if (printableElement) {
        window.print();
      } else {
        console.error('Printable element not found');
      }
    }
  }

  addNew(){
    this.router.navigate(['create-ltc']);
  }

  editLtc(data:any){
    const encodedData = btoa(JSON.stringify(data));
    this.router.navigate(['edit-ltc'],{queryParams:{id:encodedData}});
  }

  viewLtc(data:any){
    this.ltcService.getLtcId(data).subscribe((res:any)=>{
      res.results.forEach((data:any)=>{
       this.ltcService.getData().subscribe((res: any[]) => {
         res.forEach((item) => {
           if(item.category_type == "order_type"){
             if(item._id == data.orderType){
               this.viewLtcData.orderType = item.category_name;
             }
           }
           if (item.category_type == "order_for") {
             if(item._id == data.orderFor){
               this.viewLtcData.orderFor = item.category_name;
             }          
           }
         });
       });
       this.viewLtcData.phone = "+91"+data.employeeProfileId.mobileNo1;
       this.viewLtcData.id = data._id;
       this.viewLtcData.approvalStatus = data.approvalStatus;
       this.viewLtcData.name = data.officerName;
       this.viewLtcData.department = data.department;
       this.viewLtcData.designation = data.designation;
       this.viewLtcData.fromDate = data.fromDate;
       this.viewLtcData.toDate = data.toDate;
       this.viewLtcData.proposedPlaceOfVisit = data.proposedPlaceOfVisit;
       this.viewLtcData.blockYear = data.blockYear;
       this.viewLtcData.selfOrFamily = data.selfOrFamily;
       this.viewLtcData.fromPlace = data.fromPlace;
       this.viewLtcData.toPlace = data.toPlace;
       this.viewLtcData.orderType = data.orderType;
       this.viewLtcData.orderNo = data.orderNo;
       this.viewLtcData.orderFor = data.orderFor;
       this.viewLtcData.dateOfOrder = data.dateOfOrder;
       this.viewLtcData.orderFile = data.orderFile;
       this.viewLtcData.remarks = data.remarks;
       this.viewLtcData.leaveAvailed = data.leaveAvailed;
       this.viewLtcData.category = data.category;
      })
     })
  }

  approveLtc(data:any){
    const confirmation = confirm("Are you sure want to approve this record?");
    if(confirmation){
      const filePath = data.orderFile;
    const fileName = filePath.split('\\').pop();
  
    const approve = {
      approvedBy: localStorage.getItem('loginId'),
      id: data.id,
      phone: data.phone,
      module: "Leave Travel Concession",
      dateOfOrder: data.dateOfOrder.split('T')[0],
      fileName: fileName
    }
      this.ltcService.approveLtc(approve).subscribe((res:any)=>{
        alert(res.message);
        window.location.reload();
        this.showPopup = false;
      })
     }
  }
}

export class viewLtcData{
  id:string = '';
  name:string='';
  department:string='';
  designation:string='';
  fromDate:string='';
  toDate:string='';
  proposedPlaceOfVisit:string='';
  blockYear:string='';
  fromPlace:string='';
  selfOrFamily:string='';
  toPlace:string='';
  orderType:string='';
  orderNo:string='';
  orderFor:string='';
  dateOfOrder:string='';
  orderFile:string='';
  remarks:string='';
  phone:string = '';
  approvalStatus = false;
  leaveAvailed:string='';
  category:string='';
}
