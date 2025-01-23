// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrl: './home.component.css'
// })
// export class HomeComponent {
//   public texts: any[] = ['Active Proceedings', 'Civil Servants', 'Policy Reviews', 'Digital Coverage']
//   public subHeading: any[] = ['2,456', '1,287', '328', '100%']
//   public greenbox: any[] = ['12% increase this month', '98% productivity rate', '25% above target', 'Full implementation']

//   public announcements = [
//     "Presidential Committee on Administrative Excellence: New Guidelines Released",
//     "National Conference on Digital Governance: Tamil Nadu to Host Key Sessions",
//     "Smart City Implementation: Phase 3 Launch in Metropolitan Areas",
//     "International Delegation: Singapore Officials to Study TN e-Governance",
//     "Chief Secretary Announces Major Administrative Reforms Package",
//     "State Receives Award for Best e-Governance Implementation"
//   ];

//   public updates = [
//     "Cabinet Approval: New Policy Framework for Administrative Modernization",
//     "Digital Infrastructure Upgrade: 100% Connectivity Achievement",
//     "Senior IAS Officers' Conference: Innovation in Governance",
//     "Green Initiative: Paperless Office Implementation Success",
//     "Citizen Services Portal: New Features Launched",
//     "Administrative Training Academy: International Certification Received"
//   ];

//   public overview: any[] = [
//     ['Smart Governance Implementation', 'Administrative Modernization', 'Digital Infrastructure Upgrade'],
//     ['National Excellence Award 2024', '100% Digital Integration', 'ISO 27001 Certification'],
//     ['Administrative Excellence Summit','Policy Review Conference','International Governance Forum']
//   ]
// }



import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  public texts: any[] = ['Active Officers', 'Retired Officers', 'Chennai', 'Budget']
  public subHeading: any[] = ['320', '316', '453', '100%']
  public greenbox: any[] = ['12% increase this month', '98% productivity rate', '25% above target', 'Full implementation']

  public announcements = [
    "Presidential Committee on Administrative Excellence: New Guidelines Released",
    "National Conference on Digital Governance: Tamil Nadu to Host Key Sessions",
    "Smart City Implementation: Phase 3 Launch in Metropolitan Areas",
    "International Delegation: Singapore Officials to Study TN e-Governance",
    "Chief Secretary Announces Major Administrative Reforms Package",
    "State Receives Award for Best e-Governance Implementation"
  ];

  public updates = [
    "Cabinet Approval: New Policy Framework for Administrative Modernization",
    "Digital Infrastructure Upgrade: 100% Connectivity Achievement",
    "Senior IAS Officers' Conference: Innovation in Governance",
    "Green Initiative: Paperless Office Implementation Success",
    "Citizen Services Portal: New Features Launched",
    "Administrative Training Academy: International Certification Received"
  ];

  public overview: any[] = [
    ['Smart Governance Implementation', 'Administrative Modernization', 'Digital Infrastructure Upgrade'],
    ['National Excellence Award 2024', '100% Digital Integration', 'ISO 27001 Certification'],
    ['Administrative Excellence Summit','Policy Review Conference','International Governance Forum']
  ]
}
