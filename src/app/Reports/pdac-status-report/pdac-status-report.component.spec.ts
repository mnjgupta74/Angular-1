import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PDAcStatusReportComponent } from './pdac-status-report.component';

describe('PDAcStatusReportComponent', () => {
  let component: PDAcStatusReportComponent;
  let fixture: ComponentFixture<PDAcStatusReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PDAcStatusReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PDAcStatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
