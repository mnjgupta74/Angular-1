import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PfmsCnComponent } from './pfms-cn.component';

describe('PfmsCnComponent', () => {
  let component: PfmsCnComponent;
  let fixture: ComponentFixture<PfmsCnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PfmsCnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PfmsCnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
