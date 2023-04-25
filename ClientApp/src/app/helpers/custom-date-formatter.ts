import { Injectable } from '@angular/core';
import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';

@Injectable()
export class CustomDateFormatter extends CalendarDateFormatter {
  public weekViewHour({ date, locale }: DateFormatterParams): string {
    const hour = date.getHours();
    const formattedHour = hour < 10 ? '0' + hour : hour;
    return `${formattedHour}:00`;
  }
}