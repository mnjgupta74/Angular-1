import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTokenReportComponent } from './new-token-report.component';

describe('NewTokenReportComponent', () => {
  let component: NewTokenReportComponent;
  let fixture: ComponentFixture<NewTokenReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewTokenReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTokenReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
