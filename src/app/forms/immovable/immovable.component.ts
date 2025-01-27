import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveTransferService } from '../forms.service';
import { DatePipe } from '@angular/common';
import { ECDH } from 'node:crypto';

@Component({
  selector: 'app-immovable',
  templateUrl: './immovable.component.html',
  styleUrl: './immovable.component.css'
})
export class ImmovableComponent implements OnInit {

  filterText : any;
  tableData:any[]=[];
  pageSize: number = 10; 
  pageSizeOptions: number[] = [5, 10, 15, 20];
  currentPage: number = 1; 
  visiblePages: number[] = [];
  maxVisiblePages = 10;
  viewImmovableData = new viewImmovableData();
  url:string='';
  showAdd:boolean=false;
  showView:boolean=false;
  showEdit:boolean=false;
  showApprove:boolean=false;
  showPopup = true;

  constructor(private router:Router,private immovableService:LeaveTransferService,private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.url = this.immovableService.fileUrl;
    const loginId = localStorage.getItem('loginId');
   const loginAs = localStorage.getItem('loginAs');
    this.immovableService.getImmovable(loginId,loginAs).subscribe((res:any)=>{
      this.tableData = res.results;
    });
    this.checkAccess();
  }

  checkAccess(): void {
    this.immovableService.currentRoleData.subscribe((response: any[]) => {
      const immovableMenu = response.find(item => item.menu === 'Immovable');
      this.showAdd = immovableMenu?.entryAccess ?? false;
      this.showEdit = immovableMenu?.editAccess ?? false;
      this.showView = immovableMenu?.viewAccess ?? false;
      this.showApprove = immovableMenu?.approvalAccess ?? false;
    });
  }

  addNew(){
    this.router.navigate(['create-immovable']);
  }

  editImmovable(data:any){
    const encodedData = btoa(JSON.stringify(data));
    this.router.navigate(['edit-immovable'],{queryParams:{id:encodedData}});
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

  viewImmovable(data:any){
    this.immovableService.getImmovableId(data).subscribe((res:any)=>{
      res.results.forEach((data:any)=>{
       this.immovableService.getData().subscribe((res: any[]) => {
         res.forEach((item) => {
           if(item.category_type == "order_type"){
             if(item._id == data.orderType){
               this.viewImmovableData.orderType = item.category_name;
             }
           }
           if (item.category_type == "order_for") {
             if(item._id == data.orderFor){
               this.viewImmovableData.orderFor = item.category_name;
             }          
           }
         });
       });
       
       this.viewImmovableData.phone = "+91"+data.employeeProfileId.mobileNo1;
       this.viewImmovableData.id = data._id;
       this.viewImmovableData.approvalStatus = data.approvalStatus;
       this.viewImmovableData.name = data.officerName;
       this.viewImmovableData.department = data.department;
       this.viewImmovableData.designation = data.designation;
       this.viewImmovableData.typeOfImmovableProperty = data.typeOfImmovableProperty;
       this.viewImmovableData.detailsOfImmovableProperty = data.detailsOfImovableProperty;
       this.viewImmovableData.sourceOfFunding = data.sourceOfFunding;
       this.viewImmovableData.totalCostOfProperty = data.totalCostOfProperty;
       this.viewImmovableData.boughtFromName = data.boughtFromName;
       this.viewImmovableData.boughtFromContactNumber = data.boughtFromContactNumber;
       this.viewImmovableData.boughtFromAddress = data.boughtFromAddress;
       this.viewImmovableData.propertyShownInIpr = data.propertyShownInIpr;
       this.viewImmovableData.selfOrFamily = data.selfOrFamily;
       this.viewImmovableData.immovableDateOfOrder = data.immovableDateOfOrder;
       this.viewImmovableData.previousSanctionOrder = data.previousSanctionOrder;
       this.viewImmovableData.orderType = data.orderType;
       this.viewImmovableData.orderNo = data.orderNo;
       this.viewImmovableData.orderFor = data.orderFor;
       this.viewImmovableData.dateOfOrder = data.dateOfOrder;
       this.viewImmovableData.orderFile = data.orderFile;
       this.viewImmovableData.remarks = data.remarks;
      })
     })
  }
  approveImmovable(data:any){
    const confirmation = confirm("Are you sure want to approve this record?");
    if(confirmation){
      const filePath = data.orderFile;
    const fileName = filePath.split('\\').pop();
  
    const approve = {
      approvedBy: localStorage.getItem('loginId'),
      id: data.id,
      phone: data.phone,
      module: "Immovable Property",
      dateOfOrder: data.dateOfOrder.split('T')[0],
      fileName: fileName
    }
      this.immovableService.approveImmovable(approve).subscribe((res:any)=>{
        alert(res.message);
        window.location.reload();
        this.showPopup = false;
      })
     }
  }
}


export class viewImmovableData{
  id:string = '';
  name:string='';
  department:string='';
  designation:string='';
  typeOfImmovableProperty:string='';
  detailsOfImmovableProperty:string='';
  sourceOfFunding:string='';
  totalCostOfProperty:string='';
  boughtFromName:string='';
  boughtFromContactNumber:string='';
  boughtFromAddress:string='';
  propertyShownInIpr:string='';
  immovableDateOfOrder:string='';
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