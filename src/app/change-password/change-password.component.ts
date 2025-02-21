import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private fb:FormBuilder){}

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
    console.log(this.passwordForm.value);
    if(this.passwordForm.valid){
      console.log(this.passwordForm.value);
    }
  }
}
