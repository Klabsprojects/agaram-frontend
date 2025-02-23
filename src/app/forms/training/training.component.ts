import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveTransferService } from '../forms.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit {

  filterText : any;
  tableData:any[]=[];
  tableDataConst: any[] = [];
  pageSize: number = 10; 
  pageSizeOptions: number[] = [5, 10, 15, 20];
  currentPage: number = 1; // Current page
  visiblePages: number[] = [];
  maxVisiblePages = 10;
  viewTrainingData = new viewTrainingData();
  url='';
  showAdd:boolean=false;
  showView:boolean=false;
  showEdit:boolean=false;
  showApprove:boolean=false;
  showPopup = true;

  constructor(private router:Router,private trainingService:LeaveTransferService,private datePipe: DatePipe) { }
  
  
  ngOnInit(): void {
    this.url = this.trainingService.fileUrl;
    const loginId = localStorage.getItem('loginId');
    const loginAs = localStorage.getItem('loginAs');
    this.trainingService.getTraining(loginId,loginAs).subscribe((res:any)=>{
      this.tableData = res.results;

      this.trainingService.getData().subscribe((item:any[])=>{
        const typeTraining = new Map(item.filter(data=>data.category_type == 'training_type').map(item => [item._id, item.category_name]));
        const country = new Map(item.filter(data=>data.category_type == 'country').map(item => [item._id, item.category_name]));
        this.tableData.forEach((data: any) => {
          data.typeOfTraining = typeTraining.get(data.typeOfTraining) || data.typeOfTraining;
          data.foreignVisitOrDeftCountry = country.get(data.foreignVisitOrDeftCountry) || data.foreignVisitOrDeftCountry;
        });
        this.tableDataConst = structuredClone(this.tableData);
      })
    });
    this.checkAccess();
    this.trainingService.getData().subscribe((res:any)=>{
      res.forEach((item:any)=>{
        if (item.category_type == "training_type") {
          this.trainingTypearray.push({ label: item.category_name, value: item._id });
        }
      })
    })
  }


  checkAccess(): void {
    this.trainingService.currentRoleData.subscribe((response: any[]) => {
      const trainingMenu = response.find(item => item.menu === 'Training');
      this.showAdd = trainingMenu?.entryAccess ?? false;
      this.showEdit = trainingMenu?.editAccess ?? false;
      this.showView = trainingMenu?.viewAccess ?? false;
      this.showApprove = trainingMenu?.approvalAccess ?? false;
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
  addNew(){
    this.router.navigate(['create-training']);
  }

  editTraining(data:any){
    const encodedData = btoa(JSON.stringify(data));
    this.router.navigate(['edit-training'],{queryParams:{id:encodedData}});
  }

  viewTraining(data:any){
    console.log('viewTraining ', data);
    this.trainingService.getTrainingId(data).subscribe((res:any)=>{
      res.results.forEach((data:any)=>{
       this.trainingService.getData().subscribe((res: any[]) => {
         res.forEach((item) => {
           if(item.category_type == "order_type"){
             if(item._id == data.orderType){
               this.viewTrainingData.orderType = item.category_name;
             }
           }
           if (item.category_type == "order_for") {
             if(item._id == data.orderFor){
               this.viewTrainingData.orderFor = item.category_name;
             }          
           }
           if (item.category_type == "training_type") {
            if(item._id == data.typeOfTraining){
              this.viewTrainingData.typeOfTraining = item.category_name;
            }          
          }
          if (item.category_type == "country") {
            if(item._id == data.foreignVisitOrDeftCountry){
              this.viewTrainingData.foreignVisitOrDeftCountry = item.category_name;
            }          
          }
         });
       });
       console.log('this.viewTrainingData', this.viewTrainingData);
       this.viewTrainingData.phone = "+91"+data.employeeProfileId.mobileNo1;
       this.viewTrainingData.id = data._id;
       this.viewTrainingData.approvalStatus = data.approvalStatus;
       this.viewTrainingData.name = data.fullName;
       this.viewTrainingData.employeeId = data.employeeId;
       this.viewTrainingData.fromDate = data.fromDate;
       this.viewTrainingData.endDate = data.endDate;
       this.viewTrainingData.foreignVisitOrDeftCountry = data.foreignVisitOrDeftCountry;
       this.viewTrainingData.typeOfTraining = data.typeOfTraining;
       this.viewTrainingData.nameOfInstitute = data.nameOfInstitute;
       this.viewTrainingData.orderType = data.orderType;
       this.viewTrainingData.orderNo = data.orderNo;
       this.viewTrainingData.orderFor = data.orderFor;
       this.viewTrainingData.dateOfOrder = data.dateOfOrder;
       this.viewTrainingData.orderFile = data.orderFile;
       this.viewTrainingData.remarks = data.remarks;
       console.log('this.viewTrainingData after', this.viewTrainingData);
      })
     })
  }

  approveTraining(data:any){
    console.log('viewTrainingData ', data);
    const confirmation = confirm("Are you sure want to approve this record?");
    if(confirmation){
    const filePath = data.orderFile;
    const fileName = filePath.split('\\').pop();
    const approve = {
      approvedBy: localStorage.getItem('loginId'),
      id: data.id,
      phone: data.phone,
      module: "Training",
      dateOfOrder: data.dateOfOrder.split('T')[0],
      fileName: fileName
    }
    this.trainingService.approveTraining(approve).subscribe((res:any)=>{
      alert(res.message)
        window.location.reload();
       this.showPopup = false;
    })
  }
  }
  isDropdownOpen = false;
  fromdate: any;
  todate: any;
  typeOfTraining: any;
  trainingTypearray: any[] = [];

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
  }
  filter() {
    this.tableData = [];
    const loginAs = localStorage.getItem('loginAs');
    if (this.fromdate && this.todate && this.typeOfTraining) {
      this.trainingService.uploadGet(`getTraining?loginAs=${loginAs}&fromdate=${this.fromdate}&todate=${this.todate}&typeOfTraining=${this.typeOfTraining}`).subscribe((res: any) => {
        this.createTable(res);
      })
    }
    else if (this.fromdate && this.todate) {
      this.trainingService.uploadGet(`getTraining?loginAs=${loginAs}&fromdate=${this.fromdate}&todate=${this.todate}`).subscribe((res: any) => {
        this.createTable(res);
      })
    }
    else if (this.typeOfTraining) {
      this.trainingService.uploadGet(`getTraining?loginAs=${loginAs}&typeOfTraining=${this.typeOfTraining}`).subscribe((res: any) => {
        this.createTable(res);
      })
    }
  }
  createTable(res: any) {
    this.tableData = res.results;
    this.trainingService.getData().subscribe((item:any[])=>{
      const typeTraining = new Map(item.filter(data=>data.category_type == 'training_type').map(item => [item._id, item.category_name]));
      const country = new Map(item.filter(data=>data.category_type == 'country').map(item => [item._id, item.category_name]));
      this.tableData.forEach((data: any) => {
        data.typeOfTraining = typeTraining.get(data.typeOfTraining) || data.typeOfTraining;
        data.foreignVisitOrDeftCountry = country.get(data.foreignVisitOrDeftCountry) || data.foreignVisitOrDeftCountry;
      });
    })
  }
  clear() {
    this.fromdate = undefined;
    this.todate = undefined;
    this.typeOfTraining = undefined;
  }
  clearFilter() {
    this.tableData = this.tableDataConst;
  }
}

export class viewTrainingData{
  id:string='';
  name:string='';
  employeeId:string='';
  fromDate:string='';
  endDate:string='';
  foreignVisitOrDeftCountry:string='';
  typeOfTraining:string='';
  nameOfInstitute:string='';
  orderType:string='';
  orderNo:string='';
  orderFor:string='';
  dateOfOrder:string='';
  orderFile:string='';
  remarks:string='';
  approvalStatus:boolean=false;
  phone:string='';
}