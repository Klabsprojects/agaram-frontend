import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveTransferService } from '../forms.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-hba',
  templateUrl: './hba.component.html',
  styleUrls: ['./hba.component.css']
})
export class HbaComponent implements OnInit {
  filterText : any;
      tableData:any[]=[];
      pageSize: number = 10; 
      pageSizeOptions: number[] = [5, 10, 15, 20];
      currentPage: number = 1; // Current page
      visiblePages: number[] = [];
      maxVisiblePages = 10;
      url='';
      showAdd:boolean=false;
      showView:boolean=false;
      showEdit:boolean=false;
      showApprove:boolean=false;  
      showPopup = true;
      viewHbaData = new viewHbaData();

    
      constructor(private router:Router,private hbaService:LeaveTransferService,private datePipe: DatePipe) { }
    
      ngOnInit(): void {
        this.url = this.hbaService.fileUrl;
        const loginId = localStorage.getItem('loginId');
       const loginAs = localStorage.getItem('loginAs');
        this.hbaService.getHba(loginId,loginAs).subscribe((res:any)=>{
          this.tableData = res.results;
        });
        this.checkAccess();
      }
    
      checkAccess(): void {
        this.hbaService.currentRoleData.subscribe((response: any[]) => {
          const idCardMenu = response.find(item => item.menu === 'Hba');
          this.showAdd = idCardMenu?.entryAccess ?? false;
          this.showEdit = idCardMenu?.editAccess ?? false;
          this.showView = idCardMenu?.viewAccess ?? false;
          this.showApprove = idCardMenu?.approvalAccess ?? false;
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
        this.router.navigate(['create-hba']);
      }
  
      editHba(data:any){
        const encodedData = btoa(JSON.stringify(data));
        this.router.navigate(['edit-hba'],{queryParams:{id:encodedData}});
      }
  
      viewHba(data:any){
          this.hbaService.getHbaId(data).subscribe((res:any)=>{
            res.results.forEach((data:any)=>{
              console.log(res.results);
             this.hbaService.getData().subscribe((res: any[]) => {
               res.forEach((item) => {
                 if(item.category_type == "order_type"){
                   if(item._id == data.orderType){
                     this.viewHbaData.orderType = item.category_name;
                   }
                 }
                 if (item.category_type == "order_for") {
                   if(item._id == data.orderFor){
                     this.viewHbaData.orderFor = item.category_name;
                   }          
                 }
               });
             });

             this.hbaService.getState().subscribe((res:any)=>{
              res.results.find((ele:any)=>{
                if(ele._id == data.state){
                  this.viewHbaData.state = ele.stateName;
                }
              })
             })

             this.hbaService.getDistrict(data.state).subscribe((res:any)=>{
              res.results.find((ele:any)=>{
                if(ele._id == data.district){
                  this.viewHbaData.district = ele.districtName;
                }
              })
             })
             this.viewHbaData.phone = "+91"+data.employeeProfileId.mobileNo1;
             this.viewHbaData.id = data._id;
             this.viewHbaData.approvalStatus = data.approvalStatus;
             this.viewHbaData.officerName = data.officerName;
             this.viewHbaData.department = data.department;
             this.viewHbaData.designation = data.designation;
             this.viewHbaData.hbaAvailedFor = data.hbaAvailedFor;
             this.viewHbaData.typeOfProperty = data.typeOfProperty;
             this.viewHbaData.dateOfApplication = data.dateOfApplication;
             this.viewHbaData.totalCostOfProperty = data.totalCostOfProperty;
             this.viewHbaData.isExisingResidenceAvailable = data.isExisingResidenceAvailable;
             this.viewHbaData.twoBRelacation = data.twoBRelacation;
             this.viewHbaData.totalHbaAvailed = data.totalHbaAvailed;
             this.viewHbaData.totalNumberOfInstallments = data.totalNumberOfInstallments;
             this.viewHbaData.totalNumberOfRecoveryMonths = data.totalNumberOfRecoveryMonths;
             this.viewHbaData.orderType = data.orderType;
             this.viewHbaData.orderNo = data.orderNo;
             this.viewHbaData.orderFor = data.orderFor;
             this.viewHbaData.dateOfOrder = data.dateOfOrder;
             this.viewHbaData.orderFile = data.orderFile;
             this.viewHbaData.remarks = data.remarks;
            })
           })
        }
  }
  
  export class viewHbaData{
    id:string = '';
    officerName:string='';
    department:string='';
    designation:string='';
    state:string='';
    district:string='';
    hbaAvailedFor:string='';
    typeOfProperty:string='';
    dateOfApplication:string='';
    totalCostOfProperty:string='';
    isExisingResidenceAvailable:string='';
    twoBRelacation:string='';
    totalHbaAvailed:string='';
    totalNumberOfInstallments:string='';
    totalNumberOfRecoveryMonths:string='';
    orderType:string='';
    orderNo:string='';
    orderFor:string='';
    dateOfOrder:string='';
    orderFile:string='';
    remarks:string='';
    phone:string = '';
    approvalStatus = false;
  }