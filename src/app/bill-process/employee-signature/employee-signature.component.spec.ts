import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSignatureComponent } from './employee-signature.component';

describe('EmployeeSignatureComponent', () => {
  let component: EmployeeSignatureComponent;
  let fixture: ComponentFixture<EmployeeSignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeSignatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
