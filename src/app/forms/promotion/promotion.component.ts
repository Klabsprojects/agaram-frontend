import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveTransferService } from '../forms.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { elementAt } from 'rxjs';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.css']
})
export class PromotionComponent implements OnInit {

  filterText: any;
  tableData: any[] = [];
  tableDataConst: any[] = [];
  pageSize: number = 10;
  pageSizeOptions: number[] = [1, 5, 10, 15, 20];
  currentPage: number = 1; // Current page
  visiblePages: number[] = [];
  maxVisiblePages = 10;
  viewPromotionData = new viewPromotionData();
  url = '';
  showAdd: boolean = false;
  showView: boolean = false;
  showEdit: boolean = false;
  showApprove: boolean = false;
  showPopup = true;
  phone: string = '';
  promotionGrade: any[] = [];

  constructor(private router: Router, private promotionService: LeaveTransferService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.url = this.promotionService.fileUrl;
    const loginId = localStorage.getItem('loginId');
    const loginAs = localStorage.getItem('loginAs');
    this.promotionService.getEmployeeUpdateList(loginId, loginAs).subscribe((res: any) => {
      res.results.filter((item: any) => {
        if (item.updateType == "Promotion") {
          const id = item._id;
          this.promotionService.getData().subscribe((element: any[]) => {
            const promotionGrade = new Map(element.filter(data => data.category_type == 'promotion_grade').map(item => [item._id, item.category_name]));
            item.transferOrPostingEmployeesList.forEach((data: any) => {
              const newData = { ...data, id: id };
              newData.promotionGrade = promotionGrade.get(newData.promotionGrade) || newData.promotionGrade;
              newData.promotedGrade = promotionGrade.get(newData.promotedGrade) || newData.promotedGrade;
              newData.submittedBy = item.submittedBy;
              newData.approvedBy = item.approvedBy;
              newData.approvalStatus = item.approvalStatus;
              this.tableData.push(newData);
              this.tableDataConst = structuredClone(this.tableData);
              // console.log(this.tableData);
            });
          });
        }
      })
    });
    this.promotionService.getData().subscribe((res: any[]) => {
      res.forEach((item) => {
        if (item.category_type === "promotion_grade") {
          this.promotionGrade.push({ label: item.category_name, value: item._id });
        }
      });

    });
    this.checkAccess();
  }

