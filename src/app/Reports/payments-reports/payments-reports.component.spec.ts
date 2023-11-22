import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsReportsComponent } from './payments-reports.component';

describe('PaymentsReportsComponent', () => {
  let component: PaymentsReportsComponent;
  let fixture: ComponentFixture<PaymentsReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentsReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
