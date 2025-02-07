import { Component, OnInit } from '@angular/core';
import { LeaveTransferService } from '../forms/forms.service';
import { Router, Routes } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit{
    notificationData:any[]=[];
    url='';
    constructor(private notificationService:LeaveTransferService,private router:Router) { }
  
    ngOnInit(): void {
      this.url = this.notificationService.fileUrl;
      console.log("nof");
      this.notificationService.getAppliedForms().subscribe((res:any)=>{
        this.notificationData = res.results;
      })
    }
  
    approve(data:any){
      console.log(data,data.formType);
      const formData = {
        approvedBy: localStorage.getItem('loginId'),
        id:data._id
        }
        this.notificationService.formApproval(formData).subscribe((res:any)=>{
        })
      if(data.formType == 'SAF Games Village'){
        this.router.navigate(['saf-village-application']);
      }
      if(data.formType == 'Medical Reimbursement'){
        this.router.navigate(['medical-reimbursement']);
      }
    }
  
   
}
