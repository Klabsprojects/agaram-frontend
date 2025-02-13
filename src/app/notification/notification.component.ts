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
    pageSize: number = 100; 
    pageSizeOptions: number[] = [5, 10, 15, 20];
    currentPage: number = 1;
    visiblePages: number[] = [];
    maxVisiblePages = 100;

    constructor(private notificationService:LeaveTransferService,private router:Router) { }
  
    ngOnInit(): void {
      this.url = this.notificationService.fileUrl;
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
        const routeMap: { [key: string]: string } = {
          'Transfer / Posting': 'create-transfer',
          'Leave': 'apply-leave',
          'Training':'create-training',
          'Promotion':'create-promotion',
          'SAF Games Village': 'saf-village-application',
          'Medical Reimbursement': 'create-medical-reimbursement',
          'Foreign Visit':'create-foreign-visit',
          'LTC':'create-ltc',
          'Private Visit':'create-private',
          'Immovable':'create-immovable',
          'Movable':'create-movable',
          'Education':'create-education',
          'Intimation':'create-intimation',
          'House Building Advance':'create-hba',
          'OfficerTour':'create-officers-tour',
          'GPF':'create-gpf',
          'MHA ID Card':'create-mha'
        };
        
        const route = routeMap[data.formType];
        if (route) {
          this.router.navigate([route]);
        }
        
    }

    getStatus(data:any){
      const value = data.target.value;
      if(value!='All'){
        this.notificationService.getNotificationStatus(value).subscribe((res:any)=>{
          console.log(res);
          this.notificationData = res.results;
        })
      }
      else{
        this.notificationService.getAppliedForms().subscribe((res:any)=>{
          this.notificationData = res.results;
        })
      }
     
    }
  
   
}
