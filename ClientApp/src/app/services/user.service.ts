import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { User } from 'models/user';
import { Router } from '@angular/router';
import { Reservation } from 'models/reservation';
import { id } from 'date-fns/locale';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private uri = 'https://localhost:7212/api/';
  private userSubject!: BehaviorSubject<User | null>;
  public user!: Observable<User | null>;
  public isAuthenticated!: boolean;
  

  constructor(private http: HttpClient, private router: Router) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
    this.isAuthenticated = false;
    console.log(this.user)
  }

  public get userValue() {
    return this.userSubject.value;
}

resetPassword(newPassword: string, token: string) {
  const body = { newPassword, token };
  return this.http.post(`${this.uri}User/ResetPassword`, body);
}

forgotPassword(email: string): Observable<void> {
  const headers = new HttpHeaders().set('Content-Type', 'application/json');
  const body = JSON.stringify({ email });

  return this.http.post<void>(this.uri + 'User/ForgotPassword', body, {headers});
}

  register(user: User){
    return this.http.post<User>(this.uri + 'User/Registration', user);
  }

  login(username: string, password: string) {
    return this.http.post<User>(`${this.uri}User/Login`, { username, password })
        .pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify({ username: username}));
            this.userSubject.next(user);
            this.isAuthenticated = true;
            return user;
        }));
}

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.isAuthenticated = false;
    this.router.navigate(['/']);
}

  getUsersById() {
    return this.http.get<any>(this.uri+'User/GetAllUserIds');
  }

  addUsers(User: User) {
    return this.http.post<User>(this.uri + 'User/AddUsers',User,{withCredentials:true})
         
  }

  UpdateUser(User: User) {
    return this.http.post<User>(this.uri + 'UpdateUser?UserName=', User)
         
  }

  deleteUser(id: number){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    }
    const url = this.uri + 'User/DeleteUser?id=';

    return this.http.delete(url + id, httpOptions)
  }

  getUserReservations(userId: number): Observable<Reservation[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    }

    return this.http.get<Reservation[]>(`${this.uri}Reservation/GetReservationsByUserId/${userId}`, httpOptions);
  }
  
  // Delete a reservation
  deleteReservation(reservationId: number): Observable<void> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    }

    return this.http.delete<void>(this.uri + 'Reservation?Id='+ reservationId, httpOptions);
  }
}

