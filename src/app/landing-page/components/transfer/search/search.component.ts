import { Component } from '@angular/core';
import { landingService } from '../../../landing-services/landing.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  constructor(private service:landingService){}
  onInput(event:any){
    const inputValue = event.target.value.trim();
    this.service.CallSearchTransfer(inputValue);
  }
}
