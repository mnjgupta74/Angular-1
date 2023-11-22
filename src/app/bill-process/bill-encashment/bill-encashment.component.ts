
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { LoaderService } from 'src/app/services/loaderservice';
import { IGetBillEncashmentFetchList } from 'src/app/utils/Master';
import { IGetBillEncashmentSubmitList } from 'src/app/utils/Master';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import * as Val from  '../../../app/utils/Validators/ValBarrel'
import * as moment from 'moment';
import { Helper } from 'src/app/utils/Helper';
import { CommonDialogComponent } from '../common-dialog/common-dialog.component'; 
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs/internal/Observable';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/internal/operators/map';

export interface BillEncashmentList {
  billnoid: number;
  officename: string;
  VoucherDate: string;
  ecs: string;
  CashAmt: number;
  GrossAmt: number;
  toflag: string;
  ChequeDate: string;
  billnoidpaymanager: number;
  ScrollAmount: number;
  BillCode: number;
  billtypecode: number;
  VoucherNo: number;
}




@Component({
  selector: 'app-bill-encashment',
  templateUrl: './bill-encashment.component.html',
  styleUrls: ['./bill-encashment.component.scss']
})

export class BillEncashmentComponent implements OnInit {


  BillEncashmentListdata: MatTableDataSource<BillEncashmentList> = new MatTableDataSource();
  displayedColumns = [
    'SrNo',
    'officename',
    'ChequeDate',
    'CashAmt',
    'GrossAmt',
    'ScrollAmount',
    'ViewBill',
  ];


  // Form Module
  BillEncashmentForm: any;
  BillEncashmentViewBillForm: any;
  loading: any;
  showTab_Table: boolean = false
  showTab_Label: boolean = false
  //BillEncashmentDetails: any[] = [];
  BillEncashmentDetails: MatTableDataSource<BillEncashmentList> = new MatTableDataSource();
  fetchedBillCode: any;
  newVoucherNo: any;

  fetchedCashAmt: any;
  fetchedScrollAmt: any;


