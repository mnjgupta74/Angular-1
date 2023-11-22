import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { LoaderService } from 'src/app/services/loaderservice';
import * as Val from '../../utils/Validators/ValBarrel'
import { ApiMethods } from '../../utils/ApiMethods';
import { ApiService } from '../../utils/utility.service';
import { DatePipe, formatDate } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
//import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import "jspdf-autotable";
import { TrackTransaction, pdPassbookDetail } from '../Interface';
import autoTable from 'jspdf-autotable';
import { Helper } from 'src/app/utils/Helper';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, map, startWith } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogComponent } from 'src/app/bill-process/common-dialog/common-dialog.component';
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

export const dateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const start = control.get('fromDate');
  const end = control.get('toDate');  
  return start?.value !== null && end?.value !== null && start?.value <= end?.value 
  ? null :{ dateValid:true };
    }
    


@Component({
  selector: 'app-pdpassbookformat-report',
  templateUrl: './pdpassbookformat-report.component.html',
  styleUrls: ['./pdpassbookformat-report.component.scss']
})
export class PdpassbookformatReportComponent implements OnInit {

  @ViewChild('test', { static: false }) el!: ElementRef;
    filename = "PdpassbookformatReport.xlsx";
    exportcompletedata:any[]=[]
  @ViewChild(MatPaginator) set MatPaginator(paginator: MatPaginator) {
   this.ReportData.paginator = paginator;
 }
  @ViewChild(MatSort) set matSort(sort: MatSort) {
   this.ReportData.sort = sort;
  }
   ReportData: MatTableDataSource<any> = new MatTableDataSource();
   displayedColumns = [
         'SrNo',
         'transdate',
         'openAmt', 
         'rcptamt', 
         'expenditure', 
         'CurrAmt',
         'status'
         ]

   budgetHeadlist: Observable<any[]> | undefined;
   PdAccountNolist: Observable<any[]> | undefined;
   budgetHeadData:any;
   PdAccountNoData:any;
   reportDetailsCard:boolean =false;
   datepicker: any = formatDate(new Date(), 'dd/MM/yyyy', 'en');
   picker1: any = formatDate(new Date(), 'dd/MM/yyyy', 'en');
   picker2: any = formatDate(new Date(), 'dd/MM/yyyy', 'en');
   transactionref: boolean = false;
   Transactionreportform: any;
   pdPassbookreportform: any;//
   Report: any = [];
   //filename = "samplesheet.xlsx";
 
  
   // Model Track OF Reports
   pdPassbookDetail: pdPassbookDetail = {
     fromdate: '',
     toDate: '',
     treasuryCode: this.Tcode.Treasury_Code,
     budgethead:"",
     pdAccNo:0,
   }
   reportDetails: any = {
    Receiving: 0,
    Blockamt: 0,
    Expenditure: 0,
    OpeningBal: 0,
    data: false,
  };

  constructor(
    public finyear_: Helper,
    private Tcode: Helper,
    private toyear_: Helper,
    private router: Router,
    private ApiMethods: ApiMethods,
    public loader: LoaderService,
    private ApiService: ApiService,
    private snackbar: SnackbarService,
    public _helperMsg: Helper,
    public dialog: MatDialog
  ) {
    history.pushState(null, '', location.href);
  }

  max = new Date();
  ChooseOption: any = '';
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = [];

  ngOnInit(): void {
    this.pdPassbookreportform = new FormGroup(
      {
        fromDate: new FormControl({ value: null, disabled: false }, [
          Validators.required,
          Validators.maxLength(12),
        ]),
        toDate: new FormControl({ value: null, disabled: false }, [
          Validators.required,
          Validators.maxLength(12),
        ]),
        TreasaryCode: new FormControl(
          { value: this.pdPassbookDetail.treasuryCode },
          {
            validators: [
              this.ApiMethods.autocompleteObjectValidator(),
              Validators.required,
            ],
          }
        ),
        budgetHead: new FormControl('0', {validators: [this.ApiMethods.autocompleteObjectValidator(),Validators.required]}),
        pdAccNum: new FormControl('', [this.ApiMethods.autocompleteObjectValidator(),
          Val.maxLength(40),
          Val.SpecialChar,
          Validators.required,
        ]),
      },
      { validators: dateValidator }
    );

    this.GetBudgetHeadData();
    this.getTreasuryList();
  }

  // Call Treasury List API >>>------------------->

