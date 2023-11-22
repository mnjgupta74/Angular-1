import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PfmsDnFileReportComponent } from './pfms-dn-file-report.component';

describe('PfmsDnFileReportComponent', () => {
  let component: PfmsDnFileReportComponent;
  let fixture: ComponentFixture<PfmsDnFileReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PfmsDnFileReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PfmsDnFileReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
