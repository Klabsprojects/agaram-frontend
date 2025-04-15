import { Component, ElementRef, OnInit } from '@angular/core';
import {  FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveTransferService } from '../forms/forms.service';


@Component({
  selector: 'app-master-creation',
  templateUrl: './master-creation.component.html',
  styleUrls: ['./master-creation.component.css']
})
export class MasterCreationComponent implements OnInit {
  postingInForm!:FormGroup;
  postingInUpdateForm!:FormGroup;
  departmentForm!:FormGroup;
  designationForm!:FormGroup;
  degreeForm!:FormGroup;
  countryForm!:FormGroup;
  districtForm!:FormGroup;
  payscaleForm!:FormGroup;
  orderTypeForm!:FormGroup;
  orderForForm!:FormGroup;
  masterCreationForm!:FormGroup;
  classForm!:FormGroup;
  religionForm!:FormGroup;
  educationFundForm!:FormGroup;
  recruitmentForm!:FormGroup;
  postTypeForm!:FormGroup;
  locationChangeForm!:FormGroup;
  leaveForm!:FormGroup;
  trainingForm!:FormGroup;
  foreignVisitForm!:FormGroup;
  course_levelForm!:FormGroup;
  ltcForm!:FormGroup;
  immovableForm!:FormGroup;
  movableForm!:FormGroup;
  intimationForm!:FormGroup;
  hba_availedForm!:FormGroup;
  hba_typesForm!:FormGroup;
  gpf_typeForm!:FormGroup;
  purpose_of_gpfForm!:FormGroup;
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
  classData:any[]=[];
  religions:any[]=[];
  educationFund:any[]=[];
  recruitment:any[]=[];
  postType:any[]=[];
  locationChange:any[]=[];
  leave:any[]=[];
  training:any[]=[];
  foreignVisit:any[]=[];
  course_level:any[]=[];
  ltc:any[]=[];
  immovable:any[]=[];
  movable:any[]=[];
  intimation:any[]=[];
  hba_availed:any[]=[];
  hba_types:any[]=[];
  gpf_type:any[]=[];
  purpose_of_gpf:any[]=[];
  showPopup = true;
  masterData:any[]=[];
  showAdd:boolean=false;
  showView:boolean=false;
  editing = false;
  editingId: number | null = null;
  editingCategoryName: string = '';
  editingCategoryCode: string = '';

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

