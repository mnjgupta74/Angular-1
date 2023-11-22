import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgDivisionUpdateComponent } from './ag-division-update.component';

describe('AgDivisionUpdateComponent', () => {
  let component: AgDivisionUpdateComponent;
  let fixture: ComponentFixture<AgDivisionUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgDivisionUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgDivisionUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
