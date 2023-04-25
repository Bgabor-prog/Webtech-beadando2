import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'login-signup-container',
  templateUrl: './login-signup-container.component.html',
  styleUrls: ['./login-signup-container.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('Login', style({ height: '600px', width:'400px' })),
      state('Sign Up', style({ height: '600px', width:'600px' })),
      transition('* <=> *', [animate('0.3s ease-out')]),
    ]),
  ],
})
export class LoginSignupContainerComponent {
  selectedTab = 'Login';
  isOpen = true;

  constructor(private router: Router, private userService: UserService) {

    if (this.userService.userValue) {
      this.router.navigate(['/login-signup-container']);
      console.log(this.userService.userValue);
    }
  }
  ngOnInit() {
  }

  changeTab(tab: string) {
    this.selectedTab = tab;
  }

  closeContainer() {
    this.router.navigate(['']);
  }
}
