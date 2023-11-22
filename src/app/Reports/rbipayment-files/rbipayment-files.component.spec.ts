import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RBIPaymentFilesComponent } from './rbipayment-files.component';

describe('RBIPaymentFilesComponent', () => {
  let component: RBIPaymentFilesComponent;
  let fixture: ComponentFixture<RBIPaymentFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RBIPaymentFilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RBIPaymentFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
