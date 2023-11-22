import { Component, OnInit, Pipe } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, map, startWith } from 'rxjs';
import { LoaderService } from 'src/app/services/loaderservice';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { Helper } from 'src/app/utils/Helper';
import { ApiService } from 'src/app/utils/utility.service';
import { CommonDialogComponent } from '../common-dialog/common-dialog.component';



@Component({
  selector: 'app-token-trail',
  templateUrl: './token-trail.component.html',
  styleUrls: ['./token-trail.component.scss']
})



export class TokenTrailComponent implements OnInit {
  auditorColour: string = 'primary';
  acctColour: string = 'danger';
  toColour: string = 'danger';

  TokenTrailForm: any;
  TreasuryListarr: any;
  Treasuryoptions: Observable<any[]> | undefined;
  ChooseOption: any = '';
  TokenTrailStatusForm: any;
  paymangerResult: any;
  tokenTrailStatusResult: any;
  tokenTrailStatusdata: boolean = false;
  paymangerStatusdata: boolean = false;
  objectionlist: any;

  displayedColumns: string[] =
    ['RefNo',
      'DDOCode',
      'OfficeCode',
      'BillType',
      'subBillType',
      'BudgetHead',
      'Objecthead',
      'PlanNonPlan',
      'VotedCharged',
      'BillDate',
      'BillNo',
      // 'Demandno',
      'PDAcNo',
      // 'TreasuryCode',
      'PayYear',
      'PayMonth',
      'PaymentMode',
      // 'DeductionAmount',
      // 'Amount',
      'CashAmoumt',
      'GrossAmount'];
  constructor(public dialog: MatDialog, private ApiMethods: ApiMethods, public loader: LoaderService, public ApiService: ApiService, public Helper: Helper,) { }

