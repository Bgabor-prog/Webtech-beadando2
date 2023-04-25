import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseOptionsComponent } from './database-options.component';

describe('DatabaseOptionsComponent', () => {
  let component: DatabaseOptionsComponent;
  let fixture: ComponentFixture<DatabaseOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatabaseOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
