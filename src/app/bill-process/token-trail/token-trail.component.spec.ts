import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenTrailComponent } from './token-trail.component';

describe('TokenTrailComponent', () => {
  let component: TokenTrailComponent;
  let fixture: ComponentFixture<TokenTrailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TokenTrailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenTrailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
