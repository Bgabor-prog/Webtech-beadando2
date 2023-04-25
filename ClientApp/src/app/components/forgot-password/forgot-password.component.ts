import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
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
export class ForgotPasswordComponent {
  forgotPasswordForm!: FormGroup;
  submitted = false;
  loading = false;
  showSuccessMessage = false;
  errorMessage = '';
  success !: boolean;
  error !: boolean;
  showAlert = false;
  alertTimeout: any;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  showAlertMessage() {
    clearTimeout(this.alertTimeout);
    this.showAlert = true;
    this.alertTimeout = setTimeout(() => {
      this.showAlert = false;
    }, 3000); // Change this value to set the duration for the alert message.
  }

  onSubmit() {
    this.error = false;
    this.success = false;
    this.submitted = true;

    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.loading = true;

    this.userService.forgotPassword(this.forgotPasswordForm.controls.email.value)
      .subscribe(
        () => {
          this.showSuccessMessage = true;
          this.errorMessage = '';
          this.loading = false;
          this.success = true;
          this.showAlertMessage();
        },
        error => {
          this.showSuccessMessage = false;
          this.errorMessage = error;
          this.loading = false;
          this.error = true;
          this.showAlertMessage();
        }
      );
  }
}

