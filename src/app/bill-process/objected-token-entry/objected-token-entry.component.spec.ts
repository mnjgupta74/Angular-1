import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectedTokenEntryComponent } from './objected-token-entry.component';

describe('ObjectedTokenEntryComponent', () => {
  let component: ObjectedTokenEntryComponent;
  let fixture: ComponentFixture<ObjectedTokenEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectedTokenEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectedTokenEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
