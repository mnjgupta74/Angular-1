import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { LoaderService } from 'src/app/services/loaderservice';
import { Helper } from 'src/app/utils/Helper';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import { Observable, map, startWith } from 'rxjs';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import * as Val from '../../utils/Validators/ValBarrel'
import { ViewDocumentComponent } from 'src/app/bill-process/view-document/view-document.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-treasury-lop-report',
  templateUrl: './treasury-lop-report.component.html',
  styleUrls: ['./treasury-lop-report.component.scss']
})
export class TreasuryLopReportComponent implements OnInit {
  @ViewChild('test', { static: false }) el!: ElementRef;
  filename = "TreasuryLOPReport.xlsx";
  exportcompletedata: any[] = []
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.GetTreasurytrackdata.sort = sort;
  }
  @ViewChild(MatPaginator) set MatPaginator(paginator: MatPaginator) {
    this.GetTreasurytrackdata.paginator = paginator;
  }

  LopReportForm: any;
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []

  TreasuryName: any = ''
  FromDate: any = ''
  ToDate: any = ''
  GetTreasurytrackdata: MatTableDataSource<any> = new MatTableDataSource();
  showTreastrackTable: boolean = false;
  display: boolean = false;
  displayedColumns = [
    'SrNo',
    'PD_DIV_DTLS',
    'BudgetHead',
    'MajorHead',
    'GRP',
    'DivCode',
    'CentralFundPhase2',
    'CentralFundPhase1',
    'StateFundPhase1',
    'StateFundPhase2',
    'HeadRange',
    'MyDraft',
    'DivStateFundPhase1',
    'DivStateFundPhase2',
    'DivCentralFundPhase1',
    'TotalVoucherPhase1',
    'TotalVoucherPhase2',
  ];

  constructor(private sanitizer: DomSanitizer, private ApiMethods: ApiMethods, private _formBuilder: FormBuilder, public loader: LoaderService,
    private ApiService: ApiService, private _liveAnnouncer: LiveAnnouncer, private finyear_: Helper, private toyear_: Helper, private TCode: Helper,
    private UId: Helper, private datePipe: DatePipe, public dialog: MatDialog, private snackbar: SnackbarService) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
    };
  }

  ngOnInit(): void {
    this.getTreasuryList();
    this.LopReportForm = new FormGroup({
      treasuryval: new FormControl({ value: '', disabled: true }, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
      toDate: new FormControl({ value: new Date(), disabled: false }, [Val.Required, Val.maxLength(12)]),
      fromDate: new FormControl({ value: new Date(), disabled: false }, [Val.Required, Val.maxLength(12)]),
    })
  }
  getTreasuryList() {
    this.loader.setLoading(true);
    this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe((resp: any) => {
      console.log("Auditor__res", resp);
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.TreasuryListarr = resp.result
        //console.log("Show_Treasury_AuditorList", this.TreasuryListarr);
        this.Treasuryoptions = this.LopReportForm.controls['treasuryval'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            return typeof value === 'string' ? value : value.treasuryCode
          }),
          map((treasury: any) => {

            return treasury ? this._filtertreasury(treasury, data) : data.slice()
          })
        );
        const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.TCode.Treasury_Code)[0];
        this.LopReportForm.patchValue({
          treasuryval: treasury
        })
      }
    })
    this.loader.setLoading(false);
  }
  _filtertreasury(value: string, data: any) {
    return data.filter((option: any) => {
      return option.TreasuryName.toLowerCase().includes(value.toLowerCase())
    });
  }
  displaytreasury(selectedoption: any) {
    console.log("display_fun_call aaa", selectedoption.TreasuryName);
    return selectedoption ? selectedoption.TreasuryName : undefined;
  }

  onSearch() {
    this.GetTreasurytrackdata.filter = "";

    let Trescode = this.LopReportForm.controls['treasuryval'].value;


    let Date1 = this.LopReportForm.controls['fromDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');
    let Date2 = this.LopReportForm.controls['toDate'].value;
    let tDate = new DatePipe('en-US').transform(Date2, 'yyyy-MM-dd');

    console.log("b", fDate)
    console.log("c", tDate)
    console.log("casdfasdf", Trescode)


    if (Date1 === "" || Date2 === "" || Date1 === null || Date2 === null) {
      console.log("f", fDate)
      this.snackbar.show('Please Enter Date', 'alert')
      return;
    }
    else {
      console.log("fff", fDate)
      var body = {
        "fromDate": fDate,
        "toDate": tDate,
        "treasuryCode": Trescode.TreasuryCode,
        "mode": ""
      }
    }
    this.loader.setLoading(true);
    console.log("Before_Calling_API_body", body);

    //api call of Treasury Report
    this.ApiMethods.postresultservice(this.ApiService.Getloplist, body).subscribe((resp: any) => {
      console.log("After_Calling_API_lop_Result", resp);
      if (resp.result.length > 0) {
        this.TreasuryName = Trescode.TreasuryName

        let arr = resp.result;
        this.GetTreasurytrackdata.data = arr;
        this.exportcompletedata = arr;
        this.showTreastrackTable = true;
        this.loader.setLoading(false);
        this.LopReportForm.disable();
      }
      else {
        this.snackbar.show('No Data Found !', 'alert')
        this.loader.setLoading(false);
        this.showTreastrackTable = false;
      }
    },
      (res: any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger')
          this.loader.setLoading(false);
        }
      }
    );
  }
  onReset() {
    window.location.reload()
  }

  applyFilter(filterValue: string) {
    this.GetTreasurytrackdata.filter = filterValue.trim().toLowerCase();
  }

  //  // // export to excel
  //  exportexcel(): void {
  //   let user = document.getElementById('test')
  //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(user);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new()
  //   XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
  //   XLSX.writeFile(wb, this.filename);
  //   }

  /// complete excel data
  exportexcel(json: any[], excelFileName: string): void {
    var Heading: any = [
      [' Sr No.', 'PD DIV DTLS', ' GRP', ' Budget Head', 'Discription of Budget Head', 'Div Code', 'Central Fund Phase 2', 'Central Fund Phase 1', 'State Fund Phase 1', ' State Fund Phase 2', ' Head Range', 'My Draft', 'Div State Fund Phase 1', 'Div State Fund Phase 2', 'Div Central Fund Phase 1', ' Total Voucher Phase 1', 'Total Voucher Phase 2']
    ];
    let arr: any[] = []
    json.forEach((item: any, index: any) => {
      let a = {
        " Sr No.": index + 1,
        "PD DIV DTLS": item.PD_DIV_DTLS,
        " GRP": item.GRP,
        "Budget Head": item.BHName,
        "Discription of Budget Head": item.MajorHeadNameHindi,
        "Div Code": item.DivCode,
        "Central Fund Phase 2": item.CentralFundPhase2,
        "Central Fund Phase 1": item.CentralFundPhase1,
        "State Fund Phase 1": item.StateFundPhase1,
        " State Fund Phase 2": item.StateFundPhase2,
        " Head Range": item.HeadRange,
        "My Draft": item.MyDraft,
        "Div State Fund Phase 1": item.DivStateFundPhase1,
        "Div State Fund Phase 2": item.DivStateFundPhase2,
        "Div Central Fund Phase 1": item.DivCentralFundPhase1,
        " Total Voucher Phase 1": item.TotalVoucherPhase1,
        "Total Voucher Phase 2": item.TotalVoucherPhase2,
      }
      arr.push(a)
     // console.log("a__", a)
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


  // //export to pdf 
  exportToPdf() {
    this.loader.setLoading(true);
    setTimeout(() => {
      let str: string = '';
      var Heading: any = 
        [' Sr No.', 'PD DIV DTLS', ' GRP', ' Budget Head', 'Discription of Budget Head', 'Div Code', 'Central Fund Phase 2', 'Central Fund Phase 1', 'State Fund Phase 1', ' State Fund Phase 2', ' Head Range', 'My Draft', 'Div State Fund Phase 1', 'Div State Fund Phase 2', 'Div Central Fund Phase 1', ' Total Voucher Phase 1', 'Total Voucher Phase 2']
      
      let table = document.createElement('table');
      table.setAttribute('id', 'testpdTable');
      let heasRow = ''
      Heading.forEach((value: any) => {
        heasRow = heasRow + `<th scope="col" >${value}</th>`
      })
      heasRow = `<tr>${heasRow} <tr> `
      let tableData = this.GetTreasurytrackdata.data.map((value1: any, index: number) => {

        str = str + `<td >${index + 1}</td>`
        this.displayedColumns.map((value: any) => {
          if (value !== 'SrNo') {
            if (value == 'MajorHead') {
              str = str + `<td >${value1['MajorHead']}</br>${value1['MajorHeadNameHindi']}</br></td>`
            }

            else if (value == 'BudgetHead') {
              str = str + `<td >${value1['BudgetHead']}</br>${value1['BHName']}</br></td>`
            }
            else {
              str = str + `<td >${value1[value]}</td>`
            }

          }

        })

        let str1 = `<tr>${str} <tr> `
        str = ''
        return (
          str1
        );

      }).join('');
      const footer: any = document.querySelector("#footer");
      // footer.setAttribute('class','thead-dark')
      table.innerHTML = `<thead><tr>${heasRow} <tr></thead> ` + `<tbody>${tableData}</tbody>`
      var doc = new jsPDF("l", "mm", "a2");
      let Date1 = this.LopReportForm.controls['fromDate'].value;
      let fDate = new DatePipe('en-US').transform(Date1, 'dd-MM-yyyy');
      let Date2 = this.LopReportForm.controls['toDate'].value;
      let tDate = new DatePipe('en-US').transform(Date2, 'dd-MM-yyyy');
      var name: any = "Government of Rajasthan" + '\n' + "Treasury Name :" + `${this.TreasuryName}` + '\n' + "List of Receipt from :" + `${fDate}` + " To :" + `${tDate}`
      doc.text(name, 130, 20);

      doc.addFileToVFS('NotoSerifDevanagari-VariableFont_wdth,wght.ttf', './assets/fonts/NotoSerifDevanagari-VariableFont_wdth,wght.ttf');
      doc.addFont('./assets/fonts/NotoSerifDevanagari-VariableFont_wdth,wght.ttf', 'NotoSerifDevanagari', 'normal');
      doc.setFont('NotoSerifDevanagari');

      // doc.text("pfmsApilog", 170, 10);
      //  autoTable(doc, { html: table });
      autoTable(doc, {
        margin: { top: 80 },
        html: table,
        tableWidth: 'auto',
        styles: {
          overflow: 'linebreak', valign: 'middle', fontSize: 9, cellPadding: 3, font: 'NotoSerifDevanagari',
          fontStyle: 'normal'
        },
      });
      // doc.text("https://rajkosh.rajasthan.gov.in", 10, 200);
      doc.save("TreasuryLOPReport.pdf");
      this.loader.setLoading(false);
    }, 500);

  }

}



