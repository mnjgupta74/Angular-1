import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as Val from '../../utils/Validators/ValBarrel'
import { Observable, map, startWith } from 'rxjs';
import { Router } from '@angular/router';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import { LoaderService } from 'src/app/services/loaderservice';
import { Helper } from 'src/app/utils/Helper';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { IGetAutoProcessStatus } from 'src/app/utils/Master';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MatTableDataSource } from '@angular/material/table';
import { IGEtPDBALANCE } from '../Interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DatePipe, formatDate } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import * as XLSX from 'xlsx';
//import { Workbook } from 'exceljs';
//import * as fs from 'file-saver';
import * as fileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-pd-balance-report',
  templateUrl: './pd-balance-report.component.html',
  styleUrls: ['./pd-balance-report.component.scss']
})
export class PdBalanceReportComponent implements OnInit {
  PDdata: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild('test', { static: false }) el!: ElementRef
  @ViewChild(MatSort) set matSort(Sort: MatSort) {
    this.PDdata.sort = Sort;
  }
  @ViewChild(MatPaginator) set MatPaginator(paginator: MatPaginator) {
    this.PDdata.paginator = paginator;
  }
  filename = "PD BALANCE.xlsx";
  datepicker: any = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  displayColumns =
    ['SrNo',
      //'TreasCode',
      'PDacno',
      'Balance']
  PdBalanceReportForm: any;
  PDbalance: boolean = false;
  PDbalancedata: any;
  ChooseOption: any = '';
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []
  exportcompletedata:any[]=[]

  GetAutoProcessStatusModal: IGetAutoProcessStatus = {
    treasuryCode: this.TCode.Treasury_Code,
    tblName: "TreasuryMst"
  }

  GetPDbalancereportmodel: IGEtPDBALANCE = {
    date: '',
    pdAccNo: 0,
    treasuryCode: this.TCode.Treasury_Code,
  }

  PDREPORTLIST: any = {
    "billNo": 1212,
    "reportPath": "/Treasury/Admin/Reports/PD_ACCOUNT_BALANCE_DM.xdo",
    "format": "pdf",
    "params": [
      {
        "name": "v_treasurycode",
        "value": ""
      },
      {
        "name": "v_pdaccno",
        "value": "0"
      },
      {
        "name": "v_date",
        "value": ""
      }
    ]
  }

