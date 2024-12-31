import { Component, Input } from '@angular/core';


interface Person{
  name:string;
  service:string;
  period:string;
  imageUrl:string;
}
@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrl: './person.component.css'
})
export class PersonComponent {
  @Input() person!:Person;
}
