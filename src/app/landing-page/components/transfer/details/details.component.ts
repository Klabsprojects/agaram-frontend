import { Component, Input } from '@angular/core';

interface details{
  date:string;
  description:string;
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {
  @Input() detail!:details;
}
