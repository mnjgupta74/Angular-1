import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillStatusComponent } from './bill-status.component';

describe('BillStatusComponent', () => {
  let component: BillStatusComponent;
  let fixture: ComponentFixture<BillStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
