import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { LoaderService } from 'src/app/services/loaderservice';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { Helper } from 'src/app/utils/Helper';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import {
  IGetAutoProcessStatus,
  IGetChequeSeriesModal,
  IGetchequeSubmitObject,
} from 'src/app/utils/Master';
import { ApiService } from 'src/app/utils/utility.service';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from 'src/app/utils/snackbar.service';


@Component({
  selector: 'app-transfer-delete-cheque-series',
  templateUrl: './transfer-delete-cheque-series.component.html',
  styleUrls: ['./transfer-delete-cheque-series.component.scss'],
})
export class TransferDeleteChequeSeriesComponent implements OnInit {
  deleteChequeSeries:boolean=false;
  selectNewEmployeeName:any;
  transferDeleteChequeForm: any;
  selectedOption: any;
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = [];
  userinfo: any;
  list: any[] = [];
  UserList: any;
  BankList: any;
  showTab_Table:boolean=false;
  listtable:any;
  tablelist:any;
  loading: any;
  chequeSerDataSource: MatTableDataSource<any> = new MatTableDataSource();

  displayedColumns: string[] = [];
  BankListoptions: Observable<any[]> | undefined;
  UserListoptions: Observable<any[]> | undefined;


  GetAutoProcessStatusModal: IGetAutoProcessStatus = {
    treasuryCode: this.TCode.Treasury_Code,
    tblName: 'TreasuryMst',
  };

  GetchequeSubmitObject: IGetchequeSubmitObject = {
    type: 1,
    treasurycode: this.TCode.Treasury_Code,
    bankBranchCode: 0,
    chequeinit: 0,
    chequefrom: 0,
    chequeto: 0,
    chequeKey: 0,
    runningChqNo: 0,
    issuedId: 0,
    userID: this.UId.UserId,
  };

