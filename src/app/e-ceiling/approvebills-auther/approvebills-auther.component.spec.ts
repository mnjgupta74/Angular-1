import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovebillsAutherComponent } from './approvebills-auther.component';

describe('ApprovebillsAutherComponent', () => {
  let component: ApprovebillsAutherComponent;
  let fixture: ComponentFixture<ApprovebillsAutherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovebillsAutherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovebillsAutherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
