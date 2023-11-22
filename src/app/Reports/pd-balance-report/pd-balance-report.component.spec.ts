import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdBalanceReportComponent } from './pd-balance-report.component';

describe('PdBalanceReportComponent', () => {
  let component: PdBalanceReportComponent;
  let fixture: ComponentFixture<PdBalanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdBalanceReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdBalanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
