import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveTransferService } from '../forms.service';
import { DatePipe } from '@angular/common';
import { app } from '../../../../server';

@Component({
  selector: 'app-foreign-visit',
  templateUrl: './foreign-visit.component.html',
  styleUrls: ['./foreign-visit.component.css']
})
export class ForeignVisitComponent implements OnInit {
  filterText: any;
  tableData :any[]=[];
  tableDataConst: any[] = [];
  pageSize: number = 10; // Number of items per page
  pageSizeOptions: number[] = [5, 10, 15, 20];
  currentPage: number = 1; // Current page
  visiblePages: number[] = [];
  maxVisiblePages = 10;
  viewForeignVisitData = new viewForeignVisitData();
  url:string='';
  showAdd:boolean=false;
  showView:boolean=false;
  showEdit:boolean=false;
  showApprove:boolean=false;
  showPopup = true;
  showRejection = false;

  constructor(private router:Router,private foreignVisitService:LeaveTransferService,private datepipe:DatePipe) { }

  ngOnInit(): void {
    this.url = this.foreignVisitService.fileUrl;
    const loginId = localStorage.getItem('loginId');
    const loginAs = localStorage.getItem('loginAs');
    this.foreignVisitService.getForeignVisit(loginId,loginAs).subscribe((res:any)=>{
      this.tableData = res.results;
      this.tableDataConst = structuredClone(this.tableData);
    });
    this.getDesignation();
    this.checkAccess();
  }

