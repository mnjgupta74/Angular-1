import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdReportsComponent } from './pd-reports.component';

describe('PdReportsComponent', () => {
  let component: PdReportsComponent;
  let fixture: ComponentFixture<PdReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
