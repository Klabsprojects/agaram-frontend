import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { employeeList } from '../officer.model';
import { LeaveTransferService } from '../../forms/forms.service';
import { app } from '../../../../server';


@Component({
  selector: 'app-officer-profile-list',
  templateUrl: './officer-profile-list.component.html',
  styleUrls: ['./officer-profile-list.component.css']
})
export class OfficerProfileListComponent implements OnInit {

  public employeeListData:any[]=[];
  filterText: any;
  pageSize: number = 100; // Number of items per page
  pageSizeOptions: number[] = [5, 10, 15, 20];
  currentPage: number = 1; // Current page
  visiblePages: number[] = [];
  maxVisiblePages = 100;
  showAdd :boolean = false;
  showEdit:boolean = false;
  showApprove:boolean = false;
  showView:boolean=false;
  viewEmployeeData = new viewEmployeeData();
  base64ImageData:string='';
  showPopup = true;

  constructor(private router:Router, private officerAction:LeaveTransferService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    const loginId = localStorage.getItem('loginId');
   const loginAs = localStorage.getItem('loginAs');
    this.officerAction.getEmployeeLists(loginId,loginAs).subscribe((res:any)=>{
      this.employeeListData = res.results;
      console.log(this.employeeListData);
    });
    this.checkEntryAccess();
  }

  getImageSource(base64ImageData: string): string {
    const imageType = base64ImageData.startsWith('data:image/png') ? 'png' :
                      base64ImageData.startsWith('data:image/jpeg') ? 'jpeg' :
                      base64ImageData.startsWith('data:image/jpg') ? 'jpg' : '';
    return `data:image/${imageType};base64,${base64ImageData}`;
  }

