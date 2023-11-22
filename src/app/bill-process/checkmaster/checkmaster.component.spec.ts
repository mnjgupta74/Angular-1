import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckmasterComponent } from './checkmaster.component';

describe('CheckmasterComponent', () => {
  let component: CheckmasterComponent;
  let fixture: ComponentFixture<CheckmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckmasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
