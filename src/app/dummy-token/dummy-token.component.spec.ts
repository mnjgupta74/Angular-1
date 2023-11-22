import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DummyTokenComponent } from './dummy-token.component';

describe('DummyTokenComponent', () => {
  let component: DummyTokenComponent;
  let fixture: ComponentFixture<DummyTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DummyTokenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DummyTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
