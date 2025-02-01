import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-person-retirement',
  templateUrl: './person-retirement.component.html',
  styleUrl: './person-retirement.component.css'
})
export class PersonRetirementComponent {
@Input() person!:any;
defaultimage:string = 'assets/images/ias/noprofile.jpg'
}
