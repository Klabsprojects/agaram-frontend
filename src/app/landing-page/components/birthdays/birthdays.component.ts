import { Component } from '@angular/core';
import { landingService } from '../../landing-services/landing.service';
import { LeaveTransferService } from '../../../forms/forms.service';
@Component({
  selector: 'app-birthdays',
  templateUrl: './birthdays.component.html',
  styleUrl: './birthdays.component.css'
})
export class BirthdaysComponent {
constructor(private Service:landingService,private LTC:LeaveTransferService){}
  ngOnInit(): void {
    this.department()
  }
  public bithdayPersons:any[]=[];
  public departments:any[]=[];
  public designations:any[]=[];
  department() {
    this.LTC.getDepartmentData().subscribe((departments: any) => {
      this.departments = departments;
  
      this.LTC.getDesignations().subscribe((designations: any) => {
        this.designations = designations.results;
  
        this.Service.getapicall('getEmployeeProfileBydateOfBirth').subscribe((res: any) => {
          this.bithdayPersons = res.results.map((employee: any) => {
            return {
              name: employee.fullName,
              department: this.departments.find((d: any) => d._id === employee.toDepartmentId)?.department_name || '',
              designation: this.designations.find((d: any) => d._id === employee.toDesignationId)?.designation_name || '',
              location: employee.city,
              image: employee.imagePath 
                ? `${this.LTC.fileUrl}profileImages/${employee.imagePath.replace('\\', '/')}`
                : null
            };
          });
  
          console.log("bithdayPersons", this.bithdayPersons);
        });
      });
    });
  }
}
