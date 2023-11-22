import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PfmsBillToPaymangerComponent } from './pfms-bill-to-paymanger.component';

describe('PfmsBillToPaymangerComponent', () => {
  let component: PfmsBillToPaymangerComponent;
  let fixture: ComponentFixture<PfmsBillToPaymangerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PfmsBillToPaymangerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PfmsBillToPaymangerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
