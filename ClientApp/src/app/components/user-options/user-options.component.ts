import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'user-options',
  templateUrl: './user-options.component.html',
  styleUrls: ['./user-options.component.css']
})
export class UserOptionsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  load_AddUser() {
    document.getElementById('user_datablock1')!.style.display = 'block';
    document.getElementById('user_datablock2')!.style.display = 'block';

    document.getElementById('user_datablock3')!.style.display = 'none';

    document.getElementById('user_datablock4')!.style.display = 'none';
    document.getElementById('user_datablock5')!.style.display = 'none';

  }

  load_DeleteUser() {
    document.getElementById('user_datablock1')!.style.display = 'none';
    document.getElementById('user_datablock2')!.style.display = 'none';

    document.getElementById('user_datablock3')!.style.display = 'block';

    document.getElementById('user_datablock4')!.style.display = 'none';
    document.getElementById('user_datablock5')!.style.display = 'none';
  
  }

  load_UpdateUser() {
    document.getElementById('user_datablock4')!.style.display = 'block';
    document.getElementById('user_datablock5')!.style.display = 'block';

    document.getElementById('user_datablock1')!.style.display = 'none';
    document.getElementById('user_datablock2')!.style.display = 'none';

    document.getElementById('user_datablock3')!.style.display = 'none';
   
  }
}
