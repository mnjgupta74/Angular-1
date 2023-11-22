import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PfmsReportComponent } from './pfms-report.component';

describe('PfmsReportComponent', () => {
  let component: PfmsReportComponent;
  let fixture: ComponentFixture<PfmsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PfmsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PfmsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