  arrayBufferToBase64(buffer: Uint8Array): string {
    let binary = '';
    const len = buffer.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(buffer[i]);
    }
    return btoa(binary);
}

  checkEntryAccess(): void {
    this.officerAction.currentRoleData.subscribe((response: any[]) => {
      const officerProfileMenu = response.find(item => item.menu === 'Officer Profile');
      this.showAdd = officerProfileMenu?.entryAccess ?? false;
      this.showEdit = officerProfileMenu?.editAccess ?? false;
      this.showView = officerProfileMenu?.viewAccess ?? false;
      this.showApprove = officerProfileMenu?.approvalAccess ?? false;
      // if (officerProfileMenu && officerProfileMenu.entryAccess) {
      //   this.showAdd = true;
      // } else {
      //   this.showAdd = false;
      // }
      // if (officerProfileMenu && officerProfileMenu.viewAccess) {
      //   this.showEdit = true;
      // } else {
      //   this.showEdit = false;
      // }
      // if (officerProfileMenu && officerProfileMenu.approveAccess) {
      //   this.showApprove = true;
      // } else {
      //   this.showApprove = false;
      // }
    });
  }

  addNew(){
    // this.router.navigate(['leave-transfer'], { queryParams: { exam: 'Hema' } }).then(success => {
    //   if (success) {
    //     console.log('Navigation successful');
    //   } else {
    //     console.log('Navigation failed');
    //   }
    // });
    this.router.navigate(['create-officer']);
  }

  // get filteredEmployeeList() {
  //   const filterText = this.filterText || '';
  //   if (filterText.trim() === '') {
  //     return this.employeeListData;
  //   } else {
  //     return this.employeeListData.filter(employee =>
  //       Object.values(employee).some(value =>
  //         value && value.toString().includes(filterText)));
  //   }
  // }

  get filteredEmployeeList() {
    const filterText = (this.filterText || '').trim().toLowerCase();
    if (filterText === '') {
      return this.employeeListData;
    } else {
      return this.employeeListData.filter(employee =>
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
  

  handleFilterChange() {
    this.cdr.detectChanges();
  }

  editEmployee(data:any){
    this.router.navigate(['edit-officer'], { queryParams: { profile: data } })
  }

  viewEmployee(data:any){
    this.officerAction.getEmployee(data).subscribe((res:any)=>{
      res.results.forEach((ele:any)=>{
        this.viewEmployeeData.approvalStatus = ele.approvalStatus;
        this.viewEmployeeData.id = ele._id;
        this.viewEmployeeData.submittedBy = ele.submittedBy.loginAs;
        this.viewEmployeeData.approvedBy = ele.approvedBy?.loginAs;
        this.viewEmployeeData.fullName = ele.fullName;
        this.viewEmployeeData.caste = ele.caste;
        this.viewEmployeeData.mobileNo1 = ele.mobileNo1;
        this.viewEmployeeData.mobileNo2 = ele.mobileNo2;
        this.viewEmployeeData.mobileNo3 = ele.mobileNo3;
        this.viewEmployeeData.personalEmail = ele.personalEmail;
        this.viewEmployeeData.dateOfBirth = ele.dateOfBirth;
        this.viewEmployeeData.addressLine = ele.addressLine;
        this.viewEmployeeData.city = ele.city;
        this.viewEmployeeData.pincode = ele.pincode;
        this.viewEmployeeData.employeeId = ele.employeeId;
        this.viewEmployeeData.ifhrmsId = ele.ifhrmsId;
        this.viewEmployeeData.batch = ele.batch;
        this.viewEmployeeData.dateOfJoining = ele.dateOfJoining;
        this.viewEmployeeData.dateOfRetirement = ele.dateOfRetirement;
        this.viewEmployeeData.officeEmail = ele.officeEmail;
        this.viewEmployeeData.payscale = ele.payscale;
        this.viewEmployeeData.educationdetails = ele.degreeData;
        this.viewEmployeeData.seniority = ele.seniority;
        this.viewEmployeeData.imagePath = `${this.officerAction.fileUrl}${ele.imagePath.replace('\\', '/')}`;
        // const binaryData = new Uint8Array(ele.photo.data);
        // this.base64ImageData = this.arrayBufferToBase64(binaryData);
        this.officerAction.getDegree().subscribe((response:any)=>{
          response.results.forEach((degree:any)=>{
            ele.degreeData.filter((deg:any)=>{
              if(deg.degree == degree._id){
                deg.degree = degree.degree_name;
              }
            });
          })
        });
        this.officerAction.getData().subscribe((res:any)=>{
          res.forEach((data:any)=>{
            if(data.category_type == "gender" && data._id == ele.gender){
              this.viewEmployeeData.gender = data.category_name;
            }
            if(data.category_type == "state" && data._id == ele.state){
              this.viewEmployeeData.state = data.category_name;
            }
            if (data.category_type == "state") {
              ele.degreeData.forEach((element:any)=>{
                if(data._id == element.locationState){
                  element.locationStateName = data.category_name;
                }              
              });
            }
            if (data.category_type == "country") {
              ele.degreeData.forEach((element:any)=>{
                if(data._id == element.locationCountry){
                  element.locationCountryName = data.category_name;
                }              
              });
            }
  
            if(data.category_type == "class" && data._id == ele.community){
              this.viewEmployeeData.community = data.category_name;
            }
            if(data.category_type == "recruitment_type" && data._id == ele.recruitmentType){
              this.viewEmployeeData.recruitmentType = data.category_name;
            }
            if(data.category_type == "service_status" && data._id == ele.serviceStatus){
              this.viewEmployeeData.serviceStatus = data.category_name;
            }
            if(data.category_type == "religion" && data._id == ele.religion){
              this.viewEmployeeData.religion = data.category_name;
            }
            if(data.category_type == "promotion_grade" && data._id == ele.promotionGrade){
              this.viewEmployeeData.promotionGrade = data.category_name;
            }
          })
          
        })
      });
    });
  }

  approveOfficer(data:any){
    console.log(data);
    const confirmation = confirm("Are you sure want to approve this record?");
    if(confirmation){
     
    const approve = {
      approvedBy: localStorage.getItem('loginId'),
      id: data.id,
    }
      this.officerAction.updateProfileApprovalStatus(approve).subscribe((res:any)=>{
        alert(res.message);
        window.location.reload();
        this.showPopup = false;
      })
     }
  }
  
  // exportToPDF() {
  //       const data = document.getElementById('table-to-export');
  //       if (data) {
  //           html2canvas(data).then(canvas => {
  //               const imgWidth = 208;
  //               const pageHeight = 295;
  //               const imgHeight = canvas.height * imgWidth / canvas.width;
  //               const heightLeft = imgHeight;
  //               const doc = new jsPDF('p', 'mm', 'a4');
  //               let position = 0;

  //               doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
  //               doc.save('table-data.pdf');
  //           });
  //       }
  //   }
}

export class viewEmployeeData{
  id:string='';
  fullName:string='';
  gender:string='';
  dateOfBirth:string='';
  state:string='';
  community:string='';
  religion:string='';
  caste:string='';
  mobileNo1:string='';
  mobileNo2:string='';
  mobileNo3:string='';
  personalEmail:string='';
  educationdetails:education[]=[];
  addressLine:string='';
  city:string='';
  pincode:string='';
  employeeId:string='';
  ifhrmsId:string='';
  dateOfJoining:string='';
  dateOfRetirement:string='';
  batch:string='';
  recruitmentType:string='';
  officeEmail:string='';
  serviceStatus:string='';
  promotionGrade:string='';
  payscale:string='';
  approvalStatus:boolean = false;
  submittedBy:string='';
  approvedBy:string='';
  seniority: string ='';
  imagePath:string='';
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

