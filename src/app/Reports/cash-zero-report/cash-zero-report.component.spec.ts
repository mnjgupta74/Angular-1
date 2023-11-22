import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashZeroReportComponent } from './cash-zero-report.component';

describe('CashZeroReportComponent', () => {
  let component: CashZeroReportComponent;
  let fixture: ComponentFixture<CashZeroReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashZeroReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashZeroReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
