import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithoutDivisionCodeChallanReportComponent } from './without-division-code-challan-report.component';

describe('WithoutDivisionCodeChallanReportComponent', () => {
  let component: WithoutDivisionCodeChallanReportComponent;
  let fixture: ComponentFixture<WithoutDivisionCodeChallanReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithoutDivisionCodeChallanReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithoutDivisionCodeChallanReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
