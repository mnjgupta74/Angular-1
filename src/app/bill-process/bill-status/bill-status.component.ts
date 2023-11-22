import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loaderservice';
import { Helper } from 'src/app/utils/Helper';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import * as Val from '../../utils/Validators/ValBarrel';
import { BillEntryList, TreasaryModel } from 'src/app/utils/Master';
import { DatePipe, formatDate } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import * as moment from 'moment';
import { log } from 'console';
import { Observable, map, startWith } from 'rxjs';

export interface BillTypeMaster {
  FrmToken: number;
}
// export interface billStatus {
//   tokenno: string;
//   ECSNonEcs: number;
//   ToDate: number;
//   ChequeNo: string;
//   BankName: string;
//   VoucherNo: string;
//   CashAmt: number;
//   GrossAmt: number;
// }
@Component({
  selector: 'app-bill-status',
  templateUrl: './bill-status.component.html',
  styleUrls: ['./bill-status.component.scss'],
})
export class BillStatusComponent implements OnInit {
  constructor(
    private router: Router,
    private ApiMethods: ApiMethods,
    public loader: LoaderService,
    private ApiService: ApiService,
    private snackbar: SnackbarService,
    private TCode: Helper,
    private finyear_: Helper,
    private toyear_: Helper,
    private _liveAnnouncer: LiveAnnouncer
  ) {
    this.userinfo = this.ApiMethods.getUserInfo();
  }
  userinfo: any;
  billStatusForm: any;
  billStatusResult: any = [];
  // All_radio: boolean = false;
  // CheckUser_radio: boolean = false;
  BankList: any = [];
  SelectedBank: any;
  showTab_Table: boolean = false;
  chequedate: any;
  chequeNo: any;
  Treasuryoptions: Observable<any[]> | undefined;
  treasuryCode!: any;
  treasaryData: TreasaryModel[] = [];
  TreasuryListarr: any[] = [];
  selectedOption:any;
  forwardBill: BillEntryList = {
    treasurycode: this.TCode.Treasury_Code,
    tokenNo: 0,
    type: 1,
    finyear: this.TCode.forwardYear,
  };
  BillStatusTable: string[] = [
    'TOKENNO',
    'NETAMT',
    'GROSSAMT',
    'PAYMODE',
    'CHEQUEDATE',
    'CHEQUENO',
    'BANKNAME',
    'Action',
  ];
  dataSource = new MatTableDataSource();
  // startYear = new Date().getFullYear();
  // Years: any[] = [];
  ngOnInit(): void {
    // for (let i = 0; i < 1; i++) {
    //   this.Years.push(this.startYear - i);
    // }
    this.billStatusForm = new FormGroup({
      FrmToken: new FormControl('', [
        Val.Required,
        Val.minLength(1),
        Val.maxLength(8),
        Val.cannotContainSpace,
        Val.Numeric,
      ]),
      FrmTreasuryCode: new FormControl({
        // value: this.forwardBill.treasurycode,
        // disabled: true,
      }),
      FrmAuditor: new FormControl(''),
      FrmFinYear: new FormControl({
        value: this.forwardBill.finyear,
        disabled: true,
      }),
      fromDate: new FormControl({ value: new Date(), disabled: false }, [
        Val.Required,
        Val.maxLength(12),
      ]),
      //toDate: new FormControl({ value: new Date(), disabled: false }),
      toDate: new FormControl({ value: new Date(), disabled: false }, [
        Val.Required,
        Val.maxLength(12),
      ]),
      chequeNoctrl: new FormControl(),
      bankName: new FormControl(),
      ChequeDate: new FormControl({ value: new Date(), disabled: false }, [
        Val.Required,
        Val.maxLength(12),
      ]),
    });
    this.gettreasuryList();
    // this.billStatusForm.patchValue({
    //   FrmTreasuryCode: this.forwardBill.treasurycode,      
    // });
     
    if(this.TCode.Treasury_Code !="5000")
    {
      this.billStatusForm.controls['FrmTreasuryCode'].disable();
    }

  }
  // radioButtoninGroupChange(event: any) {}
  onReset() {
    window.location.reload();
  }
  show(){
    let Date1 = this.billStatusForm.controls['fromDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');

    let Date2 = this.billStatusForm.controls['toDate'].value;
    let tDate = new DatePipe('en-US').transform(Date2, 'yyyy-MM-dd');

    let data = {
      fromdate: fDate!,
      treasurycode: this.TCode.Treasury_Code,
      enddate: tDate!,
      tokenno: this.billStatusForm.controls['FrmToken'].value,
      checkuser: 'A',
      pageIndex: 1,
    };
    this.loader.setLoading(true);
    this.billStatusForm.controls['toDate'].disable();
    this.billStatusForm.controls['fromDate'].disable();
    this.billStatusForm.controls['FrmToken'].disable();
    //this.GetOnlineBillListModal.type = 1
    console.log('Before_Calling_API_BillAuthorization_Result', data);

    //api call of Treasury Officer List
    this.ApiMethods.postresultservice(
      this.ApiService.BillAuthorizationDetails,
      data
    ).subscribe(
      (resp:any) => {
        console.log('After_Calling_API_BillAuthorization_Result', resp);
        if (resp.result.length > 0) {
          this.showTab_Table = true;
          this.dataSource.data = resp.result;
          console.log('str', this.dataSource.data.length);
          // this.GetAutoProcessListdata.sort = this.Sort;
          // this.GetAutoProcessListdata.paginator = this.paginator;
          // this.showTab_Table = true;
          this.loader.setLoading(false);
        } else {
          //this.toastrService.info(CmnMsg, 'Info!');  // Comman Message - No Data Found
          this.snackbar.show('No Data Found !', 'alert');
          //window.location.reload();
          this.dataSource.data = [];
          this.loader.setLoading(false);
          // this.showTab_Table = false;
        }
      },
      (res:any) => {
        console.log('errror message___', res.status);
        if (res.status != 200) {
          //this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert !');
          //let ApiErrMsg = this._helperMsg.APIErrorMsg();
          //this.toastrService.error(ApiErrMsg, 'Alert !');  /// API Error Message
          this.snackbar.show(
            'Something Went Wrong ! Please Try Again',
            'danger'
          );
          this.loader.setLoading(false);
        }
      }
    );
  }
  onsubmit() {
    this.show();
  }
  getBankList() {
    this.ApiMethods.getservice(
      this.ApiService.BankList + this.userinfo.treasCode + '/' + 1
    ).subscribe((resp:any) => {
      console.log('BankList', resp.result);
      let response = resp.result;
      if (response && response.length > 0) {
        this.BankList = response;
      }
    });
  }
  onEdit(item: any) {
    console.log('itembankbranchcode', item.BANKBRANCHCODE);
    console.log('itemchequedate', item.CHEQUEDATE);
    console.log('itemchequeNo', item.CHEQUENO);
    console.log('abc', new Date(item.CHEQUEDATE));

    this.billStatusForm.patchValue({
      ChequeDate: new Date(item.CHEQUEDATE),
      chequeNoctrl: item.CHEQUENO,
      bankName: item.BANKBRANCHCODE,
    });

    // let checkDate = formatDate(new Date(item.Chequedate),'MM-dd-yyyy','en')
    // this.SelectedBank = item.BANKBRANCHCODE;
    // this.chequedate = item.CHEQUEDATE;//moment(checkDate),//moment(item.Chequedate.toString()).format(item.Chequedate);//new Date(item.Chequedate);
    // this.chequeNo = item.CHEQUENO;
    this.dataSource.data.forEach((element: any) => {
      element.RFLAG = true;
    });
    item.RFLAG = false;
    // console.log("item.RFLAG",item.RFLAG);
    this.getBankList();
  }
  onUpdate(item: any) {
    let ecsNonEcsValue;
    ecsNonEcsValue = '';
    this.loader.setLoading(true);
    // console.log('itemTrgRefNo', item.TREASURY_REFNO);
    // console.log('itembankbranchcode', item.Billcode);
    let bankCode = this.billStatusForm.controls['bankName'].value;
    let formattedChequeDate = null;
    let formattedToDate = null;
    let chequeNo;
    if (item.PAYMODE == 'ECS') {
      ecsNonEcsValue = 'E';
      formattedToDate = item.CHEQUEDATE;
      chequeNo = item.CHEQUENO;
    } else {
      ecsNonEcsValue = 'C';
      let myChequetodate = this.billStatusForm.controls['ChequeDate'].value;
      formattedToDate = new DatePipe('en-US').transform(
        myChequetodate,
        'yyyy-MM-dd'
      );
      chequeNo = this.billStatusForm.controls['chequeNoctrl'].value;
    }
    // console.log('myDateUpdatedate', formattedChequeDate);
    let myToDate = new Date();
    formattedChequeDate = new DatePipe('en-US').transform(
      myToDate,
      'yyyy-MM-dd'
    );
    console.log('chequeToDate', formattedToDate);
    let chequeuser = 0;
    // console.log('chequeuser', chequeuser);
    let data = {
      treasuryRef: item.TREASURY_REFNO,
      bankCode: bankCode,
      ecsNonEcs: ecsNonEcsValue,
      chequedate: formattedChequeDate,
      todate: formattedToDate,
      chequeno: chequeNo,
      chequeuser: 0,
    };
    console.log('data', data);
    this.ApiMethods.postresultservice(
      this.ApiService.BillAuthorizationUpdate,
      data
    ).subscribe(
      (resp:any) => {
        console.log('After_Calling_API_BillAuthorization_Result', resp);
        if (resp.result == true && resp.message == 'Success') {
          this.snackbar.show('Update Successfully!!','Success');
          this.show();
          this.loader.setLoading(false);
        } else {
          this.snackbar.show('No Data Found !', 'alert');
          this.dataSource.data = [];
          this.loader.setLoading(false);
        }
      },
      (res:any) => {
        console.log('errror message___', res.status);
        if (res.status != 200) {
          //this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert !');
          //let ApiErrMsg = this._helperMsg.APIErrorMsg();
          //this.toastrService.error(ApiErrMsg, 'Alert !');  /// API Error Message
          this.snackbar.show(
            'Something Went Wrong ! Please Try Again',
            'danger'
          );
          this.loader.setLoading(false);
        }
      }
    );
  }
  onCancel() {
    this.dataSource.data.forEach((element: any) => {
      element.RFLAG = true;
    });
  }

//TreasuryList Bind
gettreasuryList() {
  this.loader.setLoading(true);
  this.treasuryCode = this.userinfo.treasCode;
  this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe(
    (resp:any) => {
      let data = resp.result;
      if (resp.result && resp.result.length > 0) {
        this.treasaryData = resp.result;
      }
      
      this.Treasuryoptions = this.billStatusForm.controls[
        'FrmTreasuryCode'
      ].valueChanges.pipe(
        startWith(''),
        map((value: any) => {
          return typeof value === 'string' ? value : value.BillTypeListarr;
        }),
        map((TreasuryName: any) => {
          return TreasuryName
            ? this._filter(TreasuryName, data)
            : data.slice();
        })
      );
      const treasury = this.treasaryData.filter(
        (item: any) => item.TreasuryCode === this.TCode.Treasury_Code
      )[0];
      this.billStatusForm.patchValue({
        FrmTreasuryCode: treasury,
      });

      this.selectedOption = treasury;
      this.loader.setLoading(false);
    },
    (res:any) => {
      if (res.status != 200) {
        this.loader.setLoading(false);
      }
    }
  );
}
//trasary List Filter function
_filter(value: string, data: any) {
  return data.filter((option: any) => {
    return option.TreasuryName.toLowerCase().includes(value.toLowerCase());
  });
}
//trasary List Display function
displayFn(selectedoption: any) {
  return selectedoption ? selectedoption.TreasuryName : undefined;
}

OnTreasurySelected(SelectTreasury: any) {
  // console.log('befort______Select_Auditor', SelectTreasury.TreasuryCode);

  // this.GetAutoProcessStatusModal.treasuryCode = SelectTreasury.TreasuryCode;
  // this.getBankdata();

}

  get FrmToken() {
    return this.billStatusForm.get('FrmToken');
  }
  // get BillRef() { return this.BillTypeForm.get('BillRef') }
  get FrmTreasuryCode() {
    return this.billStatusForm.get('FrmTreasuryCode');
  }
  get FrmFinYear() {
    return this.billStatusForm.get('FrmFinYear');
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce('Sorted ${sortState.direction}ending');
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
// "BANKBRANCHCODE": 293,
//             "TOKENNO": 67,
//             "SRNO": 1,
//             "NETAMT": 905610,
//             "BANKNAME": "SBI erstwhileS.B.B.j.  COLLECTORATE",
//             "CHEQUENO": null,
//             "PAYMODE": "ECS",
//             "FLAG": "b",
//             "CHEQUEDATE": "19-MAY-23 10.58.27.000000 AM",
//             "VOUCHERNO": null,
//             "BILLTYPE": 0,
//             "RFLAG": "False",
//             "TREASURY_REFNO": 869,
//             "GROSSAMT": 960630,
//             "TOTALRECORD": 3
