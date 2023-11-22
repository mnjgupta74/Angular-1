import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PfmsApilogComponent } from './pfms-apilog.component';

describe('PfmsApilogComponent', () => {
  let component: PfmsApilogComponent;
  let fixture: ComponentFixture<PfmsApilogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PfmsApilogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PfmsApilogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
