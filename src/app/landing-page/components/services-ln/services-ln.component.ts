import { Component } from '@angular/core';
import { title } from 'process';

@Component({
  selector: 'app-services-ln',
  templateUrl: './services-ln.component.html',
  styleUrl: './services-ln.component.css'
})
export class ServicesLnComponent {
  public dashboardDetails = [
    {title:"Success Rate",details:"99.8%"},
    {title:"Citizens Served",details:"10M+"},
    {title:"Average Response",details:"24hrs"},
    {title:"Digital Services",details:"200+"}
  ]

  public administrativedetails = [
    {
      title:'Administrative Reforms',
      description:'Streamlining governance processes and implementing modern administrative practices for enhanced efficiency.'
    },
    {
      title:'Policy Implementation',
      description:'Execution and monitoring of government policies and directives across departments.'
    },
    {
      title:'Infrastructure Development',
      description:'Coordination and oversight of major infrastructure projects and urban development initiatives.'
    },
    {
      title:'Inter-Department Coordination',
      description:'Facilitating seamless communication and collaboration between various government departments.'
    },
    {
      title:'Training & Development',
      description:'Comprehensive training programs for civil servants and administrative staff.'
    },
    {
      title:'Performance Monitoring',
      description:'Advanced analytics and reporting systems for tracking administrative performance.'
    },
    {
      title:'Digital Governance',
      description:'Implementation of e-governance solutions and digital transformation initiatives.'
    },
    {
      title:'Public Service Delivery',
      description:'Efficient delivery of government services to citizens through modern channels.'
    }
  ]
}