  checkAccess(): void {
    this.promotionService.currentRoleData.subscribe((response: any[]) => {
      const promotionMenu = response.find(item => item.menu === 'Promotion');
      this.showAdd = promotionMenu?.entryAccess ?? false;
      this.showEdit = promotionMenu?.editAccess ?? false;
      this.showView = promotionMenu?.viewAccess ?? false;
      this.showApprove = promotionMenu?.approvalAccess ?? false;
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
  public startIndex: any;
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
      this.visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      const rangeStart = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const rangeEnd = Math.min(totalPages, rangeStart + maxVisiblePages - 1);

      if (rangeEnd === totalPages) {
        this.visiblePages = Array.from({ length: maxVisiblePages }, (_, i) => totalPages - maxVisiblePages + i + 1);
      } else {
        this.visiblePages = Array.from({ length: maxVisiblePages }, (_, i) => rangeStart + i);
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

  addNew() {
    this.router.navigate(['create-promotion']);
  }

  editPromotion(data: any) {
    const encodedData = btoa(JSON.stringify(data));
    this.router.navigate(['edit-promotion'], { queryParams: { id: encodedData } });
  }

  viewPromotion(data: any) {
    this.promotionService.getPromotionId(data).subscribe((res: any) => {

      console.log(res.results);
      res.results.forEach((data: any) => {
        this.promotionService.getData().subscribe((res: any[]) => {
          res.forEach((item) => {
            if (item.category_type == "order_type") {
              if (item._id == data.orderTypeCategoryCode) {
                this.viewPromotionData.orderTypeCategoryCode = item.category_name;
              }
            }
            if (item.category_type == "order_for") {
              if (item._id == data.orderForCategoryCode) {
                this.viewPromotionData.orderForCategoryCode = item.category_name;
              }
            }
            if (item.category_type == "promotion_grade") {
              data.transferOrPostingEmployeesList.forEach((elementAt: any) => {
                if (item._id == elementAt.promotedGrade) {
                  this.viewPromotionData.promotedGrade = item.category_name;
                }
                if (item._id == elementAt.promotionGrade) {
                  this.viewPromotionData.promotionGrade = item.category_name;
                }
                this.viewPromotionData.phone = elementAt.empProfileId.mobileNo1;
              })

            }

          });
        });
        data.transferOrPostingEmployeesList.find((ele: any) => {
          this.viewPromotionData.name = ele.fullName;
          this.viewPromotionData.employeeId = ele.employeeId;
        });
        this.viewPromotionData.id = data._id;
        this.viewPromotionData.approvalStatus = data.approvalStatus;
        this.viewPromotionData.orderTypeCategoryCode = data.orderTypeCategoryCode;
        this.viewPromotionData.orderNumber = data.orderNumber;
        this.viewPromotionData.orderForCategoryCode = data.orderForCategoryCode;
        this.viewPromotionData.dateOfOrder = data.dateOfOrder;
        this.viewPromotionData.orderFile = data.orderFile;
        this.viewPromotionData.remarks = data.remarks.trim();
      })
    })
  }

  promotionApprove(data: any) {
    console.log(data)
    const confirmation = confirm("Are You sure want to approve this record?");
    if (confirmation) {
      const filePath = data.orderFile;
      const fileName = filePath.split('\\').pop();

      const approve = {
        approvedBy: localStorage.getItem('loginId'),
        id: data.id,
        phone: "+91" + data.phone,
        module: "Promotion",
        dateOfOrder: data.dateOfOrder.split('T')[0],
        fileName: fileName
      }
      this.promotionService.updatePromotionApprovalStatus(approve).subscribe((res: any) => {
        alert(res.message);
        window.location.reload();
        this.showPopup = false;
      })
    }
  }
  isDropdownOpen = false;
  fromdate: any;
  todate: any;
  promotionType:any;

  // Toggle the dropdown open/close state
  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation(); // Prevent event from bubbling and closing the dropdown
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Optional: Handle closing dropdown when clicking outside of it (if needed)
  closeDropdown(): void {
    this.isDropdownOpen = false;
    this.fromdate = undefined;
    this.todate = undefined;
    this.promotionType = undefined;
  }
  filter() {
    // updateType
    this.tableData = [];
    const loginId = localStorage.getItem('loginId');
    const loginAs = localStorage.getItem('loginAs');
    if(this.fromdate && this.todate && this.promotionType){
      this.promotionService.uploadGet(`getEmployeeUpdate?fromdate=${this.fromdate}&todate=${this.todate}&updateType=${this.promotionType}`).subscribe((res: any) => {
        this.createTable(res);
      })
    }
    else if (this.fromdate && this.todate) {
      this.promotionService.uploadGet(`getEmployeeUpdate?fromdate=${this.fromdate}&todate=${this.todate}`).subscribe((res: any) => {
        this.createTable(res);
      })
    }
    else if(this.promotionType){
      this.promotionService.uploadGet(`getEmployeeUpdate?updateType=${this.promotionType}`).subscribe((res: any) => {
        this.createTable(res);
      })
    }
  }
  createTable(res:any){
    res.results.filter((item: any) => {
      if (item.updateType == "Promotion") {
        const id = item._id;
        this.promotionService.getData().subscribe((element: any[]) => {
          const promotionGrade = new Map(element.filter(data => data.category_type == 'promotion_grade').map(item => [item._id, item.category_name]));
          item.transferOrPostingEmployeesList.forEach((data: any) => {
            const newData = { ...data, id: id };
            newData.promotionGrade = promotionGrade.get(newData.promotionGrade) || newData.promotionGrade;
            newData.promotedGrade = promotionGrade.get(newData.promotedGrade) || newData.promotedGrade;
            newData.submittedBy = item.submittedBy;
            newData.approvedBy = item.approvedBy;
            newData.approvalStatus = item.approvalStatus;
            this.tableData.push(newData);
          });
        });
      }
    })
  }
  clear() {
    this.fromdate = undefined;
    this.todate = undefined;
    this.promotionType = undefined;
  }
  clearFilter() {
    this.tableData = this.tableDataConst;
  }
}


export class viewPromotionData {
  id: string = '';
  name: string = '';
  employeeId: string = '';
  promotionGrade: string = '';
  promotedGrade: string = '';
  orderTypeCategoryCode: string = '';
  orderNumber: string = '';
  orderForCategoryCode: string = '';
  dateOfOrder: string = '';
  orderFile: string = '';
  remarks: string = '';
  approvalStatus = false;
  phone: string = '';
}

