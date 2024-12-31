import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-service-info',
  templateUrl: './service-info.component.html',
  styleUrl: './service-info.component.css'
})
export class ServiceInfoComponent {
  @Input() heading:string="";
  @Input() subHeading:string="";
}
