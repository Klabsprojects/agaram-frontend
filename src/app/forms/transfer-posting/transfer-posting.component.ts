import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveTransferService } from '../forms.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-transfer-posting',
  templateUrl: './transfer-posting.component.html',
  styleUrls: ['./transfer-posting.component.css']
})
export class TransferPostingComponent implements OnInit {
 
  filterText : any;
  tableData:any[]=[];
  pageSize: number = 100; 
  pageSizeOptions: number[] = [5, 10, 15, 20];
  currentPage: number = 1;
  visiblePages: number[] = [];
  maxVisiblePages = 10;
  viewTransferPostingData = new viewTransferPostingData();
  url = '';
  showAdd : boolean = false;
  showView:boolean = false;
  showEdit:boolean= false;
  showApprove:boolean = false;
  phone:any[]=[];
  showPopup = true;


  constructor(private router:Router,private transferPostingService:LeaveTransferService,private datePipe: DatePipe) { }

  ngOnInit(): void {
    const loginId = localStorage.getItem('loginId');
    const loginAs = localStorage.getItem('loginAs');
    this.url = this.transferPostingService.fileUrl;
    this.transferPostingService.getEmployeeUpdateList(loginId,loginAs).subscribe((res:any)=>{
      const filteredResults = res.results.filter((item: any) => item.updateType == "Transfer / Posting");
      this.tableData.push(...filteredResults);

        this.transferPostingService.getData().subscribe((item:any[])=>{
          const orderType = new Map(item.filter(data=>data.category_type == 'order_type').map(item => [item._id, item.category_name]));
          const orderFor = new Map(item.filter(data=>data.category_type == 'order_for').map(item => [item._id, item.category_name]));
          this.tableData.forEach((data: any) => {
             data.orderTypeCategoryCode = orderType.get(data.orderTypeCategoryCode) || data.orderTypeCategoryCode;
             data.orderForCategoryCode = orderFor.get(data.orderForCategoryCode) || data.orderForCategoryCode;
          });
        });
    });
    this.checkAccess();
  }

  checkAccess(): void {
    this.transferPostingService.currentRoleData.subscribe((response: any[]) => {
      const transferPostingMenu = response.find(item => item.menu === 'Transfer / Posting');
      this.showAdd = transferPostingMenu?.entryAccess ?? false;
      this.showEdit = transferPostingMenu?.editAccess ?? false;
      this.showView = transferPostingMenu?.viewAccess ?? false;
      this.showApprove = transferPostingMenu?.approvalAccess ?? false;
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
    this.router.navigate(['create-transfer']);
  }

  editTransferPosting(data:any){
    const encodedData = btoa(JSON.stringify(data));
    this.router.navigate(['edit-transfer'],{ queryParams: { _id: encodedData } });
  }

  viewTransferPosting(data: any) {
    this.transferPostingService.getTransferId(data).subscribe((res: any) => {
      res.results.forEach((data: any) => {
        this.transferPostingService.getData().subscribe((res: any[]) => {
          if (Array.isArray(res)) {
            res.forEach((item) => {
              if (item.category_type == "order_type" && item._id == data.orderTypeCategoryCode) {
                this.viewTransferPostingData.orderTypeCategoryCode = item.category_name;
              }
              
              if (item.category_type == "order_for" && item._id == data.orderForCategoryCode) {
                this.viewTransferPostingData.orderForCategoryCode = item.category_name;
              }
              data.transferOrPostingEmployeesList.forEach((element: any) => {
              if (item.category_type == "posting_in") {
                if (item._id == element.toPostingInCategoryCode) {
                    element.postingCategoryCode = item.category_name;
                    this.viewTransferPostingData.employeeDetails.toPostingInCategoryCode = item.category_name;
                  }
              }
              if (item.category_type == "post_type") {
                if (item._id == element.postTypeCategoryCode) {
                    element.postTypeCategoryCode = item.category_name;  
                    this.viewTransferPostingData.employeeDetails.postTypeCategoryCode = item.category_name;
                  }
              }
              if (item.category_type == "location_change") {
                if (item._id == element.locationChangeCategoryId) {
                    element.locationChangeCategoryId = item.category_name;  
                    this.viewTransferPostingData.employeeDetails.locationChangeCategoryId = item.category_name;
                  }
              }
            });
            });
          }
        }, (error) => {
          console.error("Error fetching data:", error);
        });
        
        this.transferPostingService.getDepartmentData().subscribe((res:any)=>{
          data.transferOrPostingEmployeesList.forEach((element: any) => {
            res.forEach((item:any)=>{
             if (element.toDepartmentId== item._id) {
                element.toDepartmentId = item.department_name;  
                this.viewTransferPostingData.employeeDetails.locationChangeCategoryId = item.department_name;
              }
            })
               
          });
        });

        this.transferPostingService.getDesignations().subscribe((response:any)=>{
          data.transferOrPostingEmployeesList.forEach((element: any) => {
            response.results.forEach((item:any)=>{
             if (element.toDesignationId== item._id) {
                element.toDesignationId = item.designation_name;  
                this.viewTransferPostingData.employeeDetails.locationChangeCategoryId = item.designation_name;
              }
            })
               
          });
        });
        this.viewTransferPostingData.approvalStatus = data.approvalStatus;
        this.viewTransferPostingData.id = data._id;
        this.viewTransferPostingData.orderTypeCategoryCode = data.orderTypeCategoryCode;
        this.viewTransferPostingData.orderNumber = data.orderNumber;
        this.viewTransferPostingData.orderForCategoryCode = data.orderForCategoryCode;
        this.viewTransferPostingData.dateOfOrder = data.dateOfOrder;
        this.viewTransferPostingData.orderFile = data.orderFile;
        this.viewTransferPostingData.employeeDetails = data.transferOrPostingEmployeesList;
      });
    });
  }
  
  transferPostingApprove(data:any){
      
    const confirmation = confirm("Are You sure want to approve this record?");
    if(confirmation){
      const filePath = data.orderFile;
    const fileName = filePath.split('\\').pop();
   const phone =  data.employeeDetails.forEach((ele:any)=>{
    this.phone.push("+91"+ele.empProfileId.mobileNo1);
  });
    const approve = {
      approvedBy: localStorage.getItem('loginId'),
      id: data.id,
      phoneArr: this.phone,
      module: "Transfer / Posting",
      dateOfOrder: data.dateOfOrder.split('T')[0],
      fileName: fileName
    }
      this.transferPostingService.updateTransferPostingApprovalStatus(approve).subscribe((res:any)=>{
        alert(res.message);
        window.location.reload();
        this.showPopup = false;
      })
     }
  }
}

export class viewTransferPostingData{
  // employeeDetails:employeeDetail[]=[];
  id:string='';
  employeeDetails:any;
  orderTypeCategoryCode:string='';
  orderNumber:string='';
  orderForCategoryCode:string='';
  dateOfOrder:string='';
  orderFile:string='';
  remarks:string='';
  approvalStatus:boolean=false;
}

export class employeeDetail{
  fullName:string='';
  employeeId:string='';
  toPostingInCategoryCode:string='';
  toDepartmentId:string='';
  toDesignationId:string='';
  postTypeCategoryCode:string='';
  locationChangeCategoryId:string='';
}