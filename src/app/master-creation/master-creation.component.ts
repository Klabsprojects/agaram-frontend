import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveTransferService } from '../forms/forms.service';


@Component({
  selector: 'app-master-creation',
  templateUrl: './master-creation.component.html',
  styleUrls: ['./master-creation.component.css']
})
export class MasterCreationComponent implements OnInit {
  postingInForm!:FormGroup;
  departmentForm!:FormGroup;
  designationForm!:FormGroup;
  degreeForm!:FormGroup;
  countryForm!:FormGroup;
  districtForm!:FormGroup;
  payscaleForm!:FormGroup;
  orderTypeForm!:FormGroup;
  orderForForm!:FormGroup;
  masterCreationForm!:FormGroup;
  submitted:boolean = false;
  departmentSubmitted = false;
  postingin:any[]= [];
  department:any[]=[];
  designation:any[]=[];
  degree:any[]=[];
  country:any[]=[];
  district:any[]=[];
  payscale:any[]=[];
  orderType:any[]=[];
  orderFor:any[]=[];
  showPopup = true;
  masterData:any[]=[];
  showAdd:boolean=false;
  showView:boolean=false;

  constructor(private fb:FormBuilder, private masterAction:LeaveTransferService,private ElementRef:ElementRef) { }

  ngOnInit(): void {
    this.masterAction.getCategoryTypes().subscribe((res)=>{
      this.masterData = res.results;
    });
    this.checkAccess();
    this.masterCreationForm = this.fb.group({
      title:['',Validators.required]
    })

    this.postingInForm = this.fb.group({
      title:['',Validators.required],
      code:['',Validators.required]
    });

    this.departmentForm = this.fb.group({
      category_code:['',Validators.required],
      department_name:['',Validators.required]
    });

    this.designationForm = this.fb.group({
      category_code:['',Validators.required],
      designation_name:['',Validators.required]
    });

    this.degreeForm = this.fb.group({
      degree_name:['',Validators.required],
      // degreeCode:['',Validators.required]
    });

    this.countryForm = this.fb.group({
      title:['',Validators.required],
      code:['',Validators.required]
    });

    this.districtForm = this.fb.group({
      title:['',Validators.required],
      code:['',Validators.required]
    });

    this.payscaleForm = this.fb.group({
      category_name:['',Validators.required],
      category_code:['',Validators.required],
      payscale:['',Validators.required]
    })

    this.orderTypeForm = this.fb.group({
      category_name:['',Validators.required],
      category_code:['',Validators.required]
    })

    this.orderForForm = this.fb.group({
      category_name:['',Validators.required],
      category_code:['',Validators.required]
    })


    this.masterAction.getData().subscribe((res:any[]) => {
      res.forEach((item) => {
        if(item.category_type == "posting_in"){
          this.postingin.push({label:item.category_name,value:item.category_code});
        }
      });
    });
  }

  checkAccess(): void {
    this.masterAction.currentRoleData.subscribe((response: any[]) => {
      const masterCreationMenu = response.find(item => item.menu === 'Master Creation');
      this.showAdd = masterCreationMenu?.entryAccess ?? false;
      this.showView = masterCreationMenu?.viewAccess ?? false;
    });
  }

  addNew(){
    
  }

  // openModal() {
  //   this.ngZone.run(() => {
  //     $('#viewDetails').modal('show');
  //   });
  // }
  // openModal() {
  //   $('#addMaster').modal('show');
  // }
  // openModal(){
  //   $('#viewDet').modal('show');
  // }

  viewPosting(){
    this.masterAction.getData().subscribe((res:any[]) => {
      this.postingin = res.filter(item => item.category_type === "posting_in");
    });
  }

  viewDepartment(){
    this.masterAction.getDepartmentData().subscribe((res:any[]) => {
      this.department = res;
    });
  }

  viewDesignation(){
    this.masterAction.getDesignations().subscribe((res) => {
      console.log(res.results)
      this.designation = res.results;
    });
  }
  viewPayscale(){
    this.masterAction.getData().subscribe((res)=>{
      this.payscale = res.filter((item:any) => item.category_type === "promotion_grade");
    })
  }  

  viewDistrict(){
    this.masterAction.getData().subscribe((res)=>{
      this.district = res.filter((item:any) => item.category_type === "district");
    })
  }

  viewCountry(){
    this.masterAction.getData().subscribe((res)=>{
      this.country = res.filter((item:any) => item.category_type === "country");
    })
  }

  viewDegree(){
    this.masterAction.getDegree().subscribe((res:any)=>{
     this.degree = res.results;
     console.log(this.degree);
    })
  }

  viewOrderType(){
    this.masterAction.getData().subscribe((res)=>{
      this.orderType = res.filter((item:any) => item.category_type === "order_type");
    })
  }

  viewOrderFor(){
    this.masterAction.getData().subscribe((res)=>{
      this.orderFor = res.filter((item:any) => item.category_type === "order_for");
    })
  }

  cancel(){
    this.masterCreationForm.reset();
  }
  

