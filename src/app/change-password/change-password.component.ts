import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveTransferService } from '../forms/forms.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit{

  passwordForm!:FormGroup;
  submitted = false;
  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(private fb:FormBuilder,private passwordAction:LeaveTransferService,private router:Router){}

  ngOnInit(): void {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.matchPasswords('newPassword', 'confirmPassword') // Custom Validator
    });
  }

  matchPasswords(newPassword: string, confirmPassword: string) {
    return (formGroup: AbstractControl) => {
      const passwordControl = formGroup.get(newPassword);
      const confirmPasswordControl = formGroup.get(confirmPassword);

      if (confirmPasswordControl?.errors && !confirmPasswordControl.errors['passwordMismatch']) {
        return; // Return if another validator has already set an error
      }

      if (passwordControl?.value !== confirmPasswordControl?.value) {
        confirmPasswordControl?.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl?.setErrors(null);
      }
    };
  }

  togglePassword(field: string) {
    if (field === 'old') {
      this.showOldPassword = !this.showOldPassword;
    } else if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  
  onSubmit(){
    this.submitted = true;
    console.log(localStorage.getItem('username'));
    console.log(this.passwordForm.value);
    if(this.passwordForm.valid){
    const formData:any = {};
    Object.keys(this.passwordForm.value).forEach(key => {
      const value = this.passwordForm.get(key)?.value;
      if (value !== null && value !== undefined) {
          formData[key] = value;
      }
  });
   
      formData['username'] = localStorage.getItem('username');
      console.log(this.passwordForm.value);
      this.passwordAction.changePassword(formData).subscribe(
        (res: any) => {
            console.log(res);
            // alert(res.message);
            // this.passwordAction.logout();
            const confirmLogout = confirm("Password changed successfully. Do you want to log out?");
            if (confirmLogout) {
                this.passwordAction.logout();
            }else{
              location.reload();
            }
        },
        error => {
            console.error('API Error:', error);
        }
    );
    }
  }
}
