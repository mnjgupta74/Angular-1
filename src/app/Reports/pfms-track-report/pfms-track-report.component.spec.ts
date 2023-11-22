import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PfmsTrackReportComponent } from './pfms-track-report.component';

describe('PfmsTrackReportComponent', () => {
  let component: PfmsTrackReportComponent;
  let fixture: ComponentFixture<PfmsTrackReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PfmsTrackReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PfmsTrackReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
