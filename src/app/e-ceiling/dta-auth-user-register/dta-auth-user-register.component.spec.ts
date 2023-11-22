import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DtaAuthUserRegisterComponent } from './dta-auth-user-register.component';

describe('DtaAuthUserRegisterComponent', () => {
  let component: DtaAuthUserRegisterComponent;
  let fixture: ComponentFixture<DtaAuthUserRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DtaAuthUserRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DtaAuthUserRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
