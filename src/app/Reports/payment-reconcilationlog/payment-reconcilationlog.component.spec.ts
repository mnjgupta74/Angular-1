import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentReconcilationlogComponent } from './payment-reconcilationlog.component';

describe('PaymentReconcilationlogComponent', () => {
  let component: PaymentReconcilationlogComponent;
  let fixture: ComponentFixture<PaymentReconcilationlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentReconcilationlogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentReconcilationlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
