import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TOKENMASTERComponent } from './token-master.component';

describe('TOKENMASTERComponent', () => {
  let component: TOKENMASTERComponent;
  let fixture: ComponentFixture<TOKENMASTERComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TOKENMASTERComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TOKENMASTERComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
