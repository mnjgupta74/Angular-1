import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentscrollComponent } from './paymentscroll.component';

describe('PaymentscrollComponent', () => {
  let component: PaymentscrollComponent;
  let fixture: ComponentFixture<PaymentscrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentscrollComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentscrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
