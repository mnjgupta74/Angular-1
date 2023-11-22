import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnMinusEntryComponent } from './grn-minus-entry.component';

describe('GrnMinusEntryComponent', () => {
  let component: GrnMinusEntryComponent;
  let fixture: ComponentFixture<GrnMinusEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrnMinusEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrnMinusEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