    this.postingInUpdateForm = this.fb.group({
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

    this.classForm = this.fb.group({
      category_name:['',Validators.required],
      category_code:['',Validators.required]
    })

    this.religionForm = this.fb.group({
      category_name:['',Validators.required],
      category_code:['',Validators.required]
    })

    this.educationFundForm= this.fb.group({
      category_name:['',Validators.required],
      category_code:['',Validators.required]
    })

    this.recruitmentForm= this.fb.group({
      category_name:['',Validators.required],
      category_code:['',Validators.required]
    })

    this.postTypeForm= this.fb.group({
      category_name:['',Validators.required],
      category_code:['',Validators.required]
    })

    this.locationChangeForm= this.fb.group({
      category_name:['',Validators.required],
      // category_code:['',Validators.required]
    })

    this.leaveForm= this.fb.group({
      category_name:['',Validators.required],
      category_code:['',Validators.required]
    })

    this.trainingForm= this.fb.group({
      category_name:['',Validators.required],
      category_code:['',Validators.required]
    })

    this.foreignVisitForm= this.fb.group({
      category_name:['',Validators.required],
      category_code:['',Validators.required]
    })

    this.course_levelForm= this.fb.group({
      category_name:['',Validators.required],
      category_code:['',Validators.required]
    })

    this.ltcForm= this.fb.group({
      category_name:['',Validators.required],
      category_code:['',Validators.required]
    })

    this.immovableForm= this.fb.group({
      category_name:['',Validators.required],
      category_code:['',Validators.required]
    })

    this.movableForm= this.fb.group({
      category_name:['',Validators.required],
      category_code:['',Validators.required]
    })

    this.intimationForm= this.fb.group({
      category_name:['',Validators.required],
      category_code:['',Validators.required]
    })

    this.hba_availedForm= this.fb.group({
      category_name:['',Validators.required],
      category_code:['',Validators.required]
    })

    this.hba_typesForm= this.fb.group({
      category_name:['',Validators.required],
      category_code:['',Validators.required]
    })

    this.gpf_typeForm= this.fb.group({
      category_name:['',Validators.required],
      category_code:['',Validators.required]
    })

    this.purpose_of_gpfForm= this.fb.group({
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

  viewPosting(){
    this.masterAction.getData().subscribe((res:any[]) => {
      this.postingin = res.filter(item => item.category_type === "posting_in");
    });
  }

  

  editPosting(id: any) {
    this.editing = true;
    this.editingId = id;

    this.masterAction.getCategoriesById(id).subscribe((res: any) => {
      if (res.length > 0) {
        const postingItem = res[0];

        this.postingInForm.patchValue({
          title: postingItem.category_name,
          code: postingItem.category_code
        });
      }
    });
  }

  updatePosting() {
    if (this.postingInForm.valid) {
      const value={
        category_name : this.postingInForm.get('title')?.value,
        category_code : this.postingInForm.get('code')?.value,
        category_type:"posting_in",
      }
      this.masterAction.updateCategories(this.editingId, value).subscribe(
        (res: any) => {
          console.log('Update Response:', res);
          alert(res.message);
          this.showPopup = false;
          location.reload();
          this.editing = false;
          this.editingId = null;
        },
        (error) => {
          console.error('Error updating category:', error);
        }
      );
    }
  }
  
 cancelEditing() {
    this.editing = false;
    this.editingId = null;
  }

  viewDepartment(){
    this.masterAction.getDepartmentData().subscribe((res:any[]) => {
      this.department = res;
      console.log(res);
    });
  }

  editDepartment(id:any){
    this.editing = true;
    this.editingId = id;
    this.masterAction.getDepartmentData().subscribe((dept:any)=>{
          dept.forEach((ele:any)=>{
            if(ele._id == id){
              this.departmentForm.patchValue({
                category_code: ele.category_code,
                department_name: ele.department_name
              });
            }
          })
      })
  }

  updateDepartment(id:any){
      if (this.departmentForm.valid) {
        const formValue={
          ...this.departmentForm.value
        }
        this.masterAction.updateDepartment(id,formValue).subscribe(
          (res: any) => {
            alert(res.message);
            this.showPopup = false;
            location.reload();
            this.editing = false;
            this.editingId = null;
          },
          (error) => {
            console.error('Error updating category:', error);
          }
        );
      }
  }

  editDesignation(id:any){
    this.editing = true;
    this.editingId = id;
    this.masterAction.getDesignations().subscribe((designationItem:any)=>{
          designationItem.results.forEach((ele:any)=>{
            if(ele._id == id){
              this.designationForm.patchValue({
                category_code: ele.category_code,
                designation_name: ele.designation_name
              });
            }
          })
      })
  }

  updateDesignation(id:any){
    if (this.designationForm.valid) {
      const formValue={
        ...this.designationForm.value
      }
      this.masterAction.updateDesignation(id,formValue).subscribe(
        (res: any) => {
          alert(res.message);
          this.showPopup = false;
          location.reload();
          this.editing = false;
          this.editingId = null;
        },
        (error) => {
          console.error('Error updating category:', error);
        }
      );
    }
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

  editPayscale(id:any){
    this.editing = true;
    this.editingId = id;

    this.masterAction.getCategoriesById(id).subscribe((res: any) => {
      if (res.length > 0) {
        const payScaleItem = res[0];

        this.payscaleForm.patchValue({
          category_name: payScaleItem.category_name,
          category_code: payScaleItem.category_code,
          payscale:payScaleItem.payscale
        });
      }
    });
  }

  updatePayscale(){
      if (this.payscaleForm.valid) {
        const value={
          category_name : this.payscaleForm.get('category_name')?.value,
          category_code : this.payscaleForm.get('category_code')?.value,
          payscale:this.payscaleForm.get('payscale')?.value,
          category_type:"promotion_grade",
        }
        this.masterAction.updateCategories(this.editingId, value).subscribe(
          (res: any) => {
            console.log('Update Response:', res);
            // alert(res.message);
            alert("Payscale Updated Successfully!");
            this.showPopup = false;
            location.reload();
            this.editing = false;
            this.editingId = null;
          },
          (error) => {
            console.error('Error updating category:', error);
          }
        );
      }
    
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

  editCountry(id:any){
    this.editing = true;
    this.editingId = id;

    this.masterAction.getCategoriesById(id).subscribe((res: any) => {
      if (res.length > 0) {
        const countryItem = res[0];

        this.countryForm.patchValue({
          title: countryItem.category_name,
          code: countryItem.category_code,
        });
      }
    });
  }

  updateCountry(){
    if (this.countryForm.valid) {
      const value={
        category_name : this.countryForm.get('title')?.value,
        category_code : this.countryForm.get('code')?.value,
        category_type:"country",
      }
      this.masterAction.updateCategories(this.editingId, value).subscribe(
        (res: any) => {
          // alert(res.message);
          alert("Country Updated Successfully!");
          this.showPopup = false;
          location.reload();
          this.editing = false;
          this.editingId = null;
        },
        (error) => {
          console.error('Error updating category:', error);
        }
      );
    }
  
  }

  viewDegree(){
    this.masterAction.getDegree().subscribe((res:any)=>{
     this.degree = res.results;
     console.log(this.degree);
    })
  }

  editDegree(id:any){
    this.editing = true;
    this.editingId = id;

    this.masterAction.getDegree().subscribe((res: any) => {
      res.results.forEach((ele:any)=>{
        if(ele._id == id){
          this.degreeForm.patchValue({
            degree_name: ele.degree_name,
          });
        }
      })
    });
  }

  updateDegree(){
  }

  viewOrderType(){
    this.masterAction.getData().subscribe((res)=>{
      this.orderType = res.filter((item:any) => item.category_type === "order_type");
    })
  }

  editOrderType(id:any){
    this.editing = true;
    this.editingId = id;

    this.masterAction.getCategoriesById(id).subscribe((res: any) => {
      if (res.length > 0) {
        const orderTypeItem = res[0];
        this.orderTypeForm.patchValue({
          category_name: orderTypeItem.category_name,
          category_code: orderTypeItem.category_code,
        });
      }
    });
  }

  updateOrderType(){
    if (this.orderTypeForm.valid) {
      const value={
        category_name : this.orderTypeForm.get('category_name')?.value,
        category_code : this.orderTypeForm.get('category_code')?.value,
        category_type:"order_type",
      }
      this.masterAction.updateCategories(this.editingId, value).subscribe(
        (res: any) => {
          console.log('Update Response:', res);
          // alert(res.message);
          alert("Order Type Updated Successfully!");
          this.showPopup = false;
          location.reload();
          this.editing = false;
          this.editingId = null;
        },
        (error) => {
          console.error('Error updating category:', error);
        }
      );
    }
  }

  viewOrderFor(){
    this.masterAction.getData().subscribe((res)=>{
      this.orderFor = res.filter((item:any) => item.category_type === "order_for");
    })
  }

  editOrderFor(id:any){
    this.editing = true;
    this.editingId = id;

    this.masterAction.getCategoriesById(id).subscribe((res: any) => {
      if (res.length > 0) {
        const orderForItem = res[0];
        this.orderForForm.patchValue({
          category_name: orderForItem.category_name,
          category_code: orderForItem.category_code,
        });
      }
    });
  }

  updateOrderFor(){
    if (this.orderForForm.valid) {
      const value={
        category_name : this.orderForForm.get('category_name')?.value,
        category_code : this.orderForForm.get('category_code')?.value,
        category_type:"order_for",
      }
      this.masterAction.updateCategories(this.editingId, value).subscribe(
        (res: any) => {
          console.log('Update Response:', res);
          // alert(res.message);
          alert("Order For Updated Successfully!");
          this.showPopup = false;
          location.reload();
          this.editing = false;
          this.editingId = null;
        },
        (error) => {
          console.error('Error updating category:', error);
        }
      );
    }
  }

  // Class Details Start

  onClassSubmit(){
    this.submitted = true;
    if(this.classForm.valid){
      const value={
        category_name : this.classForm.get('category_name')?.value,
        category_code : this.classForm.get('category_code')?.value,
        category_type:"class",
      }
      this.masterAction.addMasterData(value).subscribe((res)=>{
        this.showPopup = false;
        location.reload();
        alert("Class Added Successfully");
      })
    }
  }

  viewClass(){
    this.masterAction.getData().subscribe((res)=>{
      this.classData = res.filter((item:any) => item.category_type === "class");
    })
  }

  editClass(id:any){
    this.editing = true;
    this.editingId = id;

    this.masterAction.getCategoriesById(id).subscribe((res: any) => {
      if (res.length > 0) {
        const classItem = res[0];
        this.classForm.patchValue({
          category_name: classItem.category_name,
          category_code: classItem.category_code,
        });
      }
    });
  }

  updateClass(){
    if (this.classForm.valid) {
      const value={
        category_name : this.classForm.get('category_name')?.value,
        category_code : this.classForm.get('category_code')?.value,
        category_type:"class",
      }
      this.masterAction.updateCategories(this.editingId, value).subscribe(
        (res: any) => {
          alert("Class Updated Successfully!");
          this.showPopup = false;
          location.reload();
          this.editing = false;
          this.editingId = null;
        },
        (error) => {
          console.error('Error updating category:', error);
        }
      );
    }
  }

  // Class End


  // Religion Start

  onReligionSubmit(){
    this.submitted = true;
    if(this.religionForm.valid){
      const value={
        category_name : this.religionForm.get('category_name')?.value,
        category_code : this.religionForm.get('category_code')?.value,
        category_type:"religion",
      }
      this.masterAction.addMasterData(value).subscribe((res)=>{
        this.showPopup = false;
        location.reload();
        alert("Religion Added Successfully");
      })
    }
  }

  viewReligion(){
    this.masterAction.getData().subscribe((res)=>{
      this.religions = res.filter((item:any) => item.category_type === "religion");
    })
  }

  editReligion(id:any){
    this.editing = true;
    this.editingId = id;

    this.masterAction.getCategoriesById(id).subscribe((res: any) => {
      if (res.length > 0) {
        const religionItem = res[0];
        this.religionForm.patchValue({
          category_name: religionItem.category_name,
          category_code: religionItem.category_code,
        });
      }
    });
  }

  updateReligion(){
    if (this.religionForm.valid) {
      const value={
        category_name : this.religionForm.get('category_name')?.value,
        category_code : this.religionForm.get('category_code')?.value,
        category_type:"religion",
      }
      this.masterAction.updateCategories(this.editingId, value).subscribe(
        (res: any) => {
          alert("Religion Updated Successfully!");
          this.showPopup = false;
          location.reload();
          this.editing = false;
          this.editingId = null;
        },
        (error) => {
          console.error('Error updating category:', error);
        }
      );
    }
  }
// Religion End


// Education Fund Start
onEducationFundSubmit(){
  this.submitted = true;
  if(this.educationFundForm.valid){
    const value={
      category_name : this.educationFundForm.get('category_name')?.value,
      category_code : this.educationFundForm.get('category_code')?.value,
      category_type:"education_fund",
    }
    this.masterAction.addMasterData(value).subscribe((res)=>{
      this.showPopup = false;
      location.reload();
      alert("Education Fund Added Successfully");
    })
  }
}

viewEducationFund(){
  this.masterAction.getData().subscribe((res)=>{
    this.educationFund = res.filter((item:any) => item.category_type === "education_fund");
  })
}

editEducationFund(id:any){
  this.editing = true;
  this.editingId = id;
  this.masterAction.getCategoriesById(id).subscribe((res: any) => {
    if (res.length > 0) {
      const educationFundItem = res[0];
      this.educationFundForm.patchValue({
        category_name: educationFundItem.category_name,
        category_code: educationFundItem.category_code,
      });
    }
  });
}

updateEducationFund(){
  if (this.educationFundForm.valid) {
    const value={
      category_name : this.educationFundForm.get('category_name')?.value,
      category_code : this.educationFundForm.get('category_code')?.value,
      category_type:"education_fund",
    }
    this.masterAction.updateCategories(this.editingId, value).subscribe(
      (res: any) => {
        alert("Education Fund Updated Successfully!");
        this.showPopup = false;
        location.reload();
        this.editing = false;
        this.editingId = null;
      },
      (error) => {
        console.error('Error updating category:', error);
      }
    );
  }
}
// Education Fund End


// Recruitment Start
onRecruitmentSubmit(){
  this.submitted = true;
  if(this.recruitmentForm.valid){
    const value={
      category_name : this.recruitmentForm.get('category_name')?.value,
      category_code : this.recruitmentForm.get('category_code')?.value,
      category_type:"recruitment_type",
    }
    this.masterAction.addMasterData(value).subscribe((res)=>{
      this.showPopup = false;
      location.reload();
      alert("Recruitment Added Successfully");
    })
  }
}

viewRecruitment(){
  this.masterAction.getData().subscribe((res)=>{
    this.recruitment = res.filter((item:any) => item.category_type === "recruitment_type");
  })
}

editRecruitment(id:any){
  this.editing = true;
  this.editingId = id;
  this.masterAction.getCategoriesById(id).subscribe((res: any) => {
    if (res.length > 0) {
      const recruitmentItem = res[0];
      this.recruitmentForm.patchValue({
        category_name: recruitmentItem.category_name,
        category_code: recruitmentItem.category_code,
      });
    }
  });
}

updateRecruitment(){
  if (this.recruitmentForm.valid) {
    const value={
      category_name : this.recruitmentForm.get('category_name')?.value,
      category_code : this.recruitmentForm.get('category_code')?.value,
      category_type:"recruitment_type",
    }
    this.masterAction.updateCategories(this.editingId, value).subscribe(
      (res: any) => {
        alert("Recruitment Updated Successfully!");
        this.showPopup = false;
        location.reload();
        this.editing = false;
        this.editingId = null;
      },
      (error) => {
        console.error('Error updating category:', error);
      }
    );
  }
}
// Recruitment End


// Post Type Start
onPostTypeSubmit(){
  this.submitted = true;
  if(this.postTypeForm.valid){
    const value={
      category_name : this.postTypeForm.get('category_name')?.value,
      category_code : this.postTypeForm.get('category_code')?.value,
      category_type:"post_type",
    }
    this.masterAction.addMasterData(value).subscribe((res)=>{
      this.showPopup = false;
      location.reload();
      alert("Post Type Added Successfully");
    })
  }
}

viewPostType(){
  this.masterAction.getData().subscribe((res)=>{
    this.postType = res.filter((item:any) => item.category_type === "post_type");
  })
}

editPostType(id:any){
  this.editing = true;
  this.editingId = id;
  this.masterAction.getCategoriesById(id).subscribe((res: any) => {
    if (res.length > 0) {
      const postTypeItem = res[0];
      this.postTypeForm.patchValue({
        category_name: postTypeItem.category_name,
        category_code: postTypeItem.category_code,
      });
    }
  });
}

updatePostType(){
  if (this.postTypeForm.valid) {
    const value={
      category_name : this.postTypeForm.get('category_name')?.value,
      category_code : this.postTypeForm.get('category_code')?.value,
      category_type:"post_type",
    }
    this.masterAction.updateCategories(this.editingId, value).subscribe(
      (res: any) => {
        alert("Post Type Updated Successfully!");
        this.showPopup = false;
        location.reload();
        this.editing = false;
        this.editingId = null;
      },
      (error) => {
        console.error('Error updating category:', error);
      }
    );
  }
}
// Post Type End


// location change Start
onLocationChangeSubmit(){
  this.submitted = true;
  if(this.locationChangeForm.valid){
    const value={
      category_name : this.locationChangeForm.get('category_name')?.value,
      // category_code : this.locationChangeForm.get('category_code')?.value,
      category_type:"location_change",
    }
    this.masterAction.addMasterData(value).subscribe((res)=>{
      this.showPopup = false;
      location.reload();
      alert("Location Change Added Successfully");
    })
  }
}

viewLocationChange(){
  this.masterAction.getData().subscribe((res)=>{
    this.locationChange = res.filter((item:any) => item.category_type === "location_change");
  })
}

editLocationChange(id:any){
  this.editing = true;
  this.editingId = id;
  this.masterAction.getCategoriesById(id).subscribe((res: any) => {
    if (res.length > 0) {
      const locationChangeItem = res[0];
      this.locationChangeForm.patchValue({
        category_name: locationChangeItem.category_name,
        // category_code: locationChangeItem.category_code,
      });
    }
  });
}

updateLocationChange(){
  if (this.locationChangeForm.valid) {
    const value={
      category_name : this.locationChangeForm.get('category_name')?.value,
      // category_code : this.locationChangeForm.get('category_code')?.value,
      category_type:"location_change",
    }
    this.masterAction.updateCategories(this.editingId, value).subscribe(
      (res: any) => {
        alert("Location Change Updated Successfully!");
        this.showPopup = false;
        location.reload();
        this.editing = false;
        this.editingId = null;
      },
      (error) => {
        console.error('Error updating category:', error);
      }
    );
  }
}
// Location Change End


// Leave Start
onLeaveSubmit(){
  this.submitted = true;
  if(this.leaveForm.valid){
    const value={
      category_name : this.leaveForm.get('category_name')?.value,
      category_code : this.leaveForm.get('category_code')?.value,
      category_type:"leave_type",
    }
    this.masterAction.addMasterData(value).subscribe((res)=>{
      this.showPopup = false;
      location.reload();
      alert("Leave Type Added Successfully");
    })
  }
}

viewLeave(){
  this.masterAction.getData().subscribe((res)=>{
    this.leave = res.filter((item:any) => item.category_type === "leave_type");
  })
}

editLeave(id:any){
  this.editing = true;
  this.editingId = id;
  this.masterAction.getCategoriesById(id).subscribe((res: any) => {
    if (res.length > 0) {
      const leaveItem = res[0];
      this.leaveForm.patchValue({
        category_name: leaveItem.category_name,
        category_code: leaveItem.category_code,
      });
    }
  });
}

updateLeave(){
  if (this.leaveForm.valid) {
    const value={
      category_name : this.leaveForm.get('category_name')?.value,
      category_code : this.leaveForm.get('category_code')?.value,
      category_type:"leave_type",
    }
    this.masterAction.updateCategories(this.editingId, value).subscribe(
      (res: any) => {
        alert("Leave Type Updated Successfully!");
        this.showPopup = false;
        location.reload();
        this.editing = false;
        this.editingId = null;
      },
      (error) => {
        console.error('Error updating category:', error);
      }
    );
  }
}
// Leave End

//Training Start
onTrainingSubmit(){
  this.submitted = true;
  if(this.trainingForm.valid){
    const value={
      category_name : this.trainingForm.get('category_name')?.value,
      category_code : this.trainingForm.get('category_code')?.value,
      category_type:"training_type",
    }
    this.masterAction.addMasterData(value).subscribe((res)=>{
      this.showPopup = false;
      location.reload();
      alert("Training Type Added Successfully");
    })
  }
}

viewTraining(){
  this.masterAction.getData().subscribe((res)=>{
    this.training = res.filter((item:any) => item.category_type === "training_type");
  })
}

editTraining(id:any){
  this.editing = true;
  this.editingId = id;
  this.masterAction.getCategoriesById(id).subscribe((res: any) => {
    if (res.length > 0) {
      const trainingItem = res[0];
      this.trainingForm.patchValue({
        category_name: trainingItem.category_name,
        category_code: trainingItem.category_code,
      });
    }
  });
}

updateTraining(){
  if (this.trainingForm.valid) {
    const value={
      category_name : this.trainingForm.get('category_name')?.value,
      category_code : this.trainingForm.get('category_code')?.value,
      category_type:"training_type",
    }
    this.masterAction.updateCategories(this.editingId, value).subscribe(
      (res: any) => {
        alert("Training Type Updated Successfully!");
        this.showPopup = false;
        location.reload();
        this.editing = false;
        this.editingId = null;
      },
      (error) => {
        console.error('Error updating category:', error);
      }
    );
  }
}
//Training End

//Foreign Visit Start
onForeignVisitSubmit(){
  this.submitted = true;
  if(this.foreignVisitForm.valid){
    const value={
      category_name : this.foreignVisitForm.get('category_name')?.value,
      category_code : this.foreignVisitForm.get('category_code')?.value,
      category_type:"foreign_visit_fund",
    }
    this.masterAction.addMasterData(value).subscribe((res)=>{
      this.showPopup = false;
      location.reload();
      alert("Foreign Visit Added Successfully");
    })
  }
}

viewForeignVisit(){
  this.masterAction.getData().subscribe((res)=>{
    this.foreignVisit = res.filter((item:any) => item.category_type === "foreign_visit_fund");
  })
}

editForeignVisit(id:any){
  this.editing = true;
  this.editingId = id;
  this.masterAction.getCategoriesById(id).subscribe((res: any) => {
    if (res.length > 0) {
      const foreignVisitItem = res[0];
      this.foreignVisitForm.patchValue({
        category_name: foreignVisitItem.category_name,
        category_code: foreignVisitItem.category_code,
      });
    }
  });
}

updateForeignVisit(){
  if (this.foreignVisitForm.valid) {
    const value={
      category_name : this.foreignVisitForm.get('category_name')?.value,
      category_code : this.foreignVisitForm.get('category_code')?.value,
      category_type:"foreign_visit_fund",
    }
    this.masterAction.updateCategories(this.editingId, value).subscribe(
      (res: any) => {
        alert("Foreign Visit Updated Successfully!");
        this.showPopup = false;
        location.reload();
        this.editing = false;
        this.editingId = null;
      },
      (error) => {
        console.error('Error updating category:', error);
      }
    );
  }
}
//Foreign Visit End
//Course Level Start
onCourseLevelSubmit(){
  this.submitted = true;
  if(this.course_levelForm.valid){
    const value={
      category_name : this.course_levelForm.get('category_name')?.value,
      category_code : this.course_levelForm.get('category_code')?.value,
      category_type:"course_level",
    }
    this.masterAction.addMasterData(value).subscribe((res)=>{
      this.showPopup = false;
      location.reload();
      alert("Course Level Added Successfully");
    })
  }
}

viewCourseLevel(){
  this.masterAction.getData().subscribe((res)=>{
    this.course_level = res.filter((item:any) => item.category_type === "course_level");
  })
}

editCourseLevel(id:any){
  this.editing = true;
  this.editingId = id;
  this.masterAction.getCategoriesById(id).subscribe((res: any) => {
    if (res.length > 0) {
      const course_level_item = res[0];
      this.course_levelForm.patchValue({
        category_name: course_level_item.category_name,
        category_code: course_level_item.category_code,
      });
    }
  });
}

updateCourseLevel(){
  if (this.ltcForm.valid) {
    const value={
      category_name : this.ltcForm.get('category_name')?.value,
      category_code : this.ltcForm.get('category_code')?.value,
      category_type:"course_level",
    }
    this.masterAction.updateCategories(this.editingId, value).subscribe(
      (res: any) => {
        alert("Course Level Updated Successfully!");
        this.showPopup = false;
        location.reload();
        this.editing = false;
        this.editingId = null;
      },
      (error) => {
        console.error('Error updating category:', error);
      }
    );
  }
}
//Course Level End

// ltc start
onLtcSubmit(){
  this.submitted = true;
  if(this.ltcForm.valid){
    const value={
      category_name : this.ltcForm.get('category_name')?.value,
      category_code : this.ltcForm.get('category_code')?.value,
      category_type:"ltc_category",
    }
    this.masterAction.addMasterData(value).subscribe((res)=>{
      this.showPopup = false;
      location.reload();
      alert("LTC Added Successfully");
    })
  }
}

viewLtc(){
  this.masterAction.getData().subscribe((res)=>{
    this.ltc = res.filter((item:any) => item.category_type === "ltc_category");
  })
}

editLtc(id:any){
  this.editing = true;
  this.editingId = id;
  this.masterAction.getCategoriesById(id).subscribe((res: any) => {
    if (res.length > 0) {
      const ltc_item = res[0];
      this.ltcForm.patchValue({
        category_name: ltc_item.category_name,
        category_code: ltc_item.category_code,
      });
    }
  });
}

updateLtc(){
  if (this.ltcForm.valid) {
    const value={
      category_name : this.ltcForm.get('category_name')?.value,
      category_code : this.ltcForm.get('category_code')?.value,
      category_type:"ltc_category",
    }
    this.masterAction.updateCategories(this.editingId, value).subscribe(
      (res: any) => {
        alert("LTC Updated Successfully!");
        this.showPopup = false;
        location.reload();
        this.editing = false;
        this.editingId = null;
      },
      (error) => {
        console.error('Error updating category:', error);
      }
    );
  }
}
// ltc end




// immovable start
onimmovableSubmit(){
  this.submitted = true;
  if(this.immovableForm.valid){
    const value={
      category_name : this.immovableForm.get('category_name')?.value,
      category_code : this.immovableForm.get('category_code')?.value,
      category_type:"immovable_type",
    }
    this.masterAction.addMasterData(value).subscribe((res)=>{
      this.showPopup = false;
      location.reload();
      alert("Immovable Added Successfully");
    })
  }
}

viewimmovable(){
  this.masterAction.getData().subscribe((res)=>{
    this.immovable = res.filter((item:any) => item.category_type === "immovable_type");
  })
}

editimmovable(id:any){
  this.editing = true;
  this.editingId = id;
  this.masterAction.getCategoriesById(id).subscribe((res: any) => {
    if (res.length > 0) {
      const immovable_item = res[0];
      this.immovableForm.patchValue({
        category_name: immovable_item.category_name,
        category_code: immovable_item.category_code,
      });
    }
  });
}

updateimmovable(){
  if (this.immovableForm.valid) {
    const value={
      category_name : this.immovableForm.get('category_name')?.value,
      category_code : this.immovableForm.get('category_code')?.value,
      category_type:"immovable_type",
    }
    this.masterAction.updateCategories(this.editingId, value).subscribe(
      (res: any) => {
        alert("immovable Updated Successfully!");
        this.showPopup = false;
        location.reload();
        this.editing = false;
        this.editingId = null;
      },
      (error) => {
        console.error('Error updating category:', error);
      }
    );
  }
}
// immovable end

// movable start
onmovableSubmit(){
  this.submitted = true;
  if(this.movableForm.valid){
    const value={
      category_name : this.movableForm.get('category_name')?.value,
      category_code : this.movableForm.get('category_code')?.value,
      category_type:"movable_type",
    }
    this.masterAction.addMasterData(value).subscribe((res)=>{
      this.showPopup = false;
      location.reload();
      alert("Movable Added Successfully");
    })
  }
}

viewmovable(){
  this.masterAction.getData().subscribe((res)=>{
    this.movable = res.filter((item:any) => item.category_type === "movable_type");
  })
}

editmovable(id:any){
  this.editing = true;
  this.editingId = id;
  this.masterAction.getCategoriesById(id).subscribe((res: any) => {
    if (res.length > 0) {
      const movable_type_item = res[0];
      this.movableForm.patchValue({
        category_name: movable_type_item.category_name,
        category_code: movable_type_item.category_code,
      });
    }
  });
}

updatemovable(){
  if (this.movableForm.valid) {
    const value={
      category_name : this.movableForm.get('category_name')?.value,
      category_code : this.movableForm.get('category_code')?.value,
      category_type:"movable_type",
    }
    this.masterAction.updateCategories(this.editingId, value).subscribe(
      (res: any) => {
        alert("Movable Updated Successfully!");
        this.showPopup = false;
        location.reload();
        this.editing = false;
        this.editingId = null;
      },
      (error) => {
        console.error('Error updating category:', error);
      }
    );
  }
}
// movable end

// intimation start
onintimationSubmit(){
  this.submitted = true;
  if(this.intimationForm.valid){
    const value={
      category_name : this.intimationForm.get('category_name')?.value,
      category_code : this.intimationForm.get('category_code')?.value,
      category_type:"intimation_type",
    }
    this.masterAction.addMasterData(value).subscribe((res)=>{
      this.showPopup = false;
      location.reload();
      alert("Intimation Added Successfully");
    })
  }
}

viewintimation(){
  this.masterAction.getData().subscribe((res)=>{
    this.intimation = res.filter((item:any) => item.category_type === "intimation_type");
  })
}

editintimation(id:any){
  this.editing = true;
  this.editingId = id;
  this.masterAction.getCategoriesById(id).subscribe((res: any) => {
    if (res.length > 0) {
      const intimation_item = res[0];
      this.intimationForm.patchValue({
        category_name: intimation_item.category_name,
        category_code: intimation_item.category_code,
      });
    }
  });
}

updateintimation(){
  if (this.intimationForm.valid) {
    const value={
      category_name : this.intimationForm.get('category_name')?.value,
      category_code : this.intimationForm.get('category_code')?.value,
      category_type:"intimation_type",
    }
    this.masterAction.updateCategories(this.editingId, value).subscribe(
      (res: any) => {
        alert("Intimation Updated Successfully!");
        this.showPopup = false;
        location.reload();
        this.editing = false;
        this.editingId = null;
      },
      (error) => {
        console.error('Error updating category:', error);
      }
    );
  }
}
//intimation end

// hba availed start
onhbaavailedSubmit(){
  this.submitted = true;
  if(this.hba_availedForm.valid){
    const value={
      category_name : this.hba_availedForm.get('category_name')?.value,
      category_code : this.hba_availedForm.get('category_code')?.value,
      category_type:"hba_availed_for",
    }
    this.masterAction.addMasterData(value).subscribe((res)=>{
      this.showPopup = false;
      location.reload();
      alert("HBA availed Added Successfully");
    })
  }
}

viewhbaavailed(){
  this.masterAction.getData().subscribe((res)=>{
    this.hba_availed = res.filter((item:any) => item.category_type === "hba_availed_for");
  })
}

edithbaavailed(id:any){
  this.editing = true;
  this.editingId = id;
  this.masterAction.getCategoriesById(id).subscribe((res: any) => {
    if (res.length > 0) {
      const hba_availed_for_item = res[0];
      this.hba_availedForm.patchValue({
        category_name: hba_availed_for_item.category_name,
        category_code: hba_availed_for_item.category_code,
      });
    }
  });
}

updatehbaavailed(){
  if (this.hba_availedForm.valid) {
    const value={
      category_name : this.hba_availedForm.get('category_name')?.value,
      category_code : this.hba_availedForm.get('category_code')?.value,
      category_type:"hba_availed_for",
    }
    this.masterAction.updateCategories(this.editingId, value).subscribe(
      (res: any) => {
        alert("HBA availed Updated Successfully!");
        this.showPopup = false;
        location.reload();
        this.editing = false;
        this.editingId = null;
      },
      (error) => {
        console.error('Error updating category:', error);
      }
    );
  }
}
// hba availed end

// hba types start
onhbtypesSubmit(){
  this.submitted = true;
  if(this.hba_typesForm.valid){
    const value={
      category_name : this.hba_typesForm.get('category_name')?.value,
      category_code : this.hba_typesForm.get('category_code')?.value,
      category_type:"hba_typeofproperty",
    }
    this.masterAction.addMasterData(value).subscribe((res)=>{
      this.showPopup = false;
      location.reload();
      alert("HBA Types Added Successfully");
    })
  }
}

viewhbtypes(){
  this.masterAction.getData().subscribe((res)=>{
    this.hba_types = res.filter((item:any) => item.category_type === "hba_typeofproperty");
  })
}

edithbtypes(id:any){
  this.editing = true;
  this.editingId = id;
  this.masterAction.getCategoriesById(id).subscribe((res: any) => {
    if (res.length > 0) {
      const hba_types_item = res[0];
      this.hba_typesForm.patchValue({
        category_name: hba_types_item.category_name,
        category_code: hba_types_item.category_code,
      });
    }
  });
}

updatehbtypes(){
  if (this.hba_typesForm.valid) {
    const value={
      category_name : this.hba_typesForm.get('category_name')?.value,
      category_code : this.hba_typesForm.get('category_code')?.value,
      category_type:"hba_typeofproperty",
    }
    this.masterAction.updateCategories(this.editingId, value).subscribe(
      (res: any) => {
        alert("HBA Types Updated Successfully!");
        this.showPopup = false;
        location.reload();
        this.editing = false;
        this.editingId = null;
      },
      (error) => {
        console.error('Error updating category:', error);
      }
    );
  }
}
// hba types end

// gpf type start
ongpftypeSubmit(){
  this.submitted = true;
  if(this.gpf_typeForm.valid){
    const value={
      category_name : this.gpf_typeForm.get('category_name')?.value,
      category_code : this.gpf_typeForm.get('category_code')?.value,
      category_type:"gpf_type",
    }
    this.masterAction.addMasterData(value).subscribe((res)=>{
      this.showPopup = false;
      location.reload();
      alert("GPF Type Added Successfully");
    })
  }
}

viewgpftype(){
  this.masterAction.getData().subscribe((res)=>{
    this.gpf_type = res.filter((item:any) => item.category_type === "gpf_type");
  })
}

editgpftype(id:any){
  this.editing = true;
  this.editingId = id;
  this.masterAction.getCategoriesById(id).subscribe((res: any) => {
    if (res.length > 0) {
      const gpf_type_item = res[0];
      this.gpf_typeForm.patchValue({
        category_name: gpf_type_item.category_name,
        category_code: gpf_type_item.category_code,
      });
    }
  });
}

updategpftype(){
  if (this.gpf_typeForm.valid) {
    const value={
      category_name : this.gpf_typeForm.get('category_name')?.value,
      category_code : this.gpf_typeForm.get('category_code')?.value,
      category_type:"gpf_type",
    }
    this.masterAction.updateCategories(this.editingId, value).subscribe(
      (res: any) => {
        alert("GPF Type Updated Successfully!");
        this.showPopup = false;
        location.reload();
        this.editing = false;
        this.editingId = null;
      },
      (error) => {
        console.error('Error updating category:', error);
      }
    );
  }
}
// gpf type end

// purpose of gpf start
ongpfpurposeSubmit(){
  this.submitted = true;
  if(this.purpose_of_gpfForm.valid){
    const value={
      category_name : this.purpose_of_gpfForm.get('category_name')?.value,
      category_code : this.purpose_of_gpfForm.get('category_code')?.value,
      category_type:"purpose_of_gpf",
    }
    this.masterAction.addMasterData(value).subscribe((res)=>{
      this.showPopup = false;
      location.reload();
      alert("GPF Purpose Added Successfully");
    })
  }
}

viewgpfpurpose(){
  this.masterAction.getData().subscribe((res)=>{
    this.purpose_of_gpf = res.filter((item:any) => item.category_type === "purpose_of_gpf");
  })
}

editgpfpurpose(id:any){
  this.editing = true;
  this.editingId = id;
  this.masterAction.getCategoriesById(id).subscribe((res: any) => {
    if (res.length > 0) {
      const gpf_purpose_item = res[0];
      this.purpose_of_gpfForm.patchValue({
        category_name: gpf_purpose_item.category_name,
        category_code: gpf_purpose_item.category_code,
      });
    }
  });
}

updategpfpurpose(){
  if (this.purpose_of_gpfForm.valid) {
    const value={
      category_name : this.purpose_of_gpfForm.get('category_name')?.value,
      category_code : this.purpose_of_gpfForm.get('category_code')?.value,
      category_type:"purpose_of_gpf",
    }
    this.masterAction.updateCategories(this.editingId, value).subscribe(
      (res: any) => {
        alert("GPF Purpose Updated Successfully!");
        this.showPopup = false;
        location.reload();
        this.editing = false;
        this.editingId = null;
      },
      (error) => {
        console.error('Error updating category:', error);
      }
    );
  }
}
// purpose of gpf end
//Block
viewBlock(){

}


  cancel(){
    this.masterCreationForm.reset();
  }
  
  onPostingUpdate(){
    // this.submitted = true;
    console.log(this.postingInUpdateForm.value);
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
        alert("Order For Added Successfully");
      })
    }
  }  
  showAddStateModal = false;
  showViewStateModal = false;
  type:string=""

  openAddModal(type:string) {
  this.showAddStateModal = true;
  this.type = type;
  }
  openViewModal(type:any){
    this.type = type;
     this.showViewStateModal = true;
  }

  handleAddModalClose(data: any) {
    this.showAddStateModal = false;
    this.showViewStateModal = false;
    if (data) {
      // handle submission
      console.log('Form submitted:', data);
    }
  }
 

onSubmit(){

}
}