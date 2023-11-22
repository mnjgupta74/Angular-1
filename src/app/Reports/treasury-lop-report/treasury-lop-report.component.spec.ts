import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasuryLopReportComponent } from './treasury-lop-report.component';

describe('TreasuryLopReportComponent', () => {
  let component: TreasuryLopReportComponent;
  let fixture: ComponentFixture<TreasuryLopReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreasuryLopReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasuryLopReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
