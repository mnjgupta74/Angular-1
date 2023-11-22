import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import * as Val from '../../utils/Validators/ValBarrel'
@Component({
  selector: 'app-payments-reports',
  templateUrl: './payments-reports.component.html',
  styleUrls: ['./payments-reports.component.scss']
})
export class PaymentsReportsComponent implements OnInit {
  paymentreportForm: any;
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []
  finYr: any;
  base64data: any;
  paymentreportList: any = {

    "billNo": 1212,
    "reportPath": "",
    "format": "pdf",
    "params": [
      {
        "name": "p_TreasuryCode",
        "value": ""
      },
      {
        "name": "p_FromDate",
        "value": ""
      },
      {
        "name": "p_ToDate",
        "value": ""
      },
      {
        "name": "p_RegisterNo",
        "value": ""
      },

    ]



  }
  constructor(private sanitizer: DomSanitizer, private ApiMethods: ApiMethods, private _formBuilder: FormBuilder, public loader: LoaderService, private ApiService: ApiService, private _liveAnnouncer: LiveAnnouncer, private finyear_: Helper, private toyear_: Helper, private TCode: Helper, private UId: Helper, private datePipe: DatePipe, public dialog: MatDialog, private snackbar: SnackbarService) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
    };
  }

  ngOnInit(): void {
    this.getTreasuryList();
    this.finYr = this.finyear_.forwardYear.toString();
    this.paymentreportForm = new FormGroup({
      finyear: new FormControl({ value: this.finYr, disabled: true }),
      treasuryval: new FormControl({ value: '', disabled: true }, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
      toDate: new FormControl({ value: new Date(), disabled: false }, [Val.Required, Val.maxLength(12)]),
      fromDate: new FormControl({ value: new Date(), disabled: false }, [Val.Required, Val.maxLength(12)]),
      registerValue: new FormControl({ value:0, disabled: false }, [Val.maxLength(6), Val.SpecialChar, Val.Numeric, Val.cannotContainSpace]),
      searchreport: new FormControl(''),
    })
  }

  getTreasuryList() {
    this.loader.setLoading(true);
    this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe((resp: any) => {
      console.log("Auditor__res", resp);
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.TreasuryListarr = resp.result
        //console.log("Show_Treasury_AuditorList", this.TreasuryListarr);
        this.Treasuryoptions = this.paymentreportForm.controls['treasuryval'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            return typeof value === 'string' ? value : value.treasuryCode
          }),
          map((treasury: any) => {

            return treasury ? this._filtertreasury(treasury, data) : data.slice()
          })
        );
        const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.TCode.Treasury_Code)[0];
        this.paymentreportForm.patchValue({
          treasuryval: treasury
        })
      }
    })
    this.loader.setLoading(false);
  }

  _filtertreasury(value: string, data: any) {
    return data.filter((option: any) => {
      return option.TreasuryName.toLowerCase().includes(value.toLowerCase())
    });
  }
  displaytreasury(selectedoption: any) {
    console.log("display_fun_call aaa", selectedoption.TreasuryName);
    return selectedoption ? selectedoption.TreasuryName : undefined;
  }
  onReset() {
    window.location.reload()
  }

  //ORACLE PDF EXPORT
  getpaymentreport() {
    
    let Date1 = this.paymentreportForm.controls['fromDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');
    let Date2 = this.paymentreportForm.controls['toDate'].value;
    let tDate = new DatePipe('en-US').transform(Date2, 'yyyy-MM-dd');
    console.log("value__control",this.paymentreportForm.controls['searchreport'].value)
    if (this.paymentreportForm.controls['searchreport'].value == "RP1") {
      this.paymentreportList.reportPath = "/Treasury/AG/Reports/RPT_FRSPR_Ty1.xdo"
    }
    else if (this.paymentreportForm.controls['searchreport'].value =="RP2") {
      this.paymentreportList.reportPath = "/Treasury/AG/Reports/RP_FRSPR_TY3.xdo"
    }
   else if (this.paymentreportForm.controls['searchreport'].value =="RP3") {
      this.paymentreportList.reportPath = "/Treasury/AG/Reports/RPT_FRSPR_Ty3.xdo"
    }
   else if (this.paymentreportForm.controls['searchreport'].value == "RP4") {
      this.paymentreportList.reportPath = "/Treasury/AG/Reports/RPT_FRSPR_Ty4.xdo"
    }
  else  if (this.paymentreportForm.controls['searchreport'].value == "RP5") {
      this.paymentreportList.reportPath = "/Treasury/AG/Reports/RPT_FRSForm24G.xdo"
    }
   else if (this.paymentreportForm.controls['searchreport'].value == "RP6") {
      this.paymentreportList.reportPath = "/Treasury/AG/Reports/RPT_FRSPR_BTRegister.xdo"
    }
  else  if (this.paymentreportForm.controls['searchreport'].value == "RP7") {
      this.paymentreportList.reportPath = "/Treasury/AG/Reports/RPT_FRSPR_CashBook.xdo"
    }
    console.log("reportpath_",this.paymentreportList.reportPath)
    // this.paymentreportList.reportPath=this.paymentreportForm.controls['searchreport'].value
    this.paymentreportList.params[0].value = this.TCode.Treasury_Code;
    // this.reportList.params[2].value = this.paymentreportForm.controls['searchreport'].value;
    this.paymentreportList.params[1].value = fDate;
    this.paymentreportList.params[2].value = tDate;
    this.paymentreportList.params[3].value = this.paymentreportForm.controls['registerValue'].value;
    console.log("beforeapi called reportlist_", this.paymentreportList)
    this.loader.setLoading(true)
    //api call of Treasury Officer List
    this.ApiMethods.postresultservice(this.ApiService.OracleReport, this.paymentreportList).subscribe((resp: any) => {
      console.log("imgresp__", resp)
      var response = resp.data
      console.log("object__",Object.keys(response).length)
       if (Object.keys(response).length > 0) {
        //if (response.length > 0) {
        let documentArray = resp.data.report;
        console.log("docc__", documentArray)
        this.base64data = "data:application/pdf;base64," + documentArray.content;
        console.log("base64", this.base64data)
        this.base64data = 'data:application/pdf;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(documentArray.content) as any).changingThisBreaksApplicationSecurity;
        let w = window.open('about:blank', 'mywindow', "width=1200, height=800");
        w?.document.write(' <iframe id="ireport" style="width:100%; min-height:875px;" scrolling="no" frameborder="0" allowfullscreen></iframe>')
        w?.document.getElementById('ireport')?.setAttribute("src", this.base64data);
        this.loader.setLoading(false)
      }
      else {
        this.snackbar.show('No Data Found !', 'alert')
        this.loader.setLoading(false);
      }
    },
      (res: any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          this.snackbar.show('Something Went Wrong! Please Try Again !', 'danger')
          this.loader.setLoading(false);
        }
      }
    );
  }
}
