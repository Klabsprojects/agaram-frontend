import { Component,OnInit } from '@angular/core';
import { landingService } from '../../../landing-services/landing.service';
@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent implements OnInit {
  sampleData: string[] = []; // Array to hold 100 sample data items
  itemsPerPage = 10; // Number of items per page
  currentPage = 1; // Current active page
  totalPages: any;// Total number of pages
  currentPageItems: string[] = []; // Items for the current page
  pagesToDisplay: (number | string)[] = []; // Pages to display dynamically

  constructor(private service:landingService) {}
  ngOnInit(): void {
    this.service.pagginationSend$.subscribe((res:any)=>{
      if(res){
        this.sampleData = res;
        this.totalPages = Math.ceil(this.sampleData.length / this.itemsPerPage);
        this.updatePagination();
      }
    })
  }

  // Update pagination details (pagesToDisplay and currentPageItems)
  updatePagination(): void {
    this.pagesToDisplay = this.calculatePageNumbers();
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.currentPageItems = this.sampleData.slice(startIndex, endIndex);
    this.service.handlePaginationRecive(this.currentPageItems);
  }

  // Calculate the page numbers to display
  calculatePageNumbers(): (number | string)[] {
    const visiblePages = 4; // Number of pages to show before `...`
    const pages = [];

    if (this.totalPages <= visiblePages + 2) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= visiblePages) {
        for (let i = 1; i <= visiblePages; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(this.totalPages);
      } else if (this.currentPage > this.totalPages - visiblePages) {
        pages.push(1);
        pages.push('...');
        for (let i = this.totalPages - visiblePages + 1; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(this.totalPages);
      }
    }

    return pages;
  }

  // Navigate to a specific page
  goToPage(page: number | string): void {
    if (page === '...' || page === this.currentPage) return;
    this.currentPage = +page;
    this.updatePagination();
  }
}
