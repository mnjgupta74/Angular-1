import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PfmsPaymentlogComponent } from './pfms-paymentlog.component';

describe('PfmsPaymentlogComponent', () => {
  let component: PfmsPaymentlogComponent;
  let fixture: ComponentFixture<PfmsPaymentlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PfmsPaymentlogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PfmsPaymentlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
