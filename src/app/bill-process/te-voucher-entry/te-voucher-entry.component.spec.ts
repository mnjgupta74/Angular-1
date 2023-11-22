import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeVoucherEntryComponent } from './te-voucher-entry.component';

describe('TeVoucherEntryComponent', () => {
  let component: TeVoucherEntryComponent;
  let fixture: ComponentFixture<TeVoucherEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeVoucherEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeVoucherEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
