import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineTokenEntryComponent } from './online-token-entry.component';

describe('OnlineTokenEntryComponent', () => {
  let component: OnlineTokenEntryComponent;
  let fixture: ComponentFixture<OnlineTokenEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineTokenEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineTokenEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
