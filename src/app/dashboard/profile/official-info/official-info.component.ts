import { Component, OnInit } from '@angular/core';
import { employeeHistory } from '../../dashboard.model';
import { LeaveTransferService } from '../../../forms/forms.service';
import { DatePipe } from '@angular/common';
import { CommonService } from '../../../shared-services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-official-info',
  templateUrl: './official-info.component.html',
  styleUrl: './official-info.component.css'
})
export class OfficialInfoComponent implements OnInit{
  constructor(private dashboardService: LeaveTransferService, private datePipe: DatePipe, private cs:CommonService, private fb:FormBuilder) {
  }
  employeeProfileId:string='';
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
    this.applyForm = this.fb.group({
      formFile: ['', Validators.required],
      remarks: [''],
      // employeeProfileId:[this.employeeProfileId]
    });
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
  hba:any[] = [];
  OfficersTour:any[]=[];
  gpf:any[]=[];
  IdCard:any[]=[];
  urls: string[] = [
    "getLeave",
    "getTraining",
    "getVisit",
    "getSafApplication",
    "getLtc",
    "getMedicalReimbursement",
    "getPrivateForeignVisit",
    "getImmovable",
    "getMovable",
    "getEducation",
    "getIntimation",
    "getHba",
    "getOfficersTourByProfileId",
    "getGpf",
    "getIdCard"]
  applyForm!:FormGroup;
  uploadSafFile : any;
  submitted = false;
  formType = '';
  get_Id(login_id: any) {
    this.loading = true;
    this.dashboardService.getEmployeeAlone(login_id).subscribe((res: any) => {
      if (res.results.length > 0) {
        this.getTransferPosting(res.results[0]._id);
        this.getPromotion(res.results[0]._id)
        this.viewInfo(res.results[0]._id)
        this.urls.forEach((value: string, index: number) => {
          this.dashboardService.getIndividual(res.results[0]._id, value).subscribe((response: any) => {
            if (value === 'getLeave') {
              this.leaveTabledata = response.results;
            }
            if (value === 'getTraining') {
              this.trainingTabledata = response.results;
            }
            if (value === 'getVisit') {
              this.foriegnVisitdata = response.results;
            }
            if (value === 'getSafApplication') {
              this.SAF_data = response.results;
            }
            if (value === 'getLtc') {
              this.LTC_data = response.results;
            }
            if (value === 'getMedicalReimbursement') {
              this.medicalData = response.results;
            }

            if (value === 'getPrivateForeignVisit') {
              this.privatevisitData = response.results;
            }
            if (value === 'getImmovable') {
              this.imassetData = response.results;
            }
            if (value === 'getMovable') {
              this.massestData = response.results;
            }
            if (value === 'getEducation') {
              this.educationData = response.results;
            }
            if (value === 'getIntimation') {
              this.intimationData = response.results;
            }
            if (value === 'getHba'){
              this.hba = response.results;
            }
            if (value === 'getOfficersTourByProfileId'){
              this.OfficersTour = response.results;
            }
            if (value === 'getGpf'){
              this.gpf = response.results;
            }
            if (value === 'getIdCard'){
              this.IdCard = response.results;
            }
          })
        })
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
    this.dashboardService.getEmployeeHistory(data).subscribe((res: any) => {
      this.userAvailable = res.results;
      console.log(res.results);
      // this.loading = false;
      res.results.forEach((item: any) => {
        if (item._id == data) {
          this.employeeProfileId = item._id;
          console.log(item);
          console.log(item._id);
          this.dashboardService.getData().subscribe((response: any) => {
            response.forEach((ele: any) => {
              if (ele.category_type == "state") {
                if (ele._id == item.state) {
                  this.employeeHistory.state = ele.category_name;
                }
              }
            });
            item.employeeHistory.forEach((element: any, index: number) => {

              // console.log("element",element)
              this.previousData.push({ 'postingIn': element.transferOrPostingEmployeesList.toPostingInCategoryCode, 'department': element.transferOrPostingEmployeesList.toDepartmentId, 'designation': element.transferOrPostingEmployeesList.toDesignationId })
              if (index === 0) {
                this.firstIndex = element.transferOrPostingEmployeesList;
                console.log("this.firstIndex", this.firstIndex)
                
                if (element.category_type == "posting_in") {
                  if (element._id == element.transferOrPostingEmployeesList.toPostingInCategoryCode) {
                    this.firstIndex.posting = element.category_name;
                  }
                }
                this.department.forEach((elem: any) => {
                  if (elem.value == element.transferOrPostingEmployeesList.toDepartmentId) {
                    this.firstIndex.toDepartmentId = elem.label;
                  }
                });
                console.log("his.firstIndex.posting", this.firstIndex.toDepartmentId)
                this.designation.forEach((elem: any) => {
                  if (elem.value == element.transferOrPostingEmployeesList.toDesignationId) {
                    this.firstIndex.toDesignationId = elem.label;
                  }
                });
              }


              if (index != 0) {
                const postingIn = this.postingIn.find((data: any) => data.value === element.transferOrPostingEmployeesList.toPostingInCategoryCode);
                const department = this.department.find((data: any) => data.value === element.transferOrPostingEmployeesList.toDepartmentId);
                const designation = this.designation.find((data: any) => data.value === element.transferOrPostingEmployeesList.toDesignationId);
                this.remainingIndices.push({
                  postingIn: postingIn ? postingIn.label : '',
                  department: department ? department.label : '',
                  designation: designation ? designation.label : ''
                });
              }
            });

            this.employeeHistory.fullName = item.fullName;
            this.employeeHistory.mobileNo1 = item.mobileNo1;
            this.employeeHistory.mobileNo2 = item.mobileNo2;
            this.employeeHistory.mobileNo3 = item.mobileNo3;
            this.employeeHistory.personalEmail = item.personalEmail;
            this.employeeHistory.batch = item.batch;
            this.employeeHistory.addressLine = item.addressLine;
            this.employeeHistory.city = item.city;
            this.employeeHistory.pincode = item.pincode;
            this.employeeHistory.employeeId = item.employeeId;
            this.employeeHistory.payscale = item.payscale;
            this.employeeHistory.officeEmail = item.officeEmail;
            this.employeeHistory.caste = item.caste;
            const originalDate = item.dateOfBirth;
            this.employeeHistory.dateOfBirth = this.datePipe.transform(originalDate, 'dd/MM/yyyy');
            const dateOfJoining = item.dateOfJoining;
            this.employeeHistory.dateOfJoining = this.datePipe.transform(dateOfJoining, 'dd/MM/yyyy');
            const dateOfRetirement = item.dateOfRetirement;
            this.employeeHistory.dateOfRetirement = this.datePipe.transform(dateOfRetirement, 'dd/MM/yyyy');
            if(item.imagePath){
              this.employeeHistory.imagePath = `${this.dashboardService.fileUrl}profileImages/${item.imagePath?.replace('\\', '/')}`;
            }
            else{
              this.employeeHistory.imagePath = 'assets/images/worker.png';
            }
            // const binaryData = new Uint8Array(item.photo.data);
            // this.base64ImageData = this.arrayBufferToBase64(binaryData);
            this.loading = false;
            this.fetching_user_detail(this.employeeHistory)
          });
        }
      });
    });
  }

  getTransferPosting(data: any) {
    this.dashboardService.getIndividualtwo(data, 'Transfer / Posting').subscribe((res: any) => {
      this.transferpostingdata = res.results;
    })
  }

  getPromotion(data: any) {
    this.dashboardService.getIndividualtwo(data, 'Promotion').subscribe((res: any) => {
      this.promotionData = res.results;
    })
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

  // showModal(modalName:string) {
  //   const modalElement = document.getElementById(modalName);
  //   if (modalElement) {
  //     // Ensure backdrop is added if not already present
  //     if (!document.querySelector('.modal-backdrop')) {
  //       const backdrop = document.createElement('div');
  //       backdrop.classList.add('modal-backdrop', 'fade', 'show');
  //       document.body.appendChild(backdrop);
  //     }
  
  //     // Show the modal by adding the 'show' class and setting display
  //     modalElement.classList.add('show');
  //     modalElement.setAttribute('aria-hidden', 'false'); // Make modal visible for screen readers
  //     modalElement.style.display = 'block'; // Make modal visible
  //   }
  // }
  // hideModal(modalName:string) {
  //   const modalElement = document.getElementById(modalName);
  //   if (modalElement) {
  //     // Remove modal backdrop manually
  //     const backdrop = document.querySelector('.modal-backdrop');
  //     if (backdrop) {
  //       backdrop.remove(); // Remove the backdrop manually
  //     }
  
  //     // Hide the modal by removing the 'show' class and setting display to 'none'
  //     modalElement.classList.remove('show'); // Remove 'show' class
  //     modalElement.setAttribute('aria-hidden', 'true'); // Hide modal from screen readers
  //     modalElement.style.display = 'none'; // Manually hide modal
  //   }
  // }

  showModal(modalName: string) {
    const modalElement = document.getElementById(modalName);
    if (modalElement) {
      // Ensure backdrop is added if not already present
      if (!document.querySelector('.modal-backdrop')) {
        const backdrop = document.createElement('div');
        backdrop.classList.add('modal-backdrop', 'fade', 'show');
        document.body.appendChild(backdrop);
      }
  
      // Show the modal by adding the 'show' class and setting display
      modalElement.classList.add('show');
      modalElement.setAttribute('aria-hidden', 'false'); // Make modal visible for screen readers
      modalElement.style.display = 'block'; // Make modal visible
    }
  }
  
  hideModal(modalName: string) {
    const modalElement = document.getElementById(modalName);
    if (modalElement) {
      // Remove modal backdrop manually
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove(); // Remove the backdrop manually
      }
  
      // Hide the modal by removing the 'show' class and setting display to 'none'
      modalElement.classList.remove('show'); // Remove 'show' class
      modalElement.setAttribute('aria-hidden', 'true'); // Hide modal from screen readers
      modalElement.style.display = 'none'; // Manually hide modal
    }
  }
  
  
  onApply() {
    this.formType = 'SAF Games Village';
    this.hideModal('SAF');
    this.showModal('safApplication');
  }

  applyMedical(){
    this.formType = 'Medical Reimbursement';
    this.hideModal('medical');
    this.showModal('applyMedical');
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadSafFile = input.files[0];
      this.applyForm.patchValue({ formFile: this.uploadSafFile });
    }
    this.uploadSafFile = event.target.files[0];
    this.applyForm.get('formFile')?.setValue(this.uploadSafFile);
    if (this.uploadSafFile) {
      if (this.uploadSafFile.type !== 'application/pdf') {
        this.applyForm.get('formFile')?.setErrors({ 'incorrectFileType': true });
        return;
      }

      if (this.uploadSafFile.size > 5 * 1024 * 1024) { 
        this.applyForm.get('formFile')?.setErrors({ 'maxSize': true });
        return;
      }

      this.applyForm.get('formFile')?.setErrors(null);
    }
  }

  applyFormSubmit() {
    console.log(this.applyForm.value);
    if (this.applyForm.valid) {
      const formData = new FormData();
      const formValues = this.applyForm.value;
  
      // Append form data excluding the file (which will be handled separately)
      for (const key in formValues) {
        if (formValues.hasOwnProperty(key) && key !== 'formFile') {
          formData.append(key, formValues[key]);
        }
      }
  
      // If a file is uploaded, append it
      if (this.uploadSafFile) {
        formData.append('formFile', this.uploadSafFile);
      }
  
      // Add additional data like employeeProfileId, formType
      formData.append('employeeProfileId', this.employeeProfileId);
      formData.append('formType', this.formType);  // Pass formType dynamically
  
      // Send the form data
      this.dashboardService.applyForm(formData).subscribe(
        response => {
          alert(response.message);
          console.log(response.message);
  
          // Hide modal based on formType
          if (this.formType === 'SAF Games Village') {
            this.hideModal('safApplication');  // Hide SAF application modal
          } else if (this.formType === 'Medical Reimbursement') {
            this.hideModal('applyMedical');  // Hide Medical application modal
          }
        },
        error => {
          console.error('API Error:', error);
        }
      );
    }
  }
  
}
