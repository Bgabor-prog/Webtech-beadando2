import { BrowserModule } from '@angular/platform-browser';
import { Component, NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarDateFormatter, CalendarModule, CalendarUtils, DateAdapter } from 'angular-calendar';
import { CustomDateFormatter } from './helpers/custom-date-formatter';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { DeskCalendarComponent } from './components/desk-calendar/desk-calendar.component';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { HomeComponent } from './components/home/home.component';
import { DatabaseOptionsComponent } from './components/adminpanel/database-options/database-options.component';
import { ReserveComponent } from './components/reserve/reserve.component';
import { MyreservationsComponent } from './components/myreservations/myreservations.component';
import { ContactComponent } from './components/contact/contact.component';
import { AdminpanelComponent } from './components/adminpanel/adminpanel.component';
import { DeskOptionsComponent } from './components/adminpanel/desk-options/desk-options.component';
import { WorkerOptionsComponent } from './components/adminpanel/worker-options/worker-options.component';
import { ReservationOptionsComponent } from './components/adminpanel/reservation-options/reservation-options.component';
import { UserOptionsComponent } from './components/user-options/user-options.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { SignupPageComponent } from './components/signup-page/signup-page.component';
import { LoginSignupContainerComponent } from './components/login-signup-container/login-signup-container.component';
import { DeskReservationChartComponent } from './components/desk-calendar/desk-reservation-chart/desk-reservation-chart.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/forgot-password/reset-password/reset-password.component';

import { JwtInterceptor } from './helpers/jwt.interceptor';
import { AlertComponent } from './components/alert/alert.component';

import { DeskOptionsDataComponent } from './components/adminpanel/desk-options/desk-options-data/desk-options-data.component';
import { WorkerOptionsDataComponent } from './components/adminpanel/worker-options/worker-options-data/worker-options-data.component';
import { ReservationOptionsDataComponent } from './components/adminpanel/reservation-options/reservation-options-data/reservation-options-data.component';
import { UserOptionsDataComponent } from './components/user-options/user-options-data/user-options-data.component';

import { RoomSVGsComponent } from './components/room-svgs/room-svgs.component';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { AuthGuard } from './helpers/auth.guard';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';





@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,

    AlertComponent,

    DeskOptionsDataComponent,
    WorkerOptionsDataComponent,
    ReservationOptionsDataComponent,
    UserOptionsDataComponent,
    LoginPageComponent,
    SignupPageComponent,
    LoginSignupContainerComponent,
    DatabaseOptionsComponent,
    ReserveComponent,
    MyreservationsComponent,
    ContactComponent,
    AdminpanelComponent,
    DeskOptionsComponent,
    WorkerOptionsComponent,
    ReservationOptionsComponent,
    UserOptionsComponent,
    DeskCalendarComponent,
    DeskReservationChartComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,

    RoomSVGsComponent

  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatDialogModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'database-options', component: DatabaseOptionsComponent },
      { path: 'desk-options', component: DeskOptionsComponent },
      { path: 'worker-options', component: WorkerOptionsComponent },
      { path: 'reservation-options', component: ReservationOptionsComponent },
      { path: 'user-options', component: UserOptionsComponent },

      { path: 'login-page', component: LoginPageComponent },
      { path: 'signup-page', component: SignupPageComponent },
      { path: 'login-signup-container', component: LoginSignupContainerComponent },
      { path: 'reserve', component: ReserveComponent },
      { path: 'myreservations', component: MyreservationsComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'adminpanel', component: AdminpanelComponent },
      { path: 'desk-options-data', component: DeskOptionsDataComponent },
      { path: 'worker-options-data', component: WorkerOptionsDataComponent },
      { path: 'reservation-options-data', component: ReservationOptionsDataComponent },
      { path: 'user-options-data', component: UserOptionsDataComponent },
      { path: 'desk-calendar', component: DeskCalendarComponent},
      { path: 'desk-reservation-chart', component: DeskReservationChartComponent},
      { path: 'forgot-password', component: ForgotPasswordComponent},
      { path: 'reset-password', component: ResetPasswordComponent},

      { path: 'room-svgs', component: RoomSVGsComponent },

    ]),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: CalendarDateFormatter, useClass: CustomDateFormatter },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

