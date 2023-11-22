import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineBillListComponent } from './online-bill-list.component';

describe('OnlineBillListComponent', () => {
  let component: OnlineBillListComponent;
  let fixture: ComponentFixture<OnlineBillListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineBillListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineBillListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
