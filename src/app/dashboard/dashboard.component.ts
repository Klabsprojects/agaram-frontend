import { ChangeDetectorRef, Component, ElementRef, OnInit, TRANSLATIONS } from '@angular/core';
// import Chart from 'chart.js/auto';
import { employeeFilterList } from '../officer-profile/officer.model';
import { Router } from '@angular/router';
import { employeeHistory } from './dashboard.model';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { LeaveTransferService } from '../forms/forms.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public chart: any;
  department: any[] = [];
  designation: any[] = [];
  postingIn: any[] = [];
  public employeeFilterDataMl = new employeeFilterList();
  public employeeFilterData: any[] = [];
  public gender: any[] = [];
  public genderValue: any;
  filteredOptions: any[] = [];
  showDropdown = false;
  selectedOption: any;
  selectedEmpOption: string = '';
  selectedFilter: string = '';
  showName = true;
  showGender = true;
  showPosting = true;
  showBatch = true;
  showDepartment = true;
  showDesignation = true;
  showFrom = false;
  showTo = false;
  showTable = true;
  nameReadonly: boolean = false;
  postingInReadonly: boolean = false;
  departmentReadonly: boolean = false;
  designationReadonly: boolean = false;
  showLocation = true;
  fromDate: string = '';
  toDate: string = '';
  name: string = '';
  postingin: string = '';
  departmentValue: string = '';
  tableData: any[] = [];
  showMainTitle = true;

  //Dashboard icon
  showActive = false;
  showretiredOfficer = false;
  showMale = false;
  showFemale = false;
  showSec = false;
  showOutsideChennai = false;
  showOutsideSec = false;
  showChennai = false;
  showCollector = false;
  showSub = false;
  showAsst = false;
  showAdditional = false;
  showComm = false;
  showFilter = true;
  showCard = true;
  showtable = false;
  showIcon = false;

  ActiveEmployeeCount = '';
  RetiredEmployeeCount = '';
  TotalOfficerCount = '';
  TotalGender = '';
  maleEmployeeCount = '';
  femaleEmployeeCount = '';
  totalCountLocation = '';
  chennaiOfficerCount = '';
  outsideChennaiOfficerCount = '';
  secretariatCount = '';
  outsideSecretariatCount = '';
  totalSecretariatCount = '';
  totalCollectors = '';
  collectorCount = '';
  subCollectorCount = '';
  asstCollectorsCount = '';
  additionalCollectorCount = '';
  commissionerCount = '';
  droCount = '';
  filterText: any;
  state: any[] = [];

  pageSize: number = 100;
  pageSizeOptions: number[] = [5, 10, 15, 20];
  currentPage: number = 1;
  // filteredEmployeeLists: any[] = []; // Your filtered list
  popupVisible: boolean = false;
  base64ImageData: string = '';
  employeeHistory = new employeeHistory();
  filterForm!: FormGroup;
  selectedBatchOption: string = '';
  showBatchDropdown = false;
  filteredBatchOptions: any;
  firstIndex: any = '';
  remainingIndices: any[] = [];
  showAdvanceSearch = true;
  showPeriod = true;
  showDesignationDropdown = false;
  hideHistory = true;
  role: any;
  constructor(private fb: FormBuilder, private datePipe: DatePipe, private router: Router, private dashboardService: LeaveTransferService, private el: ElementRef, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.role = localStorage.getItem('loginAs');
    console.log(this.role);
    if (this.role != "Officer") {
      this.showCard = true;
      this.showAdvanceSearch = true;
      this.showPeriod = true;
      this.showDesignationDropdown = false;
      this.hideHistory = true;
      this.getDashboard();
    }
    else {
      // this.showCard  = false;
      // this.showAdvanceSearch = false;
      this.showPeriod = false;
      this.showDesignationDropdown = true;
      this.hideHistory = false;
      this.getDashboard();
    }
    // this.createBarChart();
    // this.createLineChart();

    this.filterForm = this.fb.group({
      name: [''],
      postingIn: [''],
      department: [''],
      designation: [''],
      batch: [''],
      period: this.fb.group({
        fromDate: [''],
        toDate: ['']
      })
    });

    this.dashboardService.getData().subscribe((res: any[]) => {
      res.forEach((item) => {
        if (item.category_type == "posting_in") {
          this.postingIn.push({ label: item.category_name, value: item._id });
        }
        if (item.category_type == "gender") {
          this.gender.push(item);
        }
      });
    });

    this.dashboardService.getDepartmentData().subscribe((res: any[]) => {
      res.filter((data: any) => {
        this.department.push({ label: data.department_name, value: data._id });
      });
    });

    this.dashboardService.getDesignations().subscribe((res: any) => {
      res.results.filter((data: any) => {
        this.designation.push({ label: data.designation_name, value: data._id });
      })
    })
  }

  advanceSearch() {
    this.router.navigate(['advance-search']);
  }

  viewInfo(data: any) {
    this.popupVisible = true;
    this.remainingIndices = [];
    this.firstIndex = '';
    this.dashboardService.getEmployeeHistory(data).subscribe((res: any) => {
      res.results.forEach((item: any) => {
        console.log("item", item);
        if (item._id == data) {
          this.dashboardService.getData().subscribe((response: any) => {
            response.forEach((ele: any) => {
              if (ele.category_type == "state") {
                if (ele._id == item.state) {
                  this.employeeHistory.state = ele.category_name;
                }
              }
            });
            item.employeeHistory.forEach((element: any, index: number) => {
              if (index === 0) {
                this.firstIndex = element.transferOrPostingEmployeesList;
                if (element.category_type == "posting_in") {
                  if (element._id == element.transferOrPostingEmployeesList.toPostingInCategoryCode) {
                    this.firstIndex.posting = element.category_name;
                  }
                }
                this.department.forEach((elem: any) => {
                  if (elem.value == element.transferOrPostingEmployeesList.toDepartmentId) {
                    this.firstIndex.toDepartmentId = elem.label;
                  }
                });

                this.designation.forEach((elem: any) => {
                  if (elem.value == element.transferOrPostingEmployeesList.toDesignationId) {
                    this.firstIndex.toDesignationId = elem.label;
                  }
                });
              }


              if (index != 0) {
                const postingIn = this.postingIn.find((data: any) => data.value === element.transferOrPostingEmployeesList.toPostingInCategoryCode);
                const department = this.department.find((data: any) => data.value === element.transferOrPostingEmployeesList.toDepartmentId);
                const designation = this.designation.find((data: any) => data.value === element.transferOrPostingEmployeesList.toDesignationId);
                this.remainingIndices.push({
                  postingIn: postingIn ? postingIn.label : '',
                  department: department ? department.label : '',
                  designation: designation ? designation.label : ''
                });
                console.log(this.remainingIndices);
              }
            });

            this.employeeHistory.fullName = item.fullName;
            this.employeeHistory.mobileNo1 = item.mobileNo1;
            this.employeeHistory.mobileNo2 = item.mobileNo2;
            this.employeeHistory.mobileNo3 = item.mobileNo3;
            this.employeeHistory.personalEmail = item.personalEmail;
            this.employeeHistory.batch = item.batch;
            this.employeeHistory.addressLine = item.addressLine;
            this.employeeHistory.city = item.city;
            this.employeeHistory.pincode = item.pincode;
            this.employeeHistory.employeeId = item.employeeId;
            this.employeeHistory.payscale = item.payscale;
            this.employeeHistory.officeEmail = item.officeEmail;
            this.employeeHistory.caste = item.caste;
            const originalDate = item.dateOfBirth;
            this.employeeHistory.dateOfBirth = this.datePipe.transform(originalDate, 'dd/MM/yyyy');
            const dateOfJoining = item.dateOfJoining;
            this.employeeHistory.dateOfJoining = this.datePipe.transform(dateOfJoining, 'dd/MM/yyyy');
            const dateOfRetirement = item.dateOfRetirement;
            this.employeeHistory.dateOfRetirement = this.datePipe.transform(dateOfRetirement, 'dd/MM/yyyy');
            this.employeeHistory.imagePath = `${this.dashboardService.fileUrl}profileImages/${item.imagePath?.replace('\\', '/')}`;
            // const binaryData = new Uint8Array(item.photo.data);
            // if (item.photo && item.photo.data) {
            console.log(item.photo);
            const binaryData = new Uint8Array(item.photo.data);
            this.base64ImageData = this.arrayBufferToBase64(binaryData);
            // }

          });
        }
      });
    });
  }

  arrayBufferToBase64(buffer: Uint8Array): string {
    let binary = '';
    const len = buffer.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(buffer[i]);
    }
    return btoa(binary);
  }
  getImageSource(base64ImageData: string): string {
    const imageType = base64ImageData.startsWith('data:image/png') ? 'png' :
      base64ImageData.startsWith('data:image/jpeg') ? 'jpeg' :
        base64ImageData.startsWith('data:image/jpg') ? 'jpg' : '';
    return `data:image/${imageType};base64,${base64ImageData}`;
  }

  closePopup() {
    this.popupVisible = false;
  }

  onInput(event: any, field: string) {
    const inputValue = event.target.value.trim();
    if (!inputValue) {
      this.getDashboard()
    }
    if (!inputValue) {
      this.showDropdown = false;
      return;
    }
    this.dashboardService.getEmployeeList().subscribe((res: any) => {
      if (res && res.results) {
        const mergedOptions: { name: string, id: string }[] = res.results.map((item: any) => ({
          name: item.fullName,
          id: item.employeeId
        }));
        this.filteredOptions = mergedOptions.filter(option => option.name.toLowerCase().includes(inputValue.toLowerCase()));
        this.showDropdown = this.filteredOptions.length > 0;
      } else {
        console.error('Invalid API response:', res);
      }
    }, error => {
      console.error('API request failed:', error);
    });
  }


  onBatchInput(event: any, field: string) {
    const inputValue = event.target.value.trim();
    if (!inputValue) {
      this.showBatchDropdown = false;
      return;
    }



    this.dashboardService.getEmployeeList().subscribe((res: any) => {
      if (res && res.results) {
        const groupedOptions: { [key: string]: any[] } = {};
        res.results.forEach((item: any) => {
          const batchValue = item.batch;
          if (!groupedOptions[batchValue]) {
            groupedOptions[batchValue] = [];
          }
          groupedOptions[batchValue].push({ batch: batchValue });
        });

        // Transforming groupedOptions into array
        this.filteredBatchOptions = Object.keys(groupedOptions).map(key => ({
          batch: key,
          items: groupedOptions[key]
        }));

        this.showBatchDropdown = this.filteredBatchOptions.length > 0;
      } else {
        console.error('Invalid API response:', res);
      }
    }, error => {
      console.error('API request failed:', error);
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

  changeValue(data: any) {
    if (data.target.value == "Print") {
      const printableElement = document.querySelector('.printable-content');
      console.log(printableElement);
      if (printableElement) {
        window.print();
      } else {
        console.error('Printable element not found');
      }
    }
  }

  public startIndex:any;
  pagedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.startIndex  = startIndex;
    const endIndex = startIndex + this.pageSize;
    return this.filteredEmployeeList.slice(startIndex, endIndex);
  }
  tabledatareturn() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.startIndex  = startIndex;
    const endIndex = startIndex + this.pageSize;
    return this.tableData.slice(startIndex, endIndex);
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

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  changePageSize(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
  }

  goToPage(page: number) {
    this.currentPage = page;
  }



  handleFilterChange() {
    this.cdr.detectChanges();
  }


  onDateChange(data: any) {
    console.log(this.fromDate, this.toDate);
    if (this.fromDate && this.toDate) {
      this.postingInReadonly = true;
      // this.departmentReadonly = true;
      this.designationReadonly = true;
      this.showName = !this.showTable;
      this.showGender = false;
      this.showPosting = this.showTable;
      this.showBatch = this.showTable;
      this.showDepartment = this.showTable;
      this.showDesignation = this.showTable;
      this.showFrom = this.showTable;
      this.showTo = this.showTable;
      this.showDropdown = false;
      this.dashboardService.employeeFilter(data).subscribe((res: any) => {
        this.employeeFilterData = res.results;
      }, (error) => {
        console.error('Error fetching employees:', error);
      });
    }
  }





  getDashboard() {
    this.dashboardService.getActiveOfficers().subscribe((res: any) => {
      this.ActiveEmployeeCount = res.results.empCount;
      const activeList: any[] = res.results.empList;
      this.dashboardService.getRetiresOfficers().subscribe((res: any) => {
        this.RetiredEmployeeCount = res.results.empCount;
        const retiredList: any[] = res.results.empList;
        this.tableData = activeList.concat(retiredList);
        this.TotalOfficerCount = this.ActiveEmployeeCount + this.RetiredEmployeeCount;
      });
    });

    this.dashboardService.getMaleEmployees().subscribe((res: any) => {
      this.maleEmployeeCount = res.results.empCount;

      this.dashboardService.getFemaleEmployees().subscribe((res: any) => {
        this.femaleEmployeeCount = res.results.empCount;
        this.TotalGender = this.maleEmployeeCount + this.femaleEmployeeCount;
      });
    });

    this.dashboardService.getByLocation('yes').subscribe((res: any) => {
      this.chennaiOfficerCount = res.results.empCount;

      this.dashboardService.getByLocation('no').subscribe((res: any) => {
        this.outsideChennaiOfficerCount = res.results.empCount;
        this.totalCountLocation = this.chennaiOfficerCount + this.outsideChennaiOfficerCount;
      });
    });

    this.dashboardService.getSecretariat('yes').subscribe((res: any) => {
      this.secretariatCount = res.results.empCount;

      this.dashboardService.getSecretariat('no').subscribe((res: any) => {
        this.outsideSecretariatCount = res.results.empCount;
        this.totalSecretariatCount = this.secretariatCount + this.outsideSecretariatCount;
      });
    });

    this.dashboardService.getByDesignation('Collector').subscribe((res: any) => {
      this.collectorCount = res.results.empCount;
      this.dashboardService.getByDesignation('Sub Collector').subscribe((res: any) => {
        this.subCollectorCount = res.results.empCount;
        this.dashboardService.getByDesignation('Assistant Collector').subscribe((res: any) => {
          this.asstCollectorsCount = res.results.empCount;
          this.dashboardService.getByDesignation('Additional Collector').subscribe((res: any) => {
            this.additionalCollectorCount = res.results.empCount;
            this.totalCollectors = this.collectorCount + this.subCollectorCount + this.asstCollectorsCount + this.additionalCollectorCount;
          });
          this.dashboardService.getByDesignation('Commissioner').subscribe((res: any) => {
            this.commissionerCount = res.results.empCount;
          });
          this.dashboardService.uploadGet('getDrosCountByDate').subscribe((res:any)=>{
            this.droCount = res.results[0].count;
          })
        });
      });
    });

  }


  activeOfficers(data: any) {
    this.dashboardService.getActiveOfficers().subscribe((res: any) => {
      res.results.empList.forEach((empItem: any) => {
        this.postingIn.forEach((postingInItem: any) => {
          if (empItem.toPostingInCategoryCode === postingInItem.value) {
            empItem.postingIn = postingInItem.label;
          }
        });

        this.department.forEach((departmentItem: any) => {
          if (empItem.toDepartmentId === departmentItem.value) {
            empItem.department = departmentItem.label;
          }
        });

        this.designation.forEach((designationItem: any) => {
          if (empItem.toDesignationId === designationItem.value) {
            empItem.designation = designationItem.label;
          }
        });
      });
      this.tableData = res.results.empList;

    });
    this.drocurrent = false;
    this.showMainTitle = false;
    this.showCard = false;
    this.showtable = true;
    this.showFilter = false;
    this.showActive = true;
    this.showIcon = true;
    this.showGender = true;
    this.showPosting = true;
    this.showDesignation = true;
  }

  retiredOfficer() {
    this.dashboardService.getRetiresOfficers().subscribe((res: any) => {
      res.results.empList.forEach((empItem: any) => {
        this.postingIn.forEach((postingInItem: any) => {
          if (empItem.toPostingInCategoryCode === postingInItem.value) {
            empItem.postingIn = postingInItem.label;
          }
        });

        this.department.forEach((departmentItem: any) => {
          if (empItem.toDepartmentId === departmentItem.value) {
            empItem.department = departmentItem.label;
          }
        });

        this.designation.forEach((designationItem: any) => {
          if (empItem.toDesignationId === designationItem.value) {
            empItem.designation = designationItem.label;
          }
        });
      });
      this.tableData = res.results.empList;
    });
    this.drocurrent = false;
    this.showMainTitle = false;
    this.showCard = false;
    this.showFilter = false;
    this.showtable = true;
    this.showretiredOfficer = true;
    this.showIcon = true;
    this.showGender = true;
    this.showPosting = true;
    this.showDesignation = true;
  }

  maleOfficer() {
    this.dashboardService.getMaleEmployees().subscribe((res: any) => {
      res.results.empList.forEach((empItem: any) => {
        this.postingIn.forEach((postingInItem: any) => {
          if (empItem.toPostingInCategoryCode === postingInItem.value) {
            empItem.postingIn = postingInItem.label;
          }
        });

        this.department.forEach((departmentItem: any) => {
          if (empItem.toDepartmentId === departmentItem.value) {
            empItem.department = departmentItem.label;
          }
        });

        this.designation.forEach((designationItem: any) => {
          if (empItem.toDesignationId === designationItem.value) {
            empItem.designation = designationItem.label;
          }
        });
      });
      this.tableData = res.results.empList;
    });
    this.drocurrent = false;
    this.showMainTitle = false;
    this.showCard = false;
    this.showFilter = false;
    this.showtable = true;
    this.showMale = true;
    this.showIcon = true;
    this.showGender = false;
    this.showPosting = true;
    this.showDesignation = true;
  }

  femaleOfficer() {
    this.dashboardService.getFemaleEmployees().subscribe((res: any) => {
      res.results.empList.forEach((empItem: any) => {
        this.postingIn.forEach((postingInItem: any) => {
          if (empItem.toPostingInCategoryCode === postingInItem.value) {
            empItem.postingIn = postingInItem.label;
          }
        });

        this.department.forEach((departmentItem: any) => {
          if (empItem.toDepartmentId === departmentItem.value) {
            empItem.department = departmentItem.label;
          }
        });

        this.designation.forEach((designationItem: any) => {
          if (empItem.toDesignationId === designationItem.value) {
            empItem.designation = designationItem.label;
          }
        });
      });
      this.tableData = res.results.empList;
    });
    this.drocurrent = false;
    this.showMainTitle = false;
    this.showCard = false;
    this.showFilter = false;
    this.showtable = true;
    this.showFemale = true;
    this.showIcon = true;
    this.showGender = false;
    this.showPosting = true;
    this.showDesignation = true;
  }

  secretariat(data: any) {
    this.dashboardService.getSecretariat(data).subscribe((res) => {
      res.results.empList.forEach((empItem: any) => {
        this.department.forEach((departmentItem: any) => {
          if (empItem.toDepartmentId === departmentItem.value) {
            empItem.department = departmentItem.label;
          }
        });

        this.designation.forEach((designationItem: any) => {
          if (empItem.toDesignationId === designationItem.value) {
            empItem.designation = designationItem.label;
          }
        });
      });
      this.tableData = res.results.empList;
    });
    this.drocurrent = false;
    this.showMainTitle = false;
    this.showCard = false;
    this.showtable = true;
    this.showFilter = false;
    this.showSec = true;
    this.showIcon = true;
    this.showPosting = false;
    this.showDesignation = true;
  }

  outsideSectrtariat(data: any) {
    this.dashboardService.getSecretariat(data).subscribe((res) => {
      res.results.empList.forEach((empItem: any) => {
        this.department.forEach((departmentItem: any) => {
          if (empItem.toDepartmentId === departmentItem.value) {
            empItem.department = departmentItem.label;
          }
        });

        this.designation.forEach((designationItem: any) => {
          if (empItem.toDesignationId === designationItem.value) {
            empItem.designation = designationItem.label;
          }
        });
      });
      this.tableData = res.results.empList;
    });
    this.drocurrent = false;
    this.showMainTitle = false;
    this.showCard = false;
    this.showtable = true;
    this.showFilter = false;
    this.showOutsideSec = true;
    this.showIcon = true;
    this.showPosting = false;
    this.showDesignation = true;
  }

  chennaiOfficer(data: any) {
    this.dashboardService.getByLocation(data).subscribe((res) => {
      res.results.empList.forEach((empItem: any) => {
        this.postingIn.forEach((postingInItem: any) => {
          if (empItem.toPostingInCategoryCode === postingInItem.value) {
            empItem.postingIn = postingInItem.label;
          }
        });

        this.department.forEach((departmentItem: any) => {
          if (empItem.toDepartmentId === departmentItem.value) {
            empItem.department = departmentItem.label;
          }
        });

        this.designation.forEach((designationItem: any) => {
          if (empItem.toDesignationId === designationItem.value) {
            empItem.designation = designationItem.label;
          }
        });
      });
      this.tableData = res.results.empList;
    });
    this.drocurrent = false;
    this.showMainTitle = false;
    this.showCard = false;
    this.showtable = true;
    this.showFilter = false;
    this.showChennai = true;
    this.showIcon = true;
    this.showLocation = false;
    this.showGender = true;
    this.showPosting = true;
  }

  outsideChennai(data: any) {
    this.dashboardService.getByLocation(data).subscribe((res) => {
      res.results.empList.forEach((empItem: any) => {
        this.postingIn.forEach((postingInItem: any) => {
          if (empItem.toPostingInCategoryCode === postingInItem.value) {
            empItem.postingIn = postingInItem.label;
          }
        });

        this.department.forEach((departmentItem: any) => {
          if (empItem.toDepartmentId === departmentItem.value) {
            empItem.department = departmentItem.label;
          }
        });

        this.designation.forEach((designationItem: any) => {
          if (empItem.toDesignationId === designationItem.value) {
            empItem.designation = designationItem.label;
          }
        });
      });
      this.tableData = res.results.empList;
    });
    this.drocurrent = false;
    this.showMainTitle = false;
    this.showCard = false;
    this.showtable = true;
    this.showFilter = false;
    this.showOutsideChennai = true;
    this.showIcon = true;
    this.showLocation = true;
    this.showDesignation = true;
  }

  collectors(data: string) {
    this.dashboardService.getByDesignation(data).subscribe((res: any) => {
      res.results.empList.forEach((empItem: any) => {
        this.department.forEach((departmentItem: any) => {
          if (empItem.toDepartmentId === departmentItem.value) {
            empItem.department = departmentItem.label;
          }
        });

        this.postingIn.forEach((postingInItem: any) => {
          if (empItem.toPostingInCategoryCode === postingInItem.value) {
            empItem.postingIn = postingInItem.label;
          }
        });
      });

      this.tableData = res.results.empList;
    });
    this.drocurrent = false;
    this.showMainTitle = false;
    this.showCard = false;
    this.showtable = true;
    this.showFilter = false;
    this.showCollector = true;
    this.showIcon = true;
    this.showPosting = true;
    this.showGender = true;
    this.showDesignation = false;
  }

  subCollectors(data: string) {
    this.dashboardService.getByDesignation(data).subscribe((res: any) => {
      res.results.empList.forEach((empItem: any) => {
        this.department.forEach((departmentItem: any) => {
          if (empItem.toDepartmentId === departmentItem.value) {
            empItem.department = departmentItem.label;
          }
        });

        this.postingIn.forEach((postingInItem: any) => {
          if (empItem.toPostingInCategoryCode === postingInItem.value) {
            empItem.postingIn = postingInItem.label;
          }
        });
      });

      this.tableData = res.results.empList;
    });
    this.drocurrent = false;
    this.showMainTitle = false;
    this.showCard = false;
    this.showtable = true;
    this.showFilter = false;
    this.showSub = true;
    this.showIcon = true;
    this.showPosting = true;
    this.showGender = true;
    this.showDesignation = false;
  }

  asstCollectors(data: string) {
    this.dashboardService.getByDesignation(data).subscribe((res: any) => {
      res.results.empList.forEach((empItem: any) => {
        this.department.forEach((departmentItem: any) => {
          if (empItem.toDepartmentId === departmentItem.value) {
            empItem.department = departmentItem.label;
          }
        });

        this.postingIn.forEach((postingInItem: any) => {
          if (empItem.toPostingInCategoryCode === postingInItem.value) {
            empItem.postingIn = postingInItem.label;
          }
        });
      });

      this.tableData = res.results.empList;
    });
    this.drocurrent = false;
    this.showMainTitle = false;
    this.showCard = false;
    this.showtable = true;
    this.showFilter = false;
    this.showAsst = true;
    this.showIcon = true;
    this.showPosting = true;
    this.showGender = true;
    this.showDesignation = false;
  }

  additioanlCollector(data: string) {
    this.dashboardService.getByDesignation(data).subscribe((res: any) => {
      res.results.empList.forEach((empItem: any) => {
        this.department.forEach((departmentItem: any) => {
          if (empItem.toDepartmentId === departmentItem.value) {
            empItem.department = departmentItem.label;
          }
        });

        this.postingIn.forEach((postingInItem: any) => {
          if (empItem.toPostingInCategoryCode === postingInItem.value) {
            empItem.postingIn = postingInItem.label;
          }
        });
      });

      this.tableData = res.results.empList;
    });
    this.drocurrent = false;
    this.showMainTitle = false;
    this.showCard = false;
    this.showtable = true;
    this.showFilter = false;
    this.showAdditional = true;
    this.showIcon = true;
    this.showPosting = true;
    this.showGender = true;
    this.showDesignation = false;
  }

  commissioner(data: string) {
    this.dashboardService.getByDesignation(data).subscribe((res: any) => {
      res.results.empList.forEach((empItem: any) => {
        this.department.forEach((departmentItem: any) => {
          if (empItem.toDepartmentId === departmentItem.value) {
            empItem.department = departmentItem.label;
          }
        });

        this.postingIn.forEach((postingInItem: any) => {
          if (empItem.toPostingInCategoryCode === postingInItem.value) {
            empItem.postingIn = postingInItem.label;
          }
        });
      });

      this.tableData = res.results.empList;
    });
    this.drocurrent = false;
    this.showMainTitle = false;
    this.showCard = false;
    this.showtable = true;
    this.showFilter = false;
    this.showComm = true;
    this.showIcon = true;
    this.showPosting = true;
    this.showGender = true;
    this.showDesignation = false;
  }
  drocurrent:boolean=false;
  dro(){
    this.router.navigate(['/dro'])
    // this.dashboardService.uploadGet('getDros').subscribe((res:any)=>{
    //   this.tableData = res.results;
    //   this.drocurrent = true;
    //   this.showMainTitle = false;
    //   this.showCard = false;
    //   this.showtable = true;
    //   this.showFilter = false;
    //   this.showComm = true;
    //   this.showIcon = true;
    //   this.showPosting = false;
    //   this.showGender = false;
    //   this.showDesignation = false;
    //   this.showLocation = false;
    // })
  }

  Back() {
    this.showMainTitle = true;
    this.showtable = false;
    this.showActive = false;
    this.showretiredOfficer = false;
    this.showMale = false;
    this.showFemale = false;
    this.showSec = false;
    this.showOutsideChennai = false;
    this.showOutsideSec = false;
    this.showChennai = false;
    this.showCollector = false;
    this.showSub = false;
    this.showAsst = false;
    this.showAdditional = false;
    this.showComm = false;
    this.showCard = true;
    this.showFilter = true;
    this.showIcon = false;
  }

  clearAll() {
    this.filterForm.reset();
    this.tableData = [];
  }

  getValue(event: any, controlName: string): void {
    let value: any;

    if (controlName === 'name') {
      value = event.name;
      this.selectedOption = value;
      this.showDropdown = false;
    }
    else if (controlName === 'batch') {
      value = event.batch;
      this.selectedBatchOption = value;
      this.showBatchDropdown = false;
    }
    else {
      value = event?.target?.value;
    }

    if (value !== undefined) {
      this.filterForm.get(controlName)?.setValue(value, { emitEvent: false });
    }

    const payload: any = {};
    Object.keys(this.filterForm.controls).forEach(key => {
      const control = this.filterForm.get(key);
      if (control) {
        const controlValue = control.value;
        if (control instanceof FormGroup) {
          const nestedPayload: any = {};
          Object.keys(control.controls).forEach(nestedKey => {
            const nestedValue = control.get(nestedKey)?.value;
            if (nestedValue !== '' && nestedValue !== null && nestedValue !== undefined) {
              nestedPayload[nestedKey] = nestedValue;
            }
          });

          if (Object.keys(nestedPayload).length > 0) {
            payload[key] = nestedPayload;
          }
        } else {
          if (controlValue !== '' && controlValue !== null && controlValue !== undefined) {
            payload[key] = controlValue;
          }
        }
      }
    });
    // console.log('Payload:', payload);
    console.log(this.role);
    if (this.role != "Officer") {
      console.log("payload", payload);
      this.dashboardService.employeeFilter(payload).subscribe((res: any) => {
        res.results.empList.forEach((ele: any) => {
          const postingIn = this.postingIn.find((data: any) => data.value === ele.toPostingInCategoryCode);
          const department = this.department.find((data: any) => data.value === ele.toDepartmentId);
          const designation = this.designation.find((data: any) => data.value === ele.toDesignationId);
          const gender = this.gender.find((data: any) => data._id === ele.gender);
          ele.postingInLabel = postingIn ? postingIn.label : '';
          ele.departmentLabel = department ? department.label : '';
          ele.designationLabel = designation ? designation.label : '';
          ele.genderLabel = gender ? gender.category_name : '';
        });
        this.tableData = res.results.empList;
      });
    }
    else if (this.role == "Officer") {
      this.dashboardService.getEmployeeSearchOfficer(payload).subscribe((res: any) => {
        res.results.empList.forEach((ele: any) => {
          const postingIn = this.postingIn.find((data: any) => data.value === ele.toPostingInCategoryCode);
          const department = this.department.find((data: any) => data.value === ele.toDepartmentId);
          const designation = this.designation.find((data: any) => data.value === ele.toDesignationId);
          const gender = this.gender.find((data: any) => data._id === ele.gender);
          ele.postingInLabel = postingIn ? postingIn.label : '';
          ele.departmentLabel = department ? department.label : '';
          ele.designationLabel = designation ? designation.label : '';
          ele.genderLabel = gender ? gender.category_name : '';
        });
        this.tableData = res.results.empList;
      });
    }

  }

  // createBarChart(){
  //   this.chart = new Chart("MyBarChart", {
  //      type: 'bar',

  //      data: {
  //        labels: ['2019', '2020', '2021','2022','2023' ], 
  //                 datasets: [
  //                  {
  //                    label: "Transfer",
  //                    data: ['467','576', '572', '79', '92'],
  //                    backgroundColor: '#3d97ff'
  //                  },
  //                  {
  //                    label: "Promotion",
  //                    data: ['542', '542', '536', '327', '17'],
  //                    backgroundColor: '#202b46'
  //                  }  
  //                ]
  //      },
  //      options: {
  //        aspectRatio:2.5
  //      }

  //    });
  //  }
  //  createLineChart(){
  //    this.chart = new Chart("MyLineChart", {
  //       type: 'line',

  //       data: {
  //         labels: ['2019', '2020', '2021','2022','2023' ], 
  //          datasets: [
  //           {
  //             label: "Transfer",
  //             data: ['467','576', '572', '79', '92'],
  //             backgroundColor: '#3d97ff'
  //           },
  //           {
  //             label: "Promotion",
  //             data: ['542', '542', '536', '327', '17'],
  //             backgroundColor: '#202b46'
  //           }  
  //         ]
  //       },
  //       options: {
  //         aspectRatio:2.5
  //       }

  //     });
  //   }

}
