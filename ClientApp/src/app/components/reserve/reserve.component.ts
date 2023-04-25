import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, ElementRef, Input, Output, EventEmitter, } from '@angular/core';
import { Reservation } from 'models/reservation';
import { ReservationService } from 'src/app/services/reservation.service';
import { RoomSVGsComponent } from '../room-svgs/room-svgs.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DeskReservationChartComponent } from '../desk-calendar/desk-reservation-chart/desk-reservation-chart.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/services/alert.service';
import { catchError, delay, retryWhen, take } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'reserve',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.css'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        overflow: 'hidden',
        height: '96vh',
      })),
      state('out', style({
        opacity: '1',
        overflow: 'hidden',
        height: '500px',
        width: '0px',
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),

    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms', style({ opacity: 0 }))]),
    ]),
  ]
})

export class ReserveComponent implements OnInit {
  @ViewChild(RoomSVGsComponent, { static: false }) svgComponent!: RoomSVGsComponent;
  selectedDeskId = '';

  desks!: any[];
  //reservation array/properties to save the res into the database
  reservations: Reservation[] = [];
  assignedToDesk = 0;
  assignedToUser: number = 0;

  dateFrom: Date = new Date();
  dateTo: Date = new Date();

  toggleCalendar!: string;
  showCalendar = false;
  otherContentClass = '';

  success = false;
  error = false;
  showAlert = false;
  alertTimeout: any;

  constructor(private reservationService: ReservationService, private userService: UserService, private snackBar: MatSnackBar, public dialog: MatDialog, private alertService: AlertService) {
  }


  ngOnInit() {
    this.toggleCalendar = 'out';
    this.setAssignedToUser();
  }

  openGanttChart(): void {
    this.dialog.open(DeskReservationChartComponent, {
      width: '100%',
      height: '80%',
      panelClass: 'dialog-container'
    });
  }

  setAssignedToUser(): void {
    const currentUser = this.userService.userValue;
    if (currentUser) {
      this.assignedToUser = currentUser.id;
    }
  }

  showAlertMessage() {
    clearTimeout(this.alertTimeout);
    this.showAlert = true;
    this.alertTimeout = setTimeout(() => {
      this.showAlert = false;
    }, 3000); // Change this value to set the duration for the alert message.
  }

  toggleCalendarView(): void {
    this.toggleCalendar = this.toggleCalendar === 'out' ? 'in' : 'out';
  }

  addReservation(assignedToUser: number): void {
    this.assignedToDesk = Number(this.selectedDeskId);

    const newReservation: Reservation = {
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
    } as Reservation;

    this.reservationService.addReservation(newReservation, this.assignedToDesk, assignedToUser)
      .pipe(
        retryWhen(errors => errors.pipe(
          // Retry up to 3 times
          take(3),
          // Wait for 1 second before retrying
          delay(1000),
          // Show an error message and throw an error to stop retries
          catchError(error => {
            this.snackBar.open('Failed to reserve the desk. Please try again later.', 'OK', { duration: 5000 });
            return throwError(error);
          })
        ))
      )
      .subscribe({
        next: (reservation) => {
          this.reservations.push(reservation);
          this.showAlertMessage();
          this.success = true;
        },
        error: (error) => {
          this.alertService.error(error);
          this.error = true;
          this.showAlertMessage();
        }
      });
  }

  onDeskClick(deskId: string) {
    this.selectedDeskId = deskId;
  }

  onDateChange() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const selectedStartDate = this.dateFrom;
    const selectedEndDate = this.dateTo;

    // Check if start date is before the current date
    if (selectedStartDate < currentDate) {
      this.dateFrom = currentDate;
      this.snackBar.open('Start date cannot be before the current date.', 'OK', { duration: 5000 });
    }

    // Check if end date is before the start date
    if (selectedStartDate && selectedEndDate && selectedEndDate < selectedStartDate) {
      this.dateTo = selectedStartDate;
      this.snackBar.open('End date cannot be before the start date.', 'OK', { duration: 5000 });
    }

    // Get the reserved desk IDs if both dates are selected and valid
    if (this.dateFrom && this.dateTo) {
      const startDate = this.dateFrom.toISOString().split('T')[0];
      const endDate = this.dateTo.toISOString().split('T')[0];
      this.svgComponent.getReservedDeskIds(startDate, endDate);
    }
  }
}
