import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LeaveTransferService } from '../forms/forms.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dro-profile',
  templateUrl: './dro-profile.component.html',
  styleUrl: './dro-profile.component.css'
})
export class DroProfileComponent implements OnInit{

  public droListData:any[]=[];
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
  viewDroData = new viewDroData();
  base64ImageData:string='';
  showPopup = true;
  showPosting = false;
  url='';

  constructor(private router:Router, private droAction:LeaveTransferService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.url = this.droAction.fileUrl;
    const loginId = localStorage.getItem('loginId');
   const loginAs = localStorage.getItem('loginAs');
    this.droAction.getDroList().subscribe((res:any)=>{
      this.droListData = res.results;
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
    this.droAction.currentRoleData.subscribe((response: any[]) => {
      const droProfileMenu = response.find(item => item.menu === 'dro Profile');
      this.showAdd = droProfileMenu?.entryAccess ?? false;
      this.showEdit = droProfileMenu?.editAccess ?? false;
      this.showView = droProfileMenu?.viewAccess ?? false;
      this.showApprove = droProfileMenu?.approvalAccess ?? false;
    });
  }

  addNew(){
    this.router.navigate(['create-dro']);
  }

  get filteredEmployeeList() {
    const filterText = (this.filterText || '').trim().toLowerCase();
    if (filterText === '') {
      return this.droListData;
    } else {
      return this.droListData.filter(employee =>
        Object.values(employee).some((value: any) =>
          value && value.toString().toLowerCase().includes(filterText)));
    }
  }
  public startIndex:any;
  pagedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.startIndex  = startIndex;
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

  editDro(data:any){
    this.router.navigate(['edit-dro'], { queryParams: { profile: data } })
  }

  viewDro(data:any){
    this.droAction.getDroId(data).subscribe((res:any)=>{
      res.results.forEach((ele:any)=>{
        this.viewDroData.approvalStatus = ele.approvalStatus;
        this.viewDroData.id = ele._id;
        this.viewDroData.submittedBy = ele.submittedBy.loginAs;
        this.viewDroData.approvedBy = ele.approvedBy?.loginAs;
        this.viewDroData.fullName = ele.fullName;
        this.viewDroData.caste = ele.caste;
        this.viewDroData.mobileNo1 = ele.mobileNo1;
        this.viewDroData.mobileNo2 = ele.mobileNo2;
        this.viewDroData.mobileNo3 = ele.mobileNo3;
        this.viewDroData.personalEmail = ele.personalEmail;
        this.viewDroData.dateOfBirth = ele.dateOfBirth;
        this.viewDroData.addressLine = ele?.addressLine;
        this.viewDroData.city = ele.city;
        this.viewDroData.pincode = ele.pincode;
        this.viewDroData.employeeId = ele.employeeId;
        this.viewDroData.ifhrmsId = ele.ifhrmsId;
        this.viewDroData.batch = ele.batch;
        this.viewDroData.dateOfJoining = ele.dateOfJoining;
        this.viewDroData.dateOfRetirement = ele.dateOfRetirement;
        this.viewDroData.officeEmail = ele.officeEmail;
        this.viewDroData.payscale = ele.payscale;
        this.viewDroData.educationdetails = ele.degreeData;
        this.viewDroData.seniority = ele.seniority;
        this.viewDroData.orderNo = ele.orderNo;
        this.viewDroData.dateOfOrder = ele.dateOfOrder;
        this.viewDroData.remarks = ele.remarks;
        this.viewDroData.imagePath = `${this.droAction.fileUrl}droProfileImages/${ele.imagePath?.replace('\\', '/')}`;
        // const binaryData = new Uint8Array(ele.photo.data);
        // this.base64ImageData = this.arrayBufferToBase64(binaryData);
        this.droAction.getDegree().subscribe((response:any)=>{
          response.results.forEach((degree:any)=>{
            ele.degreeData.filter((deg:any)=>{
              if(deg.degree == degree._id){
                deg.degree = degree.degree_name;
              }
            });
          })
        });

        this.droAction.getDesignations().subscribe((res:any)=>{
          res.results.forEach((item:any)=>{
            if(item._id == ele.toDesignationId){
              this.viewDroData.toDesignationId = item.designation_name;
            }
          })
        })

        this.droAction.getDepartmentData().subscribe((res:any)=>{
          res.forEach((item:any)=>{
            if(item._id == ele.toDepartmentId){
              this.viewDroData.toDepartmentId = item.department_name;
            }
          })
        })
        
        this.droAction.getData().subscribe((res:any)=>{
          res.forEach((data:any)=>{
            if(data.category_type == "gender" && data._id == ele.gender){
              this.viewDroData.gender = data.category_name;
            }
            if(data.category_type == "state" && data._id == ele.state){
              this.viewDroData.state = data.category_name;
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
              this.viewDroData.community = data.category_name;
            }
            if(data.category_type == "recruitment_type" && data._id == ele.recruitmentType){
              this.viewDroData.recruitmentType = data.category_name;
            }
            if(data.category_type == "service_status" && data._id == ele.serviceStatus){
              this.viewDroData.serviceStatus = data.category_name;
              console.log(this.viewDroData.serviceStatus);
              if(this.viewDroData.serviceStatus == "Serving"){
                this.showPosting = true;
              }
              else{
                this.showPosting = false;
              }
            }
            if(data.category_type == "religion" && data._id == ele.religion){
              this.viewDroData.religion = data.category_name;
            }
            if(data.category_type == "order_type" && data._id == ele.orderType){
              this.viewDroData.orderType = data.category_name;
            }
            if(data.category_type == "order_for" && data._id == ele.orderFor){
              this.viewDroData.orderFor = data.category_name;
            }
            if(data.category_type == "promotion_grade" && data._id == ele.promotionGrade){
              this.viewDroData.promotionGrade = data.category_name;
            }
            if(data.category_type == "posting_in" && data._id == ele.toPostingInCategoryCode){
              this.viewDroData.toPostingInCategoryCode = data.category_name;
            }
            if(data.category_type == "post_type" && data._id == ele.postTypeCategoryCode){
              this.viewDroData.postTypeCategoryCode = data.category_name;
            }
            if(data.category_type == "location_change" && data._id == ele.locationChangeCategoryId){
              this.viewDroData.locationChangeCategoryId = data.category_name;
            }
          })
          this.viewDroData.languages = ele.languages;
        this.viewDroData.lastDateOfPromotion = ele.lastDateOfPromotion;
        this.viewDroData.deptAddress = ele.departmentId?.address ?? '';
        this.viewDroData.deptFaxNumber = ele.departmentId?.faxNumber ?? '';
        this.viewDroData.deptOfficialMobileNo = ele.departmentId?.officialMobileNo ?? '';
        this.viewDroData.deptPhoneNumber = ele.departmentId?.phoneNumber ?? '';
        // this.viewDroData.toDepartmentId = ele.departmentId.department_name;
        })
      });
    });
  }

  approvedro(data:any){
    console.log(data);
    const confirmation = confirm("Are you sure want to approve this record?");
    if(confirmation){
     
    const approve = {
      approvedBy: localStorage.getItem('loginId'),
      id: data.id,
    }
      this.droAction.updateProfileApprovalStatus(approve).subscribe((res:any)=>{
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

export class viewDroData{
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
  deptAddress:string='';
  deptPhoneNumber:string='';
  deptFaxNumber:string='';
  deptOfficialMobileNo:string='';
  languages:string='';
  lastDateOfPromotion:string='';
  locationChangeCategoryId:string='';
  postTypeCategoryCode:string='';
  toDesignationId:string='';
  toDepartmentId:string='';
  toPostingInCategoryCode:string='';
  orderType:string='';
  orderNo:string='';
  orderFor:string='';
  dateOfOrder:string='';
  orderFile:string='';
  remarks:string='';
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
