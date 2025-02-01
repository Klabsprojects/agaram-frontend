import { Component, OnInit } from '@angular/core';
import { employeeHistory } from '../dashboard.model';
import { LeaveTransferService } from '../../forms/forms.service';
import { DatePipe } from '@angular/common';
import { CommonService } from '../../shared-services/common.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  constructor(private dashboardService: LeaveTransferService, private datePipe: DatePipe, private cs:CommonService) {
  }
  ngOnInit(): void {
    this.login_id = localStorage.getItem('loginId')
    this.get_Id(this.login_id);
    this.dashboardService.getData().subscribe((element: any[]) => {
      this.catogories = element
      // console.log("this.catogories", this.catogories)
    });
    this.dashboardService.getDepartmentData().subscribe((res: any) => {
      this.departmentData = res;
    })
    this.dashboardService.getDesignations().subscribe((res: any) => {
      this.designationData = res.results;
    })
  }
  base64ImageData: string = '';
  employeeHistory = new employeeHistory();
  firstIndex: any = '';
  loading = false;
  hideHistory = true;
  transferposting = true;
  promotion = true;
  leave = true;
  training = true
  foriegnvisit = true;
  SAF = true;
  LTC = true;
  medical = true;
  privatevisit = true;
  imasset = true;
  massest = true;
  education = true;
  intimation = true;
  login_id: string | null = '';
  transferpostingdata: any[] = [];
  promotionData: any[] = [];
  remainingIndices: any[] = [];

  department: any[] = [];
  departmentData: any[] = [];
  designation: any[] = [];
  designationData: any[] = [];
  postingIn: any[] = [];
  leaveTabledata: any[] = [];
  trainingTabledata: any[] = [];
  foriegnVisitdata: any[] = [];
  SAF_data: any[] = [];
  LTC_data: any[] = [];
  medicalData: any[] = [];
  privatevisitData: any[] = [];
  imassetData: any[] = [];
  massestData: any[] = [];
  educationData: any[] = [];
  intimationData: any[] = [];
  previousData: any[] = [];
  userAvailable: any[] = [];
  catogories: any[] = [];
  viewEmployeeData = new viewEmployeeData();
  showPosting = false;
  

  get_Id(login_id: any) {
    // this.loading = true;
    this.dashboardService.getEmployeeAlone(login_id).subscribe((res: any) => {
      if (res.results.length > 0) {
        this.viewInfo(res.results[0]._id)
      }else{
        this.loading = false;
      }
    })
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
  viewInfo(data: any) {
    this.remainingIndices = [];
    this.firstIndex = '';
    
    this.dashboardService.getEmployee(data).subscribe((res:any)=>{
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
        this.viewEmployeeData.imagePath = `${this.dashboardService.fileUrl}profileImages/${ele.imagePath?.replace('\\', '/')}`;
        // const binaryData = new Uint8Array(ele.photo.data);
        // this.base64ImageData = this.arrayBufferToBase64(binaryData);
        this.dashboardService.getDegree().subscribe((response:any)=>{
          response.results.forEach((degree:any)=>{
            ele.degreeData.filter((deg:any)=>{
              if(deg.degree == degree._id){
                deg.degree = degree.degree_name;
              }
            });
          })
        });

        this.dashboardService.getDesignations().subscribe((res:any)=>{
          res.results.forEach((item:any)=>{
            if(item._id == ele.toDesignationId){
              this.viewEmployeeData.toDesignationId = item.designation_name;
            }
          })
        })

        this.dashboardService.getDepartmentData().subscribe((res:any)=>{
          res.forEach((item:any)=>{
            if(item._id == ele.toDepartmentId){
              this.viewEmployeeData.toDepartmentId = item.department_name;
            }
          })
        })
        
        this.dashboardService.getData().subscribe((res:any)=>{
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
              console.log(this.viewEmployeeData.serviceStatus);
              if(this.viewEmployeeData.serviceStatus == "Serving"){
                this.showPosting = true;
              }
              else{
                this.showPosting = false;
              }
            }
            if(data.category_type == "religion" && data._id == ele.religion){
              this.viewEmployeeData.religion = data.category_name;
            }
            if(data.category_type == "promotion_grade" && data._id == ele.promotionGrade){
              this.viewEmployeeData.promotionGrade = data.category_name;
            }
            if(data.category_type == "posting_in" && data._id == ele.toPostingInCategoryCode){
              this.viewEmployeeData.toPostingInCategoryCode = data.category_name;
            }
            if(data.category_type == "post_type" && data._id == ele.postTypeCategoryCode){
              this.viewEmployeeData.postTypeCategoryCode = data.category_name;
            }
            if(data.category_type == "location_change" && data._id == ele.locationChangeCategoryId){
              this.viewEmployeeData.locationChangeCategoryId = data.category_name;
            }
          })
          this.viewEmployeeData.languages = ele.languages;
        this.viewEmployeeData.lastDateOfPromotion = ele.lastDateOfPromotion;
        this.viewEmployeeData.deptAddress = ele.departmentId.address;
        this.viewEmployeeData.deptFaxNumber = ele.departmentId.faxNumber;
        this.viewEmployeeData.deptOfficialMobileNo = ele.departmentId.officialMobileNo;
        this.viewEmployeeData.deptPhoneNumber = ele.departmentId.phoneNumber;
        // this.viewEmployeeData.toDepartmentId = ele.departmentId.department_name;
        })
      });
    });
  }

 

 

  cgrade(id: any) {
    var type: string = ''
    this.catogories.forEach((value: any, index: any) => {
      if (value._id == id) {
        type = value.category_name;
      }
    })
    return type;
  }

  getdesignation(id: any) {
    var type: string = ''
    this.designationData.forEach((value: any, index: number) => {
      if (value._id == id) {
        type = value.designation_name;
      }
    })
    return type
  }

  getdepatments(id: any) {
    var type: string = ''
    for (var i = 0; i < this.departmentData.length; i++) {
      if (this.departmentData[i]._id == id) {
        type = this.departmentData[i].department_name;
      }
    }
    return type
  }

  getPosition(id: any) {
    var type: string = ''
    this.catogories.forEach((value: any, index: any) => {
      if (value._id == id) {
        type = value.category_name;
      }
    })
    return type
  }

  fetching_user_detail(data:any){
    var userData = {
      fullName :data.fullName,
      postingIn:this.getPosition(this.previousData[this.previousData.length-1].postingIn),
      designation:this.getdesignation(this.firstIndex.toDesignationId),
      department:this.getdepatments(this.firstIndex.toDepartmentId),
      mobileNo1 :data.mobileNo1,
      mobileNo2 :data.mobileNo2,
      mobileNo3 :data.mobileNo3,
      personalEmail :data.personalEmail,
      batch :data.batch,
      addressLine :data.addressLine,
      city :data.city,
      pincode :data.pincode,
      employeeId :data.employeeId,
      payscale:data.payscale,
      officeEmail :data.officeEmail,
      caste :data.caste,
      dob :data.dateOfBirth
    }
    console.log('userData',userData)
    this.cs.setData(JSON.stringify(userData));
  }

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
