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
  selector: 'app-auto-process-status',
  templateUrl: './auto-process-status.component.html',
  styleUrls: ['./auto-process-status.component.scss']
})
export class AutoProcessStatusComponent implements OnInit {
  @ViewChild('test', { static: false }) el!: ElementRef;
  filename = "AutoProcessStatus.xlsx";
  exportcompletedata:any[]=[]
  dataSource: any;
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

  AutoProcessStatusForm: any;
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []
  AUTOBILLDATA:any;
  SelectTreasury: any = ''
  selectedOption: any = ''
  showTab_Table: boolean = false


  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.GetAutoProcessListdata.sort = sort;
  }
  @ViewChild(MatPaginator) set MatPaginator(paginator: MatPaginator) {
    this.GetAutoProcessListdata.paginator = paginator;
  }

  GetAutoProcessListdata: MatTableDataSource<AutoProcessList> = new MatTableDataSource();
  displayedColumns = [
    'SrNo',
    'CDE_Refno',
    'TokenNo',
    'BudgetHead/ObjectHead/BFC_Type/Head_Type',
    'OfficeId',
    'NetAmt',
    'GrossAmt',
  ];



  GetAutoProcessStatusModal: IGetAutoProcessStatus = {
    treasuryCode: this.TCode.Treasury_Code,
    tblName: "TreasuryMst"
  }


  GetAutoProcessStatusShowModal: IGetAutoProcessShowStatus = {
    fromDate: "",
    toDate: "",
    treasuryCode: this.TCode.Treasury_Code,
  }
  
  AUTOBILLLIST:any={
    "billNo": 1212,
    "reportPath": "/Treasury/Admin/Reports/Rpt_get_auto_bill_transaction.xdo",
    "format": "pdf",
    "params": [
      {
            "name": "v_type",
            "value": "A"
        },
        {
            "name": "v_treasurycode",
            "value": ""
        },
         {
            "name": "v_fromdate",
            "value": ""
        },
        {
            "name": "v_todate",
            "value": ""
        }
    ]
}


  constructor(private sanitizer: DomSanitizer, private ApiMethods: ApiMethods, public loader: LoaderService, private ApiService: ApiService, private _liveAnnouncer: LiveAnnouncer, private finyear_: Helper, private toyear_: Helper, private TCode: Helper, private UId: Helper, private datePipe: DatePipe, public dialog: MatDialog, private snackbar: SnackbarService) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);

    };
  }
  ngOnInit() {
    console.log("TCode", this.TCode);
    this.GetAutoProcessStatusModal.treasuryCode = this.TCode.Treasury_Code;
    this.GetAutoProcessStatusShowModal.treasuryCode = this.TCode.Treasury_Code;
    this.getTreasuryList();
    const date = new Date();
    date.setDate(date.getDate() - 1);
    console.log('Test Treasury Officer List');
    let financialYr = this.finyear_.year.toString().substring(2, 4) + this.toyear_.finyear.toString().substring(2, 4);   // It Shows = 2324

    //Treasury Officer form
    this.AutoProcessStatusForm = new FormGroup({
      TreasuryControl: new FormControl({value:'',disabled:true}, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required] }),
      fromDate: new FormControl({ value: new Date(), disabled: false }, [Validators.required, Validators.maxLength(12)]),
      toDate: new FormControl({ value: new Date(), disabled: false }, [Validators.required, Validators.maxLength(12)]),
      Year: new FormControl({ value: financialYr, disabled: true }),
    });

  }



  // Call Auditor List API >>>------------------->
  getTreasuryList() {
    console.log('Test Treasury Officer List', this.GetAutoProcessStatusModal);
    console.log("TTTTTTTTTTTTTTTTTTTTTTTTTT__res", this.TCode.Treasury_Code);
    this.loader.setLoading(true);
    this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe((resp:any) => {
      // this.ApiMethods.getservice(this.ApiService.autoProcessStatus + 5000 +"/"+this.GetAutoProcessStatusModal.tblName).subscribe(resp => {
      console.log("Auditor__res", resp);
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.TreasuryListarr = resp.result
        //console.log("Show_Treasury_AuditorList", this.TreasuryListarr);
        this.Treasuryoptions = this.AutoProcessStatusForm.controls['TreasuryControl'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            return typeof value === 'string' ? value : value.treasuryCode
          }),
          map((treasury: any) => {

            return treasury ? this._filter(treasury, data) : data.slice()
          })
        );
        const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.TCode.Treasury_Code)[0];
        // console.log("CCCCCCCCCCCCCCCCCCCCC_Show_treasury", treasury);
        this.AutoProcessStatusForm.patchValue({
          TreasuryControl: treasury
        })


      }
    })
    this.loader.setLoading(false);
  }


  // Function : Call Bill Encashment Fetch API >>>------------------->
  GetAutoProcessDetail() {

    // Get TokenNum Page Control value

    let Date1 = this.AutoProcessStatusForm.controls['fromDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');
    let Date2 = this.AutoProcessStatusForm.controls['toDate'].value;
    let tDate = new DatePipe('en-US').transform(Date2, 'yyyy-MM-dd');


    let treasVal = this.AutoProcessStatusForm.controls['TreasuryControl'].value;
    this.GetAutoProcessStatusShowModal.fromDate = fDate!;
    this.GetAutoProcessStatusShowModal.toDate = tDate!;
    this.GetAutoProcessStatusShowModal.treasuryCode = treasVal.TreasuryCode;
  

   
    
    this.loader.setLoading(true);
    //this.GetOnlineBillListModal.type = 1
    console.log("Before_Calling_API_GetAutoProcessStatusShowModal_Result", this.GetAutoProcessStatusShowModal);
    //api call of Treasury Officer List
    this.ApiMethods.postresultservice(this.ApiService.autoProcessView, this.GetAutoProcessStatusShowModal).subscribe((resp:any) => {
      console.log("After_Calling_API_GetAutoProcessStatusShowModal_Result", resp);

      if (resp.result.length > 0) {
        this.GetAutoProcessListdata.data = resp.result;
         this.exportcompletedata = resp.result;
        // this.GetAutoProcessListdata.paginator = this.paginator;
        this.showTab_Table = true;
        this.loader.setLoading(false);
      }
      else {
        //this.toastrService.info(CmnMsg, 'Info!');  // Comman Message - No Data Found
        this.snackbar.show('No Data Found !', 'alert')
        //window.location.reload();
        this.GetAutoProcessListdata.data = [];
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

  //  Auditor List Select >>>------------------->
  OnTreasurySelected(SelectTreasury: any) {
    console.log("befort______Select_Auditor", SelectTreasury.TreasuryCode);
    // console.log("slelction__________option_____________", SelectTreasury);
    this.GetAutoProcessStatusModal.treasuryCode = SelectTreasury.TreasuryCode
    // console.log("Treasury,,,,,,,,,", this.GetAutoProcessStatusModal.treasuryCode)
  }


  //  Auditor display Function >>>------------------->
  displayFn(selectedoption: any) {
    console.log("display_fun_call aaa", selectedoption.TreasuryName);
    return selectedoption ? selectedoption.TreasuryName : undefined;
  }


  viewDocumentPopup(element: any) {
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
    this.GetAutoProcessListdata.filter = filterValue.trim().toLowerCase();
    if (this.GetAutoProcessListdata.paginator) {
      this.GetAutoProcessListdata.paginator.firstPage();
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
      return null  /* valid option selected */
    }
  }
  //export to pdf 
  // makePdf() {
  //   let str:string=''
  //   let table = document.createElement('table');
  //   table.setAttribute('id','testpdTable');
  //   let heasRow=''
  //   this.displayedColumns.forEach((value:any)=> {
  //     heasRow = heasRow+`<th scope="col" >${value}</th>`
  //   })
  //   heasRow= `<tr>${heasRow} <tr> `
  //   let tableData = this.GetAutoProcessListdata.data.map((value1:any,index) => {
    
  //   str =  str + `<td >${index+1}</td>`
  //   this.displayedColumns.map((value:any)=> {
  //     if(value !==  'SrNo'&& value!=="BudgetHead/ObjectHead/BFC_Type/Head_Type"){
  //       str=  str + `<td >${value1[value]}</td>`
        
  //     }
  //     if(value =="BudgetHead/ObjectHead/BFC_Type/Head_Type"){
       
  //       str=  str + `<td >${value1["Budgethead"]}/${value1["ObjectHead"]}/${value1["BFC_Type"]}/${value1["Head_Type"]}</td>`
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
  //   var doc = new jsPDF("p", "pt", "a3");
  //   doc.text("Auto Bill Report", 320, 30);
  //   autoTable(doc, { html: table });
  //  doc.text("Rajkosh.raj.nic.in", 10, 1120);
  //   doc.save("AutoBillReport.pdf");

  // }

  // // // export to excel
  // exportexcel(): void {
  //   let user = document.getElementById('test')
  //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(user);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new()
  //   XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
  //   XLSX.writeFile(wb, this.filename)
  // }

    /// complete excel data
exportexcel(json: any[], excelFileName: string): void {
  var Heading: any = [
    ['Sr No.','CDERef No.','Token No. ',' BudgetHead/ObjectHead/BFCType/HeadType','OfficeId','Cash Amt',' Gross Amt']
  ];
  let arr:any[]=[]
  json.forEach((item:any,index:any)=>{
    let a={
      " Sr No.":index+1,
      "CDERef No.":item.CDE_Refno,
      "Token No.":item.TokenNo,
      " BudgetHead/ObjectHead/BFCType/HeadType":item.Budgethead,
      "OfficeId":item.OfficeId,
      "Cash Amt":item.NetAmt,
      " Gross Amt":item.GrossAmt,
         }
arr.push(a)
//console.log("a__",a)
  })
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(arr);
  //var elt = document.getElementById('test');
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

  //ORACLE PDF EXPORT
  ExportPdf() {
    let Date1 = this.AutoProcessStatusForm.controls['fromDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');
    let Date2 = this.AutoProcessStatusForm.controls['toDate'].value;
    let tDate = new DatePipe('en-US').transform(Date2, 'yyyy-MM-dd');

    this.AUTOBILLLIST.params[1].value = this.TCode.Treasury_Code;
    this.AUTOBILLLIST.params[2].value =fDate! ;
    this.AUTOBILLLIST.params[3].value =tDate!;
    console.log("beforeapi called AUTOBILLLIST", this.AUTOBILLLIST)
    this.loader.setLoading(true);
    //api call of Treasury Officer List
    this.ApiMethods.postresultservice(this.ApiService.OracleReport, this.AUTOBILLLIST).subscribe((resp:any) => {
      console.log("imgresp__", resp)
      var response = resp.data
      if (Object.keys(response).length > 0) {
        let documentArray = resp.data.report;
        console.log("docc__", documentArray)
        this.AUTOBILLDATA= "data:application/pdf;base64," + documentArray.content;
        console.log("AUTOBILLDATA__", this.AUTOBILLDATA)
        this.AUTOBILLDATA = 'data:application/pdf;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(documentArray.content) as any).changingThisBreaksApplicationSecurity;
       // this.showReport = true
       let w = window.open('about:blank', 'mywindow', "width=1200, height=800");
        w?.document.write(' <iframe id="ireport" style="width:100%; min-height:875px;" scrolling="no" frameborder="0" allowfullscreen></iframe>')
        w?.document.getElementById('ireport')?.setAttribute("src", this.AUTOBILLDATA);
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
}
// function moment(Date: any) {
//   throw new Error('Function not implemented.');
// }