  getTreasuryList() {
    this.loader.setLoading(true);

    this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe(
      (resp:any) => {
        let data = resp.result;
        if (resp.result && resp.result.length > 0) {
          this.TreasuryListarr = resp.result;

          this.Treasuryoptions = this.pdPassbookreportform.controls[
            'TreasaryCode'
          ].valueChanges.pipe(
            startWith(''),
            map((value: any) => {
              return typeof value === 'string' ? value : value.treasuryCode;
            }),
            map((treasury: any) => {
              return treasury
                ? this._filterTreas(treasury, data)
                : data.slice();
            })
          );
          const treasury = this.TreasuryListarr.filter(
            (item: any) => item.TreasuryCode === this.Tcode.Treasury_Code
          )[0];
          this.pdPassbookreportform.patchValue({
            TreasaryCode: treasury,
          });

          this.pdPassbookreportform.controls['TreasaryCode'].disable();
        }
      }
    );
    this.loader.setLoading(false);
  }

  _filterTreas(value: string, data: any) {
    return data.filter((option: any) => {
      return option.TreasuryName.toLowerCase().includes(value.toLowerCase());
    });
  }

  displayTreasFn(selectedoption: any) {
    return selectedoption ? selectedoption.TreasuryName : undefined;
  }

  displayBudgetHead(selectedoption: any) {
    return selectedoption ? selectedoption.groupsubheadname : undefined;
  }

  // Getting BudgetHead Details
  GetBudgetHeadData() {
    this.ApiMethods.getservice(
      this.ApiService.fetchGroupSubHead + 3 + '/' + null
    ).subscribe((data:any) => {
      if (data.result.length > 0) {
        this.budgetHeadData = data.result;
      }
      this.budgetHeadlist = this.pdPassbookreportform.controls['budgetHead'].valueChanges.pipe(
        startWith(''),
        map((value: any) => {
          return typeof value === 'string' ? value : value.groupsubheadname;
        }),
        map((groupsubheadname: any) => {
          return groupsubheadname
            ? this._filterSubHead(groupsubheadname, this.budgetHeadData)
            : this.budgetHeadData.slice();
        })
      );
    });
  }

  _filterSubHead(value: string, data: any) {
    return data.filter((option: any) => {
      return option.groupsubheadname
        .toLowerCase()
        .includes(value.toLowerCase());
    });
  }

  onBudgetHeadSelected() {
    this.pdPassbookreportform.controls['pdAccNum'].setValue('');
    let budgetHeadcode = this.pdPassbookreportform.value.budgetHead.code;

    // Calling PD Account Data
    this.ApiMethods.getservice(
      this.ApiService.fetchpdaccount +
        this.pdPassbookDetail.treasuryCode +
        '/' +
        budgetHeadcode
    ).subscribe((data:any) => {
      this.PdAccountNoData = data.result;
      if (data.result.length <= 0) {
        this.snackbar.show(
          'No Pd Account Found for This Budget Head !',
          'alert'
        );
      }
      this.PdAccountNolist = this.pdPassbookreportform.controls[
        'pdAccNum'
      ].valueChanges.pipe(
        startWith(''),
        map((value: any) => {
          return typeof value === 'string' ? value : value.PdAccountNoData;
        }),
        map((PdAccName: any) => {
          return PdAccName
            ? this._filterPdAccount(PdAccName, this.PdAccountNoData)
            : this.PdAccountNoData.slice();
        })
      );
    });
  }

  _filterPdAccount(value: string, data: any) {
    return data.filter((option: any) => {
      return option.PdAccName.toLowerCase().includes(value.toLowerCase());
    });
  }

  displayPdAccountNo(selectedoption: any) {
    return selectedoption ? selectedoption.PdAccName : undefined;
  }

