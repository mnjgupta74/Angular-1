import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdAcCreationComponent } from './pd-ac-creation.component';

describe('PdAcCreationComponent', () => {
  let component: PdAcCreationComponent;
  let fixture: ComponentFixture<PdAcCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdAcCreationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdAcCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
