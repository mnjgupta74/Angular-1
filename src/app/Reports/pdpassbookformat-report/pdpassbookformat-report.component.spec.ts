import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdpassbookformatReportComponent } from './pdpassbookformat-report.component';

describe('PdpassbookformatReportComponent', () => {
  let component: PdpassbookformatReportComponent;
  let fixture: ComponentFixture<PdpassbookformatReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdpassbookformatReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdpassbookformatReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
