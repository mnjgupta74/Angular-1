import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeCancelApprovalComponent } from './cheque-cancel-approval.component';

describe('ChequeCancelApprovalComponent', () => {
  let component: ChequeCancelApprovalComponent;
  let fixture: ComponentFixture<ChequeCancelApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChequeCancelApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeCancelApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