  // post main mthod
  onShowPassbookReport() {
    console.log(this.pdPassbookreportform.controls['pdAccNum'].value);
    
    if (
      this.pdPassbookreportform.controls['fromDate'].value == null ||
      this.pdPassbookreportform.controls['toDate'].value == null
    ) {
      this.Report = [''];
      this.transactionref = false;
      this.snackbar.show('Please Select Date !', 'alert');
    } else {
      this.loader.setLoading(true);
      let Date1 = this.pdPassbookreportform.controls['fromDate'].value;
      let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');

      let Date2 = this.pdPassbookreportform.controls['toDate'].value;
      let tDate = new DatePipe('en-US').transform(Date2, 'yyyy-MM-dd');

      this.pdPassbookDetail.fromdate = fDate!;
      this.pdPassbookDetail.toDate = tDate!;
      this.pdPassbookDetail.budgethead =
        this.pdPassbookreportform.controls['budgetHead'].value.code; // this.TransactionModel.todate = this.Transactionreportform.controls['toDate'].value;
      this.pdPassbookDetail.pdAccNo = Number(
        this.pdPassbookreportform.controls['pdAccNum'].value.PdAccNo

      ); // this.TransactionModel.todate = this.Transactionreportform.controls['toDate'].value;

      this.transactionref = false;

      // current Status Api Call
      this.ApiMethods.postresultservice(
        this.ApiService.getpdCurrentStatus,
        this.pdPassbookDetail
      ).subscribe(
        (user: any) => {
          this.Report = user.result;
          if (this.Report.length <= 0) {
            this.snackbar.show('No Data Found !', 'alert');
            this.loader.setLoading(false);
          } else {
            this.Report = user.result;
            this.exportcompletedata=user.result;
            this.reportDetailFunc(this.Report);
            if (user.result['out_str1'].length > 0) {
              this.addCurrentNOpeingAmt(user.result['out_str1'], this.Report);
            } else {
              this.ReportData.data = [];
            }

            this.transactionref = true;
            this.loader.setLoading(false);
          }
        },
        (res:any) => {
          if (res.status != 200) {
            this.loader.setLoading(false);
            this.snackbar.show(
              'Something Went Wrong! Please Try Again',
              'danger'
            ); /// API Error Message
          }
        }
      );
    }
  }
  addCurrentNOpeingAmt(data: any, all: any) {
    let Arr: any = [];
    let inObj = all['out_str'][0];
    data.forEach((ele: any, i: any) => {
      if (i == 0) {
        Arr.push({
          ...ele,
          openAmt: inObj.OpeningBal,
          CurrAmt: inObj.OpeningBal + ele.rcptamt - ele.expenditure,
        });
      } else {
        Arr.push({
          ...ele,
          openAmt: Arr[i - 1].CurrAmt,
          CurrAmt: Arr[i - 1].CurrAmt + ele.rcptamt - ele.expenditure,
        });
      }
    });

    this.ReportData.data = Arr;
  }

  reportDetailFunc(data: any) {
    if (data['out_str']?.length > 0) {
      let inObj = data['out_str'][0];
      this.reportDetails.OpeningBal = inObj.OpeningBal;
      this.reportDetails.Blockamt = inObj.Blockamt;
      this.reportDetails.Expenditure = inObj.Expenditure;
      this.reportDetails.Receiving = inObj.Receiving;
      this.reportDetails.data = true;
      this.reportDetailsCard = true;
    } else {
      // this.reportDetailsCard =true
      // this.reportDetails.data = false;
    }
  }

  applyFilter(filterValue: string) {
    this.ReportData.filter = filterValue.trim().toLowerCase();
    if (this.ReportData.paginator) {
      this.ReportData.paginator.firstPage();
    }
  }

  //export to pdf
  makePdf() {

    let str:string='';
    var Heading: any = 
      ['Sr No.','Date',' Opening Amount','Receiving Amount','Expenditure','Current Balance','Status']
    
    let table = document.createElement('table');
    table.setAttribute('id','testpdTable');
    let heasRow=''
    Heading.forEach((value:any)=> {
      heasRow = heasRow+`<th scope="col" >${value}</th>`
    })
    heasRow= `<tr>${heasRow} <tr> `
    let tableData = this.ReportData.data.map((value1:any,index) => {
    
    str =  str + `<td >${index+1}</td>`
    this.displayedColumns.map((value:any)=> {
      if(value !==  'SrNo'){
        str=  str + `<td >${value1[value]}</td>`
        
      }
  
    })
  
    let str1 =`<tr>${str} <tr> `
    str=''
      return (
      str1
      );
  
    }).join('');
    const footer:any = document.querySelector("#footer");
    // footer.setAttribute('class','thead-dark')
    table.innerHTML = `<thead><tr>${heasRow} <tr></thead> `+ `<tbody>${tableData}</tbody>`
    var doc = new jsPDF('l', 'mm', 'a4');
    autoTable(doc, { html: table });
    doc.text('PD Passbook Format Report', 130, 10);
    doc.text('https://rajkosh.rajasthan.gov.in', 10, 200);
    doc.save('PDPassbookFormatReport.pdf');
  }

  onReset() {
    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //   this.router.navigate(['/PdPassbookformat']);
    // });
  //  window.location.reload();

    this.pdPassbookreportform.enable();
   this.pdPassbookreportform.controls['TreasaryCode'].disable();
   this.pdPassbookreportform.controls['fromDate'].setValue( new Date());
  this.pdPassbookreportform.controls['toDate'].setValue( new Date());
  this.pdPassbookreportform.controls['budgetHead'].setValue('');
  this.pdPassbookreportform.controls['pdAccNum'].setValue('');
   this.reportDetailsCard = false;
   this.transactionref = false;
  }

