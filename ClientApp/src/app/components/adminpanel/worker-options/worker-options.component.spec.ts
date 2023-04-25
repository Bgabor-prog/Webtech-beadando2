import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerOptionsComponent } from './worker-options.component';

describe('WorkerOptionsComponent', () => {
  let component: WorkerOptionsComponent;
  let fixture: ComponentFixture<WorkerOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkerOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkerOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
