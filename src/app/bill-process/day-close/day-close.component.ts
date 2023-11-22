import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as Val from '../../utils/Validators/ValBarrel'
import { ApiMethods } from '../../utils/ApiMethods';
import { ApiService } from '../../utils/utility.service';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { LoaderService } from 'src/app/services/loaderservice';
import { Helper } from 'src/app/utils/Helper';
import { IGenerateToken, IGetAutoProcessStatus, IPayMangerToken } from 'src/app/utils/Master';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-day-close',
  templateUrl: './day-close.component.html',
  styleUrls: ['./day-close.component.scss']
})
export class DayCloseComponent implements OnInit {
  monthData:any[]=[];

BillStatusTable: string[] = [
  'SrNo',
  'treasuryName',
  'payDayClose',
  'receiptDayClose',
  'unBlockDay',
  'effectiveDate',
  'OpenFOR',
  'adminModifyDate',
  'Action',
];
// @ViewChild(MatPaginator) paginator!: MatPaginator;
// @ViewChild(MatSort) Sort!: MatSort;
dataSource = new MatTableDataSource();
myModel: boolean = true
chequeP_flag: any = ''
bank_typeselect: any = 'R'
BankType: any = [
  {
    "Type": "Payment",
    "TypeC": 'P'
  },
  {
    "Type": "Receipt",
    "TypeC": 'R'
  },


  {
    "Type": "Both",
    "TypeC": 'B'
  },
]


treasury: any;
BankEntryForm: any;

//LIst array
Treasuryoptions: Observable<any[]> | undefined;
TreasuryListarr: any[] = []


BankList: any[] = []
RFLAG: boolean = false
@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) Sort!: MatSort;

  constructor(private datePipe: DatePipe,public dialog: MatDialog, private router: Router, private ApiMethods: ApiMethods, public loader: LoaderService, private _liveAnnouncer: LiveAnnouncer, private ApiService: ApiService, private snackbar: SnackbarService, public finyear_: Helper, private Tcode: Helper, private toyear_: Helper, private usercode_: Helper, private Fyear_: Helper, private asgnId: Helper, private fy_: Helper) {
    history.pushState(null, '', location.href);
  }

  ngOnInit(): void {

   // console.log("treasury--", this.treasury)
    this.BankEntryForm = new FormGroup({
      selcetedMonth: new FormControl(),
      payDayClose: new FormControl(),
      receiptDayClose: new FormControl(),
      unBlockDay: new FormControl(),
      effectiveDate: new FormControl(),
      flag: new FormControl(),
      adminModifyDate: new FormControl(),


    })

    // var currentDate = new Date("01/01/2023");
    // var previousDate = new Date("01/01/2023");
    var currentDate = new Date();
    var previousDate = new Date();

   // currentDate.getLastDateOfMonth(currentDate.getMonth(),currentDate.getFullYear())



   if(currentDate.getMonth()>0){
    previousDate.setMonth(currentDate.getMonth() - 1);
    previousDate.setFullYear(currentDate.getFullYear());

   }else{
    previousDate.setMonth(11);
    previousDate.setFullYear(currentDate.getFullYear()-1);
   }

    this.monthData=[
      {
        monthNum:previousDate.getMonth(),
        month:previousDate.toLocaleString('default', { month: 'long' }),
        year:previousDate.getFullYear()
      },
      {
        monthNum:currentDate.getMonth(),
        month:currentDate.toLocaleString('default', { month: 'long' }),
        year:currentDate.getFullYear()
      }



    ]

    this.getTreasuryClosing();

  }

  getTreasuryClosing() {
    this.loader.setLoading(true);
    var body =
    {
      "type": "2",
      "userId": this.Tcode.UserId,
      "treasuryCode":  this.Tcode.Treasury_Code,
      "status": null,
      "closingDate": null,
      "unblockDate": null,
      "effectiveDate": null,
      "payCloseDate": null,
      "receiptCloseDate": null,
      "closeAcDate": null
  }

    console.log("body_send__", body);
    this.ApiMethods.postresultservice(this.ApiService.treasuryClosing, body).subscribe((resp:any) => {
      console.log("bankdetilas__res", resp);
      if (resp.result && resp.result.length > 0) {
        this.loader.setLoading(false);
        const datar: any[] = resp.result
        datar.map((i: any) => i.RFLAG = false)
        this.dataSource.data = datar
        //this.dataSource.data =[];
        console.log(datar)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.Sort;
      }
    },
      (res:any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          //this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');
          this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger')
        }
      })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onEdit(item: any) {
       // console.log('itembankbranchcode', item);
   this.BankEntryForm.patchValue(item);
    this.dataSource.data.forEach((element: any) => {
      // console.log("elemnt_hai kya__", element);
      element.RFLAG = false
    });
    item.RFLAG = true
  }


  onItemChange(value: any) {
    console.log(" Value is : ", value.checked);
  }

  onCancel(item: any) {
    item.RFLAG = false

  }

  onUpdate(item: any) {
    let unBlockDay= this.BankEntryForm.getRawValue().unBlockDay;
    let payDayClose= this.BankEntryForm.getRawValue().payDayClose;
    let effectiveDate=this.BankEntryForm.getRawValue().effectiveDate;
    unBlockDay=this.datePipe.transform(unBlockDay, 'yyyy-MM-dd');
    payDayClose=this.datePipe.transform(payDayClose, 'yyyy-MM-dd');
    effectiveDate=this.datePipe.transform(effectiveDate, 'yyyy-MM-dd');

    if (window.confirm('Are you sure you want to update !')) {

      if(this.BankEntryForm.getRawValue().flag=="" || this.BankEntryForm.getRawValue().flag==null){
        this.snackbar.show('Please Select Any One !', 'Alert');
        return;
      }

      if(unBlockDay < payDayClose){
        this.snackbar.show('Unblock Date should be greater or equal then Pay/Receipt Day Close', 'Alert');
        return;
      }

      if(effectiveDate < payDayClose){
        this.snackbar.show('Effective Date should be greater or equal then Pay/Receipt Day Close or Unblock Day', 'Alert');
        return;
      }

      var body = {
        "type": "3",
        "userId": this.Tcode.UserId,
        "treasuryCode": this.Tcode.Treasury_Code,
        "unblockDate": this.BankEntryForm.getRawValue().unBlockDay,
        "effectiveDate": this.BankEntryForm.getRawValue().effectiveDate,
        "status": this.BankEntryForm.getRawValue().flag,
        "payCloseDate":  this.BankEntryForm.getRawValue().payDayClose,
        "receiptCloseDate":this.BankEntryForm.getRawValue().receiptDayClose,
        "closingDate": null,
        "closeAcDate": null
      };

      this.loader.setLoading(true);
      this.ApiMethods.postresultservice(this.ApiService.treasuryClosing, body).subscribe((resp:any) => {
        console.log("BankList__udate___res", resp.result);
        if (resp.result) {
          this.loader.setLoading(false);
          this.snackbar.show('Record Successfully Updated !', 'success');
          this.getTreasuryClosing();

        }
      },
        (res:any) => {
          console.log("errror message___", res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
            //this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');
            this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger')
          }
        })
    }
  }


  // get TreasuryControl() { return this.BankEntryForm.get('TreasuryControl') }
  // get BranchName() { return this.BankEntryForm.get('BranchName') }
  // get Address() { return this.BankEntryForm.get('Address') }
  // get IFSC() { return this.BankEntryForm.get('IFSC') }
  // get MICR() { return this.BankEntryForm.get('MICR') }
  // get BSR() { return this.BankEntryForm.get('BSR') }
  // get bankName() { return this.BankEntryForm.get('bankName') }



  closeIIListAC() {
   if( this.BankEntryForm.getRawValue().selcetedMonth==null ){
    this.snackbar.show('Please Select Month', 'alert');
    return;
  }
    let year= this.BankEntryForm.getRawValue().selcetedMonth.year;
    let monthNum=this.BankEntryForm.getRawValue().selcetedMonth.monthNum;
  const nextMonth = new Date(year, monthNum, 1);
  nextMonth.setDate(nextMonth.getDate() - 1);
      var body = {
        "type": "6",
        "userId": this.Tcode.UserId,
        "treasuryCode": this.Tcode.Treasury_Code,
        "unblockDate": null,
        "effectiveDate": null,
        "status": null,
        "payCloseDate":  null,
        "receiptCloseDate":null,
        "closingDate": null,
        "closeAcDate":this.datePipe.transform(nextMonth, 'yyyy-MM-dd')
      };

      this.loader.setLoading(true);
      this.ApiMethods.postresultservice(this.ApiService.treasuryClosing, body).subscribe((resp:any) => {
        if (resp.result) {
          this.loader.setLoading(false);
          this.snackbar.show(resp.result[0].MSG, 'success');
          this.getTreasuryClosing();

        }
      },
        (res:any) => {
          console.log("errror message___", res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
            //this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');
            this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger')
          }
        })
       }

       closeIListAC() {
        if( this.BankEntryForm.getRawValue().selcetedMonth==null ){
         this.snackbar.show('Please Select Month', 'alert');
         return;
       }
         let year= this.BankEntryForm.getRawValue().selcetedMonth.year;
         let monthNum=this.BankEntryForm.getRawValue().selcetedMonth.monthNum;
       const nextMonth = new Date(year, monthNum, 1);
       nextMonth.setDate(10);
           var body = {
             "type": "5",
             "userId": this.Tcode.UserId,
             "treasuryCode": this.Tcode.Treasury_Code,
             "unblockDate": null,
             "effectiveDate": null,
             "status": null,
             "payCloseDate":  null,
             "receiptCloseDate":null,
             "closingDate": null,
             "closeAcDate":this.datePipe.transform(nextMonth, 'yyyy-MM-dd')
           };

           this.loader.setLoading(true);
           this.ApiMethods.postresultservice(this.ApiService.treasuryClosing, body).subscribe((resp:any) => {
             if (resp.result) {
               this.loader.setLoading(false);
               this.snackbar.show(resp.result[0].MSG, 'success');
               this.getTreasuryClosing();

             }
           },
             (res:any) => {
               console.log("errror message___", res.status);
               if (res.status != 200) {
                 this.loader.setLoading(false);
                 //this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');
                 this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger')
               }
             })
            }





}
