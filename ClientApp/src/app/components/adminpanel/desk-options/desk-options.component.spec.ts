import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeskOptionsComponent } from './desk-options.component';

describe('DeskOptionsComponent', () => {
  let component: DeskOptionsComponent;
  let fixture: ComponentFixture<DeskOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeskOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeskOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
