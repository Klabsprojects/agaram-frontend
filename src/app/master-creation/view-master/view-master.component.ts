import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveTransferService } from '../../forms/forms.service';

@Component({
  selector: 'app-view-master',
  templateUrl: './view-master.component.html',
  styleUrl: './view-master.component.css'
})
export class ViewMasterComponent {
  @Input() type: string = ''
  @Input() show = false;
  @Output() closeModal = new EventEmitter<any>();
  constructor(private fb: FormBuilder, private masterAction: LeaveTransferService) { }
  ngOnInit(): void {
    this.title = this.capitalizeFirstLetter(this.type);
    if (this.type === 'state') {
      this.form = this.fb.group({
        category_name: ['', Validators.required],
        category_code: ['', Validators.required]
      })
    }
    else if (this.type === 'district') {
      this.form = this.fb.group({
        state: ['', Validators.required],
        category_name: ['', Validators.required]
      })
    }
    this.masterAction.getData().subscribe((res) => {
      this.states = res.filter((item: any) => item.category_type === "state");
      this.districts = res.filter((item: any) => item.category_type === "district_type");
      this.viewdata = this.type==='state'?this.states:this.districts;
    })
  }
  form!: FormGroup;
  submitted: boolean = false;
  title: string = '';
  states: any[] = [];
  districts:any[]=[];
  viewdata: any[] = [];
  editing = false;
  editingId: number | null = null;

  close() {
    this.closeModal.emit(null);
  }
  capitalizeFirstLetter(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  update() {
    if (this.form.valid) {
      var value;
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
          stateType: this.form.get('state')?.value,
          category_type:"district_type",
        }
      }
      this.masterAction.updateCategories(this.editingId, value).subscribe(
        (res: any) => {
          alert(`${this.title} Updated Successfully!`);
          this.cancel();
          this.close();
        },
        (error) => {
          console.error('Error updating category:', error);
        }
      );
    }
  }
  cancel() { 
    this.editing = false;
    this.editingId = null;
  }
  edit(data:any) { 
    this.editing=true;
    this.editingId=data._id;
    if(this.type==='state'){
      this.form.patchValue({
        category_code: data.category_code,
        category_name:data.category_name
      });
    }
    else if(this.type==='district'){
      this.form.patchValue({
        category_code: data.category_code,
        category_name:data.category_name,
        state:data.stateType
      })
    }
  }
  get_name(id:any){
    const category = this.states.find((cat:any) => cat._id === id);
    return category ? category.category_name : null;
  }
}
