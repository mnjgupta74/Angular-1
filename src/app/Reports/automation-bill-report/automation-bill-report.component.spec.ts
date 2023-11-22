import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomationBillReportComponent } from './automation-bill-report.component';

describe('AutomationBillReportComponent', () => {
  let component: AutomationBillReportComponent;
  let fixture: ComponentFixture<AutomationBillReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutomationBillReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomationBillReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
