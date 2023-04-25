import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../services/Room.service';

@Component({
  selector: 'example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent implements OnInit {

  kulu: string = 'yaku'

  constructor(public teszt: RoomService)
  {
    
  }

  ngOnInit(): void
  {
   
  }

  

}
