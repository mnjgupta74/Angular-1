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
// import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/services/loaderservice';
import { IGetPDMasterRpt } from '../Interface';
import { Helper } from 'src/app/utils/Helper';
import { log } from 'console';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/utils/snackbar.service';
// import * as Val from  '../../../app/utils/Validators/ValBarrel'
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DomSanitizer } from '@angular/platform-browser';
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
 
export interface PDMasterRptList {
  DDOCode: number;
  TreasSancDate: string;
  PdAccNo: string;
  PDAccName: string;
  BudgetHead: number;
  ContOfficerName1: number;
  BearingFlag: number;
  ContOfficerName2: number;
}


@Component({
  selector: 'app-pdmaster-report',
  templateUrl: './pdmaster-report.component.html',
  styleUrls: ['./pdmaster-report.component.scss']
})

export class PDMasterReportComponent implements OnInit {

  @ViewChild('test1', { static: false }) el2!: ElementRef;
  filename = "PDMasterReport.xlsx";
  exportcompletedata:any[]=[]
  constructor(private sanitizer: DomSanitizer, private ApiMethods: ApiMethods, public loader: LoaderService, private ApiService: ApiService, private _liveAnnouncer: LiveAnnouncer,private finyear_:Helper,private toyear_:Helper,private TCode:Helper,private UId:Helper,private datePipe: DatePipe, public dialog: MatDialog, private snackbar: SnackbarService) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);

    };
  
  }


  PDMasterRptForm: any;
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []
  PDMASTERRDATA:any;
  SelectTreasury: any = ''
  selectedOption: any = ''
  MajorHeadListarr: any = []
  MajorHeadoptions: Observable<any[]> | undefined;
  SelectMajorHead: any = ''

  showTab_Table: boolean = false

  GetPDMasterListdata: MatTableDataSource<PDMasterRptList> = new MatTableDataSource();
  displayedColumns = [
    'SrNo',
    'DDOCode',
    'TreasSancDate',
    'PdAccNo',
    'PDAccName',
    'FinDeptSancDt',
    'BudgetHead',
    'ContOfficerName1',
    'BearingFlag',
    'ContOfficerName2',
  ];

 PDMASTERREPORT:any= {
    "billNo": 1212,
    "reportPath": "/Treasury/Admin/Reports/RPT_TRG_PDACCOUNT_MST_DM.xdo",
    "format": "pdf",
    "params": [
   
        {
            "name": "v_treascode",
            "value": ""
        },
         {
            "name": "v_BudgetHead",
            "value": ""
        }
    ]
  }

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.GetPDMasterListdata.sort = sort;
    this.GetPDMasterListdata.sort = sort;
  }
  @ViewChild(MatPaginator) set MatPaginator(paginator:MatPaginator){
    this.GetPDMasterListdata.paginator = paginator;
    this.GetPDMasterListdata.paginator = paginator;
  }

  
  GetPDMasterRptShowModal: IGetPDMasterRpt = {
    type:1,
    treasuryCode: this.TCode.Treasury_Code,
    budgetHead: ""
    }

    

  ngOnInit() {
 
    let financialYr  = this.finyear_.year.toString().substring(2,4) + this.toyear_.finyear.toString().substring(2,4);   // It Shows = 2324

    this.getTreasuryList();
    this.getMajorHeadList() 

    this.PDMasterRptForm = new FormGroup({
    TreasuryControl: new FormControl('',{ validators: [this.ApiMethods.autocompleteObjectValidator(),Validators.required] }),
    MajorHeadControl: new FormControl('',{ validators: [this.ApiMethods.autocompleteObjectValidator(),Validators.required] }),
    Year: new FormControl({ value:  financialYr, disabled: true }),
    });
 
     
  }


