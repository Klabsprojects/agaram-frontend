import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveTransferService } from '../forms.service';

@Component({
  selector: 'app-intimation',
  templateUrl: './intimation.component.html',
  styleUrl: './intimation.component.css'
})
export class IntimationComponent implements OnInit{

  filterText : any;
  tableData:any[]=[];
  pageSize: number = 10; 
  pageSizeOptions: number[] = [5, 10, 15, 20];
  currentPage: number = 1; // Current page
  visiblePages: number[] = [];
  maxVisiblePages = 10;
  viewIntimationData = new viewIntimationData();
  url:string='';
  showAdd:boolean=false;
  showView:boolean=false;
  showEdit:boolean=false;
  showApprove:boolean=false;
  showPopup = true;

  constructor(private router:Router,private intimationService:LeaveTransferService){}
  ngOnInit(): void {
    const loginId = localStorage.getItem('loginId');
   const loginAs = localStorage.getItem('loginAs');
    this.intimationService.getIntimation(loginId,loginAs).subscribe((res:any)=>{
      this.tableData = res.results;
    })
    this.url = this.intimationService.fileUrl;
    this.checkAccess();
  }

  checkAccess(): void {
    this.intimationService.currentRoleData.subscribe((response: any[]) => {
      const intimationMenu = response.find(item => item.menu === 'Intimation');
      this.showAdd = intimationMenu?.entryAccess ?? false;
      this.showEdit = intimationMenu?.editAccess ?? false;
      this.showView = intimationMenu?.viewAccess ?? false;
      this.showApprove = intimationMenu?.approvalAccess ?? false;
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
    this.router.navigateByUrl('create-intimation');
  }

  editIntimation(data:any){
    const encodedData = btoa(JSON.stringify(data));
    this.router.navigate(['edit-intimation'],{queryParams:{id:encodedData}});
  }

  viewIntimation(data:any){
    this.intimationService.getIntimationId(data).subscribe((res:any)=>{
     res.results.forEach((data:any)=>{
      this.intimationService.getData().subscribe((res: any[]) => {
        res.forEach((item) => {
          if(item.category_type == "order_type"){
            if(item._id == data.orderType){
              this.viewIntimationData.orderType = item.category_name;
            }
          }
          if (item.category_type == "order_for") {
            if(item._id == data.orderFor){
              this.viewIntimationData.orderFor = item.category_name;
            }          
          }
        });
      });
      this.viewIntimationData.phone = "+91"+data.employeeProfileId.mobileNo1;
       this.viewIntimationData.id = data._id;
       this.viewIntimationData.approvalStatus = data.approvalStatus;
      this.viewIntimationData.name = data.officerName;
      this.viewIntimationData.department = data.department;
      this.viewIntimationData.designation = data.designation;
      this.viewIntimationData.details = data.detailsOfIntimation;
      this.viewIntimationData.fund = data.fundSource;
      this.viewIntimationData.intimationType = data.typeOfIntimation;
      this.viewIntimationData.previousSanctionOrder = data.previousSanctionOrder;
      this.viewIntimationData.selfOrFamily = data.selfOrFamily;
      this.viewIntimationData.orderType = data.orderType;
      this.viewIntimationData.orderNo = data.orderNo;
      this.viewIntimationData.orderFor = data.orderFor;
      this.viewIntimationData.dateOfOrder = data.dateOfOrder;
      this.viewIntimationData.orderFile = data.orderFile;
      this.viewIntimationData.remarks = data.remarks;
     })
    })
  }

  approveIntimation(data:any){
    const confirmation = confirm("Are you sure want to approve this record?");
    if(confirmation){
      const filePath = data.orderFile;
    const fileName = filePath.split('\\').pop();
  
    const approve = {
      approvedBy: localStorage.getItem('loginId'),
      id: data.id,
      phone: data.phone,
      module: "Intimation",
      dateOfOrder: data.dateOfOrder.split('T')[0],
      fileName: fileName
    }
      this.intimationService.approveIntimation(approve).subscribe((res:any)=>{
        alert(res.message);
        window.location.reload();
        this.showPopup = false;
      })
     }
  }
}

export class viewIntimationData{
  id:string='';
  name:string='';
  department:string='';
  designation:string='';
  details:string='';
  fund:string='';
  intimationType:string='';
  previousSanctionOrder:string='';
  selfOrFamily:string='';
  orderType:string='';
  orderNo:string='';
  orderFor:string='';
  dateOfOrder:string='';
  orderFile:string='';
  remarks:string='';
  approvalStatus = false;
  phone:string='';
}