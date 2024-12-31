import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-serive',
  templateUrl: './dashboard-serive.component.html',
  styleUrl: './dashboard-serive.component.css'
})
export class DashboardSeriveComponent {
@Input() dashboard!:{title:string,details:string}
}
