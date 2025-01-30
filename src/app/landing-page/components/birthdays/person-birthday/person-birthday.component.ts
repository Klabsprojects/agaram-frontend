import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-person-birthday',
  templateUrl: './person-birthday.component.html',
  styleUrl: './person-birthday.component.css'
})
export class PersonBirthdayComponent {
 @Input() person!:any;
  defaultimage:string = 'assets/images/ias/noprofile.jpg'
}
