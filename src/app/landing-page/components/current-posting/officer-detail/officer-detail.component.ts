import { Component, Input } from '@angular/core';
import { LeaveTransferService } from '../../../../forms/forms.service';
@Component({
  selector: 'app-officer-detail',
  templateUrl: './officer-detail.component.html',
  styleUrl: './officer-detail.component.css'
})
export class OfficerDetailComponent {
  constructor(private service:LeaveTransferService){}
@Input() data!:any;
placeHolderPath:string='assets/images/ias/noprofile.jpg';
url = this.service.fileUrl + 'profileImages/';
}
