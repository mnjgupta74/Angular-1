import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as Val from '../../utils/Validators/ValBarrel'
import { LoaderService } from 'src/app/services/loaderservice';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { Helper } from 'src/app/utils/Helper';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import { IGetAutoProcessShowStatus } from 'src/app/utils/Master';
import { Observable } from 'rxjs/internal/Observable';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/internal/operators/map';
import { ViewDocumentComponent } from 'src/app/bill-process/view-document/view-document.component';
import { DomSanitizer } from '@angular/platform-browser';
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


export interface AutoProcessList {
  BillDate: string;
  BillNo: number;
  BillNoId: number;
  MajorHead: string;
  VoucherDate: string;
  VoucherNo: string;
  CashAmt: number;
  GrossAmt: number;
}
@Component({
  selector: 'app-voucher-detail',
  templateUrl: './voucher-detail.component.html',
  styleUrls: ['./voucher-detail.component.scss']
})
export class VoucherDetailComponent implements OnInit {
  @ViewChild('test', { static: false }) el!: ElementRef;
  filename = " Voucher Detail.xlsx";
  exportcompletedata: any[] = []
  ChooseOption: any = '';
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []
  VOUCHERDATA: any;

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private ApiMethods: ApiMethods,
    public loader: LoaderService,
    private ApiService: ApiService,
    private _liveAnnouncer: LiveAnnouncer,
    private finyear_: Helper, private toyear_: Helper, private TCode: Helper, private UId: Helper,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private snackbar: SnackbarService
  ) { }



  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.GetVoucherDetaildata.sort = sort;
  }
  @ViewChild(MatPaginator) set MatPaginator(paginator: MatPaginator) {
    this.GetVoucherDetaildata.paginator = paginator;
  }

  VoucherDetailForm: any;
  showTab_Table: boolean = false
  GetVoucherDetaildata: MatTableDataSource<AutoProcessList> = new MatTableDataSource();
  GetAutoProcessStatusShowModal: IGetAutoProcessShowStatus = {
    fromDate: "",
    toDate: "",
    treasuryCode: this.TCode.Treasury_Code,
  }


  VOUCHERLIST: any = {
    "billNo": 1212,
    "reportPath": "/Treasury/Admin/Reports/RPT_VOUCHER_DETAIL.xdo",
    "format": "pdf",
    "params": [
      {
        "name": "v_type",
        "value": "A"
      },
      {
        "name": "v_TreasuryCode",
        "value": ""
      },
      {
        "name": "v_FromDate",
        "value": ""
      },
      {
        "name": "v_ToDate",
        "value": ""
      }
    ]
  }
  displayedColumns = [
    'SrNo',
    'CDE_REFNO',
    'BillType',
    'BillNo',
    'BillDate',
    'MajorHead',
    // 'DDOCode',
    // 'BillType',
    'VoucherNo',
    'VoucherDate',
    'CashAmt',
    'GrossAmt',
  ];


  ngOnInit(): void {

    let financialYr = this.finyear_.year.toString().substring(2, 4) + this.toyear_.finyear.toString().substring(2, 4);   // It Shows = 2324

    this.VoucherDetailForm = new FormGroup({
      fromDate: new FormControl({ value: new Date(), disabled: false }, [Val.Required, Val.maxLength(12)]),
      //toDate: new FormControl({ value: new Date(), disabled: false }),
      toDate: new FormControl({ value: new Date(), disabled: false }, [Val.Required, Val.maxLength(12)]),
      TreasuryControl: new FormControl({ value: '' }, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
      Year: new FormControl({ value: financialYr, disabled: true }),
    });

    this.getTreasuryList();

  }



  // Call Auditor List API >>>------------------->
  getTreasuryList() {
    this.loader.setLoading(true);
    //this.ApiMethods.getservice(this.ApiService.autoProcessStatus + this.GetAutoProcessStatusModal.treasuryCode + "/" + this.GetAutoProcessStatusModal.tblName).subscribe(resp => {
    this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe((resp: any) => {

      console.log("Auditor__res", resp);
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.TreasuryListarr = resp.result
        //console.log("Show_Treasury_AuditorList", this.TreasuryListarr);
        this.Treasuryoptions = this.VoucherDetailForm.controls['TreasuryControl'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            return typeof value === 'string' ? value : value.treasuryCode
          }),
          map((treasury: any) => {

            return treasury ? this._filter(treasury, data) : data.slice()
          })
        );
        const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.TCode.Treasury_Code)[0];
        this.VoucherDetailForm.patchValue({
          TreasuryControl: treasury

        })

        if (this.TCode.Treasury_Code != "5000") {
          this.VoucherDetailForm.controls['TreasuryControl'].disable();
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




  GetVoucherDetail() {
    let Date1 = this.VoucherDetailForm.controls['fromDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');

    let Date2 = this.VoucherDetailForm.controls['toDate'].value;
    let tDate = new DatePipe('en-US').transform(Date2, 'yyyy-MM-dd');

    this.GetAutoProcessStatusShowModal.fromDate = fDate!;
    this.GetAutoProcessStatusShowModal.toDate = tDate!;
    // this.GetAutoProcessStatusShowModal.treasuryCode =treasVal.TreasuryCode;


    this.loader.setLoading(true);
    //this.GetOnlineBillListModal.type = 1
    console.log("Before_Calling_API_GetAutoProcessStatusShowModal_Result", this.GetAutoProcessStatusShowModal);


    //api call of Treasury Officer List
    this.ApiMethods.postresultservice(this.ApiService.voucherDetail, this.GetAutoProcessStatusShowModal).subscribe((resp: any) => {
      console.log("After_Calling_API_GetAutoProcessStatusShowModal_Result", resp);
      if (resp.result.length > 0) {
        this.GetVoucherDetaildata.data = resp.result;
        this.exportcompletedata = resp.result;
        // this.GetAutoProcessListdata.sort = this.Sort;
        // this.GetAutoProcessListdata.paginator = this.paginator;
        this.showTab_Table = true;
        this.loader.setLoading(false);
        this.VoucherDetailForm.disable();
      }
      else {
        //this.toastrService.info(CmnMsg, 'Info!');  // Comman Message - No Data Found
        this.snackbar.show('No Data Found !', 'alert')
        //window.location.reload();
        this.GetVoucherDetaildata.data = [];
        this.loader.setLoading(false);
        this.showTab_Table = false;
      }
    },
      (res: any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          //this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert !');
          //let ApiErrMsg = this._helperMsg.APIErrorMsg();
          //this.toastrService.error(ApiErrMsg, 'Alert !');  /// API Error Message 
          this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger')
          this.loader.setLoading(false);
        }
      }
    );
  }

  applyFilter(filterValue: string) {
    this.GetVoucherDetaildata.filter = filterValue.trim().toLowerCase();
    if (this.GetVoucherDetaildata.paginator) {
      this.GetVoucherDetaildata.paginator.firstPage();
    }
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce('Sorted ${sortState.direction}ending');
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  //JSPDF METHOD
  // makePdf() {
  //   let str:string=''
  // let table = document.createElement('table');
  // table.setAttribute('id','testpdTable');
  // let heasRow=''
  // this.displayedColumns.forEach((value:any)=> {
  //   heasRow = heasRow+`<th scope="col" >${value}</th>`
  // })
  // heasRow= `<tr>${heasRow} <tr> `
  // let tableData = this.GetVoucherDetaildata.data.map((value1:any,index) => {

  // str =  str + `<td >${index+1}</td>`
  // this.displayedColumns.map((value:any)=> {
  //   if(value !==  'SrNo'){
  //     str=  str + `<td >${value1[value]}</td>`

  //   }

  // })

  // let str1 =`<tr>${str} <tr> `
  // str=''
  //   return (
  //   str1
  //   );

  // }).join('');
  // const footer:any = document.querySelector("#footer");
  // // footer.setAttribute('class','thead-dark')
  // table.innerHTML = `<thead><tr>${heasRow} <tr></thead> `+ `<tbody>${tableData}</tbody>`
  //   var doc = new jsPDF("l", "mm", "a3");
  //   doc.text("Voucher Detail Report", 170, 10);
  //   autoTable(doc, { html: table });
  //   doc.text("https://rajkosh.rajasthan.gov.in", 10, 270);
  //   doc.save("VoucherDetailReport.pdf");
  // }

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
      [' Sr No.', 'Cde_Reference No.', 'BillNo', 'BillType', 'BillDate', 'MajorHead', 'VoucherNo', 'VoucherDate', 'CashAmount', 'Gross Amt ']
    ];
    let arr: any[] = []
    json.forEach((item: any, index: any) => {
      let a = {
        " Sr No.": index + 1,
        "Cde_Reference No.": item.CDE_REFNO,
        "BillNo": item.BillNo,
        "BillType": item.BillType,
        "BillDate": item.BillDate,
        "MajorHead": item.MajorHead,
        "VoucherNo": item.VoucherNo,
        "VoucherDate": item.VoucherDate,
        "CashAmount": item.CashAmt,
        "Gross Amt": item.GrossAmt,
      }
      arr.push(a)
      console.log("a__", a)
    })
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(arr);
    XLSX.utils.sheet_add_aoa(worksheet, Heading)
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    // fileSaver.saveAs(exportcompletedata, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
    fileSaver.saveAs(data, fileName);
  }


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
        // width: '50%',
        // height: '63%',
        width: '1000px',
        height: '800px',
        disableClose: true
        // , data: {
        //   // result: ''
        // }
      }

    );
    dialogRef.componentInstance.getBase64ImgDocumentId(CDE_REFNO);
  }


  //ORACLE PDF EXPORT
  Export() {
    let Date1 = this.VoucherDetailForm.controls['fromDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'MM-dd-yyyy');
    let Date2 = this.VoucherDetailForm.controls['toDate'].value;
    let tDate = new DatePipe('en-US').transform(Date2, 'MM-dd-yyyy');
    this.VOUCHERLIST.params[1].value = this.TCode.Treasury_Code;
    // this.VOUCHERLIST.params[2].value = this.VoucherDetailForm.value.fromDate;
    this.VOUCHERLIST.params[2].value = fDate!;
    this.VOUCHERLIST.params[3].value = tDate!;
    //this.VOUCHERLIST.params[3].value = this.VoucherDetailForm.value.toDate;
    console.log("beforeapi called VOUCHERLIST", this.VOUCHERLIST)
    this.loader.setLoading(true)
    //api call of Treasury Officer List
    this.ApiMethods.postresultservice(this.ApiService.OracleReport, this.VOUCHERLIST).subscribe((resp: any) => {
      console.log("VOUCHErresp", resp)
      var response = resp.data
      if (Object.keys(response).length > 0) {
        let documentArray = resp.data.report;
        console.log("VOUc", documentArray)
        this.VOUCHERDATA = "data:application/pdf;base64," + documentArray.content;
        console.log("VOUCHERLISTdata", this.VOUCHERDATA)
        this.VOUCHERDATA = 'data:application/pdf;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(documentArray.content) as any).changingThisBreaksApplicationSecurity;
        // this.showReport = true
        let w = window.open('about:blank', 'mywindow', "width=1200, height=800");
        w?.document.write(' <iframe id="ireport" style="width:100%; min-height:875px;" scrolling="no" frameborder="0" allowfullscreen></iframe>')
        w?.document.getElementById('ireport')?.setAttribute("src", this.VOUCHERDATA);
        this.loader.setLoading(false)
      }
      else {
        this.snackbar.show('No Data Found !', 'alert')
        this.loader.setLoading(false);
      }
    },
      (res: any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          this.snackbar.show('Something Went Wrong! Please Try Again !', 'danger')
          this.loader.setLoading(false);
        }
      }
    );
  }

}