// Call Auditor List API >>>------------------->
getTreasuryList() {
  
  this.loader.setLoading(true);
 
  // this.ApiMethods.getservice(this.ApiService.autoProcessStatus + this.TCode.Treasury_Code+"/"+"TreasuryMst").subscribe(resp => {
 // this.ApiMethods.getservice(this.ApiService.autoProcessStatus + 5000 +"/"+"TreasuryMst").subscribe(resp => {
  this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe((resp:any) => {   
  
    console.log("Auditor__res", resp);
    let data = resp.result
     
    if (resp.result && resp.result.length > 0) 
      {    
         this.TreasuryListarr = resp.result
           //console.log("Show_Treasury_AuditorList", this.TreasuryListarr);
           this.Treasuryoptions = this.PDMasterRptForm.controls['TreasuryControl'].valueChanges.pipe(
            startWith(''),
            map((value: any) => {        
              return typeof value === 'string' ? value : value.treasuryCode
            }),
            map((treasury: any) => {

              return treasury ? this._filter(treasury, data) : data.slice()
            })
          );
          const treasury = this.TreasuryListarr.filter((item:any)=> item.TreasuryCode === this.TCode.Treasury_Code)[0];
          // console.log("CCCCCCCCCCCCCCCCCCCCC_Show_treasury", treasury);
          this.PDMasterRptForm.patchValue({
          TreasuryControl: treasury
          })

          if(this.TCode.Treasury_Code !="5000")
          {
             this.PDMasterRptForm.controls['TreasuryControl'].disable();
          }
    }
  })
   this.loader.setLoading(false);
}



  //get Major Head list api call
  getMajorHeadList() {
    this.ApiMethods.getservice(this.ApiService.MajorHeadList + 0).subscribe((resp:any) => {
      console.log("MajorHeadList__res", resp);
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.MajorHeadListarr = resp.result
      }
      console.log("MajorHeadList_inbetween", this.MajorHeadListarr);
      this.MajorHeadoptions = this.PDMasterRptForm.controls['MajorHeadControl']
        .valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            console.log("firstmap__", value);
            return typeof value === 'string' ? value : value.MajorHeadListarr
          }),
          map((majorheadcode: any) => {
           console.log("second__map", majorheadcode);

            return majorheadcode ? this._filterMajor(majorheadcode, data) : data.slice()
          })
        );
      })
    }

