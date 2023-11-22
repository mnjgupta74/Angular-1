import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdAccountClosingStatusComponent } from './pd-account-closing-status.component';

describe('PdAccountClosingStatusComponent', () => {
  let component: PdAccountClosingStatusComponent;
  let fixture: ComponentFixture<PdAccountClosingStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdAccountClosingStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdAccountClosingStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
