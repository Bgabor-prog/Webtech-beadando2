import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'models/user';
import { first } from 'rxjs';
import { MustMatch } from 'src/app/helpers/password.match';
import { AlertService } from 'src/app/services/alert.service';
import { UserService } from 'src/app/services/user.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('350ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class SignupPageComponent {

  form!: FormGroup;
  loading = false;
  submitted = false;
  success = false;
  error = false;
  showAlert = false;
  alertTimeout: any;

  users: User[] = [];

  constructor(private userService: UserService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private alertService: AlertService) { }


  ngOnInit() {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      telephoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      // confirmPassword: ['', Validators.required],
    }, {
      // validators: MustMatch('password', 'confirmPassword')
    });
  }

  get f() { return this.form.controls; }


  // register(formValue: any) {
  //   const newUser: User = { ...formValue } as User;
  //   this.userService.register(newUser)
  //     .subscribe(user => this.users.push(user));
  // }

  showAlertMessage() {
    clearTimeout(this.alertTimeout);
    this.showAlert = true;
    this.alertTimeout = setTimeout(() => {
      this.showAlert = false;
    }, 3000); // Change this value to set the duration for the alert message.
  }


  onSubmit(formValue: any) {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    const newUser: User = { ...formValue, role: 'User' } as User;
    this.loading = true;
    this.userService.register(newUser)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Registration successful', { keepAfterRouteChange: true });
          this.router.navigate(['/login-signup-container'], { relativeTo: this.route });
          this.loading = false;
          this.success = true;
          this.showAlertMessage();

        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
          this.error = true;
          this.showAlertMessage();
        }
      });
  }

}

