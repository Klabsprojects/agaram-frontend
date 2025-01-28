import { Component, OnInit } from '@angular/core';
import { landingService } from '../../landing-services/landing.service';
@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css','./pagination/pagination.component.css']
})
export class TransferComponent implements OnInit {
  public details:any[]= []
  public detailsStatic:any[]=[];
  itemsPerPage = 10;
  currentPage = 1;
  totalPages: any;
  currentPageItems: string[] = [];
  pagesToDisplay: (number | string)[] = [];
  constructor(private service: landingService) { }
  ngOnInit(): void {
    this.service.getapicall(`GetLandingGODetail`).subscribe((res: any) => {
      this.details = res.results;
      this.detailsStatic = res.results;
      this.totalPages = Math.ceil(this.details.length / this.itemsPerPage);
        this.updatePagination();
    })
    this.service.searchTextTransfer$.subscribe((res:any)=>{
      if(res){
        this.details = this.detailsStatic.filter(item =>
          Object.values(item).some(value =>
            String(value).toLowerCase().includes(res.toLowerCase())
          )
        );
        this.updatePagination();
      }
      else{
        this.details = structuredClone(this.detailsStatic);
      }
    })
  }
  updatePagination(): void {
    this.pagesToDisplay = this.calculatePageNumbers();
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.currentPageItems = this.details.slice(startIndex, endIndex);
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
