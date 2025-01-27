import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveTransferService } from '../forms.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-officer-tour',
  templateUrl: './officer-tour.component.html',
  styleUrl: './officer-tour.component.css'
})
export class OfficerTourComponent implements OnInit {
  filterText: any;
  tableData: any[] = [];
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 15, 20];
  currentPage: number = 1; // Current page
  visiblePages: number[] = [];
  maxVisiblePages = 10;
  viewLtcData = new viewLtcData();
  url = '';
  showAdd: boolean = false;
  showView: boolean = false;
  showEdit: boolean = false;
  showApprove: boolean = false;
  showPopup = true;
  orderType: any[] = [];
  orderFor: any[] = [];

  constructor(private router: Router, private ltcService: LeaveTransferService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.url = this.ltcService.fileUrl;
    const loginId = localStorage.getItem('loginId');
    const loginAs = localStorage.getItem('loginAs');
    // this.ltcService.getLtc(loginId,loginAs).subscribe((res:any)=>{
    //   this.tableData = res.results;
    // });
    this.ltcService.uploadGet('getOfficersTour').subscribe((res: any) => {
      this.tableData = res.results;
    });
    this.checkAccess();
    this.get_department();
    this.get_designation();
  }
  checkAccess(): void {
    this.ltcService.currentRoleData.subscribe((response: any[]) => {
      const ltcMenu = response.find(item => item.menu === 'Leave Travel Concession');
      this.showAdd = ltcMenu?.entryAccess ?? false;
      this.showEdit = ltcMenu?.editAccess ?? false;
      this.showView = ltcMenu?.viewAccess ?? false;
      this.showApprove = ltcMenu?.approvalAccess ?? false;
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
  changeValue(data: any) {
    if (data.target.value == "Print") {
      const printableElement = document.querySelector('.printable-content');
      if (printableElement) {
        window.print();
      } else {
        console.error('Printable element not found');
      }
    }
  }

  addNew() {
    this.router.navigate(['create-officers-tour']);
  }

  editLtc(data: any) {
    const encodedData = btoa(JSON.stringify(data._id));
    this.router.navigate(['edit-officers-tour'], { queryParams: { id: encodedData } });
  }
  viewLtc(data: any) {
    this.ltcService.getData().subscribe((res: any[]) => {
      res.forEach((item) => {
        if (item.category_type == "order_type") {
          if (item._id == data.orderType) {
            this.viewLtcData.orderType = item.category_name;
          }
        }
        if (item.category_type == "order_for") {
          if (item._id == data.orderFor) {
            this.viewLtcData.orderFor = item.category_name;
          }
        }
      });
    });
    this.ltcService.uploadGet(`getOfficersTourById/${data._id}`).subscribe((res: any) => {
      this.viewLtcData.state = res.results.stateId.stateName;
      this.viewLtcData.discrict = res.results.districtId.districtName;
      this.viewLtcData.fromDate = res.results.fromDate;
      this.viewLtcData.toDate = res.results.toDate;
      this.viewLtcData.OtherOfficers = res.results.OtherOfficers;
      this.viewLtcData.purpose = res.results.purpose;
      this.viewLtcData.organization = res.results.organisationHostName;
      this.viewLtcData.status = res.results.presentStatus;
      this.viewLtcData.reject = res.results.rejectReasons;
      this.viewLtcData.orderNo = res.results.orderNo
      this.viewLtcData.dateOfOrder = res.results.dateOfOrder;
      this.viewLtcData.orderFile = res.results.orderFile;
      this.viewLtcData.remarks = res.results.remarks;
    })
  }

  approveLtc(data: any) {
    const confirmation = confirm("Are you sure want to approve this record?");
    if (confirmation) {
      const filePath = data.orderFile;
      const fileName = filePath.split('\\').pop();

      const approve = {
        approvedBy: localStorage.getItem('loginId'),
        id: data.id,
        phone: data.phone,
        module: "Leave Travel Concession",
        dateOfOrder: data.dateOfOrder.split('T')[0],
        fileName: fileName
      }
      this.ltcService.approveLtc(approve).subscribe((res: any) => {
        alert(res.message);
        window.location.reload();
        this.showPopup = false;
      })
    }
  }
  department: any[] = []
  designation: any[] = []
  get_department() {
    this.ltcService.getDepartmentData().subscribe((departmentRes: any) => {
      departmentRes.forEach((data: any) => {
        this.department.push({ label: data.department_name, value: data._id });
      });
    });
  }
  get_designation() {
    this.ltcService.getDesignations().subscribe((designationRes: any) => {
      designationRes.results.forEach((data: any) => {
        this.designation.push({ label: data.designation_name, value: data._id });
      });
    });
  }
  get_designation_alone(id: any) {
    for (let i = 0; i < this.department.length; i++) {
      if (this.department[i].value === id) {
        return this.department[i].label;
      }
    }
  }
  get_department_alone(id: any) {
    for (let i = 0; i < this.designation.length; i++) {
      if (this.designation[i].value === id) {
        return this.designation[i].label;
      }
    }
  }
  deleteLtc(id: any) {
    this.ltcService.uploadDelete('deleteOfficersTour', id).subscribe((res: any) => {
      if (res.status === 200) {
        alert("Deleted Successfully");
        this.ngOnInit();
      }
    })
  }
}
export class viewLtcData {
  id: string = '';
  state: string = '';
  discrict: string = '';
  fromDate: string = '';
  toDate: string = '';
  purpose: string = '';
  organization: string = '';
  OtherOfficers: any[] = [];
  status: string = '';
  reject: string = '';
  orderType: string = '';
  orderNo: string = '';
  orderFor: string = '';
  dateOfOrder: string = '';
  orderFile: string = '';
  remarks: string = '';
}
