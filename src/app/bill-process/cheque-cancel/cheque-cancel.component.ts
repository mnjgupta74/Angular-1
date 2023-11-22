
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import { Router } from '@angular/router';
//import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/services/loaderservice';
import { IGetChequeCancelFetchList } from 'src/app/utils/Master';
import { IGetChequeCancelSubmitList } from 'src/app/utils/Master';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import * as Val from 'src/app/utils/Validators/ValBarrel'
//import { DialogaccountofficerComponent } from '../account-officer-list/dialogaccountofficer/dialogaccountofficer.component';
import { MatDialog } from '@angular/material/dialog';
import { IgetVoucherModelData } from 'src/app/utils/Master';
import { Helper } from 'src/app/utils/Helper';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { ElementSchemaRegistry } from '@angular/compiler';


export interface ChequeCancelList {
  TokenNo: number;
  BillCode: number;
  Bankbranchcode: string;
  TransDate: string;
  AuditorCode: number;
  TreasuryCode: string;
  ChequeNo: number;
  bankcode: number;


}


@Component({
  selector: 'app-cheque-cancel',
  templateUrl: './cheque-cancel.component.html',
  styleUrls: ['./cheque-cancel.component.scss']
})
export class ChequeCancelComponent implements OnInit {
  financialYear: any;


  ChequeCancelListdata: MatTableDataSource<ChequeCancelList> = new MatTableDataSource();
  displayedColumns = [
    'SrNo',
    'TokenNo',
    'TransDate',
    'Bankbranchcode',
    'ChequeNo',
  ];

  // Form Module
  ChequeCancelForm: any;
  ChequeCancelFormData: any;

  loading: any;

  Payment_radio: boolean = true
  Receipt_radio: boolean = false
  radioButtonvalue: any = "V";

  showTab_Table: boolean = false


  ChooseOption: any = '';
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []

  //ChequeCancelFetchDetails: any[] = [];
  ChequeCancelFetchDetails: MatTableDataSource<ChequeCancelList> = new MatTableDataSource();

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.ChequeCancelFetchDetails.sort = sort;
    this.ChequeCancelFetchDetails.sort = sort;
  }
  @ViewChild(MatPaginator) set MatPaginator(paginator: MatPaginator) {
    this.ChequeCancelFetchDetails.paginator = paginator;
    this.ChequeCancelFetchDetails.paginator = paginator;
  }


  ReasonOptions: Observable<any[]> | undefined;

  //LIst array
  ReasonListarr: any = []

  SelectReason: any = ''


  fetchedchequeno: any;
  fetchedtreasurycode: any;
  fetchedtokenNo: any;
  fetchedbankCode: any;
  fetchedreason: any;
  fetcheduserID: any;
  fetchedtokenfinYear: any;
  fetchedTreasRefNo: any;

  finYr: any;
