import { Component, OnInit } from '@angular/core';
import { landingService } from '../../landing-services/landing.service';
@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.css'
})
export class TransferComponent implements OnInit {
  constructor(private service: landingService) { }
  ngOnInit(): void {
    this.service.getapicall(`getEmployeeUpdate?loginId=66ae2d4b60add601fcb89aea&loginAs=Super%20Admin&todate=2024-11-01&fromdate=2024-01-14`).subscribe((res: any) => {
      this.details = res.results;
      this.service.handlePaginationSent(this.details);
    })
    this.service.pagginationRecive$.subscribe((res:any)=>{
      if(res){
        this.details = res;
      }
    })
  }
  public details:any[]= []
}
