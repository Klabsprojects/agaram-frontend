import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class LeaveTransferService {

  private selectedItemSubject = new BehaviorSubject<string>('');

  private roleDataSource = new BehaviorSubject<any[]>(this.getLocalRoleData());
  currentRoleData = this.roleDataSource.asObservable();

         baseUrl = 'http://localhost:5500/api/';
         fileUrl = 'http://localhost:5500/';
        // fileUrl = 'https://agaram.a2zweb.in/backend/';
        // baseUrl = 'https://agaram.a2zweb.in/v1/api/';
        private roleDataKey = 'roleData';
        private token: string='';
        

  constructor(private http:HttpClient,private router:Router,@Inject(PLATFORM_ID) private platformId: Object) { }

  updateRoleData(roleData: any[]) {
    this.roleDataSource.next(roleData);
    this.setLocalRoleData(roleData);
  }

  private setLocalRoleData(roleData: any[]) {
    localStorage.setItem('roleData', JSON.stringify(roleData));
  }

  private getLocalRoleData(): any[] {
    if (typeof localStorage !== 'undefined') {
      const data = localStorage.getItem('roleData');
      return data ? JSON.parse(data) : [];
    } else {
      return [];
    }
  }

  logout(){
    if (isPlatformBrowser(this.platformId)) {
      // localStorage.removeItem('loginId');
      // localStorage.removeItem('Authorization');
      // localStorage.removeItem('roleData');
      localStorage.clear();

    }
    // this.router.navigateByUrl('/');
    this.router.navigateByUrl('/').then(() => {
      location.replace('/');  
    });
  }
  
  setSelectedItem(item: string) {
    this.selectedItemSubject.next(item);
  }

  getSelectedItem() {
    return this.selectedItemSubject.asObservable();
  }

  
  login(data:any){
    // return this.http.post<any>(this.baseUrl+'login',data);
    return this.http.post<any>(this.baseUrl + 'login', data).pipe(
      tap((response:any) => {
        if (response && response.results && response.results.token) {
          this.token = response.results.token;
          localStorage.setItem('Authorization', this.token);
        }
      })
    );
  }
  

  getToken(): string | null {
    return this.token || localStorage.getItem('Authorization');
  }
  
  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders().set('Authorization', `${token}`);
  }

  // private getContentHeader(): HttpHeaders{
  //   const token = this.getToken();
  //   return new HttpHeaders({
  //     'Authorization': `${token}`,
  //     'Content-Type': 'application/x-www-form-urlencoded'
  //   });
  // }

  createUser(data:any){
    const headers = this.getHeaders();
    return this.http.post<any>(this.baseUrl+'loginRegister',data,{headers});
  }

  addMasterData(data:any):Observable<any>{
    const headers = this.getHeaders();
    return this.http.post<any[]>(this.baseUrl + 'addCategories',data,{headers});
  }


  getData():Observable<any>{
    const headers = this.getHeaders();
    return this.http.get<any[]>(this.baseUrl + 'getCategories', { headers });
  }

  getCategoriesById(id:any):Observable<any>{
    const headers = this.getHeaders();
    return this.http.get<any[]>(this.baseUrl + `getCategories?_id=${id}`, { headers });
  }

  getDepartmentData():Observable<any>{
    const headers = this.getHeaders();
    return this.http.get<any[]>(this.baseUrl+'getDepartments',{headers});
  }

  getDesignations():Observable<any>{
    const headers = this.getHeaders();
    return this.http.get<any[]>(this.baseUrl+'getDesignations',{headers});
  }

  createEmployeeProfile(data:any) {
    const headers = this.getHeaders();
    return this.http.post<any[]>(this.baseUrl + 'addEmployeeProfile', data,{headers});
  }

  getEmployeeList():Observable<any>{
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getEmployeeProfile`,{headers});
  }

  getEmployeeLists(loginId:any,loginAs:any):Observable<any>{
    const headers = this.getHeaders();
    //loginid removed based on requirement
    // return this.http.get<any>(this.baseUrl+`getEmployeeProfile?loginId=${loginId}&loginAs=${loginAs}`,{headers});
    return this.http.get<any>(this.baseUrl+`getEmployeeProfile?loginAs=${loginAs}`,{headers});
  }

  getEmployee(_id:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getEmployeeProfile?_id=${_id}`,{headers});
  }

  getEmployeeAlone(loginId:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getEmployeeHistory?loginId=${loginId}`,{headers});
  }

  getEmployeeFilter():Observable<any>{
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+'getEmployeeByJoiningDate',{headers})
  }

  getDegree():Observable<any>{
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+'getDegree',{headers});
  }

  updateEmployeeProfile(data:any):Observable<any>{
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updateEmployeeProfile',data,{headers});
  }

  transferPosting(data:any):Observable<any>{
    const headers = this.getHeaders();
    return this.http.post<any>(this.baseUrl+'addTransferOrPostingManyEmployees',data,{headers});
  }

  // transferPosting(data:any):Observable<any>{
  //   return this.http.post<any>(this.baseUrl+'addEmployeeUpdate',data);
  // }

  // employeeFilter(name?: string, start?: string, end?: string,posting_in?:string,department?:string): Observable<any> {
  //   const url = `${this.baseUrl}getEmployeeByFilter?name=${name}&start=${start}&end=${end}&posting_in=${posting_in}&department=${department}`;
  //   return this.http.get<any>(url);
  // }

  employeeFilter(data:any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(this.baseUrl+'getEmployeeSearch',data,{headers});
  }

  getEmployeeSearchOfficer(data:any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(this.baseUrl+'getEmployeeSearchOfficer',data,{headers});
  }

  getEmployeeForLogin(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+'getEmployeeForLogin',{headers});
  }

  advanceSearch(data:any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(this.baseUrl+'getEmployeeAdvancedSearch',data,{headers});
  }

  getEmployeeUpdate():Observable<any>{
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+'getEmployeeUpdate',{headers});
  }

  getEmployeeUpdateList(loginId:any,loginAs:any):Observable<any>{
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getEmployeeUpdate?loginId=${loginId}&loginAs=${loginAs}`,{headers});
  }

  addDegree(data:any):Observable<any>{
    const headers = this.getHeaders();
    return this.http.post<any>(this.baseUrl+'addDegree',data,{headers});
  }

  getActiveOfficers():Observable<any>{
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+'getActiveEmployees',{headers});
  }

  getRetiresOfficers():Observable<any>{
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+'getRetiredEmployees',{headers});
  }

  getByLocation(data:any):Observable<any>{
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.baseUrl}/getByLocation?chennai=${data}`,{headers});
  }

  getMaleEmployees():Observable<any>{
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+'getMaleEmployees',{headers});
  }

  getFemaleEmployees():Observable<any>{
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+'getFemaleEmployees',{headers});
  }

  addDepartments(data:any):Observable<any>{
    const headers = this.getHeaders();
    return this.http.post<any>(this.baseUrl+'addDepartments',data,{headers});
  }

  addDesignation(data:any):Observable<any>{
    const headers = this.getHeaders();
    return this.http.post<any>(this.baseUrl+'addDesignations',data,{headers});
  }
  getSecretariat(data:any){
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.baseUrl}/getBySecretariat?secretariat=${data}`,{headers})
  }
  getByDesignation(data:any){
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.baseUrl}/getByDesignation?designation=${data}`,{headers})
  }

  getEmployeeHistory(data:any){
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.baseUrl}getEmployeeHistory?_id=${data}`,{headers});
  }

  getEmployeeCurrentPosting(data:any){
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.baseUrl}/getEmployeeCurrentPosting?_id=${data}`,{headers});
  }

  createForeignVisit(data:any){
    const headers = this.getHeaders();
    return this.http.post<any>(this.baseUrl+'addVisit',data,{headers});
  }

  approveForeignVisit(data:any){
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updateVisitApprovalStatus',data,{headers});
  }

  

  getForeignVisit(loginId:any,loginAs:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getVisit?loginId=${loginId}&loginAs=${loginAs}`,{headers});
  }

  createLtc(data:any){
    const headers = this.getHeaders();
    return this.http.post<any>(this.baseUrl+'addLtc',data,{headers});
  }

  getLtc(loginId:any,loginAs:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getLtc?loginId=${loginId}&loginAs=${loginAs}`,{headers});
  }

  getPrivateVisit(loginId:any,loginAs:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getPrivateForeignVisit?loginId=${loginId}&loginAs=${loginAs}`,{headers});
  }

  createPrivateVisit(data:any){
    const headers = this.getHeaders();
    return this.http.post<any>(this.baseUrl+'addPrivateForeignVisit',data,{headers});
  }

  getImmovable(loginId:any,loginAs:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getImmovable?loginId=${loginId}&loginAs=${loginAs}`,{headers});
  }

  createImmovable(data:any){
    const headers = this.getHeaders();
    return this.http.post<any>(this.baseUrl+'addImmovable',data,{headers});
  }

  getMovable(loginId:any,loginAs:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getMovable?loginId=${loginId}&loginAs=${loginAs}`,{headers});
  }

  createMovable(data:any){
    const headers = this.getHeaders();
    return this.http.post<any>(this.baseUrl+'addMovable',data,{headers});
  }

  getMedicalReimbursement(loginId:any,loginAs:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getMedicalReimbursement?loginId=${loginId}&loginAs=${loginAs}`,{headers});
  }
  createMedicalReimbursement(data:any){ 
    const headers = this.getHeaders();
    return this.http.post<any>(this.baseUrl+'addMedicalReimbursement',data,{headers});
  }
  getEducation(loginId:any,loginAs:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getEducation?loginId=${loginId}&loginAs=${loginAs}`,{headers});
  }

  createEducation(data:any){
    const headers = this.getHeaders();
    return this.http.post<any>(this.baseUrl+'addEducation',data,{headers});
  }

  approveEducation(data:any){
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updateEducationApprovalStatus',data,{headers});
  }

  updateEducation(data:any){
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updateEducation',data,{headers});
  }

  getIntimation(loginId:any,loginAs:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getIntimation?loginId=${loginId}&loginAs=${loginAs}`,{headers});
  }

  createIntimation(data:any){
    const headers = this.getHeaders();
    return this.http.post<any>(this.baseUrl+'addIntimation',data,{headers});
  }

  updateIntimation(data:any){
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updateIntimation',data,{headers});
  }

  approveIntimation(data:any){
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updateIntimationApprovalStatus',data,{headers});
  }

  getSafApplication(loginId:any,loginAs:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getSafApplication?loginId=${loginId}&loginAs=${loginAs}`,{headers});
  }
  applySaf(data:any){
    const headers = this.getHeaders();
    return this.http.post<any>(this.baseUrl+'addSafApplication',data,{headers});
  }

  getSafAllocation(_id:any = null){
    const headers = this.getHeaders();
    let url = this.baseUrl + 'getSafAllocation';
    if (_id) {
      url += `?_id=${_id}`;
    }
    return this.http.get<any>(url,{headers});
  }

  getBlock(){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+'getBlock',{headers});
  }

  safAllocation(data:any){
    const headers = this.getHeaders();
    return this.http.post<any>(this.baseUrl+'addSafAllocation',data,{headers});
  }

  updateSafAllocation(data:any):Observable<any>{
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updateSafAllocation',data,{headers});
  }

  getLeave(loginId:any,loginAs:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getLeave?loginId=${loginId}&loginAs=${loginAs}`,{headers});
  }

  applyLeave(data:any){
    const headers = this.getHeaders();
    return this.http.post<any>(this.baseUrl+'addLeave',data,{headers});
  }

  getTraining(loginId:any,loginAs:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getTraining?loginId=${loginId}&loginAs=${loginAs}`,{headers});
  }

  createTraining(data:any){
    const headers = this.getHeaders();
    return this.http.post<any>(this.baseUrl+'addTraining',data,{headers});
  }

  getCategoryTypes(){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+'getCategoryTypes',{headers});
  }

  getIntimationId(_id:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getIntimation?_id=${_id}`,{headers});
  }

  getEducationnId(_id:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getEducation?_id=${_id}`,{headers});
  }

  getMovableId(_id:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getMovable?_id=${_id}`,{headers});
  }

  getImmovableId(_id:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getImmovable?_id=${_id}`,{headers});
  }

  getPrivateVisitId(_id:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getPrivateForeignVisit?_id=${_id}`,{headers});
  }

  getPrivateVisitProfileId(_id:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getPrivateForeignVisit?employeeProfileId=${_id}`,{headers});
  }

  getMedicalReimbursementId(_id:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getMedicalReimbursement?_id=${_id}`,{headers});
  }

  getLtcId(_id:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getLtc?_id=${_id}`,{headers});
  }

  getSafVillageAllocationId(_id:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getSafAllocation?_id=${_id}`,{headers});
  }

  getSafVillageApplicationId(_id:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getSafApplication?_id=${_id}`,{headers});
  }

  getForeignVisitId(_id:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getVisit?_id=${_id}`,{headers});
  }

  getTrainingId(_id:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getTraining?_id=${_id}`,{headers});
  }

  getLeaveId(_id:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getLeave?_id=${_id}`,{headers});
  }
  getleaveIndividul(_id:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getleave?employeeProfileid=${_id}`,{headers});
  }

  
  getIndividualtwo(_id:string,type:string){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getEmployeeUpdate?employeeProfileId=${_id}&updateType=${type}`,{headers})
  }

  getIndividual(_id:string,url:string){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+url+`?employeeProfileId=${_id}`,{headers})
  }

  getPromotionId(_id:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getEmployeeUpdate?_id=${_id}`,{headers});
  }

  getTransferId(_id:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getEmployeeUpdate?_id=${_id}`,{headers});
  }



  createRole(data:any){
    const headers = this.getHeaders();
    return this.http.post<any>(this.baseUrl+`addRole`,data,{headers});
  }

  getRole(data:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getRole?roleName=${data}`,{headers});
  }

  getRoleClassified(){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+'getRoleClassified',{headers});

  }

  viewRole(data:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getRole?roleName=${data}`,{headers});
  }

  updateRole(data:any){
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updateRole',data,{headers});
  }

  getUserList(){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getUserTypesFromLogin`,{headers});
  }

  getUniqueUser(){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+'getUniqueUserTypesFromLogin',{headers});
  }
  
  getUpdateActive(data:any){
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updateActiveStatus',data,{headers});
  }

  getRoleUserList(){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+'getUniqueUserTypesWithoutRole',{headers});
  }

  updateTransferPosting(data:any):Observable<any>{
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updateTransferPosting',data,{headers});
  }

 

  // updateTransferPosting(data: any): Observable<any> {
  //   const headers = this.getContentHeader();
  //   return this.http.put<any>(this.baseUrl+'updateTransferPosting',data,{headers});
  // }
  

  updateTransferPostingApprovalStatus(data:any):Observable<any>{
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updateApprovalStatus',data,{headers});
  }

  updatePromotionApprovalStatus(data:any):Observable<any>{
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updateApprovalStatus',data,{headers});
  }

  updateProfileApprovalStatus(data:any):Observable<any>{
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updateProfileApprovalStatus',data,{headers});
  }
  
  updateLeave(data:any):Observable<any>{
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updateLeave',data,{headers});
  }

  updateTraining(data:any):Observable<any>{
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updateTraining',data,{headers});
  }

  updateForeignVisit(data:any):Observable<any>{
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updateVisit',data,{headers});
  }

  updateLtc(data:any):Observable<any>{
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updateLtc',data,{headers});
  }

  approveLtc(data:any):Observable<any>{
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updateLtcApprovalStatus',data,{headers});
  }

  updateMedicalReimbursement(data:any):Observable<any>{
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updateMedicalReimbursement',data,{headers});
  }

  approveMedicalReimbursement(data:any):Observable<any>{
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updateMedicalReimbursementApprovalStatus',data,{headers});
  }

  updatePrivateVisit(data:any):Observable<any>{
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updatePrivateVisit',data,{headers});
  }

  approvePrivateVisit(data:any):Observable<any>{
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updatePrivateVisitApprovalStatus',data,{headers});
  }

  updateImmovable(data:any):Observable<any>{
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updateImmovable',data,{headers});
  }

  approveImmovable(data:any):Observable<any>{
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updateImmovableApprovalStatus',data,{headers});
  }

  updateMovable(data:any):Observable<any>{
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updateMovable',data,{headers});
  }

  approveMovable(data:any):Observable<any>{
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updateMovableApprovalStatus',data,{headers});
  }

  approveLeave(data:any):Observable<any>{
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updateLeaveApprovalStatus',data,{headers})
  }
  
  approveTraining(data:any):Observable<any>{
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updateTrainingApprovalStatus',data,{headers})
  }

  updateSafApplication(data:any){
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+`updateSafApplication`,data,{headers});
  }

  getEmployeeProfile(loginId:any,loginAs:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getPrivateForeignVisit?loginId=${loginId}&loginAs=${loginAs}`,{headers});
  }

  
  uploadAdd(payload:any,url:any){
    const headers = this.getHeaders();
    return this.http.post<any>(this.baseUrl+url,payload,{headers});
  }

  uploadEdit(payload:any,url:any){
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+url,payload,{headers});
  }

  uploadGet(url:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+url,{headers});
  }

  uploadDelete(url:any,id:any){
    const headers = this.getHeaders();
    return this.http.delete<any>(this.baseUrl+url+'/'+id,{headers});
  }

  getGpf(loginId:any,loginAs:any){
    const headers = this.getHeaders();
    return this.http.get<any[]>(this.baseUrl + `getGpf?loginId=${loginId}&loginAs=${loginAs}`, { headers });
  }

  createGpf(data:any){
    const headers = this.getHeaders();
    return this.http.post<any>(this.baseUrl+'addGpf',data,{headers});
  }

  getGpfId(_id:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getGpf?_id=${_id}`,{headers});
  }

  updateGpf(data:any){
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updateGpf',data,{headers});
  }

  getMhaIdCard(loginId:any,loginAs:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getIdCard?loginId=${loginId}&loginAs=${loginAs}`,{headers});
  }

  getMhaId(_id:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getIdCard?_id=${_id}`,{headers});
  }

  createMhaId(data:any){
    const headers = this.getHeaders();
    return this.http.post<any>(this.baseUrl+'addIdCard',data,{headers});
  }

  updateMhaId(data:any){
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updateIdCard',data,{headers});
  }

  createHba(data:any){
    const headers = this.getHeaders();
    return this.http.post<any>(this.baseUrl+'addHba',data,{headers});
  }

  getHba(loginId:any,loginAs:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getHba?loginId=${loginId}&loginAs=${loginAs}`,{headers});
  }

  getHbaId(id:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getHba?_id=${id}`,{headers});
  }

  updateHba(data:any){
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updateHba',data,{headers});
  }

  getState():Observable<any>{
    const headers = this.getHeaders();
    return this.http.get<any[]>(this.baseUrl + 'getState', { headers });
  }

  getDistrict(stateId:any):Observable<any>{
    const headers = this.getHeaders();
    return this.http.get<any[]>(this.baseUrl + `getDistrict?stateId=${stateId}`, { headers });
  }

  get_no_header(url:any){
    return this.http.get<any>(this.baseUrl+url);
  }

  applyForm(data:any){
    const headers = this.getHeaders();
    return this.http.post<any>(this.baseUrl+'addFormsupload',data,{headers});
  }
  getAppliedForms(){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+'getFormsupload',{headers});
  }
  formApproval(data:any){
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updateFormsuploadApprovalStatus',data,{headers});
  }
  createDroProfile(data:any){
    const headers = this.getHeaders();
    return this.http.post<any>(this.baseUrl+'addDroProfile',data,{headers});
  }
  updateDroProfile(data:any){
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updateDroProfile',data,{headers});
  }
  getDroList(){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+'getDroProfile',{headers});
  }
  getDroId(_id:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getDroProfile?_id=${_id}`,{headers});
  }
  addPreviousPosting(data:any){
    const headers = this.getHeaders();
    return this.http.post<any>(this.baseUrl+'addPreviousPosting',data,{headers});
  }
  updatePreviousPosting(data:any){
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+'updatePreviousPosting',data,{headers});
  }
  getPreviousPostingList(){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+'getPreviousPosting',{headers});
  }
  getPreviousPostingbyId(_id:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getPreviousPosting?_id=${_id}`,{headers});
  }

  getPreviousPostingbyDashboard(empProfileId:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getPreviousPosting?empProfileId=${empProfileId}`,{headers});
  }

  getNotificationStatus(data:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getFormsupload?approvalStatus=${data}`,{headers});
  }
 

  updateMessageView(url:any,id:any){
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+url+'/'+id,{},{headers});
  }

  updateCategories(_id:any,data:any){
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+`updateCategory/${_id}`,data,{headers});
  }

  updateDepartment(id:any,data:any){
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+`updateDepartment?_id=${id}`,data,{headers});
  }

  updateDesignation(id:any,data:any){
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+`updateDesignation?_id=${id}`,data,{headers});
  }

  updateLeaveCredit(data:any){
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+`updateLeaveCredit`,data,{headers});
  }
  getLeaveCredit(_id:any){
    const headers = this.getHeaders();
    return this.http.get<any>(this.baseUrl+`getLeaveCredit?empProfileId=${_id}`,{headers});
  }

  changePassword(data:any){
    const headers = this.getHeaders();
    return this.http.put<any>(this.baseUrl+`updatePassword`,data,{headers});
  }

}