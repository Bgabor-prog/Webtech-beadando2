import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeskReservationChartComponent } from './desk-reservation-chart.component';

describe('DeskReservationChartComponent', () => {
  let component: DeskReservationChartComponent;
  let fixture: ComponentFixture<DeskReservationChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeskReservationChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeskReservationChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
