import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-retired-officers-detail',
  templateUrl: './retired-officers-detail.component.html',
  styleUrl: './retired-officers-detail.component.css'
})
export class RetiredOfficersDetailComponent {
@Input() data!:any;
}
