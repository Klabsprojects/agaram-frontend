import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-officers-tour',
  templateUrl: './officers-tour.component.html',
  styleUrls: ['./officers-tour.component.css']
})
export class OfficersTourComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

}
