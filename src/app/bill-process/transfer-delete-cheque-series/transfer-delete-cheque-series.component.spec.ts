import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferDeleteChequeSeriesComponent } from './transfer-delete-cheque-series.component';

describe('TransferDeleteChequeSeriesComponent', () => {
  let component: TransferDeleteChequeSeriesComponent;
  let fixture: ComponentFixture<TransferDeleteChequeSeriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferDeleteChequeSeriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferDeleteChequeSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
