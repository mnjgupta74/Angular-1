import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TogglesidemenuComponent } from './togglesidemenu.component';

describe('TogglesidemenuComponent', () => {
  let component: TogglesidemenuComponent;
  let fixture: ComponentFixture<TogglesidemenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TogglesidemenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TogglesidemenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