IP:any;

  ChequeCancelFetchModal: IGetChequeCancelFetchList = {
    tokenno: 0,
    treasurycode: this.objHelper.Treasury_Code,
    tokenfinYear: this.objHelper.year.toString().substring(2, 4) + this.objHelper.finyear.toString().substring(2, 4),
    // tokenfinYear:this.helper.FinancialYear,
    chequeType: ""

  }


  ChequeCancelSubmitModal: IGetChequeCancelSubmitList = {
    chequeno: "",
    treasurycode: this.objHelper.Treasury_Code,
    tokenNo: 0,
    bankBranchCode: 0,
    reason: 0,
    userID: this.objHelper.UserId,
    tokenfinYear: this.objHelper.year.toString().substring(2, 4) + this.objHelper.finyear.toString().substring(2, 4),
    treasuryRefno: 0,
    assignmentId: this.objHelper.assignmentId,
    ipAddress: "172.22.32.102"
  }


  constructor(private router: Router, private ApiMethods: ApiMethods, public loader: LoaderService, private ApiService: ApiService, private snackbar: SnackbarService, private _liveAnnouncer: LiveAnnouncer, public dialog: MatDialog, public objHelper: Helper) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
    };
    this.IP= this.ApiMethods.clientIP;
  }

  ngOnInit() {
    // console.log('Hello ! Cheque Cancel Fetch');
    this.financialYear = this.objHelper.FinancialYear;
    this.ChequeCancelFetchModal.tokenfinYear = this.financialYear;

    let financialYr = this.objHelper.year.toString().substring(2, 4) + this.objHelper.finyear.toString().substring(2, 4);   // It Shows = 2324
    this.finYr = this.objHelper.year.toString()   // It Shows = 2023

    this.ChequeCancelForm = new FormGroup({
      //Treasury: new FormControl({ value: this.ChequeCancelFetchModal.treasurycode, disabled: true }),
      TreasuryControl: new FormControl({ value: this.ChequeCancelFetchModal.treasurycode }, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
      //Year: new FormControl({ value: this.ChequeCancelFetchModal.tokenfinYear, disabled: true }),
      Year: new FormControl({ value: financialYr, disabled: true }),
      TokenNum: new FormControl('', [Val.Required, Val.minLength(1), Val.maxLength(8), Val.cannotContainSpace, Val.Numeric]),
      rblTypeCtrl: new FormControl('1', Validators.required),
    });



    this.ChequeCancelFormData = new FormGroup({
      //ReasonControl: new FormControl({ }, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
      ReasonControl: new FormControl('', [Val.Required]),
    });


    this.getTreasuryList();

  }



  // Call Treasury List API >>>------------------->

  getTreasuryList() {
    this.loader.setLoading(true);
    //this.ApiMethods.getservice(this.ApiService.autoProcessStatus + this.GetAutoProcessStatusModal.treasuryCode + "/" + this.GetAutoProcessStatusModal.tblName).subscribe(resp => {
    this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe((resp: any) => {

      console.log("Auditor__res", resp);
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.TreasuryListarr = resp.result
        //console.log("Show_Treasury_AuditorList", this.TreasuryListarr);
        this.Treasuryoptions = this.ChequeCancelForm.controls['TreasuryControl'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            return typeof value === 'string' ? value : value.treasuryCode
          }),
          map((treasury: any) => {

            return treasury ? this._filterTreas(treasury, data) : data.slice()
          })
        );
        const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.objHelper.Treasury_Code)[0];
        this.ChequeCancelForm.patchValue({
          TreasuryControl: treasury

        })

        if (this.objHelper.Treasury_Code != "5000") {
          this.ChequeCancelForm.controls['TreasuryControl'].disable();
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
    console.log("display_fun_call aaa", selectedoption.TreasuryName);
    return selectedoption ? selectedoption.TreasuryName : undefined;
  }


  radioButtonGroupChange(event: any) {
    // console.log("XXXXXXXXXXXXXXX_mat_radioVal", event.value);
    if (event.value == "V") {
      this.radioButtonvalue = "V"
    }
    else {
      this.radioButtonvalue = "C"
    }
  }


  // Call TO Load Data API >>>------------------->
  ChequeCancelFetch() {
    this.loader.setLoading(true);
    this.ChequeCancelFetchModal.tokenno = this.ChequeCancelForm.controls['TokenNum'].value;
    // this.ChequeCancelFetchModal.treasurycode = this.ChequeCancelForm.controls['Treasury'].value;
    this.ChequeCancelFetchModal.treasurycode = this.ChequeCancelForm.controls['TreasuryControl'].value.TreasuryCode;
    this.ChequeCancelFetchModal.tokenfinYear = this.ChequeCancelForm.controls['Year'].value;
    this.ChequeCancelFetchModal.chequeType = this.radioButtonvalue;

    console.log("Before_Calling_API_ChequeCancelFetch_Result", this.ChequeCancelFetchModal);

    this.ApiMethods.postresultservice(this.ApiService.ChequeCancelFetch, this.ChequeCancelFetchModal).subscribe((resp: any) => {
      console.log("After_Calling_API_ChequeCancelFetch_Result", resp);

     //if (resp.result.length > 0)  
     // if (resp.result[0].length > 0 && resp.result[0].Status !="001") 
     if(resp.result[0].Status!="001") 
      {
        this.showTab_Table = true;
        console.log("ChequeCancelFetch_List", resp.result);
        // this.ChequeCancelListdata.data = resp.result;
        //this.ChequeCancelFetchDetails = resp.result;
        this.ChequeCancelFetchDetails.data = resp.result;

        // Fetch Data For Cheque Cancel Submit Call API
        this.fetchedchequeno = resp.result[0].ChequeNo;
        this.fetchedtreasurycode = resp.result[0].TreasuryCode;
        this.fetchedtokenNo = resp.result[0].TokenNo;
        this.fetchedbankCode = resp.result[0].bankcode;
        //this.fetchedbillcode = resp.result[0].Billcode;
        this.fetchedTreasRefNo = resp.result[0].TREASURY_REFNO;

        this.ChequeCancelForm.disable();

        this.getReasonList();   // Call Reason List

        this.loader.setLoading(false);
        document.getElementById("myelem")?.scrollIntoView({ behavior: 'smooth', block: 'center' });

      }
      else 
      {
        this.snackbar.show(resp.result[0].Msg, 'success'); // "NO BILL FOUND" Msg
        this.loader.setLoading(false);
        this.ChequeCancelListdata.data = [];
        this.showTab_Table = false;
      }
    },
      (res: any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          this.snackbar.show('Something Went Wrong! Please Try Again', 'Alert !');
          this.showTab_Table = false;
        }
      }
    );

  }


  // Call Reason List API >>>------------------->
  getReasonList() {

    console.log("Before___ChequeCancelReason___List");

    this.ApiMethods.getservice(this.ApiService.ChequeCancelReasonList).subscribe((resp: any) => {
      console.log("Reason__res", resp);
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.ReasonListarr = resp.result
      }
      console.log("Show_Reason_List", this.ReasonListarr);
      this.ReasonOptions = this.ChequeCancelFormData.controls['ReasonControl'].valueChanges.pipe(
        startWith(''),
        map((value: any) => {
          // console.log("firstmap__", value);
          return typeof value === 'string' ? value : value.Reason
        }),
        map((Reason: any) => {
          // console.log("second__map", Reason);

          return Reason ? this._filter(Reason, data) : data.slice()
        })
      );

    })

  }



  //  Reason List filter >>>------------------->
  _filter(value: string, data: any) {
    // console.log("filterval__", value);
    return data.filter((option: any) => {
      // console.log("option_val__", option);
      return option.reason.toLowerCase().includes(value.toLowerCase())
    });
  }


  //  Reason List Select >>>------------------->
  OnReasonSelected(SelectReason: any) {
    console.log("befort______Select_Reason", SelectReason);
    console.log("slelction__________option_____________", SelectReason);
    this.ChequeCancelSubmitModal.reason = SelectReason
  }


  //  Reason display Function >>>------------------->
  displayFn(selectedoption: any) {
    console.log("display_fun_call");
    return selectedoption ? selectedoption.reason : undefined;
  }


  ChequeCancelFetchReset() {
    window.location.reload();
  }


  // Function : Call Bill Encashment Submit API >>>------------------->
  ChequeCancelSubmit() {
    let ReasonVal = this.ChequeCancelFormData.controls['ReasonControl'].value;
    const fReasonVal = this.ReasonListarr.filter((x: any) => x.reason == ReasonVal.reason)[0];
    //console.log("Reason_ValueXXXXXXXX", fReasonVal);

    if (fReasonVal == undefined) {
      this.snackbar.show('Please Select Valid Reason !', 'alert');
    }

    else {
      if (fReasonVal != "") {

        console.log("Reason_Value", ReasonVal.reasonid);

        this.ChequeCancelSubmitModal.chequeno = this.fetchedchequeno;
        this.ChequeCancelSubmitModal.treasurycode = this.fetchedtreasurycode;
        this.ChequeCancelSubmitModal.tokenNo = this.fetchedtokenNo;
        this.ChequeCancelSubmitModal.bankBranchCode = this.fetchedbankCode;
        this.ChequeCancelSubmitModal.reason = ReasonVal.reasonid;
        this.ChequeCancelSubmitModal.treasuryRefno = this.fetchedTreasRefNo;


        this.loader.setLoading(true);
        console.log("Before_Calling_API_Cheque_Cancel_Submit_Result", this.ChequeCancelSubmitModal);
        this.ApiMethods.postresultservice(this.ApiService.ChequeCancelSubmit, this.ChequeCancelSubmitModal).subscribe((resp: any) => {
          console.log("After_Calling_API_Cheque_Cancel_Submit_Result", resp);

          if (resp.result.Status == "200") {
            // let chqCanMsg1 = this.objHelper.ChqCan1();
            // this.snackbar.show(chqCanMsg1, 'Success !');  
            this.snackbar.show(resp.result.Msg, 'success'); // Cheque has been Cancel Msg
            this.loader.setLoading(false);
            this.showTab_Table = false;

            this.ChequeCancelForm.enable();
            this.ChequeCancelForm.controls.TreasuryControl.disable();
            this.ChequeCancelForm.controls.Year.disable();
            this.ChequeCancelForm = new FormGroup({
              TokenNum: new FormControl(''),
            });
          }

        },
          (res: any) => {
            console.log("errror message___", res.status);
            if (res.status != 200) {
              this.loader.setLoading(false);
              //this.snackbar.show('Something Went Wrong! Please Try Again', 'Alert !');
              let ApiErrMsg = this.objHelper.APIErrorMsg();
              this.snackbar.show(ApiErrMsg, 'Alert !');  /// API Error Message

            }
          }
        );

      }

      else {
        let chqCanMsg2 = this.objHelper.ChqCan2();
        this.snackbar.show(chqCanMsg2, 'Alert!');  // Please Select Reason Msg
        this.loader.setLoading(false);
      }
    }
  }




  // TO Load Data Sorting >>>------------------->
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce('Sorted ${sortState.direction}ending');
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  // TO Load Data Searching..............
  applyFilter(filterValue: string) {
    this.ChequeCancelFetchDetails.filter = filterValue.trim().toLowerCase();

    if (this.ChequeCancelFetchDetails.paginator) {
      this.ChequeCancelFetchDetails.paginator.firstPage();
    }
  }

  get TokenNum() { return this.ChequeCancelForm.get('TokenNum') }

}
