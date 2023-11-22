import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatepayidsComponent } from './updatepayids.component';

describe('UpdatepayidsComponent', () => {
  let component: UpdatepayidsComponent;
  let fixture: ComponentFixture<UpdatepayidsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatepayidsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatepayidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