  popup = false;
  name = 'Angular';

 
 ChooseOption: any = '';
 Treasuryoptions: Observable<any[]> | undefined;
 TreasuryListarr: any[] = []
 IP:any

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.BillEncashmentDetails.sort = sort;
    this.BillEncashmentDetails.sort = sort;
  }
  @ViewChild(MatPaginator) set MatPaginator(paginator:MatPaginator){
    this.BillEncashmentDetails.paginator = paginator;
    this.BillEncashmentDetails.paginator = paginator;
  }

  BillEncashmentFetchListModal: IGetBillEncashmentFetchList = {
    treasuryCode: this.TCode.Treasury_Code,
    voucherdate: "",
    tokenNo: 0

  }



  BillEncashmentSubmitListModal: IGetBillEncashmentSubmitList = {
    treasuryCode: this.TCode.Treasury_Code,
    voucherdate: "",
    userid   : this.UId.UserId,
    billcodenew: 0,
    ipaddress : this.IPAdd.IpAddress,
  }


  constructor(private router: Router, private ApiMethods: ApiMethods, public loader: LoaderService, private ApiService: ApiService, private snackbar: SnackbarService, private _liveAnnouncer: LiveAnnouncer, public _helperMsg: Helper,private finyear_:Helper,private toyear_:Helper,private TCode:Helper,private UId:Helper,private IPAdd:Helper,public dialog: MatDialog) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
    };
    this.IP= this.ApiMethods.clientIP;
  }



  ngOnInit() {
    console.log('Bill Encashment FetchList');

    let financialYr  = this.finyear_.year.toString().substring(2,4) + this.toyear_.finyear.toString().substring(2,4);   // It Shows = 2324

    // Bill Encashment Form
    this.BillEncashmentForm = new FormGroup({
      TokenNum: new FormControl('', [Val.Required, Val.minLength(1), Val.maxLength(8), Val.cannotContainSpace, Val.Numeric]),
      VoucherDate: new FormControl({ value: new Date(), disabled: false }, [Val.Required, Val.maxLength(12)]),
      TreasuryControl: new FormControl({}, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
      //Year: new FormControl({ value: "2324", disabled: true }),
      Year: new FormControl({ value:  financialYr, disabled: true }),
    });


    // Bill Encashment View Bill Form
    this.BillEncashmentViewBillForm = new FormGroup({
      tokennoViewBill: new FormControl({ value: "", disabled: true }),
      Billnoid: new FormControl({ value: "", disabled: true }),
      ddodetail: new FormControl({ value: "", disabled: true }),
      ddobilldetail: new FormControl({ value: "", disabled: true }),
      budgethead: new FormControl({ value: "", disabled: true }),
      officeid: new FormControl({ value: "", disabled: true }),
      ddocode: new FormControl({ value: "", disabled: true }),
      billtypecode: new FormControl({ value: "", disabled: true }),
      divisioncode: new FormControl({ value: "", disabled: true }),
      paymode: new FormControl({ value: "", disabled: true }),
      grossamount: new FormControl({ value: "", disabled: true }),
      netamount: new FormControl({ value: "", disabled: true }),

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
               this.Treasuryoptions = this.BillEncashmentForm.controls['TreasuryControl'].valueChanges.pipe(
                 startWith(''),
                 map((value: any) => {
                   return typeof value === 'string' ? value : value.treasuryCode
                 }),
                 map((treasury: any) => {
       
                   return treasury ? this._filterTreas(treasury, data) : data.slice()
                 })
               );
               const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.TCode.Treasury_Code)[0];
               this.BillEncashmentForm.patchValue({
                 TreasuryControl: treasury
       
               })
       
               
                if(this.TCode.Treasury_Code !="5000")
                {
                  this.BillEncashmentForm.controls['TreasuryControl'].disable();
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


  // Function : Call Bill Encashment Fetch API >>>------------------->
  GetBillEncashmentFetch() {
    

    
    // Get TokenNum Page Control value

    let Date = this.BillEncashmentForm.controls['VoucherDate'].value;
    //let voucherDate = moment(Date).format('YYYY-MM-DD h:mm:ss')
    let voucherDate = moment(Date).format('YYYY-MM-DD')
    

    this.BillEncashmentFetchListModal.tokenNo = this.BillEncashmentForm.controls['TokenNum'].value;
    this.BillEncashmentFetchListModal.voucherdate = voucherDate;
    // this.BillEncashmentFetchListModal.voucherdate = "";


    this.loader.setLoading(true);
    //this.GetOnlineBillListModal.type = 1
    console.log("Before_Calling_API_Bill_Encashment_Fetch_Result", this.BillEncashmentFetchListModal);

    //api call of Treasury Officer List
    //this.ApiMethods.getservice(this.ApiService.TreasuryOfficerList + this.GetTreasOfficeListModal.type+ '/' + this.GetTreasOfficeListModal.tokenNo + '/' + this.GetTreasOfficeListModal.userId+ '/' + this.GetTreasOfficeListModal.treasuryCode+ '/' + this.GetTreasOfficeListModal.auditor).subscribe(resp => {
    this.ApiMethods.postresultservice(this.ApiService.BillEncashmentFetch, this.BillEncashmentFetchListModal).subscribe((resp:any) => {

      console.log("After_Calling_API_Bill_Encashment_Fetch_Result", resp);

      if (resp.result.length > 0) {

        this.BillEncashmentForm.disable();
        
        if (resp.result[0].toflag == null) {
          let Enmsg1 = this._helperMsg.En1();
          this.snackbar.show(Enmsg1, 'alert');     // For Encashment Validation Message - 1
          this.BillEncashmentForm = new FormGroup({
            GenVcr: new FormControl({ value: 'GV', disabled: true })
          });

        }

        if (resp.result[0].toflag == "C" || resp.result[0].toflag == "O") {
          let Enmsg2 = this._helperMsg.En2();
          this.snackbar.show(Enmsg2, 'alert');     // For Encashment Validation Message - 2
          this.BillEncashmentForm = new FormGroup({
            GenVcr: new FormControl({ value: 'GV', disabled: true })
          });

        }
        if ((resp.result[0].ChequeNo == null || resp.result[0].ChequeNo == "" || resp.result[0].ChequeNo == "0") && (resp.result[0].CashAmt > 0) && (resp.result[0].ecs == "C")) {
          let Enmsg3 = this._helperMsg.En3();
          this.snackbar.show(Enmsg3, 'alert');    // For Encashment Validation Message - 3
          this.BillEncashmentForm = new FormGroup({
            GenVcr: new FormControl({ value: 'GV', disabled: true })
          });

        }


        if ((resp.result[0].CashAmt > 0) && (resp.result[0].ecs == "C")) {
          if (resp.result[0].dispatchdate == null) {
            let Enmsg4 = this._helperMsg.En4();
            this.snackbar.show(Enmsg4, 'alert');   // For Encashment Validation Message - 4
            this.BillEncashmentForm = new FormGroup({
              GenVcr: new FormControl({ value: 'GV', disabled: true })
            });
          }

          if (resp.result[0].BankSoftCopyFlag == "N") {
            let Enmsg5 = this._helperMsg.En5();
            this.snackbar.show(Enmsg5, 'alert');      // For Encashment Validation Message - 5
            this.BillEncashmentForm = new FormGroup({
              GenVcr: new FormControl({ value: 'GV', disabled: true })
            });
          }
        }


        if ((resp.result[0].CashAmt == 0) && (resp.result[0].ecs == "E")) {
          if (resp.result[0].ecs == "E") {
            if (resp.result[0].billnoid != resp.result[0].billnoidpaymanager) {
              let Enmsg6 = this._helperMsg.En6();
              this.snackbar.show(Enmsg6, 'alert');  // For Encashment Validation Message - 6
              this.BillEncashmentForm = new FormGroup({
                GenVcr: new FormControl({ value: 'GV', disabled: true })
              });
            }
          }

        }


        console.log("Bill_Encashment_Fetch__result", resp.result);
        //this.BillEncashmentListdata.data = resp.result;
        this.showTab_Table = true;
       

        //this.BillEncashmentDetails = resp.result;
        this.BillEncashmentDetails.data = resp.result;
        this.fetchedBillCode = resp.result[0].BillCode;


        this.fetchedCashAmt = resp.result[0].CashAmt;
        this.fetchedScrollAmt = resp.result[0].ScrollAmount;

       

        // this.BillEncashmentListdata.paginator = this.paginator;
        // this.BillEncashmentListdata.sort = this.Sort;
        this.loader.setLoading(false);
        document.getElementById("myelem")?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      

        //   Show "showTab_Label" When New Voucherno Generate
        if (resp.result[0].VoucherNo > 0) {
          this.showTab_Label = true;
          this.BillEncashmentForm = new FormGroup({
            NewVoucherNo: new FormControl({ value: '', disabled: true }),   // disabled  VoucherNo
            NewVoucherDate: new FormControl({ value: '', disabled: true }), // disabled  VoucherDate
          });

          this.BillEncashmentForm.controls['NewVoucherNo'].value = resp.result[0].VoucherNo;
          this.BillEncashmentForm.controls['NewVoucherDate'].value = resp.result[0].VoucherDate;
        }


      }
      else {
        //this.toastrService.info('No Data Found !', 'Info!');
        let CmnMsg = this._helperMsg.CommanMsg();
        this.snackbar.show(CmnMsg, 'alert');  // Comman Message - No Data Found

        this.loader.setLoading(false);
        this.BillEncashmentListdata.data = [];
      }
    },
      (res:any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          //this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert !');
          let ApiErrMsg = this._helperMsg.APIErrorMsg();
          this.snackbar.show(ApiErrMsg, 'alert');  /// API Error Message 

        }
      }
    );

  }

  // Function : Reset >>>------------------->
  GetBillEncashmentReset() {
    window.location.reload();
  }


  // Function : Call Bill Encashment Submit API >>>------------------->
  GetBillEncashmentSubmit() {

    console.log("QQQQQQQQQQQQQQQQQQQQQQQQQQQ", this.fetchedCashAmt);
    console.log("RRRRRRRRRRRRRRRRRRRRRRRRRRRR", this.fetchedScrollAmt);

    if (this.fetchedCashAmt != this.fetchedScrollAmt) {
      let Enmsg10 = this._helperMsg.En10();
      this.snackbar.show(Enmsg10, 'alert');  //Voucher And Scroll Amount Not Match Msg
      this.loader.setLoading(false);
    }
    else {
      let Date = this.BillEncashmentForm.controls['VoucherDate'].value;
      let voucherDate = moment(Date).format('YYYY-MM-DD h:mm:ss')
      this.BillEncashmentSubmitListModal.voucherdate = voucherDate;
      this.BillEncashmentSubmitListModal.billcodenew = this.fetchedBillCode;

      this.loader.setLoading(true);

      console.log("Before_Calling_API_Bill_Encashment_Submit_Result", this.BillEncashmentSubmitListModal);

      this.ApiMethods.postresultservice(this.ApiService.BillEncashmentSubmit, this.BillEncashmentSubmitListModal).subscribe((resp:any) => {

        console.log("After_Calling_API_Bill_Encashment_Submit_Result", resp);

        this.newVoucherNo = resp.result.MaxVoucher;

        if (resp.result.MaxVoucher > 0) {

          //this.toastrService.success('TV No. Generated !', 'Success !');
          let Enmsg7 = this._helperMsg.En7();
          this.snackbar.show(Enmsg7, 'auccess');  // TV No. Generated Msg

          this.loader.setLoading(false);
          this.showTab_Label = true

          if (resp.result.MaxVoucher > 0) {

            // this.toastrService.success('TV No. Generated !', 'Success !');
            let Enmsg7 = this._helperMsg.En7();
            this.snackbar.show(Enmsg7, 'success');  // TV No. Generated Msg
            this.loader.setLoading(false);
            this.showTab_Label = true

            this.BillEncashmentForm = new FormGroup({
              NewVoucherNo: new FormControl({ value: '', disabled: true }),
              NewVoucherDate: new FormControl({ value: '', disabled: true }),
            });

            let voucherDate = moment(Date).format('DD-MM-YYYY')
            this.BillEncashmentForm.controls['NewVoucherNo'].value = this.newVoucherNo;
            this.BillEncashmentForm.controls['NewVoucherDate'].value = voucherDate;
            //window.location.reload();
          }


          else if (resp.result.MaxVoucher == -5) {
            this.loader.setLoading(false);
            let Enmsg8 = this._helperMsg.En8();
            this.snackbar.show(Enmsg8, 'alert');  // Day has been closed
          }

          else {
            //this.toastrService.info('Not TV Generated !', 'Info!');
            let Enmsg9 = this._helperMsg.En9();
            this.snackbar.show(Enmsg9, 'alert');  // Not TV Generated Msg

            this.loader.setLoading(false);
            this.BillEncashmentListdata.data = [];
          }
        }
      },
        (res:any) => {
          console.log("errror message___", res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
            //this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert !');
            let ApiErrMsg = this._helperMsg.APIErrorMsg();
            this.snackbar.show(ApiErrMsg, 'alert');  /// API Error Message 

          }
        }
      );
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
    this.BillEncashmentListdata.filter = filterValue.trim().toLowerCase();

    if (this.BillEncashmentListdata.paginator) {
      this.BillEncashmentListdata.paginator.firstPage();
    }
  }




  // common popup For 'EncashmentViewBillDialog' ------------------------------->
      GetViewBillDetail() {
  
        const EncashdialogRef = this.dialog.open(CommonDialogComponent,
        {
          panelClass: 'dialog-w-50', autoFocus: false
          ,
          height: "auto",
          width: "50%",
          data: {
            EncashfetchedBillCode: this.fetchedBillCode ,
           
            //field: field,
            id: 'EncashmentViewBillDialog',
            //btnText: btnText
            // reasonBillCode:billcode
          }
          
        }
      );
     
    }
 



  get TokenNum() { return this.BillEncashmentForm.get('TokenNum') }
  get VoucherDate() { return this.BillEncashmentForm.get('VoucherDate') }

}

