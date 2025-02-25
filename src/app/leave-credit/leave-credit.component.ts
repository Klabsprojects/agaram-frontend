import { Component, OnInit } from '@angular/core';
import { LeaveTransferService } from '../forms/forms.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-leave-credit',
  templateUrl: './leave-credit.component.html',
  styleUrl: './leave-credit.component.css'
})
export class LeaveCreditComponent implements OnInit{
  leaveForm!:FormGroup;
  submitted = false;
  showPopup= false;
  ServingEmplyee:any[]=[];
  filterText: any;
  pageSize: number = 100; // Number of items per page
  pageSizeOptions: number[] = [5, 10, 15, 20];
  currentPage: number = 1; // Current page
  visiblePages: number[] = [];
  maxVisiblePages = 100;
  name : string = '';
  id:string='';
  data:any;

  constructor(private leaveCreditService:LeaveTransferService,private fb:FormBuilder){

  }
  ngOnInit(): void {
    this.leaveCreditService.getActiveOfficers().subscribe((res: any) => {
       this.ServingEmplyee = res.results.empList;
       this.leaveCreditService.getData().subscribe((postingCategories: any[]) => {
        const categoryMap = postingCategories.reduce((acc, item) => {
          acc[item._id] = item.category_name;
          return acc;
        }, {});

        this.ServingEmplyee.forEach((tableItem: any) => {
          tableItem.toPostingInCategoryCode = categoryMap[tableItem.toPostingInCategoryCode] || tableItem.toPostingInCategoryCode;
        });
      });

      this.leaveCreditService.getDepartmentData().subscribe((department: any[]) => {
        const departmentMap = department.reduce((acc, item) => {
          acc[item._id] = item.department_name;
          return acc;
        }, {});

        this.ServingEmplyee.forEach((tableItem: any) => {
          tableItem.toDepartmentId = departmentMap[tableItem.toDepartmentId] || tableItem.toDepartmentId;
        });
      });

      this.leaveCreditService.getDesignations().subscribe((designation: any) => {
        const designationMap = designation.results.reduce((acc:any, item:any) => {
          acc[item._id] = item.designation_name;
          return acc;
        }, {});

        this.ServingEmplyee.forEach((tableItem: any) => {
          tableItem.toDesignationId = designationMap[tableItem.toDesignationId] || tableItem.toDesignationId;
        });
      });
      
    });

    this.leaveForm = this.fb.group({
      casualLeave:['',Validators.required],
      restrictedHoliday:['',Validators.required],
      earnedLeave:['',Validators.required],
      halfPayLeave:['',Validators.required]
    })
  }

  get filteredEmployeeList() {
    const filterText = (this.filterText || '').trim().toLowerCase();
    if (filterText === '') {
      return this.ServingEmplyee;
    } else {
      return this.ServingEmplyee.filter(employee =>
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

  changeLeaveData(data: any) {
    this.name = data.fullName;
    this.data = data;
    if (data.leaveCredit.length == 0) {
        this.id = data._id;
        this.leaveForm.get('casualLeave')?.setValue('0');
            this.leaveForm.get('halfPayLeave')?.setValue('0');
            this.leaveForm.get('restrictedHoliday')?.setValue('0');
            this.leaveForm.get('earnedLeave')?.setValue('0');
    } else {
        const leaveCreditItem = data.leaveCredit.find((ele: any) => ele._id);
        if (leaveCreditItem) {
            this.id = leaveCreditItem._id;
            this.leaveForm.get('casualLeave')?.setValue(leaveCreditItem.casualLeave);
            this.leaveForm.get('halfPayLeave')?.setValue(leaveCreditItem.halfPayLeave);
            this.leaveForm.get('restrictedHoliday')?.setValue(leaveCreditItem.restrictedHoliday);
            this.leaveForm.get('earnedLeave')?.setValue(leaveCreditItem.earnedLeave);
        }
    }
    this.showPopup = true;
}

onSubmit() {
  this.submitted = true;
  console.log(this.leaveForm.valid, this.leaveForm.value);

  if (this.leaveForm.valid) {
      // Create a plain object to hold the form data
      const formObject: any = {};

      // Loop through the form controls and add each field to the object
      Object.keys(this.leaveForm.value).forEach(key => {
          const value = this.leaveForm.get(key)?.value;
          if (value !== null && value !== undefined) {
              formObject[key] = value;
          }
      });

      // Conditionally append 'empProfileId' or 'id' based on your condition
      if (this.data && this.data._id === this.id) {
          formObject['empProfileId'] = this.id;  // Add empProfileId to object
      } else {
          formObject['id'] = this.id;  // Add id to object
      }

      // Now, formObject looks like this: {casualLeave: 6, restrictedHoliday: 6, earnedLeave: 6, halfPayLeave: 6, id: "67bdc129e34713368a0bc63f"}

      console.log(formObject); // Log the object for debugging

      // Send the plain object as part of the API call (use JSON.stringify to send as JSON)
      this.leaveCreditService.updateLeaveCredit(formObject).subscribe(
          (res: any) => {
              console.log(res);
              alert(res.message);
              this.showPopup = false;
              location.reload();
          },
          error => {
              console.error('API Error:', error);
          }
      );
  }
}


}
