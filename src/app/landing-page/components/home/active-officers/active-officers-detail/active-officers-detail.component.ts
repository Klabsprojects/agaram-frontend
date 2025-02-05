import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-active-officers-detail',
  templateUrl: './active-officers-detail.component.html',
  styleUrl: './active-officers-detail.component.css'
})
export class ActiveOfficersDetailComponent {
@Input() data!:any;
}
