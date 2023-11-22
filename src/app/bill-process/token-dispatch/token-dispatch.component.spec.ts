import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenDispatchComponent } from './token-dispatch.component';

describe('TokenDispatchComponent', () => {
  let component: TokenDispatchComponent;
  let fixture: ComponentFixture<TokenDispatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TokenDispatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
