import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasuryOfficerListComponent } from './treasury-officer-list.component';

describe('TreasuryOfficerListComponent', () => {
  let component: TreasuryOfficerListComponent;
  let fixture: ComponentFixture<TreasuryOfficerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreasuryOfficerListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreasuryOfficerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
