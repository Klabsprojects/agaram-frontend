import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent {
@Input() title!:string;
@Input() subHeading!:string;
@Input() greenText!:string;
}
