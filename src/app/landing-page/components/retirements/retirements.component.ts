import { Component,OnInit} from '@angular/core';
import { landingService } from '../../landing-services/landing.service';
import { LeaveTransferService } from '../../../forms/forms.service';
@Component({
  selector: 'app-retirements',
  templateUrl: './retirements.component.html',
  styleUrl: './retirements.component.css'
})
export class RetirementsComponent implements OnInit {
  constructor(private Service:landingService,private LTC:LeaveTransferService){}
  ngOnInit(): void {
    this.department()
  }
  public retirementPersons:any[]=[];
  public departments:any[]=[];
  public designations:any[]=[];
  department() {
    this.LTC.getDepartmentData().subscribe((departments: any) => {
      this.departments = departments;
  
      this.LTC.getDesignations().subscribe((designations: any) => {
        this.designations = designations.results;
  
        this.Service.getapicall('getEmployeesRetiringThisYear').subscribe((res: any) => {
          this.retirementPersons = res.results.map((employee: any) => {
            return {
              name: employee.fullName,
              date: employee.dateOfRetirement,
              department: this.departments.find((d: any) => d._id === employee.toDepartmentId)?.department_name || '',
              designation: this.designations.find((d: any) => d._id === employee.toDesignationId)?.designation_name || '',
              location: employee.city,
              image: employee.imagePath 
                ? `${this.LTC.fileUrl}profileImages/${employee.imagePath.replace('\\', '/')}`
                : null
            };
          });
  
          console.log("retirementPersons", this.retirementPersons);
        });
      });
    });
  }
  

}
