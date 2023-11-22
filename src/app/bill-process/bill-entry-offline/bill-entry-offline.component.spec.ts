import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillEntryOfflineComponent } from './bill-entry-offline.component';

describe('BillEntryOfflineComponent', () => {
  let component: BillEntryOfflineComponent;
  let fixture: ComponentFixture<BillEntryOfflineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillEntryOfflineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillEntryOfflineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
