import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-cp',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponentCP {
@Input() dashboard!:{title:string,value:string}
}
