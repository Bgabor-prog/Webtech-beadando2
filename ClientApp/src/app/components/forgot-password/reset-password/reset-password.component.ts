import { animate, style, transition, trigger } from '@angular/animations';
import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class ResetPasswordComponent {
  resetPasswordForm!: FormGroup;
  submitted = false;
  loading = false;
  returnUrl!: string;
  token!: string;
  success !: boolean;
  error !: boolean;
  showAlert = false;
  alertTimeout: any;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private userService: UserService) {
   
  }

  ngOnInit(): void {
     this.token = this.route.snapshot.queryParams['token'];

    this.resetPasswordForm = this.formBuilder.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required]
      },
      {
        validator: this.MustMatch('password', 'confirmPassword')
      }
    );

    this.resetPasswordForm.controls.password.valueChanges.subscribe(() => {
      this.resetPasswordForm.controls.confirmPassword.updateValueAndValidity();
  });

  }

  get f() {
    return this.resetPasswordForm.controls;
  }

  showAlertMessage() {
    clearTimeout(this.alertTimeout);
    this.showAlert = true;
    this.alertTimeout = setTimeout(() => {
      this.showAlert = false;
    }, 3000); // Change this value to set the duration for the alert message.
  }

  onSubmit() {
    let statusCode;

    this.submitted = true; 
    
    if (this.resetPasswordForm.invalid) {
      return;
    }

    const newPassword = this.resetPasswordForm.controls.password.value;
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      this.userService.resetPassword(newPassword, token)
      .subscribe((response: any) => {
        // Handle successful password reset
        this.errorMessage = '';
        this.successMessage = 'Password reset successful. You can now log in with your new password.';
        this.success = true;
        this.showAlertMessage();
        this.loading = false;
        this.router.navigate(['/login-signup-container']);
      }, error => {
        // Handle errors
        statusCode = error.status;
        if (statusCode === 400) {
          this.errorMessage = 'Invalid token or the token has expired. Please request a new password reset link.';
          this.error = true;
        } else {
          this.errorMessage = 'An error occurred while resetting your password. Please try again later.';
          this.error = true;
        }
        this.showAlertMessage();
        });
    } else {
      // Handle case when token is null
      this.errorMessage = 'Invalid password reset link. Please request a new password reset link.';
      this.error = true;
      this.showAlertMessage();
    }
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
  
      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }
  
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
