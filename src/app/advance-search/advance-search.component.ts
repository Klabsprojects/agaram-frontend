import { Component, OnInit } from '@angular/core';
import { LeaveTransferService } from '../forms/forms.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { employeeHistory } from '../dashboard/dashboard.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrl: './advance-search.component.css'
})
export class AdvanceSearchComponent implements OnInit{
  state:any[]=[];
  community:any[]=[];
  degree:any[]=[];
  recruitment:any[]=[];
  department:any[]=[];
  designation:any[]=[];
  postingIn:any[]=[];
  gender:any[]=[];
  filterForm!:FormGroup;
  tableData:any[]=[];
  popupVisible: boolean = false;
  base64ImageData: string = '';
  employeeHistory = new employeeHistory();
  firstIndex: any = '';
  remainingIndices:any[]=[];

  constructor(private filterService:LeaveTransferService,private fb:FormBuilder,private datePipe: DatePipe){

  }
  ngOnInit(): void {
    this.filterForm = this.fb.group({
      search:[''],
      dateOfBirth:[''],
      state:[''],
      community:[''],
      degree:[''],
      dateOfJoining:[''],
      dateOfRetirement:[''],
      recruitmentType:[''],
      postingIn:[''],
      department:[''],
      designation:['']
    })
    this.filterService.getData().subscribe((res:any[])=>{
      res.forEach((item)=>{
        switch (item.category_type) {
          case "state":
            this.state.push({ label: item.category_name, value: item._id });
            break;
            case "class":
              this.community.push({label:item.category_name,value:item._id});
              break;
              case "recruitment_type":
                this.recruitment.push({ label: item.category_name, value: item._id });
                break;
                case "posting_in":
                this.postingIn.push({ label: item.category_name, value: item._id });
                break;
                case "gender":
                this.gender.push({ label: item.category_name, value: item._id });
                break;
            default:
            break;
        }
      });
    });
    this.filterService.getDegree().subscribe((res:any)=>{
      res.results.forEach((data:any)=>{
        this.degree.push({label:data.degree_name, value:data._id});
      });
    })
    this.filterService.getDepartmentData().subscribe((res:any)=>{
      res.forEach((data:any)=>{
        this.department.push({label:data.department_name, value:data._id});
      });
    })
    this.filterService.getDesignations().subscribe((res:any)=>{
      res.results.forEach((data:any)=>{
        this.designation.push({label:data.designation_name, value:data._id});
      });
    })
  }

  getValue(event: any, controlName: string): void {
    const value = event.target.value;
    const payload: any = {};
      Object.keys(this.filterForm.controls).forEach(key => {
      const controlValue = this.filterForm.get(key)?.value;
      if (controlValue !== '' && controlValue !== null && controlValue !== undefined) {
        payload[key] = controlValue;
      }
    });
  
    this.filterService.advanceSearch(payload).subscribe((res: any) => {
        
        res.results.empList.forEach((ele:any)=>{
        const postingIn = this.postingIn.find((data: any) => data.value === ele.toPostingInCategoryCode);
        const department = this.department.find((data: any) => data.value === ele.toDepartmentId);
        const designation = this.designation.find((data: any) => data.value === ele.toDesignationId);
        const gender = this.gender.find((data:any)=>data.value === ele.gender);
        ele.postingInLabel = postingIn ? postingIn.label : '';
        ele.departmentLabel = department ? department.label : '';
        ele.designationLabel = designation ? designation.label : '';
        ele.genderLabel = gender ? gender.label : '';
        });
        this.tableData = res.results.empList;

        
    });
  }

  arrayBufferToBase64(buffer: Uint8Array): string {
    let binary = '';
    const len = buffer.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(buffer[i]);
    }
    return window.btoa(binary);
  }

  getImageSource(base64ImageData: string): string {
    const imageType = base64ImageData.startsWith('data:image/png') ? 'png' :
                      base64ImageData.startsWith('data:image/jpeg') ? 'jpeg' :
                      base64ImageData.startsWith('data:image/jpg') ? 'jpg' : '';
    return `data:image/${imageType};base64,${base64ImageData}`;
  }
  
  viewInfo(data: any) {
    this.popupVisible = true;
    this.remainingIndices = [];
    this.firstIndex = '';
    this.filterService.getEmployeeHistory(data).subscribe((res: any) => {
        res.results.forEach((item: any) => {
          if (item._id == data) {
                this.filterService.getData().subscribe((response: any) => {
                    response.forEach((ele: any) => {
                        if (ele.category_type == "state") {
                          if(ele._id == item.state){
                            this.employeeHistory.state = ele.category_name;
                          }
                        }
                      });  
                    item.employeeHistory.forEach((element: any, index: number) => {
                      if (index === 0) {
                        this.firstIndex = element.transferOrPostingEmployeesList;
                        if (element.category_type == "posting_in") {
                          if(element._id == element.transferOrPostingEmployeesList.toPostingInCategoryCode){
                          this.firstIndex.posting = element.category_name;
                          }
                        }
                       this.department.forEach((elem:any)=>{
                        if(elem.value == element.transferOrPostingEmployeesList.toDepartmentId){
                          this.firstIndex.toDepartmentId = elem.label;
                          }
                       });

                       this.designation.forEach((elem:any)=>{
                        if(elem.value == element.transferOrPostingEmployeesList.toDesignationId){
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
                        console.log(this.remainingIndices);
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
                    this.employeeHistory.imagePath = `${this.filterService.fileUrl}${item.imagePath?.replace('\\', '/')}`;
                    // const binaryData = new Uint8Array(item.photo.data);
                    if (item.photo && item.photo.data) {
                      const binaryData = new Uint8Array(item.photo.data);
                      this.base64ImageData = this.arrayBufferToBase64(binaryData);
                    }
                });
            }
        });
    });
}
clearAll(){
  this.filterForm.reset();
  this.tableData = [];
}
  
}
