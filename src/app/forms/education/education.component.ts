import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveTransferService } from '../forms.service';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrl: './education.component.css'
})
export class EducationComponent implements OnInit{

  filterText : any;
  tableData:any[]=[];
  pageSize: number = 10; 
  pageSizeOptions: number[] = [5, 10, 15, 20];
  currentPage: number = 1; // Current page
  visiblePages: number[] = [];
  maxVisiblePages = 10;
  viewEducationData = new viewEducationData();
  url:string='';
  showAdd:boolean=false;
  showView:boolean=false;
  showEdit:boolean=false;
  showApprove:boolean=false;
  showPopup = true;

  constructor(private router:Router,private educationService:LeaveTransferService){}
  ngOnInit(): void {
    this.url = this.educationService.fileUrl;
    const loginId = localStorage.getItem('loginId');
   const loginAs = localStorage.getItem('loginAs');
    this.educationService.getEducation(loginId,loginAs).subscribe((res:any)=>{
      res.results.forEach((ele:any)=>{
        if(ele.employeeProfileId){
          this.tableData = res.results;
        }
      })
    });
    this.checkAccess();
  }

  checkAccess(): void {
    this.educationService.currentRoleData.subscribe((response: any[]) => {
      const educationMenu = response.find(item => item.menu === 'Education');
      this.showAdd = educationMenu?.entryAccess ?? false;
      this.showEdit = educationMenu?.editAccess ?? false;
      this.showView = educationMenu?.viewAccess ?? false;
      this.showApprove = educationMenu?.approvalAccess ?? false;
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
    this.router.navigateByUrl('create-education');
  }

  editEducation(data:any){
    const encodedData = btoa(JSON.stringify(data));
    this.router.navigate(['edit-education'],{queryParams:{id:encodedData}});
  }

  viewEducation(data:any){
    this.educationService.getEducationnId(data).subscribe((res:any)=>{
    res.results.forEach((data:any)=>{
      
      this.educationService.getData().subscribe((res: any[]) => {
        res.forEach((item) => {
          if(item.category_type == "order_type"){
            if(item._id == data.orderType){
              this.viewEducationData.orderType = item.category_name;
            }
          }
          if (item.category_type == "order_for") {
            if(item._id == data.orderFor){
              this.viewEducationData.orderFor = item.category_name;
            }          
          }
          if (item.category_type == "state") {
            data.degreeData.forEach((ele:any)=>{
              if(item._id == ele.locationState){
                ele.locationStateName = item.category_name;
              }              
            });
          }
          if (item.category_type == "country") {
            data.degreeData.forEach((ele:any)=>{
              if(item._id == ele.locationCountry){
                ele.locationCountryName = item.category_name;
              }              
            });
          }

        });
        this.educationService.getDegree().subscribe((res:any)=>{
          res.results.forEach((deg:any)=>{
            data.degreeData.forEach((ele:any)=>{
              if(deg._id == ele.degree){
                ele.degree = deg.degree_name;
              } 
            });
          })
        });
      });
      this.viewEducationData.phone = "+91"+data.employeeProfileId.mobileNo1;
       this.viewEducationData.id = data._id;
       this.viewEducationData.approvalStatus = data.approvalStatus;
      this.viewEducationData.name = data.officerName;
      this.viewEducationData.department = data.department;
      this.viewEducationData.designation = data.designation;
      this.viewEducationData.educationdetails = data.degreeData;
      this.viewEducationData.orderType = data.orderType;
      this.viewEducationData.orderNo = data.orderNo;
      this.viewEducationData.orderFor = data.orderFor;
      this.viewEducationData.dateOfOrder = data.dateOfOrder;
      this.viewEducationData.orderFile = data.orderFile;
      this.viewEducationData.remarks = data.remarks;
     })
    })
  }

  approveEducation(data:any){
    const confirmation = confirm("Are you sure want to approve this record?");
    if(confirmation){
      const filePath = data.orderFile;
    const fileName = filePath.split('\\').pop();
  
    const approve = {
      approvedBy: localStorage.getItem('loginId'),
      id: data.id,
      phone: data.phone,
      module: "Education",
      dateOfOrder: data.dateOfOrder.split('T')[0],
      fileName: fileName
    }
      this.educationService.approveEducation(approve).subscribe((res:any)=>{
        alert(res.message);
        window.location.reload();
        this.showPopup = false;
      })
     }
  }

}


export class viewEducationData{
  id:string = '';
  name:string='';
  department:string='';
  designation:string='';
  educationdetails:education[]=[];
  orderType:string='';
  orderNo:string='';
  orderFor:string='';
  dateOfOrder:string='';
  orderFile:string='';
  remarks:string='';
  approvalStatus = false;
  phone:string = '';
}
export class education{
  courseLevel:string='';
  degree:string='';
  specialisation:string='';
  instituteName:string='';
  locationState:string='';
  locationStateName:string='';
  locationCountry:string='';
  locationCountryName:string='';
  durationOfCourse:string='';
  fund:string='';
  fees:string='';
  courseCompletedYear:string='';
  courseCompletedDate:string='';
}