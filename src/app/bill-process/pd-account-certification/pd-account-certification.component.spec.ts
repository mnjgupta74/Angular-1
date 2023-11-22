import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdAccountCertificationComponent } from './pd-account-certification.component';

describe('PdAccountCertificationComponent', () => {
  let component: PdAccountCertificationComponent;
  let fixture: ComponentFixture<PdAccountCertificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdAccountCertificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdAccountCertificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
