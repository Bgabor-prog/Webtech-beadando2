import { Component, OnInit } from '@angular/core';
import { Reservation } from 'models/reservation';
import { ReservationService } from 'src/app/services/reservation.service';

@Component({
  selector: 'reservation-options-data',
  templateUrl: './reservation-options-data.component.html',
  styleUrls: ['./reservation-options-data.component.css']
})
export class ReservationOptionsDataComponent implements OnInit {

  reservations: Reservation[] = [];

  ReservationId = 0;

  //Foreign key variable
  assignedToDesk = 0;
  assignedToUser = 0;

  constructor(private reservationService: ReservationService) { }

  ngOnInit(): void {
  }

  addReservation(assignedToDesk: number,assignedToUser:number): void {

    const newReservation: Reservation = {} as Reservation;
    this.reservationService
      .addReservation(newReservation,assignedToDesk,assignedToUser)
      .subscribe(Reservation => this.reservations.push(Reservation));
  }

  deleteReservation(id: number): void {
    this.reservationService
      .deleteReservation(id)
      .subscribe();
  }

  UpdateReservation(): void {

    const newReservation: Reservation = {} as Reservation;
    this.reservationService
      .UpdateReservation(newReservation)
      .subscribe(Reservation => this.reservations.push(Reservation));
  }

}
