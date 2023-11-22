import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovebillsProcessComponent } from './approvebills-process.component';

describe('ApprovebillsProcessComponent', () => {
  let component: ApprovebillsProcessComponent;
  let fixture: ComponentFixture<ApprovebillsProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovebillsProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovebillsProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
