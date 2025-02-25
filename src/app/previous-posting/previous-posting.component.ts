import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveTransferService } from '../forms/forms.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-previous-posting',
  templateUrl: './previous-posting.component.html',
  styleUrl: './previous-posting.component.css'
})
export class PreviousPostingComponent implements OnInit{
  public previousPostingData:any[]=[];
  filterText: any;
  pageSize: number = 100; // Number of items per page
  pageSizeOptions: number[] = [100, 200, 500, 1000];
  currentPage: number = 1; // Current page
  visiblePages: number[] = [];
  maxVisiblePages = 100;
  showAdd :boolean = false;
  showEdit:boolean = false;
  showApprove:boolean = false;
  showView:boolean=false;
  viewPreviousPostingData = new viewPreviousPostingData();
  base64ImageData:string='';
  showPopup = true;
  showPosting = false;

  constructor(private router:Router, private previousPostingAction:LeaveTransferService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    const loginId = localStorage.getItem('loginId');
   const loginAs = localStorage.getItem('loginAs');
   this.previousPostingAction.getPreviousPostingList().subscribe((res: any) => {
    this.previousPostingData = res.results;
  });
  
  }

 
  addNew(){
    this.router.navigate(['create-previous-posting']);
  }

  get filteredEmployeeList() {
    const filterText = (this.filterText || '').trim().toLowerCase();
    if (filterText === '') {
      return this.previousPostingData;
    } else {
      return this.previousPostingData.filter(employee => {
        if (employee.empProfileId && employee.empProfileId.fullName) {
          return employee.empProfileId.fullName.toLowerCase().includes(filterText);
        }
        return false;
      });
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

  handleFilterChange() {
    this.cdr.detectChanges();
  }

  editPreviousPosting(data:any){
    this.router.navigate(['edit-previous-posting'], { queryParams: { profile: data } })
  }

  viewPreviousPosting(data:any){
    this.previousPostingAction.getPreviousPostingbyId(data).subscribe((res:any)=>{
      res.results.forEach((item:any)=>{
        this.viewPreviousPostingData.fullName = item.empProfileId.fullName;
        this.viewPreviousPostingData.empProfileId = item.empProfileId.employeeId;
        this.viewPreviousPostingData.previousPostingList = item.previousPostingList;

        this.viewPreviousPostingData.previousPostingList = res.results.flatMap((item: any) => item.previousPostingList);

      // Fetch Posting In Categories and map names
      this.previousPostingAction.getData().subscribe((postingCategories: any[]) => {
        const categoryMap = postingCategories.reduce((acc, item) => {
          acc[item._id] = item.category_name;
          return acc;
        }, {});

        this.viewPreviousPostingData.previousPostingList.forEach((tableItem: any) => {
          tableItem.toPostingInCategoryCode = categoryMap[tableItem.toPostingInCategoryCode] || tableItem.toPostingInCategoryCode;
        });
      });

      this.previousPostingAction.getDepartmentData().subscribe((department: any[]) => {
        const departmentMap = department.reduce((acc, item) => {
          acc[item._id] = item.department_name;
          return acc;
        }, {});

        this.viewPreviousPostingData.previousPostingList.forEach((tableItem: any) => {
          tableItem.toDepartmentId = departmentMap[tableItem.toDepartmentId] || tableItem.toDepartmentId;
        });
      });

      this.previousPostingAction.getDesignations().subscribe((designation: any) => {
        const designationMap = designation.results.reduce((acc:any, item:any) => {
          acc[item._id] = item.designation_name;
          return acc;
        }, {});

        this.viewPreviousPostingData.previousPostingList.forEach((tableItem: any) => {
          tableItem.toDesignationId = designationMap[tableItem.toDesignationId] || tableItem.toDesignationId;
        });
      });
        
      
      });
      
    })
  }
}

export class viewPreviousPostingData{
  id:string='';
  fullName:string='';
  empProfileId:string='';
  previousPostingList:previousPostingList[]=[];
}
export class previousPostingList{
  toPostingInCategoryCode:string='';
  toDepartmentId:string='';
  toDesignationId:string='';
  district:string='';
  fromDate:string='';
  toDate:string='';
}
