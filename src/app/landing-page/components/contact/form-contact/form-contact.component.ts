import { Component } from '@angular/core';
import { landingService } from '../../../landing-services/landing.service';
@Component({
  selector: 'app-form-contact',
  templateUrl: './form-contact.component.html',
  styleUrl: './form-contact.component.css'
})
export class FormContactComponent{
  constructor(private service:landingService){}
  onSubmit(contactForm: any) {
    // if (contactForm.valid) {
      // console.log('Form Data as JSON:', JSON.stringify(contactForm.value));
    // } else {
      // console.log('Form is invalid');
    // }

    this.service.postapicall('addContactus',contactForm.value).subscribe((res:any)=>{
      if(res.status === 200){
        alert("Request sent successfully!");
      }
    })
  }
}
