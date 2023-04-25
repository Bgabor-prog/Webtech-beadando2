import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerOptionsDataComponent } from './worker-options-data.component';

describe('WorkerOptionsDataComponent', () => {
  let component: WorkerOptionsDataComponent;
  let fixture: ComponentFixture<WorkerOptionsDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkerOptionsDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkerOptionsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
