import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasuryLoginComponent } from './treasury-login.component';

describe('TreasuryLoginComponent', () => {
  let component: TreasuryLoginComponent;
  let fixture: ComponentFixture<TreasuryLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreasuryLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasuryLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
