import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
//import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/services/loaderservice';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import * as Val from 'src/app/utils/Validators/ValBarrel';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Helper } from 'src/app/utils/Helper';

export interface ICheckMaster {
  //TreasuryCode: string;
  //type: number;
  BankName: string;
  BankBranchCode: number;
  ChequeFrom: number;
  ChequeTo: number;
  ChequeInit: number;
  chequekey: number;
  // userid: number;
  // ChequeKey: number;

  // "BankName": "BAPUNAGAR S.B.I",
  // "ChequeTo": 679885,
  // "chequekey": 13926,
  // "ChequeInit": 679878,
  // "BankBranchCode": 995,
  // "ChequeFrom": 679878
}

@Component({
  selector: 'app-checkmaster',
  templateUrl: './checkmaster.component.html',
  styleUrls: ['./checkmaster.component.scss'],
})
export class CheckmasterComponent implements OnInit {
  userinfo:any={};
  datatableIsVisiable:boolean= false;
  treasurycode:any;
  userID:any;
  
  constructor(
    private router: Router,
    private ApiMethods: ApiMethods,
    public loader: LoaderService,
    private ApiService: ApiService,
    //private toastrService: ToastrService,
    private snackbar: SnackbarService,
    private finyear_:Helper,
    private toyear_:Helper,
    private TCode:Helper,
    private _liveAnnouncer: LiveAnnouncer
  ) {
    this.getBankList(); // Call Bank List
    this.selectedOption = 0;
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) Sort!: MatSort;
  
