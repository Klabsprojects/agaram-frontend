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
      "name": "C A RAMAKRISHNAN",
      "title": "INDIAN CIVIL SERVICE",
      "period": "10/11/1965 - 13/11/1969",
      "image": null
    },
    {
      "name": "E P ROYAPPA",
      "title": "Indian Administrative Service",
      "period": "14/11/1969-12/4/1971",
      "image": null
    },
    {
      "name": "P SABANAYAGAM",
      "title": "Indian Administrative Service",
      "period": "12/04/1971-11/03/1976",
      "image": "assets/images/ias/SABANAYAGAM.jpg"
    },
    {
      "name": "V KARTHIKEYAN",
      "title": "Indian Administrative Service",
      "period": "12/03/1976-05/02/1977",
      "image": null
    },
    {
      "name": "C V R PANICKER",
      "title": "Indian Administrative Service",
      "period": "16/02/1977-13/06/1997",
      "image": "assets/images/ias/PANICKER.jpg"
    },
    {
      "name": "V KARTHIKEYAN",
      "title": "Indian Administrative Service",
      "period": "30/06/1977-21/08/1981",
      "image": null
    },
    {
      "name": "K DIRAVIAM",
      "title": "Indian Administrative Service",
      "period": "22/08/1981-24/01/1983",
      "image": null
    },
    {
      "name": "K CHOKALINGAM",
      "title": "Indian Administrative Service",
      "period": "11/02/1983-31/03/1985",
      "image": "assets/images/ias/chockalingam.jpg"
    },
    {
      "name": "T V ANTONY",
      "title": "Indian Administrative Service",
      "period": "01/04/1985-20/07/1986",
      "image": null
    },
    {
      "name": "A PADBANABAN",
      "title": "Indian Administrative Service",
      "period": "21/07/1986-05/02/1988",
      "image": "assets/images/ias/195614121928.jpg"
    },
    {
      "name": "M M RAJENDRAN",
      "title": "Indian Administrative Service",
      "period": "06/02/1988-18/01/1981",
      "image": "assets/images/ias/195712041935.jpg"
    },
    {
      "name": "T V ANTHONY",
      "title": "Indian Administrative Service",
      "period": "19/01/1991-25/06/1991",
      "image": null
    },
    {
      "name": "T V VENGATARAMAN",
      "title": "Indian Administrative Service",
      "period": "26/06/1991-31/05/1994",
      "image": "assets/images/ias/venkataraman.jpg"
    },
    {
      "name": "N HARIBHASKAR",
      "title": "Indian Administrative Service",
      "period": "31/05/1994-27/05/1996",
      "image": null
    },
    {
      "name": "A S PADMANABHAN",
      "title": "Indian Administrative Service",
      "period": "27/05/1976-06/06/1966",
      "image": "assets/images/ias/padmanabhan.jpg"
    },
    {
      "name": "K A NAMBIAR",
      "title": "Indian Administrative Service",
      "period": "06/06/1996-30/06/1998",
      "image": "assets/images/ias/nambiar.jpg"
    },
    {
      "name": "A P MUTHUSWAMI",
      "title": "Indian Administrative Service",
      "period": "30/06/1998-31/05/2001",
      "image": "assets/images/ias/muthuswami.jpg"
    },
    {
      "name": "P SHANKAR, IAS",
      "title": "Indian Administrative Service",
      "period": "01/06/2001 - 06/06/2002",
      "image": "assets/images/ias/196620081943.jpg"
    },
    {
      "name": "SUKAVANESHVAR, IAS",
      "title": "Indian Administrative Service",
      "period": "10/06/2002 - 02/12/2002",
      "image": "assets/images/ias/196704081944.jpg"
    },
    {
      "name": "LAKSHMI PRANESH, IAS",
      "title": "Indian Administrative Service",
      "period": "02/12/2002 - 30/04/2005",
      "image": "assets/images/ias/196803041945.jpg"
    },
    {
      "name": "N NARAYANAN, IAS",
      "title": "Indian Administrative Service",
      "period": "01/05/2005 - 13/05/2006",
      "image": "assets/images/ias/197014071948.jpg"
    },
    {
      "name": "L K TRIPATHY, IAS",
      "title": "Indian Administrative Service",
      "period": "14/05/2006 - 31/08/2008",
      "image": "assets/images/ias/197101091948.jpg"
    },
    {
      "name": "K S SRIPATHI, IAS",
      "title": "Indian Administrative Service",
      "period": "01/09/2008 - 31/08/2010",
      "image": "assets/images/ias/197528041950.jpg"
    },
    {
      "name": "S MALATHI, IAS",
      "title": "Indian Administrative Service",
      "period": "01/09/2010 - 16/05/2011",
      "image": "assets/images/ias/197728101954.jpg"
    },
    {
      "name": "DEBENDRANATH SARANGI, IAS",
      "title": "Indian Administrative Service",
      "period": "16/05/2011 - 31/12/2012",
      "image": "assets/images/ias/197701031953.jpg"
    },
    {
      "name": "SHEELA BALAKRISHNAN, IAS",
      "title": "Indian Administrative Service",
      "period": "31/12/2012 - 31/03/2014",
      "image": "assets/images/ias/197605031954.jpg"
    },
    {
      "name": "MOHAN VERGHESE CHUNKATH, IAS",
      "title": "Indian Administrative Service",
      "period": "01/04/2014 - 02/12/2014",
      "image": "assets/images/ias/197810031956.jpg"
    },
    {
      "name": "K GNANADESIKAN, IAS",
      "title": "Indian Administrative Service",
      "period": "02/12/2014 - 08/06/2016",
      "image": "assets/images/ias/198216041959.jpg"
    },
    {
      "name": "Dr P RAMA MOHANA RAO, IAS",
      "title": "Indian Administrative Service",
      "period": "09/06/2016 - 22/12/2016",
      "image": "assets/images/ias/198515091957.jpg"
    },
    {
      "name": "Dr GIRIJA VAIDYANATHAN, IAS",
      "title": "Indian Administrative Service",
      "period": "23/12/2016 - 30/06/2019",
      "image": "assets/images/ias/198101071959.jpg"
    },
    {
      "name": "K Shanmugam, IAS",
      "title": "Indian Administrative Service",
      "period": "30/06/2019 - 31/01/2021",
      "image": "assets/images/ias/198507071960.jpg"
    },
    {
      "name": "Dr Rajeev Ranjan, IAS",
      "title": "Indian Administrative Service",
      "period": "01/02/2021 - 07/05/2021",
      "image": "assets/images/ias/198522091961.jpg"
    },
    {
      "name": "Dr. V. Irai Anbu, IAS",
      "title": "Indian Administrative Service",
      "period": "07/05/2021 - 30/06/2023",
      "image": "assets/images/ias/198816061963.jpg"
    },
    {
      "name": "Shiv Das Meena, IAS",
      "title": "Indian Administrative Service",
      "period": "01/07/2023 - 19/08/2024",
      "image": "assets/images/ias/198905101964.jpg"
    },
    {
      "name": "Muruganantham, IAS",
      "title": "Indian Administrative Service",
      "period": "19/08/2024 - Till",
      "image": "assets/images/ias/1737455265521.jpeg"
    }
  ]
}
