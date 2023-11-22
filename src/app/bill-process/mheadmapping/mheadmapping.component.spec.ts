import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MheadmappingComponent } from './mheadmapping.component';

describe('MheadmappingComponent', () => {
  let component: MheadmappingComponent;
  let fixture: ComponentFixture<MheadmappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MheadmappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MheadmappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
