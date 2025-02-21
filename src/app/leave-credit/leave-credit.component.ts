import { Component, OnInit } from '@angular/core';
import { LeaveTransferService } from '../forms/forms.service';
import { FormGroup } from '@angular/forms';

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

  constructor(private leaveCreditService:LeaveTransferService){

  }
  ngOnInit(): void {
    this.leaveCreditService.getActiveOfficers().subscribe((res: any) => {
       this.ServingEmplyee = res.results.empList;
       console.log(this.ServingEmplyee);
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

  changeLeaveData(id:any,name:any){
    this.name = name;
    this.showPopup = true;
  }

  onSubmit(){

  }
}
