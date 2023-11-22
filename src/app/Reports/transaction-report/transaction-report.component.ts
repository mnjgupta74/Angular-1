import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { LoaderService } from 'src/app/services/loaderservice';
import * as Val from '../../utils/Validators/ValBarrel'
import { ApiMethods } from '../../utils/ApiMethods';
import { ApiService } from '../../utils/utility.service';
import { DatePipe, formatDate } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
//import jsPDF from 'jspdf';
//import "jspdf-autotable";
import { TrackTransaction } from '../Interface';
import autoTable from 'jspdf-autotable';
import { Helper } from 'src/app/utils/Helper';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, map, startWith } from 'rxjs';
import { ViewDocumentComponent } from 'src/app/bill-process/view-document/view-document.component';
import { MatDialog } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DomSanitizer } from '@angular/platform-browser';
import * as fileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


export interface tokenReport {
  CDE_REFNO: number;
  TokenNo: number;
  DDOCode: number;
  BillType: string;
  CashAmt: number;
  GrossAmount: number;
  Auditor: string;
  AuditorFlag: string;
  Auditordate: string;
  // Insurance: string;
  Accountant: string;
  AccountantFlag: string;
  Accountantdate: string;
  TO: string;
  toflag: string
  tokenuser: string;
  receiptdate: string
}

