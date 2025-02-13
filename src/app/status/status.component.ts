import { Component, OnInit } from '@angular/core';
import { LeaveTransferService } from '../forms/forms.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrl: './status.component.css'
})
export class StatusComponent implements OnInit{
    statusData:any[]=[];
    url='';
    pageSize: number = 100; 
    pageSizeOptions: number[] = [5, 10, 15, 20];
    currentPage: number = 1;
    visiblePages: number[] = [];
    maxVisiblePages = 100;

    constructor(private statusService:LeaveTransferService,private router:Router) { }
  
    ngOnInit(): void {
      this.url = this.statusService.fileUrl;
      this.statusService.getAppliedForms().subscribe((res:any)=>{
        this.statusData = res.results;
      })
    }

    getStatus(data:any){
      const value = data.target.value;
      if(value!='All'){
        this.statusService.getNotificationStatus(value).subscribe((res:any)=>{
          console.log(res);
          this.statusData = res.results;
        })
      }
      else{
        this.statusService.getAppliedForms().subscribe((res:any)=>{
          this.statusData = res.results;
        })
      }
     
    }
}
