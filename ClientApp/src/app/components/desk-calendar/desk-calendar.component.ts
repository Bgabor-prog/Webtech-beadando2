import { Component, OnInit } from '@angular/core';
import { DeskService } from 'src/app/services/desk.service';
import { CalendarEvent } from 'angular-calendar';

@Component({
  selector: 'desk-calendar',
  templateUrl: './desk-calendar.component.html',
  styleUrls: ['./desk-calendar.component.css'],
})

export class DeskCalendarComponent implements OnInit {
  desks: String[] = [];
  viewDate: Date = new Date();
  view: 'week' | 'month' = 'week';
  events: CalendarEvent[] = [];
  currentMonth!: string;

  constructor(private deskService: DeskService) {}

  ngOnInit(): void {
    this.getDesks();
    console.log(this.desks);
    this.updateCurrentMonth();
  }

  getDesks() {
    this.deskService.getDesks().subscribe((data) => {
      this.desks = [];
      for (let i = 0; i < data.length; i++) {
        this.desks.push("Desk-" + data[i]);
      }
    });
  }

  onMonthChange(selectedMonth: Date): void {
    if (selectedMonth) {
      this.viewDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
    }
  }

  setView(view: 'week' | 'month'): void {
    this.view = view;
  }

  nextMonth() {
    const newDate = new Date(this.viewDate);
    newDate.setMonth(newDate.getMonth() + 1);
    this.viewDate = newDate;
    this.updateCurrentMonth();
  }

  previousMonth() {
    const newDate = new Date(this.viewDate);
    newDate.setMonth(newDate.getMonth() - 1);
    this.viewDate = newDate;
    this.updateCurrentMonth();
  }

  updateCurrentMonth() {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    this.currentMonth = `${monthNames[this.viewDate.getMonth()]} ${this.viewDate.getFullYear()}`;
  }
}