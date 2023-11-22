import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeIssueListComponent } from './cheque-issue-list.component';

describe('ChequeIssueListComponent', () => {
  let component: ChequeIssueListComponent;
  let fixture: ComponentFixture<ChequeIssueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChequeIssueListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChequeIssueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
