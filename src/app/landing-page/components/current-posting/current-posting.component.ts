import { Component } from '@angular/core';

@Component({
  selector: 'app-current-posting',
  templateUrl: './current-posting.component.html',
  styleUrl: './current-posting.component.css'
})
export class CurrentPostingComponent {
  public dashboardDetails = [
    {title:'Total Officers',value:'256'},
    {title:'State Cadres',value:'18'},
    {title:'Departments',value:'42'},
    {title:'New Postings',value:'12'}
  ];
}
