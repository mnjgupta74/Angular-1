import { ComponentFixture, TestBed } from '@angular/core/testing';

import { P2FComponent } from './p2-f.component';

describe('P2FComponent', () => {
  let component: P2FComponent;
  let fixture: ComponentFixture<P2FComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ P2FComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(P2FComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