  checkAccess(): void {
    this.foreignVisitService.currentRoleData.subscribe((response: any[]) => {
      const foreignVisitMenu = response.find(item => item.menu === 'Foreign Visit');
      this.showAdd = foreignVisitMenu?.entryAccess ?? false;
      this.showEdit = foreignVisitMenu?.editAccess ?? false;
      this.showView = foreignVisitMenu?.viewAccess ?? false;
      this.showApprove = foreignVisitMenu?.approvalAccess ?? false;
      console.log(this.showApprove);
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
    this.router.navigate(['create-foreign-visit']);
  }

  editForeignVisit(data:any){
    const encodedData = btoa(JSON.stringify(data));
    this.router.navigate(['edit-foreign-visit'],{queryParams:{id:encodedData}});
  }
  
  viewForeignVisit(data:any){
    this.foreignVisitService.getForeignVisitId(data).subscribe((res:any)=>{
    res.results.forEach((data:any)=>{
      this.foreignVisitService.getData().subscribe((res: any[]) => {
        res.forEach((item:any) => {
          if(item.category_type == "order_type"){
            if(item._id == data.orderType){
              this.viewForeignVisitData.orderType = item.category_name;
            }
          }
          if (item.category_type == "order_for") {
            if(item._id == data.orderFor){
              this.viewForeignVisitData.orderFor = item.category_name;
            }          
          }
          if (item.category_type == "foreign_visit_fund") {
            console.log(item);
            if(item._id == data.fundsSanctionedBy){
              this.viewForeignVisitData.fundsSanctionedBy = item.category_name;
            }          
          }
          // if (item.category_type == "state") {
          //   data.degreeData.forEach((ele:any)=>{
          //     if(item._id == ele.locationState){
          //       ele.locationStateName = item.category_name;
          //     }              
          //   });
          // }
          // if (item.category_type == "country") {
          //   data.degreeData.forEach((ele:any)=>{
          //     if(item._id == ele.locationCountry){
          //       ele.locationCountryName = item.category_name;
          //     }              
          //   });
          // }


        });
      });
      this.viewForeignVisitData.approvalStatus = data.approvalStatus;
      this.viewForeignVisitData.id = data._id;
      this.viewForeignVisitData.phone = data.employeeProfileId.mobileNo1;
      this.viewForeignVisitData.officerName = data.officerName;
      this.viewForeignVisitData.department = data.department;
      this.viewForeignVisitData.designation = data.designation;
      this.viewForeignVisitData.proposedCountry = data.proposedCountry;
      this.viewForeignVisitData.fromDate = data.fromDate;
      this.viewForeignVisitData.toDate = data.toDate;
      this.viewForeignVisitData.otherDelegates = data.otherDelegates;
      this.viewForeignVisitData.presentStatus = data.presentStatus;
      this.viewForeignVisitData.faxMessageLetterNo = data.faxMessageLetterNo;
      this.viewForeignVisitData.dateOfOrderofFaxMessage = data.dateOfOrderofFaxMessage;
      this.viewForeignVisitData.politicalClearance = data.politicalClearance;
      this.viewForeignVisitData.fcraClearance = data.fcraClearance;
      this.viewForeignVisitData.fundsSanctionedBy = data.fundsSanctionedBy;
      this.viewForeignVisitData.fundsSanctioned = data.fundsSanctioned;
      this.viewForeignVisitData.orderType = data.orderType;
      this.viewForeignVisitData.orderNo = data.orderNo;
      this.viewForeignVisitData.orderFor = data.orderFor;
      this.viewForeignVisitData.dateOfOrder = data.dateOfOrder;
      this.viewForeignVisitData.orderFile = data.orderFile;
      this.viewForeignVisitData.rejectReason = data.rejectReason;
      this.viewForeignVisitData.invitingAuthority = data.invitingAuthority;
      this.viewForeignVisitData.invitationFile = data.invitationFile;
      if(this.viewForeignVisitData.presentStatus == "Rejected"){
        this.showRejection = true;
      }
      else{
        this.showRejection = false;
      }
     })
    })
  }

  approveForeignVisit(data:any){
    console.log(data);
    const confirmation = confirm("Are you sure want to approve this record?");
    if(confirmation){
      const filePath = data.orderFile;
    const fileName = filePath.split('\\').pop();
  
    const approve = {
      approvedBy: localStorage.getItem('loginId'),
      id: data.id,
      phone: "+91"+data.phone,
      module: "Foreign Visit",
      dateOfOrder: data.dateOfOrder.split('T')[0],
      fileName: fileName
    }
      this.foreignVisitService.approveForeignVisit(approve).subscribe((res:any)=>{
        alert(res.message);
        window.location.reload();
        this.showPopup = false;
      })
     }
  }
  isDropdownOpen = false;
  fromdate: any;
  todate: any;
  typeOfTraining: any;
  filteredOptions:any[]=[];
  showDropdown:boolean=false;
  department:any[]=[]
  designation:any[]=[]
  name:any=''
  departmentname:any='';
  departmentId:any;
  designationname:any='';
  designationId:any;
  selectedCountry:any;

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
    this.typeOfTraining = undefined;
    this.department  = [];
    this.name = '';
    this.filteredOptions = [];
    this.showDropdown = false;
    this.departmentname = '';
    this.departmentId = undefined;
    this.selectedCountry = undefined;
    this.designationId = undefined;
    this.designationname = '';
  }
  filter() {
    this.tableData = [];
    const loginAs = localStorage.getItem('loginAs');
    // if (this.fromdate && this.todate && this.typeOfTraining) {
    //   this.foreignVisitService.uploadGet(`getLeave?loginAs=${loginAs}&fromdate=${this.fromdate}&todate=${this.todate}&typeOfLeave=${this.typeOfTraining}`).subscribe((res: any) => {
    //     this.createTable(res);
    //   })
    // }
    // else if (this.fromdate && this.todate) {
    //   this.foreignVisitService.uploadGet(`getLeave?loginAs=${loginAs}&fromdate=${this.fromdate}&todate=${this.todate}`).subscribe((res: any) => {
    //     this.createTable(res);
    //   })
    // }
    // else if (this.typeOfTraining) {
    //   this.foreignVisitService.uploadGet(`getLeave?loginAs=${loginAs}&typeOfLeave=${this.typeOfTraining}`).subscribe((res: any) => {
    //     this.createTable(res);
    //   })
    // }

    let params: any = { loginAs };
  
    if (this.fromdate && this.todate) {
      params.fromdate = this.fromdate;
      params.todate = this.todate;
    }

    if (this.designationId){
      params.designationId = this.designationId; 
    }

    if(this.selectedCountry){
      params.proposedCountry = this.selectedCountry;
    }

  
    // Use URLSearchParams to encode values properly
    const queryString = new URLSearchParams(params).toString();
  
    // API call with properly encoded URL
    this.foreignVisitService.uploadGet(`getVisit?${queryString}`).subscribe((res: any) => {
      this.createTable(res);
    });
  }
  createTable(res: any) {
    this.tableData = res.results;
  }
  clear() {
    this.fromdate = undefined;
    this.todate = undefined;
    this.typeOfTraining = undefined;
    this.department  = [];
    this.name = '';
    this.filteredOptions = [];
    this.showDropdown = false;
    this.departmentname = '';
    this.departmentId = undefined;
    this.selectedCountry = undefined;
    this.designationId = undefined;
    this.designationname = '';
  }
  clearFilter() {
    this.tableData = this.tableDataConst;
  }
  onInput(event: any, field: string) {
    const inputValue = event.target.value.trim();
    let mergedOptions: { name: string, id: string, empProfileId: any,mobileNo:string }[] = []; 
    this.foreignVisitService.getEmployeeList().subscribe((res: any) => {
      res.results.forEach((item: any) => {
        const name: string = item.fullName;
        const id: string = item.employeeId;
        const mobileNo = item.mobileNo1;
        const empProfileId: any = item._id;
        mergedOptions.push({ name, id, empProfileId,mobileNo });
      });
      if (field === 'officerName' && mergedOptions) {
        this.filteredOptions = mergedOptions.filter((option: { name: string, id: string }) =>
          option.name && option.name.toLowerCase().includes(inputValue?.toLowerCase() || '')
        );
      }
      
      if (this.filteredOptions.length === 0) {
        this.showDropdown = false;
      } else {
        this.showDropdown = true;
      }
    });
  }

  selectOption(option: any) {
    const payload = {name:option.name};
    this.name = option.name;
    this.showDropdown = false;
    // this.foreignVisitService.employeeFilter(payload).subscribe((res:any)=>{
    //   res.results.empList.forEach((item:any)=>{
    //     this.foreignVisitService.getDepartmentData().subscribe((departmentRes: any) => {
    //       departmentRes.filter((data: any) => {
    //         this.department.push({ label: data.department_name, value: data._id });
    //       });
    //       const matchingDepartment = this.department.filter(item => item.value == res.results.empList.find((data:any) => data.toDepartmentId)?.toDepartmentId);
    //      matchingDepartment.filter((item:any)=>{
    //       this.departmentId = item.value;
    //       this.departmentname = item.label;
    //       });
         
    //     })

    //     this.foreignVisitService.getDesignations().subscribe((designationRes: any) => {
    //       designationRes.results.filter((data: any) => {
    //         this.designation.push({ label: data.designation_name, value: data._id });
    //       });
    //       const matchingDesignation = this.designation.filter(item => item.value == res.results.empList.find((data:any) => data.toDesignationId)?.toDesignationId);
    //       matchingDesignation.filter((item:any)=>{
    //         this.designationId = item.value;
    //         this.designationname = item.label;
    //       });
         
    //     });
    //   })
    // })
  }

  getDesignation(){
    this.foreignVisitService.getDesignations().subscribe((designationRes: any) => {
      designationRes.results.filter((data: any) => {
        this.designation.push({ label: data.designation_name, value: data._id });
      });     
    });
  }
}


export class viewForeignVisitData{
  id:string='';
  phone:string='';
  officerName:string='';
  department:string='';
  designation:string='';
  proposedCountry:string='';
  fromDate:string='';
  toDate:string='';
  otherDelegates:string='';
  presentStatus:string='';
  rejectReason:string = '';
  faxMessageLetterNo:string='';
  dateOfOrderofFaxMessage:string='';
  politicalClearance:string='';
  fcraClearance:string='';
  fundsSanctionedBy:string='';
  fundsSanctioned:string='';
  orderType:string='';
  orderNo:string='';
  orderFor:string='';
  dateOfOrder:string='';
  orderFile:string='';
  approvalStatus:boolean=false;
  invitingAuthority:string='';
  invitationFile:string=''

  // remarks:string='';
}