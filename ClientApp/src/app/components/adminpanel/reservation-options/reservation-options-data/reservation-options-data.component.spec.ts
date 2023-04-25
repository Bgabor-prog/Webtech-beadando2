import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationOptionsDataComponent } from './reservation-options-data.component';

describe('ReservationOptionsDataComponent', () => {
  let component: ReservationOptionsDataComponent;
  let fixture: ComponentFixture<ReservationOptionsDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservationOptionsDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationOptionsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
