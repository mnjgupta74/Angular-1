import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchApprovalComponent } from './batch-approval.component';

describe('BatchApprovalComponent', () => {
  let component: BatchApprovalComponent;
  let fixture: ComponentFixture<BatchApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
