import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent {
@Input() data!:any;
constructor(private router:Router){}
routePage(data:any){
  if(data==='Active Officers'){
    this.router.navigate(['/Landing/ActiveOfficers'])
  }
  if(data==='Retired Officers'){
    this.router.navigate(['/Landing/RetiredOfficers'])
  }
}
}