// Function : Call Bill Encashment Fetch API >>>------------------->
GetPDMasterDetail() {

    // Get TokenNum Page Control value
  
    let treasVal = this.PDMasterRptForm.controls['TreasuryControl'].value;
    let budgetVal = this.PDMasterRptForm.controls['MajorHeadControl'].value;

    // this.GetAutoProcessStatusShowModal.fromDate= fDate!;
    // this.GetAutoProcessStatusShowModal.toDate = tDate!;
    // this.GetAutoProcessStatusShowModal.treasuryCode =treasVal.TreasuryCode;


    this.loader.setLoading(true);
    //this.GetOnlineBillListModal.type = 1
     console.log("Before_Calling_API_Get_PD_Master_ShowModal_Result", this.GetPDMasterRptShowModal);
 
    
    //api call of Treasury Officer List
    this.ApiMethods.postresultservice(this.ApiService.getPDMasterList, this.GetPDMasterRptShowModal).subscribe((resp:any) => {
    console.log("After_Calling_API_GetAutoProcessStatusShowModal_Result", resp);

      if (resp.result.length > 0) {
        this.GetPDMasterListdata.data = resp.result;
        this.exportcompletedata=resp.result;
        // this.GetPDMasterListdata.sort = this.Sort;
        // this.GetPDMasterListdata.paginator = this.paginator;
        this.showTab_Table = true;
        this.loader.setLoading(false);
        this.PDMasterRptForm.disable();
      }
      else {
        //this.toastrService.info(CmnMsg, 'Info!');  // Comman Message - No Data Found
        this.snackbar.show( 'No Data Found !','alert')
        //window.location.reload();
        this.GetPDMasterListdata.data = [];
        this.showTab_Table = false;
        this.loader.setLoading(false);
      }
    },
      (res:any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          //this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert !');
          //let ApiErrMsg = this._helperMsg.APIErrorMsg();
          //this.toastrService.error(ApiErrMsg, 'Alert !');  /// API Error Message 
          this.snackbar.show( 'Something Went Wrong ! Please Try Again','danger')
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
    this.GetPDMasterRptShowModal.treasuryCode = SelectTreasury.TreasuryCode
    // console.log("Treasury,,,,,,,,,", this.GetAutoProcessStatusModal.treasuryCode)
  }


  //  Auditor display Function >>>------------------->
  displayFn(selectedoption: any) {
    console.log("display_fun_call aaa",selectedoption.TreasuryName);
    return selectedoption ? selectedoption.TreasuryName : undefined;
  }

 
 


  applyFilter(filterValue: string) {
    this.GetPDMasterListdata.filter = filterValue.trim().toLowerCase();
    if (this.GetPDMasterListdata.paginator) {
      this.GetPDMasterListdata.paginator.firstPage();
    }
  }


  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce('Sorted ${sortState.direction}ending');
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }



  OnMajorHeadSelected(SelectMajorHead: any) {
   
    
    console.log("befort______SelectMajorHead", SelectMajorHead);
    console.log("slelction__________option__majorhead", this.SelectMajorHead);
  
    this.GetPDMasterRptShowModal.budgetHead= this.SelectMajorHead.majorheadcode;

    //console.log("SaveBudgetModal==>>",this.SaveBudgetModal);
    
  }


  _filterMajor(value: string, data: any) {
    // console.log("filterval__", value);
    return data.filter((option: any) => {
      // console.log("option_val__", option);
      return option.majorheadcode.toLowerCase().includes(value.toLowerCase())
    });
  }

  displayMajor(selectedoption: any) {
    console.log("displayfuncall");
    // let displayResult: any = selectedoption.majorheadcode + "-" + selectedoption.majorheadname
    let displayResult: any = selectedoption.majorheadname
    return selectedoption ? displayResult : undefined;
  }


    // Function : Reset >>>------------------->
    Reset() {
      // window.location.reload();
      this.PDMasterRptForm.enable();
      this.PDMasterRptForm.controls['TreasuryControl'].disable();
       this.PDMasterRptForm.controls['Year'].disable();
      this.PDMasterRptForm.controls['MajorHeadControl'].setValue('');
       this.showTab_Table = false;
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
//   let tableData = this.GetPDMasterListdata.data.map((value1:any,index) => {
  
//   str =  str + `<td >${index+1}</td>`
//   this.displayedColumns.map((value:any)=> {
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
//   var doc = new jsPDF("l", "mm", "a2");
//   doc.text("PD Master Report", 250, 10);
//  autoTable(doc, { html:table });
//   doc.text("https://rajkosh.rajasthan.gov.in",10, 400);
//  doc.save("PDMasterReport.pdf");

// }
 

 //ORACLE PDF EXPORT
 DownloadPdf() {
  this.PDMASTERREPORT.params[0].value = this.TCode.Treasury_Code;
  this.PDMASTERREPORT.params[1].value = this.PDMasterRptForm.value.MajorHeadControl.majorheadcode;
     console.log("beforeapi called PDMASTERREPORT", this.PDMASTERREPORT)
   this.loader.setLoading(true)
  //api call of Treasury Officer List
  this.ApiMethods.postresultservice(this.ApiService.OracleReport, this.PDMASTERREPORT).subscribe((resp:any) => {
    console.log("PDb", resp)
    var response = resp.data
    if (Object.keys(response).length > 0) {
      let documentArray = resp.data.report;
      console.log("docc__", documentArray)
      this.PDMASTERRDATA = "data:application/pdf;base64," + documentArray.content;
      console.log("PDMASTERR", this.PDMASTERRDATA)
      this.PDMASTERRDATA = 'data:application/pdf;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(documentArray.content) as any).changingThisBreaksApplicationSecurity;
     // this.showReport = true
     let w = window.open('about:blank', 'mywindow', "width=1200, height=800");
      w?.document.write(' <iframe id="ireport" style="width:100%; min-height:875px;" scrolling="no" frameborder="0" allowfullscreen></iframe>')
      w?.document.getElementById('ireport')?.setAttribute("src", this.PDMASTERRDATA);
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
//   let user = document.getElementById('test1')
//   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(user);
//   const wb: XLSX.WorkBook = XLSX.utils.book_new()
//   XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
//   XLSX.writeFile(wb, this.filename)
// }

  /// complete excel data
  exportexcel(json: any[], excelFileName: string): void {
    var Heading: any = [
      ['Sr No.','DDOCode','TreasSancDate','PdAccNo','PDAccName','FinDeptSancDt','BudgetHead','ContOfficerName1','BearingFlag','ContOfficerName2']
    ];
    let arr: any[] = []
    json.forEach((item: any, index: any) => {
      let a = {
        " Sr No.": index + 1,
        "DDOCode": item.DDOCode,
        " TreasSancDate": item.TreasSancDate,
        "PdAccNo": item.PdAccNo,
        "PDAccName": item.PDAccName,
        "FinDeptSancDt": item.FinDeptSancDt,
        "BudgetHead": item.BudgetHead,
        "ContOfficerName1": item.ContOfficerName1,
        "BearingFlag": item.BearingFlag,
        "ContOfficerName2": item.ContOfficerName2,
             }
      arr.push(a)
     // console.log("a__", a)
    })
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(arr);
   // var elt = document.getElementById('test1');
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
  
}
 



