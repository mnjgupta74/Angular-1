import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisreportComponent } from './misreport.component';

describe('MisreportComponent', () => {
  let component: MisreportComponent;
  let fixture: ComponentFixture<MisreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MisreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MisreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
