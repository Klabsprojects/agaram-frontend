import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hba',
  templateUrl: './hba.component.html',
  styleUrls: ['./hba.component.css']
})
export class HbaComponent implements OnInit {
  filterText:any;
  tableData:any[]=[];
  constructor() { }

  ngOnInit(): void {
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
}
