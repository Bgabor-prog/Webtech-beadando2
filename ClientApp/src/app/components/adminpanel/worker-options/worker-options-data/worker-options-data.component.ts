import { Component, OnInit } from '@angular/core';
import { User } from 'models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'worker-options-data',
  templateUrl: './worker-options-data.component.html',
  styleUrls: ['./worker-options-data.component.css']
})
export class WorkerOptionsDataComponent implements OnInit {

  users: User[] = [];
  firstName = '';
  lastName = '';
  telephoneNumber = '';
  email = '';
  username = '';
  password = '';


  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  addWorker(firstName: string,lastName: string,telephoneNumber: string,email:string,username:string,password:string): void {

    const newUser: User = {firstName,lastName,telephoneNumber,email,username,password, role:'string'} as User;
    this.userService
      .addUsers(newUser)
      .subscribe(worker => this.users.push(worker));
  }

  deleteSeat(id: number): void {
    this.userService
      .deleteUser(id)
      .subscribe();
  }

  UpdateSeat(firstName: string,lastName: string,telephoneNumber: string,email:string,username:string,password:string): void {

    const newUser: User = {firstName,lastName,telephoneNumber,email,username,password} as User;
    this.userService
      .UpdateUser(newUser)
      .subscribe(worker => this.users.push(worker));
  }
}
