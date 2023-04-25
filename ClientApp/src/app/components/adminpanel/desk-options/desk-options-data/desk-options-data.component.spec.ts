import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeskOptionsDataComponent } from './desk-options-data.component';

describe('DeskOptionsDataComponent', () => {
  let component: DeskOptionsDataComponent;
  let fixture: ComponentFixture<DeskOptionsDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeskOptionsDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeskOptionsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
