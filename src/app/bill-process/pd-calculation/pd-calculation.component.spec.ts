import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdCalculationComponent } from './pd-calculation.component';

describe('PdCalculationComponent', () => {
  let component: PdCalculationComponent;
  let fixture: ComponentFixture<PdCalculationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdCalculationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