  ngOnInit(): void {



    this.TokenTrailForm = new FormGroup({
      TreasuryControl: new FormControl({}, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
      TokenNo: new FormControl('', [Validators.pattern(/^[0-9]\d*$/)]),
      RefNo: new FormControl('', [Validators.pattern(/^[0-9]\d*$/)]),
    });

    this.TokenTrailStatusForm = new FormGroup({
      ReferenceNo: new FormControl({ value: '', disabled: true }),
      TokenNo: new FormControl({ value: '', disabled: true }),
      BillType: new FormControl({ value: '', disabled: true }),
      MajorHead: new FormControl({ value: '', disabled: true }),
      DDO: new FormControl({ value: '', disabled: true }),
      VoucherNo: new FormControl({ value: '', disabled: true }),
      VoucherDate: new FormControl({ value: '', disabled: true }),
      TokenTrailStatus: new FormControl({ value: '', disabled: true }),
      GrossAmount: new FormControl({ value: '', disabled: true }),
      CashAmount: new FormControl({ value: '', disabled: true }),

    });


    this.getTreasuryList();
    this.paymangerResult = [];
  }


  getTreasuryList() {
    this.loader.setLoading(true);
    //this.ApiMethods.getservice(this.ApiService.autoProcessStatus + this.GetAutoProcessStatusModal.treasuryCode + "/" + this.GetAutoProcessStatusModal.tblName).subscribe(resp => {
    this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe((resp: any) => {

      console.log("Auditor__res", resp);
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.TreasuryListarr = resp.result
        //console.log("Show_Treasury_AuditorList", this.TreasuryListarr);
        this.Treasuryoptions = this.TokenTrailForm.controls['TreasuryControl'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            return typeof value === 'string' ? value : value.treasuryCode
          }),
          map((treasury: any) => {

            return treasury ? this._filterTreas(treasury, data) : data.slice()
          })
        );
        const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.Helper.Treasury_Code)[0];
        this.TokenTrailForm.patchValue({
          TreasuryControl: treasury

        })


        if (this.Helper.Treasury_Code != "5000") {
          this.TokenTrailForm.controls['TreasuryControl'].disable();
        }
      }
    })
    this.loader.setLoading(false);

  }

  _filterTreas(value: string, data: any) {
    return data.filter((option: any) => {
      return option.TreasuryName.toLowerCase().includes(value.toLowerCase())
    });
  }

  displayTreasFn(selectedoption: any) {
    return selectedoption ? selectedoption.TreasuryName : undefined;
  }

  onInput(event: Event, row: any): void {
    const input = event.target as HTMLInputElement;
    let newValue = input.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    input.value = newValue; // Update the input field's value
    if (row == 1) {
      this.TokenTrailForm.get('RefNo').reset();
      // this.TokenTrailForm.get('RefNo').disable();

    }

    if (row == 2) {
      this.TokenTrailForm.get('TokenNo').reset();
      // this.TokenTrailForm.get('RefNo').disable();

    }
  }


  Reset() {
    window.location.reload();
  }


  paymangerStatus() {
    this.paymangerStatusdata = false;
    let TokenNo = null;
    if (this.TokenTrailForm.getRawValue().TokenNo > 0) {
      TokenNo = this.TokenTrailForm.getRawValue().TokenNo;
    }

    let RefNo = null;
    if (this.TokenTrailForm.getRawValue().RefNo > 0) {
      RefNo = this.TokenTrailForm.getRawValue().RefNo;
    }

    let postdata = {
      "treasuryCode": this.TokenTrailForm.getRawValue().TreasuryControl.TreasuryCode,
      "tokenNo": TokenNo,
      "cdeRefNo": RefNo,
    }
    // this.loader.setLoading(true);
    this.ApiMethods.postresultservice(this.ApiService.paymangerStatus, postdata).subscribe((resp: any) => {
      //   this.loader.setLoading(false);
      this.paymangerStatusdata = true;
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.paymangerResult = this.mergeRows(resp.result);

      }
    })

  }

  mergeRows(data: any) {
    let final: any[] = [];
    let arrVC: any[] = [];
    let object: any = {}

    data.forEach((element: any) => {
      if (object[element.CDE_REFERENCE_NO]) {
        object[element.CDE_REFERENCE_NO].coPNP.push(element.BFC_TYPE)
        object[element.CDE_REFERENCE_NO].coVC.push(element.HEAD_TYPE)
      } else {
        element.coPNP = [element.BFC_TYPE]
        element.coVC = [element.HEAD_TYPE]
        object[element.CDE_REFERENCE_NO] = element
      }

    });
    for (let key in object) {
      final.push(object[key])
    }
    return final
  }

  tokenTrailStatus() {
    this.tokenTrailStatusdata = false;
    this.loader.setLoading(true);
    let TokenNo = null;
    if (this.TokenTrailForm.getRawValue().TokenNo > 0) {
      TokenNo = this.TokenTrailForm.getRawValue().TokenNo;
    }

    let RefNo = null;
    if (this.TokenTrailForm.getRawValue().RefNo > 0) {
      RefNo = this.TokenTrailForm.getRawValue().RefNo;
    }

    let postdata = {
      "treasuryCode": this.TokenTrailForm.getRawValue().TreasuryControl.TreasuryCode,
      "tokenNo": TokenNo,
      "cdeRefNo": RefNo,
    }

    this.ApiMethods.postresultservice(this.ApiService.tokenTrailStatus, postdata).subscribe((resp: any) => {
      if (resp.result) {

        this.tokenTrailStatusdata = true;
        let tokenTrailStatusResultArray = resp.result;
        this.tokenTrailStatusResult = tokenTrailStatusResultArray[0];
        this.loader.setLoading(false);
        if (Object.keys(this.tokenTrailStatusResult).length > 0) {


          this.TokenTrailStatusForm.patchValue({
            ReferenceNo: this.tokenTrailStatusResult.CDE_REFNO,
            TokenNo: this.tokenTrailStatusResult.Tokenno,
            BillType: this.tokenTrailStatusResult.BillType,
            MajorHead: this.tokenTrailStatusResult.majorhead,
            DDO: this.tokenTrailStatusResult.DDOCode,
            VoucherNo: this.tokenTrailStatusResult.VoucherNo,
            VoucherDate: this.tokenTrailStatusResult.VoucherDate,
            TokenTrailStatus: this.tokenTrailStatusResult.Toflag,
            GrossAmount: this.tokenTrailStatusResult.grossamt,
            CashAmount: this.tokenTrailStatusResult.cashamt,
          });
        }

        this.auditorColour = this.actionColour(this.tokenTrailStatusResult?.AuditorFlag);
        this.acctColour = this.actionColour(this.tokenTrailStatusResult?.Acctflag);
        this.toColour = this.actionColour(this.tokenTrailStatusResult?.Toflag);



      }
    })

  }

  actionColour(flagName: any) {
    if (flagName.toLowerCase().trim() == 'pending') {
      return 'danger';
    }
    if (flagName.toLowerCase().trim() == 'objection on') {
      return 'primary';
    }

    if (flagName.toLowerCase().trim() == 'passed on') {
      return 'success';
    }
    return 'danger';
  }

  TokenTrailSubmit() {
    this.tokenTrailStatus();
    this.paymangerStatus();

  }

  auditObjection(TREASURY_REFNO: any) {
    this.ApiMethods.getservice(this.ApiService.objectionAudit + TREASURY_REFNO).subscribe((resp: any) => {
      this.objectionlist = resp.result;

      this.dialog.open(CommonDialogComponent,
        {
          panelClass: 'dialog-w-50', autoFocus: false,
          height: "auto",
          width: "60%",
          data: {
            message: "objectionlist",
            objectionlist: this.objectionlist,
            id: 'objectionlist',
          }
        }
      );

    });

  }


}
