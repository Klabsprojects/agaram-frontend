import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class LeaveTransferService {

  private selectedItemSubject = new BehaviorSubject<string>('');

  baseUrl = 'http://localhost:5500/api/';

  constructor(private http:HttpClient) { }

  setSelectedItem(item: string) {
    this.selectedItemSubject.next(item);
  }

  getSelectedItem() {
    return this.selectedItemSubject.asObservable();
  }

  getData():Observable<any>{
    return this.http.get<any[]>(this.baseUrl + 'getCategories');
  }

  getDepartmentData():Observable<any>{
    return this.http.get<any[]>(this.baseUrl+'getDepartments');
  }

  getDesignations():Observable<any>{
    return this.http.get<any[]>(this.baseUrl+'getDesignations');
  }

  createEmployeeProfile(data:any) {
    return this.http.post<any[]>(this.baseUrl + 'addEmployeeProfile', data);
  }

  getEmployeeList():Observable<any>{
    return this.http.get<any>(this.baseUrl+'getEmployeeProfile');
  }

  getEmployee(_id:any){
    return this.http.get<any>(this.baseUrl+`getEmployeeProfile?_id=${_id}`);
  }

  getEmployeeFilter():Observable<any>{
    return this.http.get<any>(this.baseUrl+'getEmployeeByJoiningDate')
  }

  getDegree():Observable<any>{
    return this.http.get<any>(this.baseUrl+'getDegree');
  }

  updateEmployeeProfile(data:any):Observable<any>{
    return this.http.put<any>(this.baseUrl+'updateEmployeeProfile',data);
  }

  employeeFormUpdate(data:any):Observable<any>{
    return this.http.post<any>(this.baseUrl+'addEmployeeUpdate',data);
  }

  employeeFilter(name?: string, start?: string, end?: string,posting_in?:string,department?:string): Observable<any> {
    const url = `${this.baseUrl}getEmployeeByFilter?name=${name}&start=${start}&end=${end}&posting_in=${posting_in}&department=${department}`;
    return this.http.get<any>(url);
  }
  

  getEmployeeUpdate():Observable<any>{
    return this.http.get<any>(this.baseUrl+'getEmployeeUpdate');
  }

}
