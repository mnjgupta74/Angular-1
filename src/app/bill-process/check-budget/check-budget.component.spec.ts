import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckBudgetComponent } from './check-budget.component';

describe('CheckBudgetComponent', () => {
  let component: CheckBudgetComponent;
  let fixture: ComponentFixture<CheckBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckBudgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
