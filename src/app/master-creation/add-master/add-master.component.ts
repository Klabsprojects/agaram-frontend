import { Component,EventEmitter,Input,OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveTransferService } from '../../forms/forms.service';

@Component({
  selector: 'app-add-master',
  templateUrl: './add-master.component.html',
  styleUrl: './add-master.component.css'
})
export class AddMasterComponent implements OnInit{
  @Input() type:string = ''
  @Input() show = false;
  @Output() closeModal = new EventEmitter<any>();

  constructor(private fb:FormBuilder,private masterAction:LeaveTransferService){}
  ngOnInit(): void {
    this.title = this.capitalizeFirstLetter(this.type);
    if(this.type==='state'){
      this.form = this.fb.group({
        category_name:['',Validators.required],
        category_code:['',Validators.required]
      })
    }
    else if(this.type==='district'){
      this.form = this.fb.group({
        state:['',Validators.required],
        category_name:['',Validators.required],
      })
    }
    this.masterAction.getData().subscribe((res)=>{
      this.states = res.filter((item:any) => item.category_type === "state");
      console.log("states",this.states);
    })
  }
  form!:FormGroup;
  submitted:boolean = false;
  title:string='';
  states:any[]=[];
  onSubmit(){
    this.submitted = true;
    let value
    if(this.form.valid){
      if(this.type==='state'){
        value={
          category_name : this.form.get('category_name')?.value,
          category_code : this.form.get('category_code')?.value,
          category_type:"state",
        }
      }
      else if(this.type==='district'){
        value={
          category_name : this.form.get('category_name')?.value,
          stateType:this.form.get('state')?.value,
          category_type:"district_type",
        }
      }
      this.masterAction.addMasterData(value).subscribe((res)=>{
        alert(`${this.title} Added Successfully`);
        this.close();
      })
    }
  }
  close() {
    this.closeModal.emit(null);
  }
  capitalizeFirstLetter(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }



}
