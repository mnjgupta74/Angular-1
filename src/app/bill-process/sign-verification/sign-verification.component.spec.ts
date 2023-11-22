import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignVerificationComponent } from './sign-verification.component';

describe('SignVerificationComponent', () => {
  let component: SignVerificationComponent;
  let fixture: ComponentFixture<SignVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignVerificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
