import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedbyidComponent } from './approvedbyid.component';

describe('ApprovedbyidComponent', () => {
  let component: ApprovedbyidComponent;
  let fixture: ComponentFixture<ApprovedbyidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedbyidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedbyidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