  constructor(private sanitizer: DomSanitizer, private ApiMethods: ApiMethods, public loader: LoaderService, private ApiService: ApiService, private finyear_: Helper, private toyear_: Helper, private TCode: Helper, private UId: Helper, private snackbar: SnackbarService) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
    };
  }

  ngOnInit(): void {
    let financialYr = this.finyear_.year.toString().substring(2, 4) + this.toyear_.finyear.toString().substring(2, 4);   // It Shows = 2324
    console.log("TCode", this.TCode);
    this.GetAutoProcessStatusModal.treasuryCode = this.TCode.Treasury_Code;
    this.getTreasuryList();
    this.PdBalanceReportForm = new FormGroup({
      Date: new FormControl({ value: this.datepicker, disabled: false }, [Val.Required, Val.maxLength(12)]),
      PddACCValue: new FormControl('0', [Val.maxLength(14), Val.SpecialChar, Val.Numeric, Val.cannotContainSpace]),
      TreasuryControl: new FormControl({ value: '' }, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
      Year: new FormControl({ value: financialYr, disabled: true }),
    })
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
        this.Treasuryoptions = this.PdBalanceReportForm.controls['TreasuryControl'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            return typeof value === 'string' ? value : value.treasuryCode
          }),
          map((treasury: any) => {

            return treasury ? this._filter(treasury, data) : data.slice()
          })
        );
        const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.TCode.Treasury_Code)[0];
        this.PdBalanceReportForm.patchValue({
          TreasuryControl: treasury

        })

        if (this.TCode.Treasury_Code != "5000") {
          this.PdBalanceReportForm.controls['TreasuryControl'].disable();
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

  GetPDBalancereport() {
    console.log("before__", this.GetPDbalancereportmodel)
    let Date1 = this.PdBalanceReportForm.controls['Date'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');

    this.GetPDbalancereportmodel.date = fDate!;    //date controller;
    this.GetPDbalancereportmodel.pdAccNo = this.PdBalanceReportForm.controls['PddACCValue'].value; //pdaccno controller;
    this.GetPDbalancereportmodel.treasuryCode = this.PdBalanceReportForm.controls['TreasuryControl'].value.TreasuryCode; // treasurycode controller
    console.log("after", this.GetPDbalancereportmodel);
    this.loader.setLoading(true);

    // API CALL FOR pd balancwe report
    this.ApiMethods.postresultservice(this.ApiService.PDbalancecheck, this.GetPDbalancereportmodel).subscribe((resp: any) => {
      console.log("API CALL_", resp.result);
      let Data = resp.result;
      this.exportcompletedata=resp.result;
      console.log("ecxpisr-",this.exportcompletedata)
      if (resp.result.length > 0) {
        this.loader.setLoading(false);
        this.PDdata.data = Data;
        this.PDbalance = true;
      }

      else {
        this.loader.setLoading(false);
        this.PDbalance = false;
        this.snackbar.show('Data Not Found !', 'alert')
      }
    },

      (res: any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger')
        }
      }
    );
  }

  onReset() {
    // window.location.reload();
    this.PdBalanceReportForm.enable();
    this.PdBalanceReportForm.controls['TreasuryControl'].disable();
     this.PdBalanceReportForm.controls['Year'].disable();
    this.PdBalanceReportForm.controls['PddACCValue'].setValue('0');
    this.PdBalanceReportForm.controls['Date'].setValue(new Date());
    this.PDbalance = false;
   }

  applyFilter(filterValue: string) {
    this.PDdata.filter = filterValue.trim().toLowerCase();
    if (this.PDdata.paginator) {
      this.PDdata.paginator.firstPage();
    }
  }

  //export to pdf 
  // makePdf() {

  //   let str:string=''
  //   let table = document.createElement('table');
  //   table.setAttribute('id','testpdTable');
  //   let heasRow=''
  //   this.displayColumns.forEach((value:any)=> {
  //     heasRow = heasRow+`<th scope="col" >${value}</th>`
  //   })
  //   heasRow= `<tr>${heasRow} <tr> `
  //   let tableData = this.PDdata.data.map((value1,index) => {
  //   str =  str + `<td >${index+1}</td>`
  //   this.displayColumns.map((value:any)=> {
  //     if(value !==  'SrNo'){
  //       str=  str + `<td >${value1[value]}</td>`
  //     }

  //   })

  //   let str1 =`<tr>${str} <tr> `
  //   str=''
  //     return (
  //     str1
  //     );

  //   }).join('');
  //   const footer:any = document.querySelector("#footer");
  //   // footer.setAttribute('class','thead-dark')
  //   table.innerHTML = `<thead><tr>${heasRow} <tr></thead> `+ `<tbody>${tableData}</tbody>` 
  //   var doc = new jsPDF("l", "mm", "a4");
  //   doc.text("PD Balance Report", 130, 10);
  //   autoTable(doc, { html: table });
  //       doc.text("https://rajkosh.rajasthan.gov.in", 10, 200);
  //   doc.save("PDBalanceReport.pdf");

  // }

  // // export to excel
  // exportexcel(): void {
  //   let user = document.getElementById('test')
  //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(user);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new()
  //   XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
  //   XLSX.writeFile(wb, this.filename)
  // }

  //ORACLE PDF EXPORT
  MakePdf() {
    this.PDREPORTLIST.params[0].value = this.TCode.Treasury_Code;
    this.PDREPORTLIST.params[1].value = this.PdBalanceReportForm.value.PddACCValue;
    this.PDREPORTLIST.params[2].value = this.PdBalanceReportForm.value.Date;
    console.log("beforeapi called PDREPORTLIST", this.PDREPORTLIST)
    this.loader.setLoading(true)
    //api call of Treasury Officer List
    this.ApiMethods.postresultservice(this.ApiService.OracleReport, this.PDREPORTLIST).subscribe((resp: any) => {
      console.log("PDb", resp)
      var response = resp.data
      if (Object.keys(response).length > 0) {
        let documentArray = resp.data.report;
        console.log("docc__", documentArray)
        this.PDbalancedata = "data:application/pdf;base64," + documentArray.content;
        console.log("PDbalancedata", this.PDbalancedata)
        this.PDbalancedata = 'data:application/pdf;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(documentArray.content) as any).changingThisBreaksApplicationSecurity;
        // this.showReport = true
        let w = window.open('about:blank', 'mywindow', "width=1200, height=800");
        w?.document.write(' <iframe id="ireport" style="width:100%; min-height:875px;" scrolling="no" frameborder="0" allowfullscreen></iframe>')
        w?.document.getElementById('ireport')?.setAttribute("src", this.PDbalancedata);
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

//   // test excel function
//    generateExcel() {
//    // Excel Title, Header, Data
//     const title = 'PD Balance Report';
//     const header = ['PDacno', 'Treasury Code', 'Balance'];
//   //   const data = [
//   //   [2019, 1, '50', '20', '25', '20'],
//   //   [2019, 2, '80', '20', '25', '20'],
//   //   [2019, 3, '120', '20', '25', '20'],  
//   //   [2019, 4, '75', '20', '25', '20'],  
//   //   [2019, 5, '60', '20', '25', '20'],  
//   //   [2019, 6, '80', '20', '25', '20'],  
//   //   [2019, 7, '95', '20', '25', '20'],  
//   //   [2019, 8, '55', '20', '25', '20'],  
//   //   [2019, 9, '45', '20', '25', '20'],  
//   //   [2019, 10, '80', '20', '25', '20'],  
//   //   [2019, 11, '90', '20', '25', '20'],  
//   //   [2019, 12, '110', '20', '25', '20'],      
//   // ];

//     // Create workbook and worksheet
//     const workbook = new Workbook();
//     const worksheet = workbook.addWorksheet('Sharing Data');


// // Add Row and formatting
//     const titleRow = worksheet.addRow([title]);
//     titleRow.font = { name: 'Corbel', family: 4, size: 16, underline: 'double', bold: true };
//     worksheet.addRow([]);
//     const subTitleRow = worksheet.addRow(['Date : 06-09-2020']);

//     worksheet.mergeCells('A1:D2');


// // Blank Row
//     worksheet.addRow([]);

// // Add Header Row
//     const headerRow = worksheet.addRow(header);

// // Cell Style : Fill and Border
//     headerRow.eachCell((cell, number) => {
//   cell.fill = {
//     type: 'pattern',
//     pattern: 'solid',
//     fgColor: { argb: 'FFFFFF00' },
//     bgColor: { argb: 'FF0000FF' }
//   };
//   //cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
// });

// // Add Data and Conditional Formatting

// //  console.log("qty--",qty)
//     this.exportcompletedata.forEach((d:any) => {
//     //  const list = Object.entries(d);
//     //  console.log("list  data_",list)
//       // let arr:{ TreasCode: number; PDacno: string; Balance:number}[] = [];
//       //  arr.push(d)
//       //  console.log("arr-",arr)
//       // console.log("data_",d)
//   const row = worksheet.addRow(Object.values(d));
//  // const row = worksheet.addRow(list);
// ////  console.log("row-",row)
//   const qty = row.getCell(5);
// //  console.log("qty--",qty)
//   let color = 'FF99FF99';
//   // if (+qty.value < 500) {
//   //   color = 'FF9999';
//   // }

//   // qty.fill = {
//   //   type: 'pattern',
//   //   pattern: 'solid',
//   //   fgColor: { argb: color }
//   // };
// }

// );

// //worksheet.getColumn(3).width = 30;
//   //  worksheet.getColumn(4).width = 30;
//     worksheet.addRow([]);


// // Footer Row
//     const footerRow = worksheet.addRow(['This is system generated excel sheet.']);
//     footerRow.getCell(1).fill = {
//   type: 'pattern',
//   pattern: 'solid',
//   fgColor: { argb: 'FFCCFFE5' }
// };
//     footerRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

// // Merge Cells
//     worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);

// // Generate Excel File with given name
//     workbook.xlsx.writeBuffer().then((data: any) => {
//   const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//   fs.saveAs(blob, 'Pdbalance.xlsx');
// });

//   }

/// complete excel data
exportexcel(json: any[], excelFileName: string): void {
  var Heading: any = [
    [' Sr No.','Treasury','  Pd Account No',' Total Balance']
  ];
  let arr:any[]=[]
  json.forEach((item:any,index:any)=>{
    let a={
      " Sr No.":index+1,
      "Treasury":item.TreasCode,
      "  Pd Account No":item.PDacno,
      "Total Balance":item.Balance,
         }
arr.push(a)
//console.log("a__",a)
  })
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(arr);
 // var elt = document.getElementById('test');
 // const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(elt);
  XLSX.utils.sheet_add_aoa(worksheet, Heading)
  //  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
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
