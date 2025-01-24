import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-officer-detail',
  templateUrl: './officer-detail.component.html',
  styleUrl: './officer-detail.component.css'
})
export class OfficerDetailComponent {
@Input() data!:any;
}
