import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-contact',
  templateUrl: './dashboard-contact.component.html',
  styleUrl: './dashboard-contact.component.css'
})
export class DashboardContactComponent {
@Input() dashboard!:{title:string,list:any[]}
}
