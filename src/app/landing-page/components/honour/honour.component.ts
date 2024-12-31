import { Component } from '@angular/core';

@Component({
  selector: 'app-honour',
  templateUrl: './honour.component.html',
  styleUrl: './honour.component.css'
})
export class HonourComponent {
  public headings: any[] = ['Legacy of Service', 'Jurisdictional Scope', 'Administrative Impact'];
  public subHeadings: any[] = ['Serving Since 1965', '33 Districts & Beyond', 'Transforming Governance'];

  public chiefSecretaries = [
    {
      name: "C A RAMAKRISHNAN, ICS",
      service: "Indian Civil Service",
      period: "10/11/1965 - 13/11/1969",
      imageUrl: "assets/images/person_test.png"
    },
    {
      name: "E P ROYAPPA, IAS",
      service: "Indian Administrative Service",
      period: "14/11/1969 - 12/04/1971",
      imageUrl: "assets/images/person_test.png"
    },
    {
      name: "P SABANAYAGAM, IAS",
      service: "Indian Administrative Service",
      period: "12/04/1971 - 11/03/1976",
      imageUrl: "assets/images/person_test.png"
    },
    {
      name: "V KARTHIKEYAN, IAS",
      service: "Indian Administrative Service",
      period: "12/03/1976 - 15/02/1977",
      imageUrl: "assets/images/person_test.png"
    },
    {
      name: "C V R PANICKER, IAS",
      service: "Indian Administrative Service",
      period: "16/02/1977 - 30/06/1977",
      imageUrl: "assets/images/person_test.png"
    },
    {
      name: "V KARTHIKEYAN, IAS",
      service: "Indian Administrative Service",
      period: "30/06/1977 - 21/08/1981",
      imageUrl: "assets/images/person_test.png"
    }
  ]
}
