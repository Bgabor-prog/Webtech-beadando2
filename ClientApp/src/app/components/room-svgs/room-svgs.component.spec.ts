import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomSVGsComponent } from './room-svgs.component';

describe('RoomSVGsComponent', () => {
  let component: RoomSVGsComponent;
  let fixture: ComponentFixture<RoomSVGsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomSVGsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomSVGsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