  constructor(
    public loader: LoaderService,
    private ApiMethods: ApiMethods,
    private TCode: Helper,
    private ApiService: ApiService,
    private UId: Helper,
    private _liveAnnouncer: LiveAnnouncer,
    private snackbar: SnackbarService,
    private finyear_: Helper, 
    private toyear_: Helper,
  ) {


  }

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.chequeSerDataSource.sort = sort;
    this.chequeSerDataSource.sort = sort;
  }
  @ViewChild(MatPaginator) set MatPaginator(paginator:MatPaginator){
    this.chequeSerDataSource.paginator = paginator;
    this.chequeSerDataSource.paginator = paginator;
  }

  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) Sort!: MatSort;

  ngOnInit(): void {

    let financialYr  = this.finyear_.year.toString().substring(2,4) + this.toyear_.finyear.toString().substring(2,4);   // It Shows = 2324

    this.getTreasuryList();
    this.transferDeleteChequeForm = new FormGroup({
      TreasuryControl: new FormControl(''),
      Year: new FormControl({ value:  financialYr, disabled: true }),
      BankData: new FormControl('', [
        Validators.maxLength(40),
        Validators.required,
      ]),
      UserList: new FormControl('', [
        Validators.maxLength(40),
        Validators.required,
      ]),
      deleteChequeSeries:new FormControl('',[])

    

    });


    this.GetAutoProcessStatusModal.treasuryCode = this.TCode.Treasury_Code;


    this.userinfo = this.ApiMethods.getUserInfo();
    this.getBankdata();
    this.getUserdata();
  }

  GetChequeSeriesModal: IGetChequeSeriesModal = {
    type: 2,
    bankBranchCode: 0,
    treasurycode: this.TCode.Treasury_Code,
  };

  GetChequeSeriesModallist: IGetChequeSeriesModal = {
    type: 4,
    bankBranchCode: 0,
    treasurycode: this.TCode.Treasury_Code,
  }

   //  Auditor List filter >>>------------------->
   _filter(value: string, data: any) {
    // console.log("filterval__", value);
    return data.filter((option: any) => {
      // console.log("option_val__", option);
      return option.TreasuryName.toLowerCase().includes(value.toLowerCase());
    });
  }

  displayFn(selectedoption: any) {
   // console.log('display_fun_call aaa', selectedoption.TreasuryName);
    return selectedoption ? selectedoption.TreasuryName : undefined;
  }




  //  Auditor List Select >>>------------------->
  OnTreasurySelected(SelectTreasury: any) {
    this.transferDeleteChequeForm.get('BankData').reset();
    console.log('befort______Select_Auditor', SelectTreasury.TreasuryCode);

    this.GetAutoProcessStatusModal.treasuryCode = SelectTreasury.TreasuryCode;
    this.getBankdata();

  }

  // Call Auditor List API >>>------------------->
  getTreasuryList() {
    console.log('Test Treasury Officer List', this.GetAutoProcessStatusModal);

    console.log('TTTTTTTTTTTTTTTTTTTTTTTTTT__res', this.TCode.Treasury_Code);

    this.loader.setLoading(true);

      // this.ApiMethods.getservice(this.ApiService.autoProcessStatus + 5000 +"/"+this.GetAutoProcessStatusModal.tblName).subscribe(resp => {
      
      this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe((resp:any) => {
     
      console.log('Auditor__res', resp);
      let data = resp.result;

      if (resp.result && resp.result.length > 0) {
        this.TreasuryListarr = resp.result;
        this.Treasuryoptions = this.transferDeleteChequeForm.controls[
          'TreasuryControl'
        ].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            return typeof value === 'string' ? value : value.treasuryCode;
          }),
          map((treasury: any) => {
            return treasury ? this._filter(treasury, data) : data.slice();
          })
        );
        const treasury = this.TreasuryListarr.filter(
          (item: any) => item.TreasuryCode === this.TCode.Treasury_Code
        )[0];
        this.transferDeleteChequeForm.patchValue({
          TreasuryControl: treasury,
        });

        this.selectedOption = treasury;
       // this.displayFn(treasury);
      }
    });
    this.loader.setLoading(false);
  }



  getBankdata() {

   let selectedTreasCode= this.GetAutoProcessStatusModal.treasuryCode;
    this.ApiMethods.getservice(this.ApiService.BankList + selectedTreasCode + '/' + 1 ).subscribe((data:any) => {
      if (data.result.length > 0) {
        this.BankList = data.result;
        console.log('BankList_afterthis', this.BankList);
      }

      this.BankListoptions = this.transferDeleteChequeForm.controls['BankData']
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



  }

  _filterBank(value: string, data: any) {
    return data.filter((option: any) => {
      return option.BANKNAME.toLowerCase().includes(value.toLowerCase())
    });
  }

  getUserdata() {
    let selectedTreasCode= this.GetAutoProcessStatusModal.treasuryCode;
    this.ApiMethods.getservice(this.ApiService.BankUserList + selectedTreasCode + '/MstUsers').subscribe((res:any) => {

      if (res.result.length > 0) {
        this.UserList = res.result;
      }
      console.log('UserList_after', this.UserList);

      this.UserListoptions = this.transferDeleteChequeForm.controls['UserList']
      .valueChanges.pipe(
        startWith(''),
        map((value: any) => {
          console.log("firstmap__", value);
          return typeof value === 'string' ? value : value.UserList
        }),
        map((employeeid: any) => {
          console.log("second__map", employeeid);

          return employeeid ? this._filterUser(employeeid,  this.UserList ) :  this.UserList.slice()
        })
      );



    });
  }

  _filterUser(value: string, data: any) {

    return data.filter((option: any) => {
      return option.employeeid.toLowerCase().includes(value.toLowerCase())
    });
  }

  displayUserFn(selectedoption: any) {
    console.log("displayfuncall");
    return selectedoption ? selectedoption.employeeid : undefined;
  }



  transferDeleteChequeShow() {
    this.deleteChequeSeries=this.transferDeleteChequeForm.value.deleteChequeSeries
    if(this.deleteChequeSeries){
      this.displayedColumns= ['SrNo','ChequeFrom','ChequeTo','IssuedName','RunningChequeNo','Action'];
      this.getChequeDeleteView();
      this.transferDeleteChequeForm.disable();
    }else{
      this.displayedColumns= ['SrNo','ChequeFrom','ChequeTo','IssuedName','RunningChequeNo','NewEmployeeName','Action'];
      this.getChequeSerList();
      this.transferDeleteChequeForm.disable();

    }

  }

  transferDeleteChequeReset() {
    window.location.reload();
  }


  getChequeSerList() {

    let data ={
      "issuedId":this.transferDeleteChequeForm.value.UserList.userid,
      "bankBranchCode":this.transferDeleteChequeForm.value.BankData.BankBranchCode,
      "treasuryCode":this.transferDeleteChequeForm.value.TreasuryControl.TreasuryCode}
    this.ApiMethods.postresultservice(this.ApiService.PMEditChequeIssuedUser, data).subscribe((x:any)=> {
      this.chequeSerDataSource.data=[];
      if (x.result.length > 0) {
        this.showTab_Table = true;
        this.loader.setLoading(true);
        this.listtable = x.result;
        console.log("CHEQUE_Table DATDA----", this.listtable);
        this.tablelist = this.listtable;
        console.log("TABLE___LIST", this.tablelist);
        this.chequeSerDataSource.data= this.tablelist;
      }
      else {
        this.snackbar.show('No Cheque Series alloted to this User !', 'alert');
        this.showTab_Table = false;
        this.loader.setLoading(false);
      }
    });

  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce('Sorted ${sortState.direction}ending');
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  updateTransferChequeSeries(element:any){

    if(this.selectNewEmployeeName !== undefined){

      let data ={
        "issuedId":this.transferDeleteChequeForm.value.UserList.userid,
        "bankBranchCode":this.transferDeleteChequeForm.value.BankData.BankBranchCode,
        "treasuryCode":this.transferDeleteChequeForm.value.TreasuryControl.TreasuryCode,
        "masterKey" :element.masterkey ,
         "newIssueId" : this.selectNewEmployeeName.userid
      }
      this.ApiMethods.postresultservice(this.ApiService.PMUpdateChequeIssuedUse, data).subscribe((x:any) => {
        if (x.result) {

          this.snackbar.show('Transfer Cheque Series Sucessfully !', 'success');
      this.transferDeleteChequeShow();
        }
        else {
          this.snackbar.show('No Cheque Series alloted to this User !', 'alert');

        }
      });

    }else{
      this.snackbar.show('Please Select Transfer Employee !', 'alert');
    }





  }

  OnNewEmployeeNameSelected(element:any){
    this.selectNewEmployeeName=element;
    console.log("newEmployee",element);

  }

  getChequeDeleteView(){
    let data ={
      "issuedId":this.transferDeleteChequeForm.value.UserList.userid,
      "bankBranchCode":this.transferDeleteChequeForm.value.BankData.BankBranchCode,
      "treasurycode":this.transferDeleteChequeForm.value.TreasuryControl.TreasuryCode,

    }
    this.ApiMethods.postresultservice(this.ApiService.getChequeDeleteView, data).subscribe((x:any) => {
      this.chequeSerDataSource.data=[];
      if (x.result.length > 0) {
        this.showTab_Table = true;
        this.loader.setLoading(true);
        this.listtable = x.result;
        console.log("CHEQUE_Table DATDA----", this.listtable);
        this.tablelist = this.listtable;
        console.log("TABLE___LIST", this.tablelist);
        this.chequeSerDataSource.data = this.tablelist;
      }
      else {

        this.snackbar.show('No Cheque Series alloted to this User !', 'alert');
       // window.location.reload();

      }
    });


      }

      deactivateChequeSeries(element:any){
        let data ={
          "issuedId":this.transferDeleteChequeForm.value.UserList.userid,
          "bankBranchCode":this.transferDeleteChequeForm.value.BankData.BankBranchCode,
          "treasurycode":this.transferDeleteChequeForm.value.TreasuryControl.TreasuryCode,
          "chequefrom":"",
          "chequeto":""
        }
        this.ApiMethods.postresultservice(this.ApiService.deactivateChequeSeries, data).subscribe((x:any) => {
          if (x.result) {
            console.log(x);
            this.snackbar.show('Delete Cheque Series Sucessfully !', 'success');
            this.getChequeDeleteView();
          }
          else {
            this.snackbar.show('Not a valid Series !', 'alert');

          }
        });


          }

          displayBankFn(selectedoption: any) {
            console.log("displayfuncall");
            return selectedoption ? selectedoption.BANKNAME : undefined;
          }


            // TO Load Data Searching..............
  applyFilter(filterValue: string) {
    this.chequeSerDataSource.filter = filterValue.trim().toLowerCase();

    if (this.chequeSerDataSource.paginator) {
      this.chequeSerDataSource.paginator.firstPage();
    }
  }

}
