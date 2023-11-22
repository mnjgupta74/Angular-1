
import { Component, ElementRef, OnInit,ViewChild } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { LoaderService } from 'src/app/services/loaderservice';
import { Helper } from 'src/app/utils/Helper';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs/internal/Observable';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/internal/operators/map';
import { HttpClient } from '@angular/common/http';
import * as Val from '../../../app/utils/Validators/ValBarrel'
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DomSanitizer } from '@angular/platform-browser';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';



@Component({
  selector: 'app-cash-zero-report',
  templateUrl: './cash-zero-report.component.html',
  styleUrls: ['./cash-zero-report.component.scss']
})
export class CashZeroReportComponent implements OnInit {

  CashZeroData: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatSort) set matSort(Sort: MatSort) {
    this.CashZeroData.sort = Sort;
  }
  @ViewChild(MatPaginator) set MatPaginator(paginator: MatPaginator) {
    this.CashZeroData.paginator = paginator;
  }

  @ViewChild('test', { static: false }) el!: ElementRef

  filename = "CashZeroReport.xlsx";
  exportcompletedata:any[]=[];

  CashZeroReportForm: any;
  IncomeTaxReport: boolean=false
  ACBillReport: boolean=false
  WithoutDivisionCode: boolean=false
  CashZeroReports: boolean=false
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []
  treasuryCode:any
  CashZero:boolean=false
  CashZeroPdfdata : any
  displayColumns = ['SrNo','Type','VoucherDate', 'DivisionName', 'vno', 'GrossAmt', 'BudgetHead', 'TCODE', 'division_code']
 
  
 
  
  constructor( private sanitizer: DomSanitizer,private ApiMethods: ApiMethods, public loader: LoaderService, private ApiService: ApiService, private snackbar: SnackbarService,  public _helperMsg: Helper,   private TCode: Helper,
    private UId: Helper, private IPAdd: Helper, public dialog: MatDialog, private Helper: Helper, private finyear_: Helper, private toyear_: Helper, private asgnId: Helper,
    private http: HttpClient,private apiMethods: ApiMethods) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
    };
    
  }

  ngOnInit(): void {

   
 
    this.CashZeroReportForm = new FormGroup({
      toDate: new FormControl({ value: '', disabled: false }, [Val.Required, Val.maxLength(12)]),
       fromDate: new FormControl({ value: '', disabled: false }, [Val.Required, Val.maxLength(12)]),
       TreasuryCode: new FormControl({ value: '', disabled: true }), 
       FinYear : new FormControl({ value: '' }), 
       VoucherGenerated: new FormControl({ value: '' }), 
     
    });

    this.getTreasuryList()

   
  }

  displayTreasFn(selectedoption: any) {
    console.log("display_fun_call aaa", selectedoption.TreasuryName);
    return selectedoption ? selectedoption.TreasuryName : undefined;
  }

  getTreasuryList() {
    this.loader.setLoading(true);
    console.log("Treasury_Code : ",this._helperMsg.Treasury_Code)
       this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe((resp:any)  => {

       console.log("Auditor__res", resp);
       let data = resp.result
       if (resp.result && resp.result.length > 0) {
         this.TreasuryListarr = resp.result
         console.log("Show_Treasury_AuditorList", this.TreasuryListarr);
         this.Treasuryoptions = this.CashZeroReportForm.controls['TreasuryCode'].valueChanges.pipe(
           startWith(''),
           map((value: any) => {
             return typeof value === 'string' ? value : value.treasuryCode
           }),
           map((treasury: any) => {

             return treasury ? this._filterTreas(treasury, data) : data.slice()
           })
         );
         const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this._helperMsg.Treasury_Code)[0];
         this.CashZeroReportForm.patchValue({
           TreasuryCode: treasury

         })

       }
     })
     this.loader.setLoading(false);

    }

    _filterTreas(value: string, data: any) {
      return data.filter((option: any) => {
        return option.TreasuryName.toLowerCase().includes(value.toLowerCase())
      });
    }

    onReset(){
      window.location.reload() 
    }

   

    cashZeroSubmitForm(){

      this.loader.setLoading(true);
      let fromDate = this.CashZeroReportForm.controls['fromDate'].value;
      let toDate=this.CashZeroReportForm.controls['toDate'].value
      fromDate = new DatePipe('en-US').transform(fromDate, 'yyyy-MM-dd');
      toDate = new DatePipe('en-US').transform(toDate, 'yyyy-MM-dd');
      this.treasuryCode = this.TCode.Treasury_Code;
      let finYear = this.CashZeroReportForm.controls['FinYear'].value;
      console.log("finYear ==",finYear)
  
      const formData ={
      "fromDate": fromDate,
      "toDate": toDate,
      "treasuryCode": this.treasuryCode,
      "finYear":finYear
      }
      
      console.log("fromDate :",fromDate)
      console.log("toDate :",toDate)
     
      this.ApiMethods.postresultservice(this.ApiService.getCashZeroReportDetails, formData).subscribe((resp:any) => {
        this.loader.setLoading(false);
        let ResultData= resp.result;
        console.log("ResultData",ResultData.length)
       
        if(ResultData.length>0){
          this.exportcompletedata=resp.result;
          this.CashZeroData.data = ResultData;
          this.CashZero = true;
          
        }
        else 
        {
          this.CashZero = false;
          this.snackbar.show('No Data Found !', 'alert');
         
        }
       
      },
      (res:any) => {
            console.log("errror message___", res.status);
  
            if (res.status != 200) {
              this.loader.setLoading(false);
             
            }
          });
  
  
    }

    applyFilter(filterValue: string) {
      this.CashZeroData.filter = filterValue.trim().toLowerCase();
      if (this.CashZeroData.paginator) {
        this.CashZeroData.paginator.firstPage();
      }
    }
    
    
    // MakePdf() {
    //   let fromDate = this.CashZeroReportForm.controls['fromDate'].value;
    //   let toDate=this.CashZeroReportForm.controls['toDate'].value
    //   fromDate = new DatePipe('en-US').transform(fromDate, 'yyyy-MM-dd');
    //   toDate = new DatePipe('en-US').transform(toDate, 'yyyy-MM-dd');
    //   this.treasuryCode = this.TCode.Treasury_Code;
  
    //   const formData ={
    //   "fromDate": fromDate,
    //   "toDate": toDate,
    //   "treasuryCode": this.treasuryCode,
    //   }
     
    //    this.loader.setLoading(true)
    //   //api call of Treasury Officer List
    //   this.ApiMethods.postresultservice(this.ApiService.OracleReport, formData).subscribe((resp:any) => {
    //     console.log("PDb", resp)
    //     var response = resp.data
    //     if (Object.keys(response).length > 0) {
    //       let documentArray = resp.data.report;
    //       console.log("docc__", documentArray)
    //       this.CashZeroPdfdata = "data:application/pdf;base64," + documentArray.content;
    //       console.log("CashZeroPdfdata", this.CashZeroPdfdata)
    //       this.CashZeroPdfdata = 'data:application/pdf;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(documentArray.content) as any).changingThisBreaksApplicationSecurity;
    //      // this.showReport = true
    //      let w = window.open('about:blank', 'mywindow', "width=1200, height=800");
    //       w?.document.write(' <iframe id="ireport" style="width:100%; min-height:875px;" scrolling="no" frameborder="0" allowfullscreen></iframe>')
    //       w?.document.getElementById('ireport')?.setAttribute("src", this.CashZeroPdfdata);
    //       this.loader.setLoading(false)
    //     }
    //     else {
    //       this.snackbar.show('No Data Found !', 'alert')
    //       this.loader.setLoading(false);
    //     }
    //   },
    //     (res:any) => {
    //       console.log("errror message___", res.status);
    //       if (res.status != 200) {
    //         this.snackbar.show('Something Went Wrong! Please Try Again !', 'danger')
    //         this.loader.setLoading(false);
    //       }
    //     }
    //   );
    // }


      // //export to pdf 
  exportToPdf() {
    this.loader.setLoading(true);
    setTimeout(() => {
      let str:string=''
      let table = document.createElement('table');
      table.setAttribute('id','testpdTable');
      let heasRow=''
      this.displayColumns.forEach((value:any)=> {
        heasRow = heasRow+`<th scope="col" >${value}</th>`
      })
      heasRow= `<tr>${heasRow} <tr> `
      let tableData = this.CashZeroData.data.map((value1:any,index) => {
      
      str =  str + `<td >${index+1}</td>`
      this.displayColumns.map((value:any)=> {
        if(value !==  'SrNo'){
          str=  str + `<td >${value1[value]?value1[value]:'-'}</td>`
          
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
      var doc = new jsPDF("l", "mm", "a2");
     // doc.text("pfmsApilog", 170, 10);
      autoTable(doc, { html: table });
     
     // doc.text("https://rajkosh.rajasthan.gov.in", 10, 200);
      doc.save("pfmsApilog.pdf");
      this.loader.setLoading(false);
    }, 500);
   
  }

    
    // // // export to excel
    // exportexcel(): void {
    //   let user = document.getElementById('test')
    //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(user);
    //   const wb: XLSX.WorkBook = XLSX.utils.book_new()
    //   XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
    //   XLSX.writeFile(wb, this.filename);
      // }
    
 /// complete excel data
exportexcel(json: any[], excelFileName: string): void {
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
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





