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


export interface INavLink {
  id : number;
  pathLink : string;
  label : string;
}
interface Reports {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-pd-reports',
  templateUrl: './pd-reports.component.html',
  styleUrls: ['./pd-reports.component.scss']
})
export class PdReportsComponent implements OnInit {
//@Input()
 // name!: string;

//  @Output() updateStyleEvent = new EventEmitter<string>();
  PdReportform:any;
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []
  finYr: any;
  // selectedNavLink!: INavLink;
  // navLinks : any = [
  //   { pathLink : '/PdBalanceReport', label : 'Pd Balance Report', id: 1 },
  //   { pathLink : '/PdCalculation', label : 'Pd Calculation', id: 2 },
  //   { pathLink : '/PdPassbookformat', label : 'Pd Passbook format', id: 3},
  //   { pathLink : '/PDMasterReport', label : 'PD Master Report', id: 4 }
  // ];
  PdBalanceReport:boolean=false;
  PdPassbookformat:boolean=false;
  PDMasterReport:boolean=false;
  pdaccountclosingstatus:boolean=false
  pdacstatusreport:boolean=false
  InActivePDACReport:boolean=false

  reports: Reports[] = [

    {value: 'RP1', viewValue: 'PD Master Report'},
    {value: 'RP2', viewValue: 'Pd Balance Report'},
    {value: 'RP3', viewValue: 'Pd Passbook format'},
    {value: 'RP4', viewValue: 'Pd Account Status Report'},
    {value: 'RP5', viewValue: 'Inactive PD Acount Report'},
  ];
  constructor(private router : Router,private sanitizer: DomSanitizer, private ApiMethods: ApiMethods, private _formBuilder: FormBuilder, public loader: LoaderService, private ApiService: ApiService, private _liveAnnouncer: LiveAnnouncer, private finyear_: Helper, private toyear_: Helper, private TCode: Helper, private UId: Helper, private datePipe: DatePipe, public dialog: MatDialog, private snackbar: SnackbarService) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
    };
  }

  ngOnInit(): void {
   // this.getTreasuryList();
    this.finYr = this.finyear_.forwardYear.toString();
    this.PdReportform = new FormGroup({
      finyear: new FormControl({ value: this.finYr, disabled: true }),
      treasuryval: new FormControl({ value: '', disabled: true }, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
      searchreport: new FormControl(''),
      })
  }

  // getTreasuryList() {
  //   this.loader.setLoading(true);
  //   this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe((resp: any) => {
  //     console.log("Auditor__res", resp);
  //     let data = resp.result
  //     if (resp.result && resp.result.length > 0) {
  //       this.TreasuryListarr = resp.result
  //       //console.log("Show_Treasury_AuditorList", this.TreasuryListarr);
  //       this.Treasuryoptions = this.PdReportform.controls['treasuryval'].valueChanges.pipe(
  //         startWith(''),
  //         map((value: any) => {
  //           return typeof value === 'string' ? value : value.treasuryCode
  //         }),
  //         map((treasury: any) => {

  //           return treasury ? this._filtertreasury(treasury, data) : data.slice()
  //         })
  //       );
  //       const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.TCode.Treasury_Code)[0];
  //       this.PdReportform.patchValue({
  //         treasuryval: treasury
  //       })
  //     }
  //   })
  //   this.loader.setLoading(false);
  // }

  // _filtertreasury(value: string, data: any) {
  //   return data.filter((option: any) => {
  //     return option.TreasuryName.toLowerCase().includes(value.toLowerCase())
  //   });
  // }
  // displaytreasury(selectedoption: any) {
  //   console.log("display_fun_call aaa", selectedoption.TreasuryName);
  //   return selectedoption ? selectedoption.TreasuryName : undefined;
  // }

  // updateSelectedStyle(value:any) {
  //   this.updateStyleEvent.emit(value)
  // }

     routeToLink = (event : Event) => {
      console.log("event",event);
     // this.router.navigate([this.selectedNavLink.pathLink]);
     this.loader.setLoading(true)
      if (this.PdReportform.controls['searchreport'].value == "RP1") {
        this.PDMasterReport=true;
        this.PdBalanceReport=false;
        this.PdPassbookformat=false
        this.pdacstatusreport=false;
        this.InActivePDACReport=false;
      }
      else if (this.PdReportform.controls['searchreport'].value =="RP2") {
        this.PDMasterReport=false;
        this.PdBalanceReport=true;
        this.PdPassbookformat=false;
        this.pdacstatusreport=false;
        this.InActivePDACReport=false;

      }
     else if (this.PdReportform.controls['searchreport'].value =="RP3") {
      this.PDMasterReport=false;
      this.PdBalanceReport=false;
      this.PdPassbookformat=true
      this.pdacstatusreport=false;
      this.InActivePDACReport=false;
      }
        
      else if (this.PdReportform.controls['searchreport'].value =="RP4") {
          this.PDMasterReport=false;
          this.PdBalanceReport=false;
          this.PdPassbookformat=false;
          this.pdacstatusreport=true;
          this.InActivePDACReport=false;
          }
    else if (this.PdReportform.controls['searchreport'].value =="RP5") {
            this.PDMasterReport=false;
            this.PdBalanceReport=false;
            this.PdPassbookformat=false;
            this.pdacstatusreport=false;
            this.InActivePDACReport=true;
            }
        else{
          this.loader.setLoading(false)
        }

   }

   onReset() {
    window.location.reload()
  }

}
