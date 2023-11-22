import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PFMSComponent } from './pfms.component';

describe('PFMSComponent', () => {
  let component: PFMSComponent;
  let fixture: ComponentFixture<PFMSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PFMSComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PFMSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
