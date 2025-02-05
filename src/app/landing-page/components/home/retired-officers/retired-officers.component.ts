import { Component } from '@angular/core';
import { landingService } from '../../../landing-services/landing.service';
import { LeaveTransferService } from '../../../../forms/forms.service';
@Component({
  selector: 'app-retired-officers',
  templateUrl: './retired-officers.component.html',
  styleUrl: './retired-officers.component.css'
})
export class RetiredOfficersComponent {
  public currentPosting: any[] = [];
  public currentPostingStatic: any[] = [];
  public dashboardDetails = [
    { title: 'Total Officers', value: '256' },
    { title: 'State Cadres', value: '18' },
    { title: 'Departments', value: '42' },
    { title: 'New Postings', value: '12' }
  ];
  itemsPerPage = 10; // Number of items per page
  currentPage = 1; // Current active page
  totalPages: any; // Total number of pages
  currentPageItems: string[] = []; // Items for the current page
  pagesToDisplay: (number | string)[] = []; // Pages to display dynamically
  public departments:any[]=[];
  public designations:any[]=[];
  constructor(private service:landingService,private LTC:LeaveTransferService){}
  ngOnInit() {
    // this.service.getapicall('getActiveEmployeeslanding').subscribe((res: any) => {
    //   this.currentPosting = res.results.empList;
    //   this.currentPostingStatic = res.results.empList;
    //   this.updatePagination();
    // })
    this.department()
    this.service.searchText$.subscribe((res: any) => {
      if (res) {
        this.currentPosting = this.currentPostingStatic.filter(item =>
          Object.values(item).some(value =>
            String(value).toLowerCase().includes(res.toLowerCase())
          )
        );
        this.updatePagination();
      }
      else {
        this.currentPosting = structuredClone(this.currentPostingStatic);
        this.updatePagination();
      }
    })
  }

  department() {
    this.LTC.getDepartmentData().subscribe((departments: any) => {
      this.departments = departments;
  
      this.LTC.getDesignations().subscribe((designations: any) => {
        this.designations = designations.results;
  
        this.service.getapicall('getRetiredEmployeeslanding').subscribe((res: any) => {
          this.currentPosting = res.results.empList.map((employee: any) => {
            return {
              name: employee.fullName,
              department: this.departments.find((d: any) => d._id === employee.toDepartmentId)?.department_name || '',
              designation: this.designations.find((d: any) => d._id === employee.toDesignationId)?.designation_name || '',
              dateOfJoining : employee.dateOfJoining,
              dateOfRetiremnt: employee.dateOfRetirement,
              location: employee.city,
              address:employee.addressLine,
              officeEmail:employee.officeEmail
            };
          });
          this.currentPostingStatic = structuredClone(this.currentPosting);
          this.updatePagination();
        });
      });
    });
  }


  // Update pagination details (pagesToDisplay and currentPageItems)
  updatePagination(): void {
    this.totalPages = Math.ceil(this.currentPosting.length / this.itemsPerPage);
    this.pagesToDisplay = this.calculatePageNumbers();
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.currentPageItems = this.currentPosting.slice(startIndex, endIndex);
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

  changePaginationValue(data: any) {
    this.itemsPerPage = data.target.value;
    this.updatePagination()
  }
}
