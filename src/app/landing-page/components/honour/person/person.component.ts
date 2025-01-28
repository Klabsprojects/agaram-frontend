import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrl: './person.component.css'
})
export class PersonComponent {
  @Input() person!:any;
  defaultimage:string = 'assets/images/ias/noprofile.jpg'
}
