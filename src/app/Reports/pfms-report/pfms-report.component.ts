import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { LoaderService } from 'src/app/services/loaderservice';
import { Helper } from 'src/app/utils/Helper';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import { Observable, map, startWith } from 'rxjs';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Router } from '@angular/router';


interface pfmsReports {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-pfms-report',
  templateUrl: './pfms-report.component.html',
  styleUrls: ['./pfms-report.component.scss']
})
export class PfmsReportComponent implements OnInit {

  PfmsReportform:any;
  PfmsApilog:boolean=false;
  pfmsbilltopaymanger:boolean=false;
  pfmscn:boolean=false;
  pfmsdnfile:boolean=false;
  pfmstrack:boolean=false;
  rbipayment:boolean=false

  reports: pfmsReports[] = [
    
    {value: 'RP1', viewValue: 'PFMS Api Log Report'},
    {value: 'RP2', viewValue: 'PFMS Bill To Paymanger Report'},
    {value: 'RP5', viewValue: 'PFMS Track Report'},
    {value: 'RP3', viewValue: 'PFMS CN File Report'},
    {value: 'RP4', viewValue: 'PFMS DN File Report'},
    {value: 'RP6', viewValue: 'PFMS RBI Payment Report'},
  ];
  constructor(private router : Router,private sanitizer: DomSanitizer, private ApiMethods: ApiMethods, private _formBuilder: FormBuilder, public loader: LoaderService, private ApiService: ApiService, private _liveAnnouncer: LiveAnnouncer, private finyear_: Helper, private toyear_: Helper, private TCode: Helper, private UId: Helper, private datePipe: DatePipe, public dialog: MatDialog, private snackbar: SnackbarService) {
     }

  ngOnInit(): void {
    this.PfmsReportform = new FormGroup({
           searchreport: new FormControl(''),  
      })
  }
  routeToLink = (event : Event) => {
    console.log("event",event);
    
   // this.router.navigate([this.selectedNavLink.pathLink]);
   this.loader.setLoading(true)
    if (this.PfmsReportform.controls['searchreport'].value == "RP1") {
      this.PfmsApilog=true;
      this.pfmsbilltopaymanger=false;
      this.pfmscn=false
      this.pfmsdnfile=false;
      this.pfmstrack=false;
      this.rbipayment=false;
    }
    else if (this.PfmsReportform.controls['searchreport'].value =="RP2") {
      this.PfmsApilog=false;
      this.pfmsbilltopaymanger=true;
      this.pfmscn=false;
      this.pfmsdnfile=false;
      this.pfmstrack=false;
      this.rbipayment=false;

    }
   else if (this.PfmsReportform.controls['searchreport'].value =="RP3") {
    this.PfmsApilog=false;
    this.pfmsbilltopaymanger=false;
    this.pfmscn=true
    this.pfmsdnfile=false;
    this.pfmstrack=false;
    this.rbipayment=false;
    }
    else if (this.PfmsReportform.controls['searchreport'].value =="RP4") {
      this.PfmsApilog=false;
      this.pfmsbilltopaymanger=false;
      this.pfmscn=false;
      this.pfmsdnfile=true;
      this.pfmstrack=false;
      this.rbipayment=false;
      }

      else if (this.PfmsReportform.controls['searchreport'].value =="RP5") {
        this.PfmsApilog=false;
        this.pfmsbilltopaymanger=false;
        this.pfmscn=false;
        this.pfmsdnfile=false;
        this.pfmstrack=true;
        this.rbipayment=false;
        }
        else if (this.PfmsReportform.controls['searchreport'].value =="RP6") {
          this.PfmsApilog=false;
          this.pfmsbilltopaymanger=false;
          this.pfmscn=false;
          this.pfmsdnfile=false;
          this.pfmstrack=false;
          this.rbipayment=true;
          }
      else{
        this.loader.setLoading(false)
      }
  }
 onReset() {
  window.location.reload()
}
}
