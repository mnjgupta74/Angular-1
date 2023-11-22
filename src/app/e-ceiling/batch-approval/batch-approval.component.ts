import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-batch-approval',
  templateUrl: './batch-approval.component.html',
  styleUrls: ['./batch-approval.component.scss'],
})
export class BatchApprovalComponent implements OnInit {
  file: any;
  Disabledfile: any;
  constructor() {}

  ngOnInit(): void {}

  // file upload
  onChangeFile(event: any) {
    this.file = event.target.files[0];
    this.Disabledfile = event.target.files[0].name;
  }

  removeSelectedFile() {
    let deleteBtn = confirm(' Do you want to delete ?');
    if (deleteBtn == true) {
      this.file = null;
      this.Disabledfile = '';
    }
  }
}
