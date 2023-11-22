import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillObjectionListComponent } from './bill-objection-list.component';

describe('BillObjectionListComponent', () => {
  let component: BillObjectionListComponent;
  let fixture: ComponentFixture<BillObjectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillObjectionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillObjectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
