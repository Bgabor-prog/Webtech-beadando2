import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/services/alert.service';
import { first } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
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
export class LoginPageComponent {

  form!: FormGroup;
  loading = false;
  submitted = false;
  success = false;
  error = false;
  username = '';
  password = '';
  showAlert = false;
  alertTimeout: any;

  constructor(private userService: UserService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private alertService: AlertService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() { return this.form.controls; }

  showAlertMessage() {
    clearTimeout(this.alertTimeout);
    this.showAlert = true;
    this.alertTimeout = setTimeout(() => {
      this.showAlert = false;
    }, 3000); // Change this value to set the duration for the alert message.
  }

  onSubmit() {

    this.success = false;
    this.error = false;
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.userService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe({
        next: (response: any) => {
          // get return url from query parameters or default to home page
          console.log(response.user)
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify({ id: response.id ,username: response.user.username, role: response.user.role }));
          this.router.navigateByUrl('/').then(() => {
            location.reload();
          });
          this.router.navigateByUrl('/');
          this.showAlertMessage();
          this.success = true;
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
          this.error = true;
          this.showAlertMessage()
        },

      });
  }
}
