import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ECeilingReportComponent } from './e-ceiling-report.component';

describe('ECeilingReportComponent', () => {
  let component: ECeilingReportComponent;
  let fixture: ComponentFixture<ECeilingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ECeilingReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ECeilingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