@Component({
  selector: 'app-transaction-report',
  templateUrl: './transaction-report.component.html',
  styleUrls: ['./transaction-report.component.scss']
})
export class TransactionReportComponent implements OnInit {
  @ViewChild('test', { static: false }) el!: ElementRef;
    filename = " Track OF TransactionReport.xlsx";
    exportcompletedata:any[]=[]
  @ViewChild(MatPaginator) set MatPaginator(paginator: MatPaginator) {
    this.ReportData.paginator = paginator;
  }
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.ReportData.sort = sort;
  }

  ReportData: MatTableDataSource<tokenReport> = new MatTableDataSource();
  displayedColumns = [
    'SrNo',
    
   // 'tokenuser',
    'CDE_REFNO',
    'tokenno',
    'voucherno',
    'voucherdate',
    'receiptdate',
    'ddo',
    'billtype',
    'cashamt',
    'grossamt',
    'auditor/auditiorflag/auditordate',
    //'auditiorflag',
   // 'auditor',
    //'auditordate',
    //'accountant',
    'accountant/acctflag/accountantdate',
   // 'acctflag',
   
   // 'accountantdate',
    'to/toflag/Todate'
   // 'to',
   // 'toflag'
  ]



  SelectBilltype: any = ''
  SelectUserType: any = ''
  datepicker: any = formatDate(new Date(), 'dd/MM/yyyy', 'en');
  picker1: any = formatDate(new Date(), 'dd/MM/yyyy', 'en');
  picker2: any = formatDate(new Date(), 'dd/MM/yyyy', 'en');
  transactionref: boolean = false;
  Transactionreportform: any;
  // BillTypelist: any = '';
  auditorList: any = []
  auditorOptions: Observable<any[]> | undefined;
  BillTypeoptions: Observable<any[]> | undefined;
  // getTokenl: TOKENLIST = new TOKENLIST();
  toastr: any;
  Report: any = [];
  Payment_radio: boolean = false
  Reference_radio: boolean = false
  Name: any;
  //filename = "samplesheet.xlsx";
  users: any;
  BillTypeListarr: any = []
  ChooseOption: any = '';
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []
  TRACKOFTRANSACTIONDATA:any;

  // Model Track OF TRansaction
  TransactionModel: TrackTransaction = {
    fromDate: this.finyear_.year.toString(),
    todate: this.toyear_.finyear.toString(),
    tcode: this.Tcode.Treasury_Code,
    usercode: 0,
    userType: "A",
    fieldname: "TokenNo",
    value: 0,
    billType: 0,
  }

  TRACKOFTRANSACTIONLIST:any= {
    "billNo": 1212,
    "reportPath": "/Treasury/MIS/Reports/RPT_MIS_TRACK_OF_TRANSACTION.xdo",
    "format": "pdf",
    "params": [
        {
            "name": "v_type",
            "value": "A"
        },
        {
            "name": "v_tcode",
            "value": "2100"
        },
        {
            "name": "v_usercode",
            "value": null
        },
        {
            "name": "v_fromdate",
            "value":null
        },
        {
            "name": "v_todate",
            "value":null
        },
        {
            "name": "v_billtype",
            "value": null
        },
    {
            "name": "v_value",
            "value": "0"
        },
    {
            "name": "v_usertype",
            "value": "A"
        },
    {
            "name": "v_fieldname",
            "value":"TokenNo"
        }
    ]
  }


  getTokenl: any;
  UserId: any;

  constructor(private sanitizer: DomSanitizer,public dialog: MatDialog, public finyear_: Helper, private Tcode: Helper, private toyear_: Helper, private router: Router, private ApiMethods: ApiMethods, public loader: LoaderService, private ApiService: ApiService, private snackbar: SnackbarService, public _helperMsg: Helper, private TCode: Helper) {
    history.pushState(null, '', location.href);
    this.getBillTypeList()  //call Bill TypeList
    this.getAuditorList()  //call auditor list
    // this.getTokenList()
  }

  // display: boolean = true
  Auditor_radio: boolean = true
  Accountant_radio: boolean = false
  To_radio: boolean = false
  All_radio: boolean = false
  Token_radio: boolean = true
  Ref_radio: boolean = false
  radioOptions: string = '1';
  //radio button check flag
  Auditor_list: boolean = false
  Accountant: boolean = false
  to: boolean = false
  all: boolean = true
  radioButtonvalue: any="TokenNo";
  radiobuttonvalue: any="A";

  radioButtoninGroupChange(event: any) {
    if (event.value == 1) {
      this.radiobuttonvalue = "A"
    }
    else if (event.value == 2) {
      this.radiobuttonvalue = "C"
    }
    else if (event.value == 3) {
      this.radiobuttonvalue = "T"
    }
    else if (event.value == 4) {
      this.radiobuttonvalue = "N"
    }
    this.TransactionModel.userType = this.radiobuttonvalue;
  }

  radioButtonGroup(event: any) {
    if (event.value == 1) {
      this.radioButtonvalue = "TokenNo"
    }
    else {
      this.radioButtonvalue = "cde_Refno"
    }
    this.TransactionModel.fieldname = this.radioButtonvalue;
    console.log("filedvalue", this.TransactionModel.fieldname)
  }

  ngOnInit(): void {
    let financialYr = this.finyear_.year.toString().substring(2, 4) + this.toyear_.finyear.toString().substring(2, 4);   // It Shows = 2324

    this.Transactionreportform = new FormGroup({
      fromDate: new FormControl({ value: new Date(), disabled: false }, [Validators.required, Validators.maxLength(12)]),
      toDate: new FormControl({ value: new Date(), disabled: false }, [Validators.required, Validators.maxLength(12)]),
      // fieldname: new FormControl('',{ validators: [this.ApiMethods.autocompleteObjectValidator(),Validators.required,Validators.maxLength(40)]}),
      //userType: new FormControl('', [Validators.maxLength(40), Val.SpecialChar]),
      BillTypeControl: new FormControl(''),
      //UserControl: new FormControl(''),
      TokenValue: new FormControl('0', [Val.maxLength(16), Val.cannotContainSpace, Val.Numeric]),
      usercde: new FormControl('', [Val.maxLength(40), Val.SpecialChar]),
      TreasuryControl: new FormControl({ value: '' }, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
      Year: new FormControl({ value: financialYr, disabled: true }),
      userTypeCtrl:  new FormControl('A', Validators.required),
      valueCtrl:  new FormControl('TokenNo', Validators.required),
    })
    this.getTreasuryList();
  }



  // Call Auditor List API >>>------------------->
  getTreasuryList() {
    this.loader.setLoading(true);
    //this.ApiMethods.getservice(this.ApiService.autoProcessStatus + this.GetAutoProcessStatusModal.treasuryCode + "/" + this.GetAutoProcessStatusModal.tblName).subscribe(resp => {
    this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe((resp:any) => {
      console.log("Auditor__res", resp);
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.TreasuryListarr = resp.result
        //console.log("Show_Treasury_AuditorList", this.TreasuryListarr);
        this.Treasuryoptions = this.Transactionreportform.controls['TreasuryControl'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            return typeof value === 'string' ? value : value.treasuryCode
          }),
          map((treasury: any) => {

            return treasury ? this._filterTreas(treasury, data) : data.slice()
          })
        );
        const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.TCode.Treasury_Code)[0];
        this.Transactionreportform.patchValue({
          TreasuryControl: treasury
        })
        if (this.TCode.Treasury_Code != "5000") {
          this.Transactionreportform.controls['TreasuryControl'].disable();
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

  displayFnTreas(selectedoption: any) {
    console.log("display_fun_call aaa", selectedoption.TreasuryName);
    return selectedoption ? selectedoption.TreasuryName : undefined;
  }

  // post main mthod
  onTrackOfTransaction() {
    if (this.Transactionreportform.controls['fromDate'].value == null && this.Transactionreportform.controls['toDate'].value == null) {
      console.log("hi")
      this.Report = [''];
      this.snackbar.show("Please Select Date", 'alert')
      this.transactionref = false;
      this.snackbar.show('Please Select Date !', 'alert')
    }
    else {
      this.loader.setLoading(true);
      let Date1 = this.Transactionreportform.controls['fromDate'].value;
      let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');

      let Date2 = this.Transactionreportform.controls['toDate'].value;
      let tDate = new DatePipe('en-US').transform(Date2, 'yyyy-MM-dd');

      this.TransactionModel.fromDate = fDate!;
      this.TransactionModel.todate = tDate!;
      this.TransactionModel.value = this.Transactionreportform.controls['TokenValue'].value;
      // this.TransactionModel.usercode=this.Transactionreportform.controls['usercde'].value.UserId
      // this.TransactionModel.todate = this.Transactionreportform.controls['toDate'].value;
      // this.TransactionModel.fromDate = this.Transactionreportform.controls['fromDate'].value;
       this.TransactionModel.billType = this.Transactionreportform.controls['BillTypeControl'].value.Ncode;
       console.log("billtype", this.TransactionModel.billType)
      this.transactionref = false;
      console.log("test___", this.TransactionModel)
      this.ApiMethods.postresultservice(this.ApiService.TrackOfTransaction, this.TransactionModel).subscribe(
        (user: any) => {
          console.log('response', user.result)
          this.Report = user.result;
          if (this.Report.length > 0) {
            console.log("gfgfgfg", "ghghghghgh");
            this.Report = user.result;
            this.exportcompletedata=user.result;
            this.ReportData.data = user.result
            this.transactionref = true;
            this.loader.setLoading(false);
            this.Transactionreportform.disable();
          }
          else {
            this.snackbar.show("No Data Found !", 'alert')
            this.loader.setLoading(false);
          }
        },

        (res:any) => {
          console.log("errror message___", res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
            this.snackbar.show('Something Went Wrong! Please Try Again', 'danger')  /// API Error Message 
          }
        }
      );
    }
  }


  displayAuditor(selectAuditor: any) {
    return selectAuditor ? selectAuditor.EmployeeId : undefined;
  }

  //  Bill Type display Function >----->
  displayFn(selectedoption: any) {
    console.log("displayfuncall");
    return selectedoption ? selectedoption.BillType : undefined;
  }
  // get bill type list
  getBillTypeList() {
    this.ApiMethods.getservice(this.ApiService.BillTypeList + 1).subscribe((resp:any) => {
      console.log("Treasury__res", resp);
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.BillTypeListarr = resp.result
      }
      console.log("treasury_inbetween", this.BillTypeListarr);
      this.BillTypeoptions = this.Transactionreportform.controls['BillTypeControl']
        .valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            console.log("firstmap__", value);
            return typeof value === 'string' ? value : value.BillTypeListarr
          }),
          map((BillType: any) => {
            console.log("second__map", BillType);
            return BillType ? this._filter(BillType, data) : data.slice()
          })
        );
    })
  }

  _filter(value: string, data: any) {
    return data.filter((option: any) => {
      return option.BillType.toLowerCase().includes(value.toLowerCase())
    });
  }

  // OnBillTypeSelected(SelectBilltype: any) {
  //   console.log("befort______SelectBilltype", SelectBilltype);
  //   console.log("slelction__________option_____________", this.SelectBilltype);
  //   this.TransactionModel.billType = this.SelectBilltype.Ncode
  // }

  //get auditor list api 
  getAuditorList() {
    this.ApiMethods.getservice(this.ApiService.AuditorList + 1 + '/' + this.Tcode.Treasury_Code).subscribe((resp: any) => {
      console.log("auditor_res", resp.result);
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.auditorList = resp.result;
      }
      console.log("Audit_", this.auditorList);
      this.auditorOptions = this.Transactionreportform.controls['usercde']
        .valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            console.log("firstmap__", value);
            return typeof value === 'string' ? value : value.auditorList
          }),
          map((EmployeeId: any) => {
            console.log("second__map", EmployeeId);
            return EmployeeId ? this._filterAuditor(EmployeeId, data) : data.slice()
          })
        );
    })
  }

  _filterAuditor(value: string, data: any) {
    return data.filter((option: any) => {
      return option.EmployeeId.toLowerCase().includes(value.toLowerCase())
    });
  }

  getAuditorId() {
    this.TransactionModel.usercode = this.Transactionreportform.value.usercde.UserId;
    console.log("hivinay_", this.TransactionModel.usercode)
  }

  // GetBillTypeListCode() {
  //   this.TransactionModel.billType = this.Transactionreportform.value.BillTypeControl;
  //   let BillCode: any = this.TransactionModel.billType;
  //   console.log("biilcode__", BillCode);
  // }

  applyFilter(filterValue: string) {
    this.ReportData.filter = filterValue.trim().toLowerCase();
    if (this.ReportData.paginator) {
      this.ReportData.paginator.firstPage();
    }
  }

  //export to pdf 
  // makePdf() {
  //   this.loader.setLoading(true);
  //   setTimeout(() => {
  //     let str:string=''
  //     let table = document.createElement('table');
  //     table.setAttribute('id','testpdTable');
  //     let heasRow=''
  //     this.displayedColumns.forEach((value:any)=> {
  //       heasRow = heasRow+`<th scope="col" >${value}</th>`
  //     })
  //     heasRow= `<tr>${heasRow} <tr> `
  //     let tableData = this.ReportData.data.map((value1:any,index) => {
      
  //     str =  str + `<td >${index+1}</td>`
  //     this.displayedColumns.map((value:any)=> {
  //       if(value !==  'SrNo'){
  //         str=  str + `<td >${value1[value]}</td>`
          
  //       }
  
  //     })
    
  //     let str1 =`<tr>${str} <tr> `
  //     str=''
  //       return (
  //       str1
  //       );
    
  //     }).join('');
  //     const footer:any = document.querySelector("#footer");
  //     // footer.setAttribute('class','thead-dark')
  //     table.innerHTML = `<thead><tr>${heasRow} <tr></thead> `+ `<tbody>${tableData}</tbody>` 
  //     var doc = new jsPDF("l", "mm", "a2");
  //     doc.text("Track Of Transaction", 170, 10);
  //     autoTable(doc, { html: table });
     
  //     doc.text("https://rajkosh.rajasthan.gov.in", 10, 200);
  //     doc.save("sample.pdf");
  //     this.loader.setLoading(false);
  //   }, 500);
   
  // }

  onReset() {
    window.location.reload();
  }


  viewDocumentPopup(element: any) {
    //this.loader.setLoading(true);
    this.showmodal(element.CDE_REFNO);

  }
  showmodal(CDE_REFNO: any) {
    const dialogRef = this.dialog.open(ViewDocumentComponent,
      {
        width: '1000px',
        height: '800px',
        disableClose: true
             }

    );
    dialogRef.componentInstance.getBase64ImgDocumentId(CDE_REFNO);
    }

   //ORACLE PDF EXPORT
   EXPORTPdf() {
    let Date1 = this.Transactionreportform.controls['fromDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'MM-dd-yyyy');
    let Date2 = this.Transactionreportform.controls['toDate'].value;
    let tDate = new DatePipe('en-US').transform(Date2, 'MM-dd-yyyy');
    this.TRACKOFTRANSACTIONLIST.params[1].value = this.TCode.Treasury_Code;
    this.TRACKOFTRANSACTIONLIST.params[2].value = this.Transactionreportform.value.usercde.UserId;
    this.TRACKOFTRANSACTIONLIST.params[3].value = fDate!;
    this.TRACKOFTRANSACTIONLIST.params[4].value = tDate!;
   this.TRACKOFTRANSACTIONLIST.params[5].value =this.Transactionreportform.controls['BillTypeControl'].value.Ncode;
    this.TRACKOFTRANSACTIONLIST.params[6].value = this.Transactionreportform.value.TokenValue;
    this.TRACKOFTRANSACTIONLIST.params[7].value =  this.radiobuttonvalue;
    this.TRACKOFTRANSACTIONLIST.params[8].value = this.radioButtonvalue;
       console.log("beforeapi called TRACK", this.TRACKOFTRANSACTIONLIST)
     this.loader.setLoading(true)
    //api call of Treasury Officer List
    this.ApiMethods.postresultservice(this.ApiService.OracleReport, this.TRACKOFTRANSACTIONLIST).subscribe((resp:any) => {
      console.log("PDb", resp)
      var response = resp.data
      if (Object.keys(response).length > 0) {
        let documentArray = resp.data.report;
        console.log("docc__", documentArray)
        this.TRACKOFTRANSACTIONDATA = "data:application/pdf;base64," + documentArray.content;
        console.log("TRACKOFTRANSion", this.TRACKOFTRANSACTIONDATA)
        this.TRACKOFTRANSACTIONDATA = 'data:application/pdf;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(documentArray.content) as any).changingThisBreaksApplicationSecurity;
       // this.showReport = true
       let w = window.open('about:blank', 'mywindow', "width=1200, height=800");
        w?.document.write(' <iframe id="ireport" style="width:100%; min-height:875px;" scrolling="no" frameborder="0" allowfullscreen></iframe>')
        w?.document.getElementById('ireport')?.setAttribute("src", this.TRACKOFTRANSACTIONDATA);
        this.loader.setLoading(false)
      }
      else {
        this.snackbar.show('No Data Found !', 'alert')
        this.loader.setLoading(false);
      }
    },
      (res:any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          this.snackbar.show('Something Went Wrong! Please Try Again !', 'danger')
          this.loader.setLoading(false);
        }
      }
    );
   }
  //     // // export to excel
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
    [' Sr No.',' Cde_Reference No.','Token No./Token User','Voucher No','Voucher Date',' Receipt Date','DDO Name',' BillType',' CashAmount',' Gross Amount',' Auditor Status','Accountant Status',' To Status']
  ];
  let arr:any[]=[]
  json.forEach((item:any,index:any)=>{
    let a={
      " Sr No.":index+1,
      "Cde_Reference No.":item.Date,
      "Token No./Token User":item.openAmt,
      "Voucher No":item.rcptamt,
       "Voucher Date":item.expenditure,
      " Receipt Date":item.CurrAmt,
      "DDO Name":item.status,
      "BillType":item.status,
      "Status":item.status,
      "CashAmount":item.status,
      "Gross Amount":item.status,
      "Auditor Status":item.status,
      "Accountant Status":item.status,
      "To Status":item.status,
        }
arr.push(a)
console.log("a__",a)
  })
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
  XLSX.utils.sheet_add_aoa(worksheet, Heading)
  const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  this.saveAsExcelFile(excelBuffer, excelFileName);
}
saveAsExcelFile(buffer: any, fileName: string): void {
   const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});   
  // fileSaver.saveAs(exportcompletedata, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
  fileSaver.saveAs(data, fileName);
}
 };
