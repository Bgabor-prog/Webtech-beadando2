import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOptionsDataComponent } from './user-options-data.component';

describe('UserOptionsDataComponent', () => {
  let component: UserOptionsDataComponent;
  let fixture: ComponentFixture<UserOptionsDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserOptionsDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOptionsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
