import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayCloseComponent } from './day-close.component';

describe('DayCloseComponent', () => {
  let component: DayCloseComponent;
  let fixture: ComponentFixture<DayCloseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayCloseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DayCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
