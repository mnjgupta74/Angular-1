import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenUpdateComponent } from './token-update.component';

describe('TokenUpdateComponent', () => {
  let component: TokenUpdateComponent;
  let fixture: ComponentFixture<TokenUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TokenUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
