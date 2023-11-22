import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallanEntryComponent } from './challan-entry.component';

describe('ChallanEntryComponent', () => {
  let component: ChallanEntryComponent;
  let fixture: ComponentFixture<ChallanEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChallanEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallanEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
