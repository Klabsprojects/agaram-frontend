export class employeeList{
    _id:string='';
    employeeId:string='';
    ifhrmsId:string='';
    fullName:string='';
    batch:string='';
    mobileNo1:number=0;
    gender:any;
    dateOfJoining:string='';
    approvalStatus:boolean=false;
    submittedBy:string='';
    approvedBy:string='';
}

export class employeeFilterList{
    fullName?:string='';
    gender?:string = '';
    batch?:string='';
    department?:string='';
    designation?:string='';
    posting?:string='';
    from?:string='';
    to?:string='';
}