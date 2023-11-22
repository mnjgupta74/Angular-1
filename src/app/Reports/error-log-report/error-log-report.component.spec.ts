import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorLogReportComponent } from './error-log-report.component';

describe('ErrorLogReportComponent', () => {
  let component: ErrorLogReportComponent;
  let fixture: ComponentFixture<ErrorLogReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorLogReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorLogReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
