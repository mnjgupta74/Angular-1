import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillEncashmentComponent } from './bill-encashment.component';

describe('BillEncashmentComponent', () => {
  let component: BillEncashmentComponent;
  let fixture: ComponentFixture<BillEncashmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillEncashmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillEncashmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
