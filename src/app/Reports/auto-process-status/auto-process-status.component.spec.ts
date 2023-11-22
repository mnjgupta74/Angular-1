import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoProcessStatusComponent } from './auto-process-status.component';

describe('AutoProcessStatusComponent', () => {
  let component: AutoProcessStatusComponent;
  let fixture: ComponentFixture<AutoProcessStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoProcessStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoProcessStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
