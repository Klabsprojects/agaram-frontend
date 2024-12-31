import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admininstrative-dashboard',
  templateUrl: './admininstrative-dashboard.component.html',
  styleUrl: './admininstrative-dashboard.component.css'
})
export class AdmininstrativeDashboardComponent {
@Input() dashboard!:{title:string,description:string}
}
