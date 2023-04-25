import { Component, OnInit } from '@angular/core';
import { User } from 'models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'user-options-data',
  templateUrl: './user-options-data.component.html',
  styleUrls: ['./user-options-data.component.css']
})
export class UserOptionsDataComponent implements OnInit {

  users: User[] = [];
  firstName = '';
  lastName = '';
  telephoneNumber = '';
  email = '';
  username = '';
  password = '';

  userId = 0;


  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  addUsers(firstName: string,lastName: string,telephoneNumber: string,email:string,username:string,password:string): void {

    const newUser: User = {firstName,lastName,telephoneNumber,email,username,password} as User;
    this.userService
      .addUsers(newUser)
      .subscribe(user => this.users.push(user));
  }

  deleteUser(id: number): void {
    this.userService
      .deleteUser(id)
      .subscribe();
  }

  UpdateUser(firstName: string,lastName: string,telephoneNumber: string,email:string,username:string,password:string): void {

    const newUser: User = {firstName,lastName,telephoneNumber,email,username,password} as User;
    this.userService
      .UpdateUser(newUser)
      .subscribe(user => this.users.push(user));
  }

}
