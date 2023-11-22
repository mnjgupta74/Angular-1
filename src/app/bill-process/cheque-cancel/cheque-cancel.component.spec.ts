import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeCancelComponent } from './cheque-cancel.component';

describe('ChequeCancelComponent', () => {
  let component: ChequeCancelComponent;
  let fixture: ComponentFixture<ChequeCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChequeCancelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChequeCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
