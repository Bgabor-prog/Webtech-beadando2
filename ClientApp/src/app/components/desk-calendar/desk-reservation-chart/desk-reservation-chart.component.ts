import { Component, ElementRef, AfterViewInit, OnDestroy, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { gantt } from 'dhtmlx-gantt';
import { forkJoin } from 'rxjs';
import { DeskService } from 'src/app/services/desk.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'desk-reservation-chart',
  templateUrl: './desk-reservation-chart.component.html',
  styleUrls: ['./desk-reservation-chart.component.css'],
})
export class DeskReservationChartComponent {

  @ViewChild('gantt_here', { static: true }) ganttContainer!: ElementRef;

  private debouncedRowHeight!: Function;
  private debouncedColumnWidth!: Function;
  private handleResize!: () => void;

  numberOfDesks: number = 0;
  loading: boolean = true;

  currentView: 'day' | 'week' | 'month' = 'week';

  ngOnInit() {
    gantt.config.xml_date = "%Y-%m-%d %H:%i";

    gantt.config.min_column_width = 60;
    gantt.config.scale_height = 50;
    gantt.config.show_tasks_outside_timescale = true;
    

    gantt.config.columns = [
      { name: "text", label: "Desks", tree: true, width: "*", resize: true },
      { name: "start_date", label: "Start time", align: "center", width: "*", resize: true, },
      { name: "end_date", label: "End time", align: "center", width: "*", resize: true },
    ];

    // Highlight weekend
    gantt.templates.timeline_cell_class = (task, date) => {
      if (date.getDay() === 0 || date.getDay() === 6) {
        return 'weekend-highlight';
      }
      return '';
    };

    function isCurrentDate(date: { getDate: () => number; getMonth: () => number; getFullYear: () => number; }) {
      const currentDate = new Date();
      return date.getDate() === currentDate.getDate() &&
        date.getMonth() === currentDate.getMonth() &&
        date.getFullYear() === currentDate.getFullYear();
    }

    gantt.templates.timeline_cell_class = (task, date) => {
      if (isCurrentDate(date)) {
        return 'current-date-highlight';
      }
      return '';
    };

    // Highlight current date in the grid area
    gantt.templates.grid_row_class = (start, end, task) => {
      if (isCurrentDate(start) || isCurrentDate(end)) {
        return 'current-date-highlight';
      }
      return '';
    };

    gantt.attachEvent("onGanttReady", function () {
      const spinnerContainer = document.querySelector(".gantt-spinner-container");
      if (spinnerContainer) {
        spinnerContainer.remove();
      }
    });

    this.loading = true;
    this.loadData();
    gantt.init("gantt_here");
    gantt.config.duration_unit = 'day';
    gantt.config.duration_step = 1;

    this.disableInteractionsForUsers();
    setTimeout(() => {
      this.setWeekView();
      setTimeout(() => {
        this.setGanttRowHeight();
        this.setGanttColumnWidth();
      }, 0);
      this.loading = false;
    }, 1000);
    
    this.onWindowResize();

  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.handleResize);
  }

  constructor(private reservationService: ReservationService) { }

  private disableInteractionsForUsers() {
    gantt.config.readonly = true;
    gantt.config.drag_links = false;
    gantt.config.drag_progress = false;
    gantt.config.drag_resize = false;
    gantt.config.drag_move = false;
    gantt.config.drag_project = false;
  }

  private setGanttColumnWidth(): void {
    const ganttContainer = document.getElementById("gantt_here");
    if (!ganttContainer) {
      console.error('Gantt container not found');
      return;
    }
    const parentContainer = ganttContainer.parentElement;
    if (!parentContainer) {
      console.error('Parent container not found');
      return;
    }

    const parentContainerWidth = parentContainer.clientWidth;

    // Set the Gantt container's width to match the parent container's width
    ganttContainer.style.width = parentContainerWidth + 'px';
    gantt.render();
  }

  private setGanttRowHeight(): void {
    const ganttContainer = document.getElementById("gantt_here");
    if (!ganttContainer) {
      console.error('Gantt container not found');
      return;
    }
    const parentContainer = ganttContainer.parentElement;
    if (!parentContainer) {
      console.error('Parent container not found');
      return;
    }

    const ganttContainerHeight = ganttContainer.clientHeight;
    const parentContainerHeight = parentContainer.clientHeight;

    const heightDifference = parentContainerHeight - ganttContainerHeight;

    const availableHeight = parentContainerHeight - heightDifference - 30;
    const headerHeight = gantt.config.scale_height;
    const totalTaskHeight = availableHeight - headerHeight;

    // Calculate the number of visible rows
    const visibleRows = gantt.getVisibleTaskCount();

    gantt.config.row_height = totalTaskHeight / visibleRows;
    gantt.render();
  }

  private onWindowResize(): void {
    this.debouncedRowHeight = this.debounce(this.setGanttRowHeight.bind(this), 250);
    this.debouncedColumnWidth = this.debounce(this.setGanttColumnWidth.bind(this), 250);

    const handleResize = () => {
      this.debouncedRowHeight();
      this.debouncedColumnWidth();
    };

    window.addEventListener('resize', handleResize);
    this.handleResize = handleResize; // Store the handleResize function for later use
  }

  private debounce(func: Function, wait: number): Function {
    let timeout: any;
    return (...args: any[]) => {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }
  addOneDay(date: Date): Date {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + 1);
    return newDate;
  }

  loadData(): void {
    this.reservationService.getDeskIds().subscribe((deskIds) => {
      const tasks: {
        id: string;
        parent?: string;
        text: string;
        start_date?: string | null;
        end_date?: string | null;
      }[] = [];
  
      deskIds.forEach((deskId) => {
        tasks.push({
          id: `parent_${deskId}_group`,
          text: `Seat ${deskId}`,
          start_date: "3000-01-01",
          end_date: "1900-01-01",
        });
      });
  
      this.reservationService.getReservations().subscribe((reservations) => {
        reservations.forEach((reservation: { deskId: number; dateFrom: string; dateTo: string }) => {
          if (deskIds.includes(reservation.deskId)) {
            const existingTaskIndex = tasks.filter((task) => task.parent === `parent_${reservation.deskId}_group`).length;
            tasks.push({
              id: `seat_${reservation.deskId}_res_${existingTaskIndex + 1}`,
              parent: `parent_${reservation.deskId}_group`,
              text: `Reservation ${existingTaskIndex + 1}`,
              start_date: this.formatDate(reservation.dateFrom),
              end_date: this.formatDate(this.addOneDay(new Date(reservation.dateTo))),
            });
  
            const parentIndex = tasks.findIndex((task) => task.id === `parent_${reservation.deskId}_group`);
            tasks[parentIndex].start_date = this.formatDate(
              new Date(Math.min(new Date(tasks[parentIndex].start_date as string).getTime(), new Date(reservation.dateFrom).getTime()))
            );
            tasks[parentIndex].end_date = this.formatDate(
              new Date(Math.max(new Date(tasks[parentIndex].end_date as string).getTime(), new Date(reservation.dateTo).getTime()))
            );
          }
        });
        
        tasks.forEach((task) => {
          if (task.id.startsWith('parent_') && task.end_date) {
            const endDate = new Date(task.end_date);
            endDate.setDate(endDate.getDate() + 1);
            task.end_date = this.formatDate(endDate);
          }
        });

        this.numberOfDesks = deskIds.length;
  
        gantt.config.order_branch = true;
        gantt.config.order_branch_free = true;
        gantt.config.fit_tasks = true;
        gantt.config.branch_loading = true;
        gantt.config.show_progress = false;
  
        gantt.templates.task_class = function (start, end, task) {
          return task.parent === undefined ? "gantt_parent" : "";
        };
  
        gantt.templates.task_row_class = function (start, end, task) {
          return task.parent === undefined ? "gantt_split" : "";
        };
    
        gantt.parse({ data: tasks });
      });
    });
  }

  formatDate(input: string | Date | undefined): string {
    if (!input) {
      console.log('Undefined input in formatDate:', input);
      return '';
    }
  
    let date: Date;
    if (typeof input === 'string') {
      const [datePart, timePart] = input.split('T');
      const [year, month, day] = datePart.split('-').map(Number);
      date = new Date(year, month - 1, day + 1);
    } else {
      date = input;
    }
  
    const formattedDate = date.toISOString().substring(0, 10);
  
    console.log('Formatted date:', formattedDate);
    return formattedDate;
  }

  setDayView(): void {

    this.currentView = 'day';

    const currentDate = new Date();
    const startTime = 6; // 6 AM
    const endTime = 19; // 6 PM

    gantt.config.start_date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), startTime);
    gantt.config.end_date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), endTime);

    gantt.config.scale_unit = "day";

    gantt.config.scale_height = 60; // Increase the scale height to accommodate two rows
    gantt.config.subscales = [
      {
        unit: "hour",
        step: 1,
        format: "%H:%i",

      },
    ];

    gantt.templates.date_scale = (date: Date) => {
      const dayName = gantt.date.date_to_str("%l")(date);
      return `${dayName}, ${gantt.date.date_to_str("%F %d")(date)}`;
    };


    gantt.render();
  }

  setWeekView(): void {
    this.currentView = 'week';
    gantt.templates.date_scale = null;

    const currentDate = new Date();
    const weekStartDate = gantt.date.week_start(currentDate);
    const weekEndDate = gantt.date.add(weekStartDate, 6, "day");

    const weekScaleTemplate = function () {
      const dateToStr = gantt.date.date_to_str("%d %M");
      return dateToStr(weekStartDate) + " - " + dateToStr(weekEndDate);
    };

    gantt.config.scale_unit = "day";
    gantt.config.subscales = [
      { unit: "month", step: 1, format: "%F, %Y" },
      { unit: "week", step: 1, format: weekScaleTemplate },
      { unit: "day", step: 1, date: "%D" },
    ];

    gantt.config.start_date = weekStartDate;
    gantt.config.end_date = gantt.date.add(weekStartDate, 1, "week");
    gantt.render();
  }

  setMonthView(): void {
    this.currentView = 'month';
    gantt.templates.date_scale = null;

    const currentDate = new Date();
    const monthStartDate = gantt.date.month_start(currentDate);
    const monthEndDate = gantt.date.add(monthStartDate, 1, "month");

    gantt.config.start_date = monthStartDate;
    gantt.config.end_date = monthEndDate;

    // Set up the time range in the scale
    gantt.config.scale_unit = "day";
    gantt.config.scale_height = 50; // Reset scale height
    gantt.config.subscales = [
      { unit: "month", step: 1, format: "%F, %Y" },
      { unit: "day", step: 1, date: "%D" },
    ];

    gantt.render();
  }

  previousDay(): void {
    const currentDate = gantt.config.start_date!;
    const previousDate = gantt.date.add(currentDate, -1, "day");
    this.setDayViewForDate(previousDate);
  }

  nextDay(): void {
    const currentDate = gantt.config.start_date!;
    const nextDate = gantt.date.add(currentDate, 1, "day");
    this.setDayViewForDate(nextDate);
  }

  nextWeek(): void {
    const currentDate = gantt.config.start_date!;
    const nextWeekDate = gantt.date.add(currentDate, 1, "week");
    this.setWeekViewForDate(nextWeekDate);
  }

  previousWeek(): void {
    const currentDate = gantt.config.start_date!;
    const previousWeekDate = gantt.date.add(currentDate, -1, "week");
    this.setWeekViewForDate(previousWeekDate);
  }

  nextMonth(): void {
    const currentDate = gantt.config.start_date!;
    const nextMonthDate = gantt.date.add(currentDate, 1, "month");
    this.setMonthViewForDate(nextMonthDate);
  }

  previousMonth(): void {
    const currentDate = gantt.config.start_date!;
    const previousMonthDate = gantt.date.add(currentDate, -1, "month");
    this.setMonthViewForDate(previousMonthDate);
  }

  setDayViewForDate(date: Date): void {
    const startTime = 6; // 6 AM
    const endTime = 19; // 6 PM

    gantt.config.start_date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), startTime);
    gantt.config.end_date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), endTime);

    gantt.config.scale_unit = "day";

    gantt.config.scale_height = 60; // Increase the scale height to accommodate two rows
    gantt.config.subscales = [
      {
        unit: "hour",
        step: 1,
        format: "%H:%i",

      },
    ];

    gantt.templates.date_scale = (date: Date) => {
      const dayName = gantt.date.date_to_str("%l")(date);
      return `${dayName}, ${gantt.date.date_to_str("%F %d")(date)}`;
    };


    gantt.render();
  }

  setWeekViewForDate(date: Date): void {
    const weekStartDate = gantt.date.week_start(date);
    const weekEndDate = gantt.date.add(weekStartDate, 6, "day");

    const weekScaleTemplate = function () {
      const dateToStr = gantt.date.date_to_str("%d %M");
      return dateToStr(weekStartDate) + " - " + dateToStr(weekEndDate);
    };

    gantt.config.scale_unit = "day";
    gantt.config.subscales = [
      { unit: "month", step: 1, format: "%F, %Y" },
      { unit: "week", step: 1, format: weekScaleTemplate },
      { unit: "day", step: 1, date: "%D" },
    ];

    gantt.config.start_date = weekStartDate;
    gantt.config.end_date = gantt.date.add(weekStartDate, 1, "week");
    gantt.render();
  }

  setMonthViewForDate(date: Date): void {
    gantt.config.start_date = gantt.date.month_start(date);
    gantt.config.end_date = gantt.date.add(gantt.config.start_date, 1, "month");
    gantt.render();
  }
}