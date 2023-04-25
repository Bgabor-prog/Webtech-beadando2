import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'models/user';
import { animate, state, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        height: '200px'
      })),
      state('out', style({
        height: '0'
      })),
      transition('in => out', animate('500ms ease-in-out')),
      transition('out => in', animate('500ms ease-in-out'))
    ])
  ]
})
export class NavMenuComponent {
  user?: User | null;
  isExpanded = false;
  state = 'hide';
  getUser



  constructor(private userService: UserService) {
    this.userService.user.subscribe(x => this.user = x);
    this.getUser = this.getCurrentUser();
    //console.log(this.getUser.user.username)
  }

  

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  getCurrentUser() {
    var userStr = localStorage.getItem('user');

    try {
      return JSON.parse(userStr ?? '{}');
    } catch (ex) {
      return null;
    }
  }

  logout() {
    this.userService.logout();
    this.state = 'out';
  }

  toggleProfile() {
    this.state = this.state === 'hide' ? 'show' : 'hide';
  }

  isAdmin(): boolean {
    const user = this.userService.userValue;
    return user?.role === 'Admin';
  }

  isUser(): boolean {
    const user = this.userService.userValue;
    return user?.role === 'User';
  }
}
