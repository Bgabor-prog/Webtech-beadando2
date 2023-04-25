import { Component, OnInit } from '@angular/core';
import { Reservation } from 'models/reservation';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';




@Component({
  selector: 'myreservations',
  templateUrl: './myreservations.component.html',
  styleUrls: ['./myreservations.component.css']
})
export class MyreservationsComponent implements OnInit {
  activeReservations: Reservation[] = [];
  expiredReservations: Reservation[] = [];
  showExpiredReservations = false;

 
  constructor(private userService: UserService, private snackBar: MatSnackBar) { }

  toggleExpiredReservations() {
    this.showExpiredReservations = !this.showExpiredReservations;
  }

  ngOnInit(){
    const userId = this.userService.userValue?.id;
    if (userId) {
      this.userService.getUserReservations(userId).subscribe(reservations => {
        const currentDate = new Date();
        reservations.forEach(reservation => {
          if (new Date(reservation.dateTo) < currentDate) {
            this.expiredReservations.push(reservation);
          } else {
            this.activeReservations.push(reservation);
          }
        });
      });
    }
  }
 

  deleteReservation(reservationId: number): void {
    // Show a confirmation dialog using window.confirm()
    const confirmation = window.confirm('Are you sure you want to delete this reservation?');
  
    if (confirmation) {
      this.userService.deleteReservation(reservationId).subscribe(() => {
        // Remove reservation from the activeReservations or expiredReservations list
        this.activeReservations = this.activeReservations.filter(r => r.id !== reservationId);
        this.expiredReservations = this.expiredReservations.filter(r => r.id !== reservationId);
  
        // Show a success message
        this.snackBar.open('Reservation deleted successfully', 'Close', {
          duration: 3000,
        });
      });
    }
  }

}
