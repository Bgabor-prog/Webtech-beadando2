import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Desk } from 'models/desk';

@Injectable({
  providedIn: 'root'
})
export class DeskService {


  uri = 'https://localhost:7212/api/';

  constructor(private http: HttpClient) {

  }

  getDesks() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    }

    return this.http.get<String>(this.uri + 'Desk/GetAllDeskIds', httpOptions);

  }

  addDesk(desk: Desk) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    }
    return this.http.post<Desk>(this.uri + 'Desk/AddDesk', desk, httpOptions)

  }

  UpdateDesk(desk: Desk) {
    return this.http.post<Desk>(this.uri + 'Desk/UpdateDesk', desk)

  }

  deleteDesk(id: number) {

    const url = this.uri + 'Desk?Id=';

    return this.http.delete(url + id)
  }
}
