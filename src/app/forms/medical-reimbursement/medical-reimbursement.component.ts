import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveTransferService } from '../forms.service';

@Component({
  selector: 'app-medical-reimbursement',
  templateUrl: './medical-reimbursement.component.html',
  styleUrls: ['./medical-reimbursement.component.css']
})
export class MedicalReimbursementComponent implements OnInit {
  filterText : any;
  tableData:any[]=[];
  pageSize: number = 10; 
  pageSizeOptions: number[] = [5, 10, 15, 20];
  currentPage: number = 1; // Current page
  visiblePages: number[] = [];
  maxVisiblePages = 10;
  viewMedicalReimbursementData = new viewMedicalReimbursementData();
  url='';
  showEdit:boolean=false;
  showAdd:boolean=false;
  showView:boolean=false;
  showApprove:boolean=false;
  showPopup = true;

  constructor(private router:Router,private medicalService:LeaveTransferService) { }

  ngOnInit(): void {
    this.url = this.medicalService.fileUrl;
    const loginId = localStorage.getItem('loginId');
   const loginAs = localStorage.getItem('loginAs');
    this.medicalService.getMedicalReimbursement(loginId,loginAs).subscribe((res:any)=>{
      this.tableData = res.results;
    });
    this.checkAccess();
  }

  checkAccess(): void {
    this.medicalService.currentRoleData.subscribe((response: any[]) => {
      console.log(response)
      const medicalReimbursementMenu = response.find(item => item.menu === 'Medical Reimbursement');
      this.showAdd = medicalReimbursementMenu?.entryAccess ?? false;
      this.showEdit = medicalReimbursementMenu?.editAccess ?? false;
      this.showView = medicalReimbursementMenu?.viewAccess ?? false;
      this.showApprove = medicalReimbursementMenu?.approvalAccess ?? false;
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
    this.router.navigateByUrl('create-medical-reimbursement');
  }

  editMedical(data:any){
    const encodedData = btoa(JSON.stringify(data));
    this.router.navigate(['edit-medical-reimbursement'],{queryParams:{id:encodedData}});
  }

  viewMedicalReimbursement(data:any){
    console.log(data);
    this.medicalService.getMedicalReimbursementId(data).subscribe((res:any)=>{
      res.results.forEach((data:any)=>{
       this.medicalService.getData().subscribe((res: any[]) => {
         res.forEach((item) => {
           if(item.category_type == "order_type"){
             if(item._id == data.orderType){
               this.viewMedicalReimbursementData.orderType = item.category_name;
             }
           }
           if (item.category_type == "order_for") {
             if(item._id == data.orderFor){
               this.viewMedicalReimbursementData.orderFor = item.category_name;
             }          
           }
         });
       });
       this.viewMedicalReimbursementData.phone = "+91"+data.employeeProfileId.mobileNo1;
       this.viewMedicalReimbursementData.id = data._id;
       this.viewMedicalReimbursementData.approvalStatus = data.approvalStatus;
       this.viewMedicalReimbursementData.name = data.officerName;
       this.viewMedicalReimbursementData.department = data.department;
       this.viewMedicalReimbursementData.designation = data.designation;
       this.viewMedicalReimbursementData.detailsOfMedicalReimbursement = data.detailsOfMedicalReimbursement;
       this.viewMedicalReimbursementData.totalCostOfMedicalReimbursement = data.totalCostOfMedicalReimbursement;
       this.viewMedicalReimbursementData.dmeConcurranceStatus = data.dmeConcurranceStatus;
       this.viewMedicalReimbursementData.selfOrFamily = data.selfOrFamily;
       this.viewMedicalReimbursementData.nameOfTheHospital = data.nameOfTheHospital;
       this.viewMedicalReimbursementData.dateOfApplication = data.dateOfApplication;
       this.viewMedicalReimbursementData.treatmentTakenFor = data.treatmentTakenFor;
       this.viewMedicalReimbursementData.orderType = data.orderType;
       this.viewMedicalReimbursementData.orderNo = data.orderNo;
       this.viewMedicalReimbursementData.orderFor = data.orderFor;
       this.viewMedicalReimbursementData.dateOfOrder = data.dateOfOrder;
       this.viewMedicalReimbursementData.orderFile = data.orderFile;
       this.viewMedicalReimbursementData.remarks = data.remarks;
       this.viewMedicalReimbursementData.dischargeOrTestFile = data.dischargeOrTestFile;
      })
     })
  }

  approveMedicalReimbursement(data:any){
    const confirmation = confirm("Are you sure want to approve this record?");
    if(confirmation){
      const filePath = data.orderFile;
    const fileName = filePath.split('\\').pop();
  
    const approve = {
      approvedBy: localStorage.getItem('loginId'),
      id: data.id,
      phone: data.phone,
      module: "Medical Reimbursement",
      dateOfOrder: data.dateOfOrder.split('T')[0],
      fileName: fileName
    }
      this.medicalService.approveMedicalReimbursement(approve).subscribe((res:any)=>{
        alert(res.message);
        window.location.reload();
        this.showPopup = false;
      })
     }
  }
}

export class viewMedicalReimbursementData{
  id:string = '';
  name:string='';
  department:string='';
  designation:string='';
  detailsOfMedicalReimbursement:string='';
  totalCostOfMedicalReimbursement:string='';
  dmeConcurranceStatus:string='';
  selfOrFamily:string='';
  dateOfApplication:string='';
  nameOfTheHospital:string='';
  treatmentTakenFor:string='';
  orderType:string='';
  orderNo:string='';
  orderFor:string='';
  dateOfOrder:string='';
  orderFile:string='';
  remarks:string='';
  phone:string = '';
  approvalStatus = false;
  dischargeOrTestFile:string=''
}