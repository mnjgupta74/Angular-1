import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as Val from '../../utils/Validators/ValBarrel'
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import { IGetChequeSeriesfrom, IGetChequeSeriesModal, IGetchequeSubmitObject } from 'src/app/utils/Master';
// import { LoaderService } from 'src/app/shared/loader/loaderservice';
import { Helper } from 'src/app/utils/Helper';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { LoaderService } from 'src/app/services/loaderservice';


@Component({
  selector: 'app-cheque-issue-list',
  templateUrl: './cheque-issue-list.component.html',
  styleUrls: ['./cheque-issue-list.component.scss']
})


export class ChequeIssueListComponent implements OnInit {
  // chequecanclesubmitObject: any = {
  //     type: "",
  //     treasurycode: "",
  //     bankBranchCode: "",
  //     chequeinit: "",
  //     chequefrom: "",
  //     chequeto:"",
  //     chequeKey: "",
  //     runningChqNo:"",
  //     issuedId:""
  // }
  IsDisable: boolean = true;
  checkIssueForm: any;
  BankList: any[] = []
  chequefromdata: any[] = []
  list: any[] = []
  
  //tablelist: any[] = []
  tablelist: MatTableDataSource<ChequeIssueListComponent> = new MatTableDataSource();
  listtable: any[] = []
  listtable1: any[] = []
  value: any[] = []
  chequeserieslist: any[] = []
  CheckSr: any[] = []
  UserList: any[] = []
  SelectMajorHead: any = ''
  userdata: any = []
  bankname: any = '';
  chequestr: any = []
  chequelist: any = []
  chequeInit_get: any = ''
  userinfo: any;
  data: any = [
    // {
    //   value: "Project one",
    // },
    // {
    //   value: "Project two",
    // },
    // {
    //   value: "Project three",
    // }
  ];



  ChooseOption: any = '';
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []

