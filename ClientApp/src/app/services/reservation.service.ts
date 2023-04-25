import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Reservation } from 'models/reservation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  public deskIds: string[] = [];
  uri = 'https://localhost:7212/api/';

  constructor(private http: HttpClient) {

  }

  getDeskIdsByDate(dateFrom: string, dateTo: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }),
      params: new HttpParams()
        .set('startDate', dateFrom)
        .set('endDate', dateTo)
    };
  
    return this.http.get<number[]>(this.uri + 'Reservation/GetReservedDeskIds?', httpOptions);
  }

  getDeskIds(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    }

      return this.http.get<number[]>(this.uri + 'Desk/GetAllDeskIds', httpOptions);
}


  getReservations() {
    return this.http.get<any>(this.uri + 'Reservation/GetReservations');
  }

  addReservation(reservation: Reservation, AssignedToDesk: number, AssignedToUser: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    }
    return this.http.post<Reservation>(this.uri + 'Reservation/AddReservation?UserId=' + AssignedToUser + '&DeskId=' + AssignedToDesk, reservation,httpOptions)

  }

  UpdateReservation(reservation: Reservation) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    }
    return this.http.post<Reservation>(this.uri + 'Reservation/UpdateReservation', reservation, httpOptions)

  }

  deleteReservation(id: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    }
    const url = this.uri + 'Reservation?Id=';

    return this.http.delete(url + id, httpOptions)
  }
}
