import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovebillsComponent } from './approvebills.component';

describe('ApprovebillsComponent', () => {
  let component: ApprovebillsComponent;
  let fixture: ComponentFixture<ApprovebillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovebillsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovebillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
