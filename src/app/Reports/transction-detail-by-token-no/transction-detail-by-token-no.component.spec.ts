import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransctionDetailByTokenNoComponent } from './transction-detail-by-token-no.component';

describe('TransctionDetailByTokenNoComponent', () => {
  let component: TransctionDetailByTokenNoComponent;
  let fixture: ComponentFixture<TransctionDetailByTokenNoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransctionDetailByTokenNoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransctionDetailByTokenNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
