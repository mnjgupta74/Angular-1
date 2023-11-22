import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiondialogComponent } from './objection-dialog.component';

describe('ObjectiondialogComponent', () => {
  let component: ObjectiondialogComponent;
  let fixture: ComponentFixture<ObjectiondialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectiondialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectiondialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
