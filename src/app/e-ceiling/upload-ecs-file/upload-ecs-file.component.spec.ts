import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadEcsFileComponent } from './upload-ecs-file.component';

describe('UploadEcsFileComponent', () => {
  let component: UploadEcsFileComponent;
  let fixture: ComponentFixture<UploadEcsFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadEcsFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadEcsFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
