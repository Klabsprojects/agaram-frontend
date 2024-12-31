import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
public dashboardDetails = [
  {title:'Head Office',list:['Secretariat','Fort St. George','Chennai - 600009','Tamil Nadu, India']},
  {title:'Phone',list:['+91 44 2567 8901','+91 44 2567 8902','Toll Free: 1800 123 4567']},
  {title:'Email',list:['contact@tn.gov.in','support@tn.gov.in','helpdesk@tn.gov.in']},
  {title:'Working Hours',list:['Monday - Friday','10:00 AM - 5:45 PM','Except Government Holidays']}
]
}
