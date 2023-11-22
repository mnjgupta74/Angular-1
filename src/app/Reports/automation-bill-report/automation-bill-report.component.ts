// import { Component, OnInit, ElementRef, ViewChild ,ChangeDetectorRef} from '@angular/core';
import { Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
// import { MatTableDataSource } from '@angular/material/table';
// import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
// import { Router } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/services/loaderservice';
import { Helper } from 'src/app/utils/Helper';
import { log } from 'console';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IGetAutomationBillShowStatus } from 'src/app/utils/Master';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DomSanitizer } from '@angular/platform-browser';
import { ViewDocumentComponent } from 'src/app/bill-process/view-document/view-document.component';
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

export interface OBList {
  BillTypeName: string;
  TokenNo: number;
  RefNo: number;
  DDOCode: number;
  DdoName: string;
  MajorHead: number;
  PayManager_RefNo: number;
  GrossAmt: number;
  CashAmt: number;
}

export interface AutoProcessList {
  "BillType": string,
  "TokenNo": number,
  "DDOCode": number,
  "TransDate": string,
  "GrossAmt": number,
  "CashAmt": number,
  "CdeRefNO": number,
  "TreasuryCode": string,
  "Reason": string
}

@Component({
  selector: 'app-automation-bill-report',
  templateUrl: './automation-bill-report.component.html',
  styleUrls: ['./automation-bill-report.component.scss']
})
export class AutomationBillReportComponent implements OnInit {
  @ViewChild('test', { static: false }) el!: ElementRef;
  filename = "AutomationBillReport.xlsx";
  exportcompletedata:any[]=[]
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('matNoDataRow') matNoDataRow!: any;
  tableDataSource: MatTableDataSource<AutoProcessList> = new MatTableDataSource();
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatSort) Sort!: MatSort;
  base64dataArray: any = [];
  base64data: any;
  loading: any;
  mindate: Date = new Date()
  maxdate: Date = new Date
  autoBillReportForm: any;
  tableData: boolean = false
  ChooseOption: any = '';
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []
  showReport: boolean = false
  displayedColumns: string[] = [
    'SrNo',
    'CDE_REFNO',
    'TokenNo',
    'DDOCode',
    'BillType',
    'Reason',
    'TransDate',
    'GrossAmt',
    'CashAmt'];
  pdfColumns: string[] = [
    'SrNo',
    'CDE_REFNO',
    'tokenno',
    'ddocode',
    'billtype',
    'reason',
    'transdate',
    'grossamt',
    'CashAmt'
  ];
  filterDataList: any[] = ['42528402', 'Arrear', 'Pending', 'Filter-1', '425284544', 'Filter-2', 'Reverted', '42528402', 'Arrear', 'Pending', 'Filter-1', '425284544', 'Filter-2', 'Reverted',];



  GetAutoProcessStatusShowModal: IGetAutomationBillShowStatus = {
    fromDate: "",
    toDate: "",
    treasuryCode: this.TCode.Treasury_Code,
    finYear: '',
    reasonStatus: ""
  }

  reportList: any = {
    "billNo": 1212,
    "reportPath": "/Treasury/Admin/Reports/Auto_Process.xdo",
    "format": "pdf",
    "params": [
      {
        "name": "v_type",
        "value": "A"
      },
      {
        "name": "V_TreasuryCode",
        "value": ""
      },
      {
        "name": "V_FinYear",
        "value": ""
      },
      {
        "name": "V_FromDate",
        "value": ""
      },
      {
        "name": "V_ToDate",
        "value": ""
      },
      {
        "name": "V_ReasonStatus",
        "value": ""
      }
    ]

  }

  constructor(private sanitizer: DomSanitizer, private ApiMethods: ApiMethods, private _formBuilder: FormBuilder, public loader: LoaderService, private ApiService: ApiService, private _liveAnnouncer: LiveAnnouncer, private finyear_: Helper, private toyear_: Helper, private TCode: Helper, private UId: Helper, private datePipe: DatePipe, public dialog: MatDialog, private snackbar: SnackbarService) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
    };
  }

  ngOnInit(): void {
    let financialYr = this.finyear_.year.toString().substring(2, 4) + this.toyear_.finyear.toString().substring(2, 4);   // It Shows = 2324
    // this.GetAutoProcessStatusShowModal.treasuryCode=this.TCode.Treasury_Code;
    // this.GetAutoProcessStatusShowModal.treasuryCode='2100';    //Only For Test
    const date = new Date();
    date.setDate(date.getDate() - 1);
    this.autoBillReportForm = new FormGroup({
      fromDate: new FormControl({ value: date, disabled: false }, [Validators.required]),
      toDate: new FormControl({ value: new Date(), disabled: false }, [Validators.required]),
      reasonStatus: new FormControl('Y', [Validators.required]),
      TreasuryControl: new FormControl({ value: '' }, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
      Year: new FormControl({ value: financialYr, disabled: true }),
    });
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
        this.Treasuryoptions = this.autoBillReportForm.controls['TreasuryControl'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            return typeof value === 'string' ? value : value.treasuryCode
          }),
          map((treasury: any) => {
            return treasury ? this._filter(treasury, data) : data.slice()
          })
        );
        const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.TCode.Treasury_Code)[0];
        this.autoBillReportForm.patchValue({
          TreasuryControl: treasury

        })

        if (this.TCode.Treasury_Code != "5000") {
          this.autoBillReportForm.controls['TreasuryControl'].disable();
        }
      }
    })
    this.loader.setLoading(false);
  }

  _filter(value: string, data: any) {
    return data.filter((option: any) => {
      return option.TreasuryName.toLowerCase().includes(value.toLowerCase())
    });
  }
  displayFn(selectedoption: any) {
    console.log("display_fun_call aaa", selectedoption.TreasuryName);
    return selectedoption ? selectedoption.TreasuryName : undefined;
  }


  ngAfterViewInit() {
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.Sort;
  }

  reset() {
    // this.tableData =false
    // this.tableDataSource.data=[]
    // this.autoBillReportForm.reset()
    // const date = new Date();
    // // date.setDate(date.getDate() - 1);
    // this.autoBillReportForm.controls['toDate'].setValue(date);
    window.location.reload();
  }

  // Function : Call Bill Encashment Fetch API >>>------------------->
  GetAutoProcessDetail() {
    // Get TokenNum Page Control value
    this.loader.setLoading(true);
    let Date1 = this.autoBillReportForm.controls['fromDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');
    let Date2 = this.autoBillReportForm.controls['toDate'].value;
    let tDate = new DatePipe('en-US').transform(Date2, 'yyyy-MM-dd');

    this.GetAutoProcessStatusShowModal.fromDate = fDate!;
    this.GetAutoProcessStatusShowModal.toDate = tDate!;
    this.GetAutoProcessStatusShowModal.reasonStatus = this.autoBillReportForm.controls['reasonStatus'].value!;
    this.GetAutoProcessStatusShowModal.finYear = this.finyear_.year!;
    this.loader.setLoading(true);
    console.log("getbill__", this.GetAutoProcessStatusShowModal)
    //api call of Treasury Officer List
    this.ApiMethods.postresultservice(this.ApiService.autoBillReport, this.GetAutoProcessStatusShowModal).subscribe((resp:any) => {
      if (resp.result.length > 0) {
        this.tableData = true;
        this.tableDataSource.data = resp.result;
        this.exportcompletedata=resp.result;
        this.tableDataSource.paginator = this.paginator;
        this.tableDataSource.sort = this.Sort;
        this.loader.setLoading(false);
        this.autoBillReportForm.disable();
      }
      else {
        this.snackbar.show('No Data Found !', 'alert')
        this.tableData = false;
        this.tableDataSource.data = []
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

  applyFilter(filterValue: string) {
    // const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();

    if (this.tableDataSource.paginator) {
      this.tableDataSource.paginator.firstPage();
    }
  }

  announceSortChange(sortState: Sort) {
    console.log(sortState)
    if (sortState.direction) {
      this._liveAnnouncer.announce('Sorted ${sortState.direction}ending');
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  //JSPDF EXPORTER
  // EXPORTPdf() {
  //   let str: string = ''
  //   let table = document.createElement('table');
  //   table.setAttribute('id', 'testpdTable');
  //   let heasRow = ''
  //   this.displayedColumns.forEach((value: any) => {
  //     heasRow = heasRow + `<th scope="col" >${value}</th>`
  //   })
  //   heasRow = `<tr>${heasRow} <tr> `
  //   let tableData = this.tableDataSource.data.map((value1: any, index) => {
  //     str = str + `<td >${index + 1}</td>`
  //     this.pdfColumns.map((value: any) => {
  //       if (value !== 'SrNo') {
  //         str = str + `<td >${value1[value] ? value1[value] : '-'}</td>`
  //       }
  //     })

  //     let str1 = `<tr>${str} <tr> `
  //     str = ''
  //     return (
  //       str1
  //     );

  //   }).join('');
  //   const footer: any = document.querySelector("#footer");
  //   // footer.setAttribute('class','thead-dark')
  //   table.innerHTML = `<thead><tr>${heasRow} <tr></thead> ` + `<tbody>${tableData}</tbody>`
  //   var doc = new jsPDF("l", "mm", "a4");
  //   doc.text("Auto TXN Log Report", 130, 10);
  //   autoTable(doc, { html: table });
  //   doc.text("https://rajkosh.rajasthan.gov.in", 10, 200);
  //   doc.save("AutoTXNLogReport.pdf");

  // }

  //ORACLE PDF EXPORT
  exportPdf() {
    let Date1 = this.autoBillReportForm.controls['fromDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'MM-dd-yyyy');
    let Date2 = this.autoBillReportForm.controls['toDate'].value;
    let tDate = new DatePipe('en-US').transform(Date2, 'MM-dd-yyyy');
    this.reportList.params[1].value = this.TCode.Treasury_Code;
    this.reportList.params[2].value = this.finyear_.currentYear;
    this.reportList.params[3].value = fDate;
    this.reportList.params[4].value = tDate;
    this.reportList.params[5].value = this.autoBillReportForm.value.reasonStatus;
    console.log("beforeapi called reportlist_", this.reportList)
    this.loader.setLoading(true)
    //api call of Treasury Officer List
    this.ApiMethods.postresultservice(this.ApiService.OracleReport, this.reportList).subscribe((resp:any) => {
      console.log("imgresp__", resp)
      var response = resp.data
      if (Object.keys(response).length > 0) {
        let documentArray = resp.data.report;
        console.log("docc__", documentArray)
        this.base64data = "data:application/pdf;base64," + documentArray.content;
        console.log("base64", this.base64data)
        this.base64data = 'data:application/pdf;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(documentArray.content) as any).changingThisBreaksApplicationSecurity;
        this.showReport = true
       let w = window.open('about:blank', 'mywindow', "width=1200, height=800");
        w?.document.write(' <iframe id="ireport" style="width:100%; min-height:875px;" scrolling="no" frameborder="0" allowfullscreen></iframe>')
        w?.document.getElementById('ireport')?.setAttribute("src", this.base64data);
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
    ['Sr No.','Cde_Reference No.','Token No','DDO code','Bill Type','Reason','Trans Date','Gross Amount(Rs.)','Cash Amount(Rs.)']
  ];
  let arr:any[]=[]
  json.forEach((item:any,index:any)=>{
    let a={
      " Sr No.":index+1,
      "Cde_Reference No.":item.cde_refno,
      "Token No":item.tokenno,
      "DDO code":item.ddocode,
      "Bill Type":item.billtype,
      "Reason":item.reason,
      "Trans Date":item.transdate,
      "Gross Amount(Rs.)":item.grossamt,
      "Cash Amount(Rs.)":item.CashAmt,
        }
arr.push(a)
//console.log("a__",a)
  })
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(arr);
  //var elt = document.getElementById('test');
 // const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(elt);
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


  viewDocumentPopup(element: any) {
    //this.loader.setLoading(true);
    this.showmodal(element.cde_refno);
  }



  showmodal(cde_refno: any) {
    const dialogRef = this.dialog.open(ViewDocumentComponent,
      {
        // width: '50%',
        // height: '63%',
        width: '1000px',
        height: '800px',
        // disableClose: true
        // , data: {
        //   // result: ''
        // }
      }

    );
    dialogRef.componentInstance.getBase64ImgDocumentId(cde_refno);

    // Back From Objection Dialogbox and refresh TreasuryOfficer List page-----------------------begiN-------
    // dialogRef.afterClosed().subscribe(res => {
    //   if (res === 1) {
    //    // this.GetTreasOfficeList();
    //   }
    // })
    // --------------------------------------------------------------------------------------------enD-------
  }
}

