import { Component, OnInit, ViewChild } from '@angular/core';
import { login } from '../auth.model';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LeaveTransferService } from '../forms/forms.service';
import { error } from 'console';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userLogin : login = new login(); 
  @ViewChild('loginForm', { static: false }) loginForm!: NgForm; 
  // loginForm!:NgForm;
  showPassword = false;
  platformId:any
  constructor(private router:Router,private loginService:LeaveTransferService) { }

  ngOnInit(): void {
    // if (isPlatformBrowser(this.platformId)) {
      //localStorage.clear();
    // }

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.clear();
    }
  }

  loginSubmit(data:any){
    if(this.loginForm.valid){
      this.loginService.login(data).subscribe((res:any)=>{
         this.router.navigate(['/dashboard']);
        res.results.data.find((ele:any)=> {
          localStorage.setItem('loginId', ele._id);
          console.log('ele._id',ele._id)
          localStorage.setItem('loginAs', ele.loginAs);
          localStorage.setItem('username', ele.username);
        });
        this.loginService.updateRoleData(res.results.roleData); 
      },
      (error:any)=>{
        console.log(error);
        alert(error.error.message);
        this.loginForm.resetForm();
      }
    )}
  }
  // if(this.loginForm.status == 'VALID')
    // {
    //   console.log("if");
    //   if(this.loginForm.value.userName == "Test" && this.loginForm.value.password == "Test@123"){
    //     this.router.navigate(['/dashboard']);
    //   }
    //   else{
    //     alert("Please check credential");
    //   }
    // }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
