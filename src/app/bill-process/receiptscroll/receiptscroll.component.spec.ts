import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptscrollComponent } from './receiptscroll.component';

describe('ReceiptscrollComponent', () => {
  let component: ReceiptscrollComponent;
  let fixture: ComponentFixture<ReceiptscrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiptscrollComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptscrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
