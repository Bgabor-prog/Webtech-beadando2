import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'desk-options',
  templateUrl: './desk-options.component.html',
  styleUrls: ['./desk-options.component.css']
})
export class DeskOptionsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  load_AddDesk() {
    
    document.getElementById('desk_datablock1')!.style.display = 'block';
    document.getElementById('desk_datablock2')!.style.display = 'block';

    document.getElementById('desk_datablock3')!.style.display = 'none';

    document.getElementById('desk_datablock4')!.style.display = 'none';
    document.getElementById('desk_datablock5')!.style.display = 'none';

   
  }

  load_DeleteDesk() {
    
    document.getElementById('desk_datablock1')!.style.display = 'none';
    document.getElementById('desk_datablock2')!.style.display = 'none';

    document.getElementById('desk_datablock3')!.style.display = 'block';

    document.getElementById('desk_datablock4')!.style.display = 'none';
    document.getElementById('desk_datablock5')!.style.display = 'none';

    
  }

  load_UpdateDesk() {
    
    document.getElementById('desk_datablock4')!.style.display = 'block';
    document.getElementById('desk_datablock5')!.style.display = 'block';

    document.getElementById('desk_datablock1')!.style.display = 'none';
    document.getElementById('desk_datablock2')!.style.display = 'none';

    document.getElementById('desk_datablock3')!.style.display = 'none';

    
  }
}
