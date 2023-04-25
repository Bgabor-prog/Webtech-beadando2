import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeskCalendarComponent } from './desk-calendar.component';

describe('DeskCalendarComponent', () => {
  let component: DeskCalendarComponent;
  let fixture: ComponentFixture<DeskCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeskCalendarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeskCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
