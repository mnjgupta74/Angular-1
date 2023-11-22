import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PDMasterReportComponent } from './pdmaster-report.component';

describe('PDMasterReportComponent', () => {
  let component: PDMasterReportComponent;
  let fixture: ComponentFixture<PDMasterReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PDMasterReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PDMasterReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
