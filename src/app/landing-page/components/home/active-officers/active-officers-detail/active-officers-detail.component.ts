import { Component, Input } from '@angular/core';
import { landingService } from '../../../../landing-services/landing.service';
@Component({
  selector: 'app-active-officers-detail',
  templateUrl: './active-officers-detail.component.html',
  styleUrl: './active-officers-detail.component.css'
})
export class ActiveOfficersDetailComponent {
  constructor(private service:landingService){}
@Input() data!:any;
placeHolderPath:string='assets/images/ias/noprofile.jpg';
url = this.service.fileUrl + 'profileImages/';
}
