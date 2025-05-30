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
      tableDataConst: any[] = [];
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
      installment:any[]=[];
    
      constructor(private router:Router,private hbaService:LeaveTransferService,private datePipe: DatePipe) { }
    
      ngOnInit(): void {
        this.url = this.hbaService.fileUrl;
        const loginId = localStorage.getItem('loginId');
       const loginAs = localStorage.getItem('loginAs');
        this.hbaService.getHba(loginId,loginAs).subscribe((res:any)=>{
          this.tableData = res.results;
          this.tableDataConst = structuredClone(this.tableData);
        });
        this.checkAccess();
        this.viewhbtypes();
      }
      genralcateg:any;
      viewhbtypes(){
        this.hbaService.getData().subscribe((res:any)=>{
          this.genralcateg = res;
        })
      }
      get_availedFor(id:any){
        const category = this.genralcateg.find((cat:any) => cat._id === id);
        return category ? category.category_name : null;
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
        this.installment = [];
          this.hbaService.getHbaId(data).subscribe((res:any)=>{
            res.results.forEach((data:any)=>{
              console.log(res.results);
              res.results.forEach((data:any)=>{
                if (data.installments && Array.isArray(data.installments)) {
                  this.installment.push(...data.installments); // Directly push all installments without checking for non-empty fields
                  console.log(this.installment);
                }
              });
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

            //  this.hbaService.getState().subscribe((res:any)=>{
            //   res.results.find((ele:any)=>{
            //     if(ele._id == data.state){
            //       this.viewHbaData.state = ele.stateName;
            //     }
            //   })
            //  })

            //  this.hbaService.getDistrict(data.state).subscribe((res:any)=>{
            //   res.results.find((ele:any)=>{
            //     if(ele._id == data.district){
            //       this.viewHbaData.district = ele.districtName;
            //     }
            //   })
            //  })
             this.viewHbaData.phone = "+91"+data.employeeProfileId?.mobileNo1;
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
             this.viewHbaData.district = data.district;
             this.viewHbaData.state = data.state;
             console.log("viewHbaData",this.viewHbaData);
            })
           })
        }
        isDropdownOpen = false;
  fromdate: any;
  todate: any;
  dateoforder:any;
  propertyType: any;
  hbaAvailed:any;
  typeofproperty:any;
  minprice:any;
  maxprice:any;

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
    this.hbaAvailed = undefined;
    this.typeofproperty = undefined;
    this.minprice = undefined;
    this.maxprice = undefined;
  }
  filter() {
    this.tableData = [];
    const loginAs = localStorage.getItem('loginAs');

    let params: any = { loginAs };
  
    if (this.fromdate && this.todate) {
      params.fromdate = this.fromdate;
      params.todate = this.todate;
    }

    if(this.hbaAvailed){
      params.hbaAvailedFor = this.hbaAvailed;
    }

    if(this.typeofproperty){
      params.typeOfProperty = this.typeofproperty;
    }
  
    if (this.minprice && this.maxprice) {
      params.minprice = this.minprice;
      params.maxprice = this.maxprice;
    }
  
    // Use URLSearchParams to encode values properly
    const queryString = new URLSearchParams(params).toString();
  
    // API call with properly encoded URL
    this.hbaService.uploadGet(`getHba?${queryString}`).subscribe((res: any) => {
      this.createTable(res);
    });
  }
  createTable(res: any) {
    this.tableData = res.results;
  }
  clear() {
    this.fromdate = undefined;
    this.todate = undefined;
    this.hbaAvailed = undefined;
    this.typeofproperty = undefined;
    this.minprice = undefined;
    this.maxprice = undefined;
  }
  clearFilter() {
    this.tableData = this.tableDataConst;
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