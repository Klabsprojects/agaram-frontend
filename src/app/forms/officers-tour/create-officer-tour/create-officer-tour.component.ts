import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-officer-tour',
  templateUrl: './create-officer-tour.component.html',
  styleUrls: ['./create-officer-tour.component.css']
})
export class CreateOfficerTourComponent implements OnInit {
 
  officerTourForm !: FormGroup;
  submitted = false;
  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {
    this.officerTourForm = this.fb.group({
      name:['',Validators.required],
      place:['',Validators.required],
      tourType:['',Validators.required],
      fromDate:['',Validators.required],
      toDate:['',Validators.required],
      go:['',Validators.required]
    })
  }

  Submit(){
    this.submitted = true;
    if(this.officerTourForm.valid){
      
    }
  }

}
