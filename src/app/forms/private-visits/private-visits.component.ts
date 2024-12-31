import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveTransferService } from '../forms.service';

@Component({
  selector: 'app-private-visits',
  templateUrl: './private-visits.component.html',
  styleUrls: ['./private-visits.component.css']
})
export class PrivateVisitsComponent implements OnInit {
  filterText : any;
  tableData:any[]=[];
  pageSize: number = 10; 
  pageSizeOptions: number[] = [5, 10, 15, 20];
  currentPage: number = 1;
  visiblePages: number[] = [];
  maxVisiblePages = 10;
  showAdd:boolean=false;
  showView:boolean=false;
  showEdit:boolean=false;
  showApprove:boolean=false;
  viewPrivateVisitData = new viewPrivateVisitData();
  url='';
  showPopup = true;

  constructor(private router:Router,private privateVisitService:LeaveTransferService) { }

  ngOnInit(): void {

    console.log('Login As ',localStorage.getItem('loginAs'));
    console.log('loginId ',localStorage.getItem('loginId'));
    
    // localStorage.setItem('loginId', ele._id);
    // localStorage.setItem('loginAs', ele.loginAs);
    // localStorage.setItem('username', ele.username);

    this.url = this.privateVisitService.fileUrl;
    const loginId = localStorage.getItem('loginId');
   const loginAs = localStorage.getItem('loginAs');
    this.privateVisitService.getPrivateVisit(loginId,loginAs).subscribe((res:any)=>{
      this.tableData = res.results;
    });
    this.checkAccess();
  }

  checkAccess(): void {
    this.privateVisitService.currentRoleData.subscribe((response: any[]) => {
      console.log(response)
      const privateVisitMenu = response.find(item => item.menu === 'Private Visits');
      this.showAdd = privateVisitMenu?.entryAccess ?? false;
      this.showEdit = privateVisitMenu?.editAccess ?? false;
      this.showView = privateVisitMenu?.viewAccess ?? false;
      this.showApprove = privateVisitMenu?.approvalAccess ?? false;
    });
  }

  editPrivateVisit(data:any){
    const encodedData = btoa(JSON.stringify(data));
    this.router.navigate(['edit-private-visit'],{queryParams:{id:encodedData}});
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
    this.router.navigate(['create-private']);
  }

  viewPrivateVisit(data:any){
    this.privateVisitService.getPrivateVisitId(data).subscribe((res:any)=>{
      res.results.forEach((data:any)=>{
       this.privateVisitService.getData().subscribe((res: any[]) => {
         res.forEach((item) => {
           if(item.category_type == "order_type"){
             if(item._id == data.orderType){
               this.viewPrivateVisitData.orderType = item.category_name;
             }
           }
           if (item.category_type == "order_for") {
             if(item._id == data.orderFor){
               this.viewPrivateVisitData.orderFor = item.category_name;
             }          
           }
         });
       });
       this.viewPrivateVisitData.phone = "+91"+data.employeeProfileId.mobileNo1;
       this.viewPrivateVisitData.id = data._id;
       this.viewPrivateVisitData.approvalStatus = data.approvalStatus;
       this.viewPrivateVisitData.name = data.officerName;
       this.viewPrivateVisitData.department = data.department;
       this.viewPrivateVisitData.designation = data.designation;
       this.viewPrivateVisitData.fromDate = data.fromDate;
       this.viewPrivateVisitData.toDate = data.toDate;
       this.viewPrivateVisitData.proposedCountry = data.proposedCountry;
       //this.viewPrivateVisitData.fundSource = data.fundSource;
       this.viewPrivateVisitData.selfOrFamily = data.selfOrFamily;
       this.viewPrivateVisitData.status = data.status;
       this.viewPrivateVisitData.orderType = data.orderType;
       this.viewPrivateVisitData.orderNo = data.orderNo;
       this.viewPrivateVisitData.orderFor = data.orderFor;
       this.viewPrivateVisitData.dateOfOrder = data.dateOfOrder;
       this.viewPrivateVisitData.orderFile = data.orderFile;
       this.viewPrivateVisitData.remarks = data.remarks;
       this.viewPrivateVisitData.proposedAmountOfExpenditure = data.proposedAmountOfExpenditure;
      })
     })
  }

  approvePrivateVisit(data:any){
    const confirmation = confirm("Are you sure want to approve this record?");
    if(confirmation){
      const filePath = data.orderFile;
    const fileName = filePath.split('\\').pop();
  
    const approve = {
      approvedBy: localStorage.getItem('loginId'),
      id: data.id,
      phone: data.phone,
      module: "Private Visit",
      dateOfOrder: data.dateOfOrder.split('T')[0],
      fileName: fileName
    }
      this.privateVisitService.approvePrivateVisit(approve).subscribe((res:any)=>{
        alert(res.message);
        window.location.reload();
        this.showPopup = false;
      })
     }
  }
}

export class viewPrivateVisitData{
  id:string='';
  name:string='';
  department:string='';
  designation:string='';
  fromDate:string='';
  toDate:string='';
  proposedCountry:string='';
  //fundSource:string='';
  selfOrFamily:string='';
  status:string='';
  orderType:string='';
  orderNo:string='';
  orderFor:string='';
  dateOfOrder:string='';
  orderFile:string='';
  remarks:string='';
  phone:string='';
  approvalStatus = false;
  proposedAmountOfExpenditure:string='';
}
