import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InactivePdAccountComponent } from './inactive-pd-account.component';

describe('InactivePdAccountComponent', () => {
  let component: InactivePdAccountComponent;
  let fixture: ComponentFixture<InactivePdAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InactivePdAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InactivePdAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