  onPostingSubmit(){
    this.submitted = true;
    if(this.postingInForm.valid){
      const value={
        category_name : this.postingInForm.get('title')?.value,
        category_code : this.postingInForm.get('code')?.value,
        category_type:"posting_in",
      }
      this.masterAction.addMasterData(value).subscribe((res)=>{
        alert("Posting In Added Successfully");
        this.showPopup = false;
        location.reload();
      // setTimeout(() => {
      //   this.ElementRef.nativeElement.ownerDocument.querySelector('.modal-backdrop.fade').style.opacity = '0';
      //   location.reload();
      // });
      })
    }
  }

  onDepartmentSubmit(){
    this.departmentSubmitted = true;
    if(this.departmentForm.valid){
      this.masterAction.addDepartments(this.departmentForm.value).subscribe((res)=>{
        alert("Department Added Successfully");
        this.showPopup = false;
        location.reload();
        // setTimeout(() => {
        //   this.ElementRef.nativeElement.ownerDocument.querySelector('.modal-backdrop.fade').style.opacity = '0';
        // });
      });
    }
  }

  onDesignationSubmit(){
    this.submitted = true;
    if(this.designationForm.valid){
    this.masterAction.addDesignation(this.designationForm.value).subscribe((res)=>{
      alert("Designation Added Successfully");
      this.showPopup = false;
      location.reload();
      // setTimeout(() => {
      //   this.ElementRef.nativeElement.ownerDocument.querySelector('.modal-backdrop.fade').style.opacity = '0';
      // });

    });
    }
  }

  onDegreeSubmit(){
    this.submitted = true;
    if(this.degreeForm.valid){
    this.masterAction.addDegree(this.degreeForm.value).subscribe((res)=>{
      alert("Degree Added Successfully");
      this.showPopup = false;
      location.reload();
      // setTimeout(() => {
      //   this.ElementRef.nativeElement.ownerDocument.querySelector('.modal-backdrop.fade').style.opacity = '0';
      // });

    });
    }
  }

  onCountrySubmit(){
    this.submitted = true;
    if(this.countryForm.valid){
      const value={
        category_name : this.countryForm.get('title')?.value,
        category_code : this.countryForm.get('code')?.value,
        category_type:"country",
      }
      this.masterAction.addMasterData(value).subscribe((res)=>{
        console.log(res);
        alert("Country Added Successfully");
        this.showPopup = false;
        location.reload();
      // setTimeout(() => {
      //   this.ElementRef.nativeElement.ownerDocument.querySelector('.modal-backdrop.fade').style.opacity = '0';
      // });
      })
    }
  }

  onDistrictSubmit(){
    this.submitted = true;
    if(this.districtForm.valid){
      const value={
        category_name : this.districtForm.get('title')?.value,
        category_code : this.districtForm.get('code')?.value,
        category_type:"district",
      }
      this.masterAction.addMasterData(value).subscribe((res)=>{
        alert("District Added Successfully");
        this.showPopup = false;
        location.reload();
        // setTimeout(() => {
        //   this.ElementRef.nativeElement.ownerDocument.querySelector('.modal-backdrop.fade').style.opacity = '0';
        // });
      })
    }
  }

  onPayscaleSubmit(){
    this.submitted = true;
    if(this.payscaleForm.valid){
      const value={
        category_name : this.payscaleForm.get('category_name')?.value,
        category_code : this.payscaleForm.get('category_code')?.value,
        payscale:this.payscaleForm.get('payscale')?.value,
        category_type:"promotion_grade",
      }
      this.masterAction.addMasterData(value).subscribe((res)=>{
        alert("Payscale Added Successfully");
        this.showPopup = false;
        location.reload();
        // setTimeout(() => {
        //   this.ElementRef.nativeElement.ownerDocument.querySelector('.modal-backdrop.fade').style.opacity = '0';
        // });
      })
    }
  }

  onOrderTypeSubmit(){
    this.submitted = true;
    if(this.orderTypeForm.valid){
      const value={
        category_name : this.orderTypeForm.get('category_name')?.value,
        category_code : this.orderTypeForm.get('category_code')?.value,
        category_type:"order_type",
      }
      this.masterAction.addMasterData(value).subscribe((res)=>{
        alert("Order Type Added Successfully");
        this.showPopup = false;
        location.reload();
        // setTimeout(() => {
        //   this.ElementRef.nativeElement.ownerDocument.querySelector('.modal-backdrop.fade').style.opacity = '0';
        //   window.location.reload();
        // });
      })
    }
  }  
  
  onOrderForSubmit(){
    this.submitted = true;
    if(this.orderForForm.valid){
      const value={
        category_name : this.orderForForm.get('category_name')?.value,
        category_code : this.orderForForm.get('category_code')?.value,
        category_type:"order_for",
      }
      this.masterAction.addMasterData(value).subscribe((res)=>{
        this.showPopup = false;
        location.reload();
        // setTimeout(() => {
        //   this.ElementRef.nativeElement.ownerDocument.querySelector('.modal-backdrop.fade').style.opacity = '0';
        //   window.location.reload();
        // });
        alert("Order For Added Successfully");
      })
    }
  }  

  onSubmit(){

  }

}