import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherDateUpdationComponent } from './voucher-date-updation.component';

describe('VoucherDateUpdationComponent', () => {
  let component: VoucherDateUpdationComponent;
  let fixture: ComponentFixture<VoucherDateUpdationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherDateUpdationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherDateUpdationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