  ChooseOption: any = '';
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []
  
  
  ngOnInit(): void {

  this.treasurycode=  this.userinfo.treasCode;
  this.userID  =  this.userinfo.userId;
  let financialYr  = this.finyear_.year.toString().substring(2,4) + this.toyear_.finyear.toString().substring(2,4);   // It Shows = 2324

    this.CheckMasterGrp = new FormGroup({
      frmBank: new FormControl('',{ validators: [this.ApiMethods.autocompleteObjectValidator(),Validators.required] }),
      frmChequeFrom: new FormControl('', [
        Val.Required,
        Val.minLength(6),
        Val.maxLength(6),
        Val.cannotContainSpace,
        Val.Numeric,
      ]),
      frmChequeTo: new FormControl('', [
        Val.Required,
        Val.minLength(6),
        Val.maxLength(6),
        Val.cannotContainSpace,
        Val.Numeric,
      ]),
      frmChequeNo: new FormControl('', [
        Val.Required,
        Val.minLength(6),
        Val.maxLength(6),
        Val.cannotContainSpace,
        //Val.Numeric,
      ]),

      TreasuryControl: new FormControl({}, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
      //Year: new FormControl({ value: "2324", disabled: true }),
      Year: new FormControl({ value:  financialYr, disabled: true }),

    });


    this.getTreasuryList();

    // setTimeout(() => {
    //   this.setValues();
    // }, 2000);
  }
  // setValues(): void {
  //   this.CheckMasterGrp.controls['frmBank'].setValue('111');
  // }
  loading: any;
  CheckMasterGrp: any;
  Bankselected: any = '';
  bankSelect: any;
  BankList: any[] = [];
  selectedOption: any;
  OBListdata: MatTableDataSource<ICheckMaster> = new MatTableDataSource();
  BankListoptions: Observable<any[]> | undefined;
  displayedColumns = [
    'SrNo',
    'BankName',
    'BankBranchCode',
    'ChequeInit',
    'ChequeFrom',
    'ChequeTo',
    'Action',
    // "BankName": "BAPUNAGAR S.B.I",
    //   "ChequeTo": 679885,
    //   "chequekey": 13926,
    //   "ChequeInit": 679878,
    //   "BankBranchCode": 995,
    //   "ChequeFrom": 679878
  ];



        // Call Treasury List API >>>------------------->
   
        getTreasuryList() {
          this.loader.setLoading(true);
           //this.ApiMethods.getservice(this.ApiService.autoProcessStatus + this.GetAutoProcessStatusModal.treasuryCode + "/" + this.GetAutoProcessStatusModal.tblName).subscribe(resp => {
             this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe((resp:any) => {
       
             console.log("Auditor__res", resp);
             let data = resp.result
             if (resp.result && resp.result.length > 0) {
               this.TreasuryListarr = resp.result
               //console.log("Show_Treasury_AuditorList", this.TreasuryListarr);
               this.Treasuryoptions = this.CheckMasterGrp.controls['TreasuryControl'].valueChanges.pipe(
                 startWith(''),
                 map((value: any) => {
                   return typeof value === 'string' ? value : value.treasuryCode
                 }),
                 map((treasury: any) => {
       
                   return treasury ? this._filterTreas(treasury, data) : data.slice()
                 })
               );
               const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.TCode.Treasury_Code)[0];
               this.CheckMasterGrp.patchValue({
                 TreasuryControl: treasury
       
               })
        
               if(this.TCode.Treasury_Code !="5000")
               {
                 this.CheckMasterGrp.controls['TreasuryControl'].disable();
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


  getBankList() {
     console.log('bankList_before', this.BankList);
    this.userinfo= this.ApiMethods.getUserInfo();
    let url= this.ApiService.BankBillList+'/'+this.userinfo.treasCode+'/'+3;
    this.ApiMethods.getservice(url).subscribe((resp:any) => {
       console.log('BankList__res', resp);
      if (resp.result && resp.result.length > 0) {
        this.BankList = resp.result;

      }

      this.BankListoptions = this.CheckMasterGrp.controls['frmBank']
      .valueChanges.pipe(
        startWith(''),
        map((value: any) => {
          console.log("firstmap__", value);
          return typeof value === 'string' ? value : value.BankList
        }),
        map((BANKNAME: any) => {
          console.log("second__map", BANKNAME);

          return BANKNAME ? this._filterBank(BANKNAME,  this.BankList ) :  this.BankList.slice()
        })
      );





    });
    // console.log('BankList_after', this.BankList);
  }
  onBankSelected(BankBranchCode: any) {
    this.OBListdata.data = [];
    // console.log("selecteddddd_bank___", val.target.value);
    //this.bankSelect = val.target.value;
    this.bankSelect = BankBranchCode;
    // console.log("ssssssssss", this.bankSelect);
    this.fetchBankDetails(this.bankSelect);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce('Sorted ${sortState.direction}ending');
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  fetchBankDetails(val: number) {
    this.datatableIsVisiable=true;
    this.OBListdata.data= [];
    this.loader.setLoading(true);
    // let bankCode = val
    let data = {
      treasurycode:this.treasurycode,
      type: 4,  // data fetch
      bankBranchCode: val,
      chequeto: null,
      chequefrom: null,
      chequeinit: null,
      userID:  this.userID,
      chequeKey: 0,
    };
    // console.log('data', data);
    this.ApiMethods.postresultservice(
      this.ApiService.FetchChequeDetails,
      data
    ).subscribe(
      (resp:any) => {
        // console.log('response', resp.result);
        if (resp.result.length > 0) {
          this.OBListdata.data = resp.result;
          // console.log('this.OBListdata.data', this.OBListdata.data);
          this.OBListdata.paginator = this.paginator;
          this.OBListdata.sort = this.Sort;
          this.loader.setLoading(false);
        } else {
          this.snackbar.show('Data Not found !','alert' );
          this.loader.setLoading(false);
          this.datatableIsVisiable=false;
          // this.snackbar.show('Please Try Again!', 'Alert!');
        }
      },
      (res:any) => {

        console.log('errror message___', res.status);
        if (res.status != 200) {
          alert(res.status);
          this.loader.setLoading(false);
          this.snackbar.show('Something Went Wrong ! Please Try Again','danger' );
        }
      }
    );
  }
  InsertCheckList() {
    this.CheckMasterGrp.disable();
    this.datatableIsVisiable=true;
    let bankBranchCode = this.CheckMasterGrp.controls['frmBank'].value.BankBranchCode;
    let chequeto = this.CheckMasterGrp.controls['frmChequeTo'].value;
    let chequefrom = this.CheckMasterGrp.controls['frmChequeFrom'].value;
    let chequeinit = this.CheckMasterGrp.controls['frmChequeNo'].value;
    let FrmCheque = Number(chequefrom);
    let ToCheque = Number(chequeto);
    if(chequeinit.length!=6){
      this.snackbar.show('Cheque Init value should be in 6 digit !', 'alert');
      return;
    }

    if(chequefrom.length!=6){
      this.snackbar.show('Cheque Form value should be in 6 digit !', 'alert');
      return;
    }
    if(chequeto.length!=6){
      this.snackbar.show('Cheque To value should be in 6 digit !', 'alert');
      return;
    }

    if (FrmCheque > ToCheque) {
      this.snackbar.show('Cheque From value should be Greater Cheque To Value !', 'alert');
    } else {
      this.loader.setLoading(true);
      let data = {
        treasurycode: this.treasurycode,
        type: 1,  // data Insert
        bankBranchCode: bankBranchCode,
        chequeto: this.CheckMasterGrp.controls['frmChequeTo'].value,
        chequefrom: this.CheckMasterGrp.controls['frmChequeFrom'].value,
        chequeinit: this.CheckMasterGrp.controls['frmChequeNo'].value,
        userID: this.userID,
        chequeKey: 0,
      };
      console.log('dataInsert', data);

      this.ApiMethods.postresultservice(
        this.ApiService.FetchChequeDetails,
        data
      ).subscribe(
        (resp:any) => {
          console.log('responseshyam', resp.result[0]);
          if (resp.result[0].Result== 0) {
             this.snackbar.show('Cheque Series is Alredy in Use !', 'alert');
            this.fetchBankDetails(bankBranchCode);
            //this.loader.setLoading(false);
          }
          if (resp.result[0].Result == 1) {
             this.snackbar.show('Cheque Series created Successfully !', 'success');
            this.fetchBankDetails(bankBranchCode);

          } else {
            this.loader.setLoading(false);
            // this.snackbar.show('Please Try Again!', 'Alert!');
          }
        },
        (res:any) => {
          console.log('errror message___', res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
            this.snackbar.show('Something Went Wrong ! Please Try Again','danger' );
          }
        }
      );
    }
  }
  DeleteCheck(val: any) {
    if (window.confirm('Are you sure you want to delete this Cheque Series ?')) {
    console.log('check___', val);
    this.loader.setLoading(true);
    let data = {
      treasurycode: this.treasurycode,
      type: 5,  // data Deleted
      bankBranchCode: val.BankBranchCode,
      chequeto: val.ChequeTo,
      chequefrom: val.ChequeFrom,
      chequeinit: val.ChequeInit,
      userID: this.userID,
      chequeKey: val.chequekey,
    };
    console.log('dataDelete', data);

    this.ApiMethods.postresultservice(
      this.ApiService.FetchChequeDetails,
      data
    ).subscribe(
      (resp:any) => {
      //  this.fetchBankDetails(val.BankBranchCode);
        console.log('response', resp);
        if ((resp.result[0].Result == 0)) {
          this.snackbar.show('Cheque Series Deleted Successfully !', 'success');

          this.fetchBankDetails(val.BankBranchCode);

        }
        if ((resp.result[0].Result == 1)) {
          this.snackbar.show('Alredy in Use !', 'alert');
          this.fetchBankDetails(val.BankBranchCode);

          //this.loader.setLoading(false);
        } else {
          this.loader.setLoading(false);
          // this.snackbar.show('Please Try Again!', 'Alert!');
        }
      },
      (res:any) => {
        console.log('errror message___', res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          this.snackbar.show('Something Went Wrong ! Please Try Again','danger' );
        }
      }
    );
  }

}



// TO Load Data Searching..............
applyFilter(filterValue: string) {
  this.OBListdata.filter = filterValue.trim().toLowerCase();

  if (this.OBListdata.paginator) {
    this.OBListdata.paginator.firstPage();
  }
}

   get ChequeNo() { return this.CheckMasterGrp.get('frmChequeNo') }
   get ChequeNoFrom() { return this.CheckMasterGrp.get('frmChequeFrom') }
   get ChequeNoTo() { return this.CheckMasterGrp.get('frmChequeTo') }

   displayBankFn(selectedoption: any) {
    console.log("displayfuncall");
    return selectedoption ? selectedoption.BANKNAME : undefined;
  }

  _filterBank(value: string, data: any) {
    return data.filter((option: any) => {
      return option.BANKNAME.toLowerCase().includes(value.toLowerCase())
    });
  }

  formReset(){
    window.location.reload();

 }
}
