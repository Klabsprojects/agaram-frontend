import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveTransferService } from '../forms.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-gpf',
  templateUrl: './gpf.component.html',
  styleUrl: './gpf.component.css'
})
export class GpfComponent implements OnInit{
filterText : any;
    tableData:any[]=[];
    pageSize: number = 10; 
    pageSizeOptions: number[] = [5, 10, 15, 20];
    currentPage: number = 1; // Current page
    visiblePages: number[] = [];
    maxVisiblePages = 10;
    url='';
    showAdd:boolean=false;
    showView:boolean=false;
    showEdit:boolean=false;
    showApprove:boolean=false;  
    showPopup = true;
  
    constructor(private router:Router,private gpfService:LeaveTransferService,private datePipe: DatePipe) { }
  
    ngOnInit(): void {
      this.url = this.gpfService.fileUrl;
      const loginId = localStorage.getItem('loginId');
     const loginAs = localStorage.getItem('loginAs');
      this.gpfService.getGpf(loginId,loginAs).subscribe((res:any)=>{
        this.tableData = res.results;
      });
      this.checkAccess();
    }
  
    checkAccess(): void {
      this.gpfService.currentRoleData.subscribe((response: any[]) => {
        const idCardMenu = response.find(item => item.menu === 'GPF');
        this.showAdd = idCardMenu?.entryAccess ?? false;
        this.showEdit = idCardMenu?.editAccess ?? false;
        this.showView = idCardMenu?.viewAccess ?? false;
        this.showApprove = idCardMenu?.approvalAccess ?? false;
      });
    }
  
  
    get filteredEmployeeList() {
      const filterText = (this.filterText || '').trim().toLowerCase();
      if (filterText === '') {
        return this.tableData;
      } else {
        return this.tableData.filter(employee =>
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
    changeValue(data:any){
      if(data.target.value == "Print"){
        const printableElement = document.querySelector('.printable-content');
        console.log(printableElement);
        if (printableElement) {
          window.print();
        } else {
          console.error('Printable element not found');
        }
      }
    }
  
    addNew(){
      this.router.navigate(['create-gpf']);
    }


}