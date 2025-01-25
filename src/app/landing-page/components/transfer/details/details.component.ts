import { Component, Input } from '@angular/core';
import { landingService } from '../../../landing-services/landing.service';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {
  constructor(private service:landingService){}
  @Input() detail!:any;
  url:string = this.service.fileUrl;
  openpdf(data:any){
    const pdfUrl = `${this.url}${data}`;
    window.open(pdfUrl, '_blank');
  }
}
