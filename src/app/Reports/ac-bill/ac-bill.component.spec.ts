import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcBillComponent } from './ac-bill.component';

describe('AcBillComponent', () => {
  let component: AcBillComponent;
  let fixture: ComponentFixture<AcBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
