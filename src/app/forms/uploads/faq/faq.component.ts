import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeaveTransferService } from '../../forms.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {
  actrulesForm!: FormGroup;
  submitted = false;
  isEdit: boolean = false; // Flag to distinguish between create and edit
  editId: number | null = null; // Store the ID for editing
  selectedFile: File | null = null;
  filterText: any;
  tableData: any[] = [];
  pageSize: number = 10; // Number of items per page
  pageSizeOptions: number[] = [1, 5, 10, 15, 20];
  currentPage: number = 1; // Current page
  visiblePages: number[] = [];
  maxVisiblePages = 10;
  url: string = '';
  showAdd: boolean = false;
  showView: boolean = false;
  showEdit: boolean = false;
  showApprove: boolean = false;
  showPopup = true;
  showRejection = false;

  constructor(private router: Router, private foreignVisitService: LeaveTransferService, private datepipe: DatePipe, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.url = this.foreignVisitService.fileUrl;
    this.getlist();
    this.checkAccess();
    this.actrulesForm = this.fb.group({
      Question: ['', Validators.required],
      Answer: ['', Validators.required],
    });
  }

  checkAccess(): void {
    this.foreignVisitService.currentRoleData.subscribe((response: any[]) => {
      const foreignVisitMenu = response.find(item => item.menu === 'Foreign Visit');
      this.showAdd = foreignVisitMenu?.entryAccess ?? false;
      this.showEdit = foreignVisitMenu?.editAccess ?? false;
      this.showView = foreignVisitMenu?.viewAccess ?? false;
      this.showApprove = foreignVisitMenu?.approvalAccess ?? false;
      console.log(this.showApprove);
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
  getlist() {
    this.foreignVisitService.uploadGet('getfaq').subscribe((res: any) => {
      console.log("resact get", res);
      if (res.status === 200) {
        this.tableData = res.results;
      }
    })
  }
  create() {
    this.actrulesForm.reset();
    this.editId = null;
    this.isEdit = false; // Switch back to create mode
    this.showModal();
  }
  setEditMode(isEdit: boolean) {
    this.actrulesForm.reset();
    this.showModal();
    this.isEdit = isEdit; // Update the mode
  }
  edit(data: any) {
    this.setEditMode(true)
    this.editId = data._id;
    this.actrulesForm.get('Question')?.setValue(data.Question);
    this.actrulesForm.get('Answer')?.setValue(data.Answer);
  }
  delete(id: any) {
    this.foreignVisitService.uploadDelete('deletefaq', id).subscribe((res: any) => {
      console.log("res delete", res);
      if (res.status === 200) {
        alert("Deleted Succesfully");
        this.getlist()
      }
    })
  }
  onSubmit() {
    this.submitted = true;
    if (this.actrulesForm.valid) {
      var formValues = this.actrulesForm.value;
      if (this.isEdit && this.editId) {
        formValues['id'] = this.editId.toString()
        this.foreignVisitService.uploadEdit(formValues, 'updatefaq').subscribe((res: any) => {
          if (res.status === 200) {
            alert("Updated Succesfully");
            this.resetForm();
          }
        })
      }
      else {
        this.foreignVisitService.uploadAdd(formValues, 'addfaq').subscribe((res: any) => {
          console.log("res", res);
          if (res.status === 200) {
            alert("Created Succesfully");
            this.resetForm();
          }
        })
      }
    }
  }
  resetForm() {
    this.actrulesForm.reset();
    this.hideModal()
    this.isEdit = false;
    this.editId = null;
    this.submitted = false;
    this.selectedFile = null;
    this.getlist()
  }
  hideModal() {
    const modalElement = document.getElementById('viewForeignVisit');
    if (modalElement) {
      // Remove modal backdrop manually
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove(); // Remove the backdrop manually
      }

      // Hide the modal by removing the 'show' class and setting display to 'none'
      modalElement.classList.remove('show'); // Remove 'show' class
      modalElement.setAttribute('aria-hidden', 'true'); // Hide modal from screen readers
      modalElement.style.display = 'none'; // Manually hide modal
    }
  }
  showModal() {
    const modalElement = document.getElementById('viewForeignVisit');
    if (modalElement) {
      // Ensure backdrop is added if not already present
      if (!document.querySelector('.modal-backdrop')) {
        const backdrop = document.createElement('div');
        backdrop.classList.add('modal-backdrop', 'fade', 'show');
        document.body.appendChild(backdrop);
      }

      // Show the modal by adding the 'show' class and setting display
      modalElement.classList.add('show');
      modalElement.setAttribute('aria-hidden', 'false'); // Make modal visible for screen readers
      modalElement.style.display = 'block'; // Make modal visible
    }
  }
}
