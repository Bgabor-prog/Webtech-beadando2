import { Component, OnInit } from '@angular/core';
import { DeskService } from 'src/app/services/desk.service';
import { Desk } from 'models/desk';

@Component({
  selector: 'desk-options-data',
  templateUrl: './desk-options-data.component.html',
  styleUrls: ['./desk-options-data.component.css']
})
export class DeskOptionsDataComponent implements OnInit {

  desks: Desk[] = [];
  deskId = 0;
  maxCapacity = 0;
  seatNumber = 0;


  constructor(private deskService: DeskService) {

  }

  ngOnInit(): void {
    
  }


  addSeat(maxCapacity: number, seatNumber: number): void {

    const newDesk: Desk = { maxCapacity, seatNumber } as unknown as Desk;
    this.deskService
      .addDesk(newDesk)
      .subscribe(desk => this.desks.push(desk));
  }

  deleteSeat(id: number): void {
    this.deskService
      .deleteDesk(id)
      .subscribe();
  }

  UpdateSeat(maxCapacity: number, seatNumber: number): void {

    const newDesk: Desk = { maxCapacity, seatNumber} as Desk;
    this.deskService
      .UpdateDesk(newDesk)
      .subscribe(desk => this.desks.push(desk));
  }

}
