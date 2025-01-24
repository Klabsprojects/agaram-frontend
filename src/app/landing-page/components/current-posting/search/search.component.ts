import { Component } from '@angular/core';
import { landingService } from '../../../landing-services/landing.service';
@Component({
  selector: 'app-searching',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchingComponent {
  constructor(private service:landingService){}
  onInput(event:any){
    const inputValue = event.target.value.trim();
    this.service.callSearch(inputValue);
  }
}
