import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, ValidatorFn, AbstractControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loaderservice';
import { IGetAutoProcessShowStatus, IGetAutoProcessStatus, IGetOnlineBillList } from 'src/app/utils/Master';
import { Helper } from 'src/app/utils/Helper';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ViewDocumentComponent } from 'src/app/bill-process/view-document/view-document.component';
import { DomSanitizer } from '@angular/platform-browser';
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

export interface reportList {

  "billNo": 1212,
  "reportPath": "/Treasury/Admin/Reports/Auto_Process.xdo",
  "format": "pdf",
  "params": [
    {
      "name": "v_type",
      "value": ""
    },
    {
      "name": "V_TreasuryCode",
      "value": "2100"
    },
    {
      "name": "V_FinYear",
      "value": "2023"
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



export interface AutoProcessList {
  CDE_Refno: number;
  TokenNo: string;
  BudgetHead: string;
  OfficeId: string;
  NetAmt: number;
  GrossAmt: number;
}

@Component({
  selector: 'app-error-log-report',
  templateUrl: './error-log-report.component.html',
  styleUrls: ['./error-log-report.component.scss']
})
export class ErrorLogReportComponent implements OnInit {
  dataSource: any;
  @ViewChild('test', { static: false }) el!: ElementRef;
  filename = " ErrorLogReport.xlsx";
  exportcompletedata:any[]=[];
  dataSource1: any
  // Form Module
  OnlineBillListForm: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) Sort!: MatSort;

  loading: any;
  mindate: Date = new Date()
  maxdate: Date = new Date
  Payment_radio: boolean = true
  Receipt_radio: boolean = false


  //LIst array
  OnLineBillListarr: any[] = []
  radioButtonvalue: any;
  TreasuryListarrData: any[] = []
  //showTab_Table: boolean = false

  ErrorForm: any;
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []
  AUTOBILLDATA: any;
  SelectTreasury: any = ''
  selectedOption: any = ''
  showTab_Table: boolean = false


  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.GetErrorListdata.sort = sort;
  }
  @ViewChild(MatPaginator) set MatPaginator(paginator: MatPaginator) {
    this.GetErrorListdata.paginator = paginator;
  }

  GetErrorListdata: MatTableDataSource<AutoProcessList> = new MatTableDataSource();
  displayedColumns = [
    'SrNo',
    'errorName',
    'transactionDate',
    'apiUrl',
    'methodName',
    'payload',    
    'userId',
  ];


 
  constructor(private sanitizer: DomSanitizer, private ApiMethods: ApiMethods, public loader: LoaderService, private ApiService: ApiService, private _liveAnnouncer: LiveAnnouncer, private finyear_: Helper, private toyear_: Helper, private TCode: Helper, private UId: Helper, private datePipe: DatePipe, public dialog: MatDialog, private snackbar: SnackbarService) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);

    };
  }
  ngOnInit() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    console.log('Test Treasury Officer List');
    let financialYr = this.finyear_.year.toString().substring(2, 4) + this.toyear_.finyear.toString().substring(2, 4);   // It Shows = 2324

    //Treasury Officer form
    this.ErrorForm = new FormGroup({
      fromDate: new FormControl({ value: new Date(), disabled: false }, [Validators.required, Validators.maxLength(12)]),
      toDate: new FormControl({ value: new Date(), disabled: false }, [Validators.required, Validators.maxLength(12)]),
    });

  }





  // Function : Call error detail Fetch API >>>------------------->
  GetAutoProcessDetail() {
    this.loader.setLoading(true);
    let Date1 = this.ErrorForm.controls['fromDate'].value;
    //let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd hh:mm:ss');
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');
    let Date2 = this.ErrorForm.controls['toDate'].value;
    //let tDate = new DatePipe('en-US').transform(Date2, 'yyyy-MM-dd hh:mm:ss');
    let tDate = new DatePipe('en-US').transform(Date2, 'yyyy-MM-dd');
    console.log("Before_Calling_API_GetAutoProcessStatusShowModal_Result", Date1, Date2);
    var body = {
      "fromDate": fDate,
      "toDate": tDate,
      "userId": sessionStorage.getItem('rajkoshId')
    }
    console.log("body_beforsend__", body);

    // //api call of Errolog view list
    this.ApiMethods.postresultservice(this.ApiService.ErrorLogView, body).subscribe((resp:any) => {
      console.log("After_Calling_API_geterrorlog_Result", resp);

      if (resp.result.length > 0) {
        this.GetErrorListdata.data = resp.result;
        this.exportcompletedata=resp.result;
        // this.GetErrorListdata.sort = this.Sort;
        // this.GetErrorListdata.paginator = this.paginator;
        this.showTab_Table = true;
        this.loader.setLoading(false);
      }
      else {
        //this.toastrService.info(CmnMsg, 'Info!');  // Comman Message - No Data Found
        this.snackbar.show('No Data Found !', 'alert')
        //window.location.reload();
        this.GetErrorListdata.data = [];
        this.loader.setLoading(false);
        this.showTab_Table = false;
      }
    },
      (res:any) => {
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

  //  Auditor List filter >>>------------------->
  _filter(value: string, data: any) {
    // console.log("filterval__", value);
    return data.filter((option: any) => {
      // console.log("option_val__", option);
      return option.TreasuryName.toLowerCase().includes(value.toLowerCase())
    });
  }



  //  Auditor display Function >>>------------------->
  displayFn(selectedoption: any) {
    console.log("display_fun_call aaa", selectedoption.TreasuryName);
    return selectedoption ? selectedoption.TreasuryName : undefined;
  }


  viewDocumentPopup(element: any) {
    //this.loader.setLoading(true);
    this.showmodal(element.CDE_Refno);
  }



  showmodal(CDE_Refno: any) {
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
    dialogRef.componentInstance.getBase64ImgDocumentId(CDE_Refno);
  }



  applyFilter(filterValue: string) {
    this.GetErrorListdata.filter = filterValue.trim().toLowerCase();
    if (this.GetErrorListdata.paginator) {
      this.GetErrorListdata.paginator.firstPage();
    }
  }


  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce('Sorted ${sortState.direction}ending');
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  onReset() {
    window.location.reload();
  }

  autocompleteObjectValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (typeof control.value === 'string') {
        return { 'invalidAutocompleteObject': { value: control.value } }
      }
      return null  // valid option selected /
    }
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
    ['Sr No.',' Error Name','Api Url','Date','Method Name','Payload',' UserId']
  ];
  let arr:any[]=[]
  json.forEach((item:any,index:any)=>{
    let a={
      " Sr No.":index+1,
      "Error Name":item.errorName,
      "Date":item.transactionDate,
      "Api Url":item.apiUrl,
      "Method Name":item.methodName,
      "Payload":item.payload,
      "UserId":item.userId,
        }
arr.push(a)
//console.log("a__",a)
  })
  //const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
 // var elt = document.getElementById('test');
 // const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(elt);
   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(arr);
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


  // //export to pdf 
  ExportPdf() {
    this.loader.setLoading(true);
    setTimeout(() => {
      let str:string='';
      var Heading: any = 
        ['Sr No.',' Error Name','Api Url','Date','Method Name','Payload',' UserId'];
            let table = document.createElement('table');
      table.setAttribute('id','testpdTable');
      let heasRow=''
      Heading.forEach((value:any)=> {
        heasRow = heasRow+`<th scope="col" >${value}</th>`
      })
      heasRow= `<tr>${heasRow} <tr> `
      let tableData = this.GetErrorListdata.data.map((value1:any,index) => {
      
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
      var doc = new jsPDF("l", "mm", "a2");
     // doc.text("pfmsApilog", 170, 10);
      autoTable(doc, { html: table });
     
     // doc.text("https://rajkosh.rajasthan.gov.in", 10, 200);
      doc.save("ErrorLog.pdf");
      this.loader.setLoading(false);
    }, 500);
   
  }


 
}
