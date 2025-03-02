import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeaveTransferService } from '../../forms.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-other-go',
  templateUrl: './other-go.component.html',
  styleUrl: './other-go.component.css'
})
export class OtherGoComponent {
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
      GoNumber: ['', Validators.required],
      GoDate: ['', Validators.required],
      GoDescription: ['', Validators.required],
      GoFile: [null, Validators.required]
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
  download(data: any) {
    const pdfUrl = `${this.url}${data}`;
    fetch(pdfUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();  // Convert to Blob
      })
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
  
        // Create an anchor element
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'file.pdf';  // You can customize the filename here
        
        // Append to the DOM and trigger click
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);  // Free up memory
      })
      .catch(error => {
        console.error('Error downloading the PDF:', error);
      });
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

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.actrulesForm.patchValue({ GoFile: this.selectedFile });
    }
    this.selectedFile = event.target.files[0];
    this.actrulesForm.get('GoFile')?.setValue(this.selectedFile);
    if (this.selectedFile) {
      if (this.selectedFile.type !== 'application/pdf') {
        this.actrulesForm.get('GoFile')?.setErrors({ 'incorrectFileType': true });
        return;
      }

      if (this.selectedFile.size > 5 * 1024 * 1024) { // 5MB in bytes
        this.actrulesForm.get('GoFile')?.setErrors({ 'maxSize': true });
        return;
      }

      this.actrulesForm.get('GoFile')?.setErrors(null);
    }
  }
  getlist() {
    this.foreignVisitService.uploadGet('getgo').subscribe((res: any) => {
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
    const fileControl = this.actrulesForm.get('GoFile');
    fileControl?.setValidators(Validators.required); // Add the required validator
    fileControl?.updateValueAndValidity(); // Revalidate the field
    this.showModal();
  }
  
  onKeyDown(event: KeyboardEvent) {
    const key = event.key;
    if (!((key >= '0' && key <= '9') ||
      ['Backspace', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight'].includes(key))) {
      event.preventDefault();
    }
  }
  view(data:any){
    const pdfUrl = `${this.url}${data}`;
    window.open(pdfUrl, '_blank');
  }
  setEditMode(isEdit: boolean) {
    this.actrulesForm.reset();
    this.showModal();
    this.isEdit = isEdit; // Update the mode
    const fileControl = this.actrulesForm.get('GoFile');
    if (isEdit) {
      fileControl?.clearValidators(); // Remove validators in edit mode
    } else {
      fileControl?.setValidators(Validators.required); // Add validators in create mode
    }
    fileControl?.updateValueAndValidity(); // Revalidate the field
  }
  edit(data: any) {
    this.setEditMode(true)
    this.editId = data._id;
    this.actrulesForm.get('GoNumber')?.setValue(data.GoNumber);
    this.actrulesForm.get('GoDate')?.setValue(data.GoDate);
    this.actrulesForm.get('GoDescription')?.setValue(data.GoDescription);
    this.actrulesForm.get('GoFile')?.setValue(data.GoFile);
  }
  delete(id: any) {
    this.foreignVisitService.uploadDelete('deletego', id).subscribe((res: any) => {
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
      const formData = new FormData();
      const formValues = this.actrulesForm.value;
      for (const key in formValues) {
        if (formValues.hasOwnProperty(key) && key !== 'GoFile') {
          formData.append(key, formValues[key]);
        }
      }
      if (this.selectedFile) {
        formData.append('GoFile', this.selectedFile);
      }
      if (this.isEdit && this.editId) {
        formData.append('id', this.editId.toString());
        this.foreignVisitService.uploadEdit(formData, 'updateGo').subscribe((res: any) => {
          if (res.status === 200) {
            alert("Updated Succesfully");
            this.resetForm();
          }
        })
      }
      else {
        this.foreignVisitService.uploadAdd(formData, 'addgo').subscribe((res: any) => {
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