  calculateTotal() {
    return this.ReportData.data.reduce(
      (accum: any, curr: any) => accum + curr?.rcptamt,
      0
    );
  }

  calculateExp() {
    return this.ReportData.data.reduce(
      (accum: any, curr: any) => accum + curr?.expenditure,
      0
    );
  }

  validateDates(field: string) {
    const start = this.pdPassbookreportform.controls['fromDate'].value;
    const end = this.pdPassbookreportform.controls['toDate'].value;
    if (start !== null && end !== null && start > end) {
      if (field == 'fromDate') {
        this.snackbar.show('start date should be less then End date!', 'alert');
        this.pdPassbookreportform.controls['fromDate'].reset();
      } else {
        this.snackbar.show(
          'End date should be grater then start date!',
          'alert'
        );
        this.pdPassbookreportform.controls['toDate'].reset();
      }
    }
  }

  get TreasaryCode() {
    return this.Transactionreportform.get('TreasaryCode');
  }
  get Transactionform() {
    return this.Transactionreportform;
  }

  showPopUp(field: string,rowData:any) {
    let payload:any = {}
    let UrlKey=''
    let heading=''
    let method=''
    console.log(rowData)
  
  if(field == 'Blockamt'){  
    
    payload.BH = this.pdPassbookDetail.budgethead;
    payload.PdAcc = this.pdPassbookDetail.pdAccNo;
    payload.TreasCode = this.pdPassbookDetail.treasuryCode;
    UrlKey = this.ApiService.AmtforPdAcc+  '/' +this.pdPassbookDetail.treasuryCode +'/' + this.pdPassbookDetail.budgethead + '/' + this.pdPassbookDetail.pdAccNo,
    heading = 'Block PD Token',
    method = 'GET'
  }else if(field == 'rcptamt'){
    let Date1 =  rowData.transdate ;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');
    payload.treasuryCode =this.pdPassbookDetail.treasuryCode;
    payload.fromDate = fDate;
    payload.fromDate = "2023-06-15";
    payload.budgetHead =this.pdPassbookDetail.budgethead;
    payload.pdAcc =this.pdPassbookDetail.pdAccNo;
    payload.type ='R'
    UrlKey=  this.ApiService.ReceivingAmt
    heading = 'Balance Status'
    method = 'POST'
  }else if(field == 'expenditure'){
    let Date1 =  rowData.transdate ;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');
    payload.treasuryCode =this.pdPassbookDetail.treasuryCode;
    payload.fromDate = fDate;
    // payload.fromDate = "2023-06-15";
    payload.budgetHead =this.pdPassbookDetail.budgethead;
    payload.pdAcc =this.pdPassbookDetail.pdAccNo;
    payload.type = 'E'
    UrlKey=this.ApiService.ReceivingAmt
    heading = 'Balance Status'
    method = 'POST'
  }


    const EncashdialogRef = this.dialog.open(CommonDialogComponent, {
      panelClass: 'dialog-w-50',
      autoFocus: false,
      height: 'auto',
      width: '50%',
      data: {
        message: 'hi',
        payloadData:payload,
        URLKey:UrlKey,
        heading:heading,
        Method:method,
        redirectPath: '/PdPassbookformat',
        id: 5,
      },
    });
  }

  //  // // export to excel
  //  exportexcel(): void {
  //   let user = document.getElementById('test')
  //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(user);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new()
  //   XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
  //   XLSX.writeFile(wb, this.filename)
  // }


  /// complete excel data
  exportexcel(json: any[], excelFileName: string): void {
    var Heading: any = [
      ['Sr No.','Date',' Opening Amount','Receiving Amount','Expenditure','Current Balance','Status']
    ];
    let arr:any[]=[]
    json.forEach((item:any,index:any)=>{
      let a={
        " Sr No.":index+1,
        "Date":item.Date,
        "Opening Amount":item.openAmt,
        "Receiving Amount":item.rcptamt,
         "Expenditure":item.expenditure,
        "Current Balance":item.CurrAmt,
        "Status":item.status,
          }
  arr.push(a)
  console.log("a__",a)
    })
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(arr);
   // var elt = document.getElementById('test');
  //  const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(elt);
    XLSX.utils.sheet_add_aoa(worksheet, Heading)
   // const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
     const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    // fileSaver.saveAs(exportcompletedata, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
    fileSaver.saveAs(data, fileName);
    }
}