  displayedColumns = [
    'SrNo',
    'ChequeFrom',
    'ChequeTo',
    'ChequeInit',
    'IssuedID',
    'EmployeeId',
    'RunningChequeNo',
    'masterkey',
  ];

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.tablelist.sort = sort;
    this.tablelist.sort = sort;
  }
  @ViewChild(MatPaginator) set MatPaginator(paginator:MatPaginator){
    this.tablelist.paginator = paginator;
    this.tablelist.paginator = paginator;
  }



  showTab_Table: boolean = false
  // MajorHeadoptions: Observable<any[]> | undefined;
  BankListoptions: Observable<any[]> | undefined;
  UserListoptions: Observable<any[]> | undefined;

  constructor(public loader: LoaderService,private http: HttpClient, private ApiMethods: ApiMethods, private _liveAnnouncer: LiveAnnouncer,private ApiService: ApiService, private snackbar: SnackbarService, private finyear_: Helper, private toyear_: Helper, private TCode: Helper, private UId: Helper, private IPAdd: Helper) {

    this.userinfo = this.ApiMethods.getUserInfo();

    this.getBankdata()
  }

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
  }

  GetChequeSeriesModal: IGetChequeSeriesModal = {
    type: 2,
    bankBranchCode: 0,
    treasurycode: this.TCode.Treasury_Code,
  }

  GetChequeSeriesModallist: IGetChequeSeriesModal = {
    type: 4,
    bankBranchCode: 0,
    treasurycode: this.TCode.Treasury_Code,
  }

  GetChequeSeriesfrom: IGetChequeSeriesfrom = {
    type: 3,
    bankBranchCode: 0,
    treasurycode: this.TCode.Treasury_Code,
    chequefrom: 0,
    ChequeInit: 0,
    Ckey: 13929,
  }

  ngOnInit(): void {

    let financialYr  = this.finyear_.year.toString().substring(2,4) + this.toyear_.finyear.toString().substring(2,4);   // It Shows = 2324

    this.checkIssueForm = new FormGroup({
      Banklist: new FormControl('',{ validators: [this.ApiMethods.autocompleteObjectValidator(),Validators.required]}),
    //  UserList: new FormControl('', [Val.maxLength(40), Val.SpecialChar, Val.Required]),
      UserList: new FormControl('',{ validators: [this.ApiMethods.autocompleteObjectValidator(),Validators.required]}),
      ChequeSeries: new FormControl('', [Val.maxLength(40), Val.Required]),
      ChequeFrom: new FormControl({ value: '', disabled: true }, [Val.Required, Val.maxLength(6), Val.Numeric]),

      ChequeTo: new FormControl('', [Val.Required, Val.Numeric]),
      RunningChequeNo: new FormControl('', [Validators.pattern('^\\d{0,6}$'), Val.Required, Val.Numeric, Validators.min(this.GetchequeSubmitObject.chequefrom), Val.Numeric, Validators.min(this.GetchequeSubmitObject.chequeto)]),
      TreasuryControl: new FormControl({}, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
      //Year: new FormControl({ value: "2324", disabled: true }),
      Year: new FormControl({ value:  financialYr, disabled: true }),

    });

    this.getTreasuryList();


  }

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
                 this.Treasuryoptions = this.checkIssueForm.controls['TreasuryControl'].valueChanges.pipe(
                   startWith(''),
                   map((value: any) => {
                     return typeof value === 'string' ? value : value.treasuryCode
                   }),
                   map((treasury: any) => {
         
                     return treasury ? this._filterTreas(treasury, data) : data.slice()
                   })
                 );
                 const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.TCode.Treasury_Code)[0];
                 this.checkIssueForm.patchValue({
                   TreasuryControl: treasury
         
                 })
         
                 if(this.TCode.Treasury_Code !="5000")
                 {
                   this.checkIssueForm.controls['TreasuryControl'].disable();
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

        
  OnMajorHeadSelected(SelectMajorHead: any) {
    console.log("befort______SelectMajorHead", SelectMajorHead);
    console.log("slelction__________option__majorhead", this.SelectMajorHead);
    // this.SaveBudgetModal.majorHead = this.SelectMajorHead.majorheadcode
  }


  displayMajor(selectedoption: any) {
    console.log("displayfuncall");

    return selectedoption ? selectedoption.majorheadname : undefined;
  }

  getUserdata() {
    this.ApiMethods.getservice(this.ApiService.BankUserList + this.userinfo.treasCode + '/MstUsers').subscribe((res:any) => {
      // this.userdata = res;
      // console.log("click event result", $event);
      if (res.result.length > 0) {
        this.UserList = res.result
      }
      // return this.BankList;

      this.UserListoptions = this.checkIssueForm.controls['UserList']
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



      console.log("UserList_after", this.UserList);
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

  getBankdata() {
    this.ApiMethods.getservice(this.ApiService.BankList  + this.userinfo.treasCode + '/' + 1).subscribe((data:any) => {
      // this.data = data;
      if (data.result.length > 0) {
        this.BankList = data.result
        // this.isLoaded = true;
        console.log("BankList_afterthis", this.BankList);
      }

      this.BankListoptions = this.checkIssueForm.controls['Banklist']
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

  getChequeSer() {

    this.loader.setLoading(true);
    this.GetChequeSeriesModal.treasurycode = this.userinfo.treasCode;
    this.GetChequeSeriesModal.bankBranchCode = this.checkIssueForm.value.Banklist.BankBranchCode;

    this.ApiMethods.postresultservice(this.ApiService.ChequeSeries, this.GetChequeSeriesModal).subscribe((resp:any) => {

      this.list = resp.result;
      console.log("CHEQUE_MASTER DATDA----", this.list);
      this.chequeserieslist = this.list;
      this.chequeserieslist.map((value, index) => {
        let x = []
      })
      this.getChequeSerList()
      this.loader.setLoading(false);
    });

    this.getUserdata()

  }


  getuserId() {
    // var value = this.value.bankbranchcode
    // console.log("value is :: ", value);
    console.log("ttttt", this.checkIssueForm.value.UserList.userid)
    this.GetchequeSubmitObject.userID = this.checkIssueForm.value.UserList.userid;
    this.GetchequeSubmitObject.treasurycode = this.userinfo.treasCode;
    let UserId = this.GetchequeSubmitObject.issuedId
    console.log("Selected User Id", UserId);
  }

  getChequeSerList() {

    this.GetChequeSeriesModallist.treasurycode = this.userinfo.treasCode;
    this.GetChequeSeriesModallist.bankBranchCode = this.checkIssueForm.value.Banklist.BankBranchCode;
    this.ApiMethods.postresultservice(this.ApiService.ChequeSeries, this.GetChequeSeriesModallist).subscribe((x:any) => {

      if (x.result.length > 0) {
        this.showTab_Table = true;
        this.listtable = x.result;
        console.log("CHEQUE_Table DATDA----", this.listtable);
        // this.tablelist = this.listtable;
        this.tablelist.data = this.listtable;

        console.log("TABLE___LIST", this.tablelist);
      }
      else {
        //this.snackbar.show('Data Not Found !', 'alert');
        this.showTab_Table = false;
      }
    });

  }


  getChequeSerChange(item: any) {

    this.loader.setLoading(true);

    console.log("item ", item["value"]);

    const data = item["value"].chequeseries;
    const dataInIt = item["value"].ChequeInit;
    var dataChequeTo = item["value"].ChequeTo;
    console.log("CheckInIT Data", dataInIt);

    console.log("data ", data.split(':'));
    let dataS1 = data.split(':')[0];
    const check1 = dataS1.split('-');
    var chequeFrom = check1[0];
    var dataChequeTo = check1[1];
    const dataS2 = data.split(':')[1];
    console.log("S1", dataS1);
    console.log("S2", dataS2)
    this.chequeInit_get = dataS2
    console.log("check1", check1)
    console.log("chequefrom", chequeFrom)
    const check = data.split('-');

    this.checkIssueForm.patchValue({ ChequeFrom: chequeFrom, ChequeTo: dataChequeTo, })
    const chekdata = {
      type: 3,
      //treasurycode: '2100',
      treasurycode: this.userinfo.treasCode,
      bankBranchCode: this.checkIssueForm.value.Banklist.BankBranchCode,
      chequeinit: dataS2,
      chequefrom: chequeFrom,
      chequeKey: dataInIt
    }
    this.ApiMethods.postresultservice(this.ApiService.ChequeSubmit, chekdata).subscribe((x:any) => {
      this.listtable1 = x.result;
      console.log("chequeinsert", this.listtable1)
      if (x.result.Result === "000000") {

        this.checkIssueForm.patchValue({ ChequeFrom: "", ChequeTo: "", })
        this.checkIssueForm.value.ChequeSeries.ChequeFrom = ""
        this.checkIssueForm.value.ChequeSeries.ChequeTo = ""
        this.snackbar.show('Series Not available !', 'alert');

        this.loader.setLoading(false);

      }
      else {
        console.log("CHEQUE_SERIES_ DATDA----", this.listtable1);
        console.log("Ccheckm to value", this.checkIssueForm.value.ChequeSeries.ChequeTo);
      }
        //this.tablelist = this.listtable1;
        this.tablelist.data = this.listtable1;
        this.loader.setLoading(false);

    });
    this.getChequeSerList()
  }




  onSubmit() {

    this.loader.setLoading(true);
    this.GetchequeSubmitObject.issuedId = this.checkIssueForm.value.UserList.userid
    this.GetchequeSubmitObject.bankBranchCode = this.checkIssueForm.value.Banklist.BankBranchCode
    this.GetchequeSubmitObject.chequeinit = this.chequeInit_get
    this.GetchequeSubmitObject.chequefrom = this.checkIssueForm.value.ChequeSeries.ChequeFrom
    this.GetchequeSubmitObject.chequeto = this.checkIssueForm.value.ChequeTo
    this.GetchequeSubmitObject.chequeKey = this.checkIssueForm.value.ChequeSeries.ChequeInit
    this.GetchequeSubmitObject.runningChqNo = this.checkIssueForm.value.RunningChequeNo
    this.GetchequeSubmitObject.treasurycode = this.userinfo.treasCode
    console.log("CHECK CheQUE TO", this.checkIssueForm.ChequeTo);
    console.log("CHECK RunningChequeNo TO", this.checkIssueForm.value.RunningChequeNo);

    if (this.checkIssueForm.value.ChequeTo <= this.GetchequeSubmitObject.chequeto && this.checkIssueForm.value.ChequeTo >= this.GetchequeSubmitObject.chequefrom && this.checkIssueForm.value.RunningChequeNo <= this.GetchequeSubmitObject.chequeto && this.checkIssueForm.value.RunningChequeNo >= this.GetchequeSubmitObject.chequefrom)
    // this.GetchequeSubmitObject.runningChqNo>this.checkIssueForm.value.ChequeFrom
    {
      console.log("OnSubmit final User ID", this.GetchequeSubmitObject)
      this.checkIssueForm.disable();

      this.ApiMethods.postresultservice(this.ApiService.ChequeSubmit, this.GetchequeSubmitObject).subscribe((x:any) => {
        this.listtable1 = x.result;
        if (x.result.Result === "000000") {
          this.snackbar.show('Please Enter Cheque from, Cheque To and Running ChequeNo !', 'alert');
          this.loader.setLoading(false);
        }
        else {
          console.log("CHEQUE_SERIES_ DATDA----", this.listtable1);
          this.snackbar.show('Submitted Sucessfully', 'success');
          this.getChequeSerList();
          this.loader.setLoading(false);
        }


        // this.checkIssueForm.ChequeFrom =""
        // this.checkIssueForm.ChequeTo =""
        // this.checkIssueForm.chequelist=""
        // this.checkIssueForm.UserList=""
        // console.log("rrrrrrrrrrrr>>>>>>", this.checkIssueForm.chequelist)
        // this.tablelist = this.listtable1;
      });
      const banklistValue = this.checkIssueForm.get('Banklist').value;
      //this.checkIssueForm.reset();
      this.checkIssueForm.patchValue({ Banklist: banklistValue });
    }
    else {
      this.snackbar.show('Not a valid Series !', 'alert');
      this.loader.setLoading(false);
    }


  }

  displayBankFn(selectedoption: any) {
    console.log("displayfuncall");
    return selectedoption ? selectedoption.BANKNAME : undefined;
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
      this.tablelist.filter = filterValue.trim().toLowerCase();

      if (this.tablelist.paginator) {
        this.tablelist.paginator.firstPage();
      }
    }


    formReset(){
      window.location.reload();
   }

}

/*

getDistrict() {
  this.state = this.saveAddress.value.pstate;
  this.apiService.getDistrict(this.state).subscribe({
    next: (res:any) => {
      if (res.status = 200) {
        this.Districtdata = res.data
      }
    },
    error: (err) => {

    }
  })
}
 */
