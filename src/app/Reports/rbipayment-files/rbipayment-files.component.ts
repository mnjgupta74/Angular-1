
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
import { PFMSDNFile } from '../Interface';
import { ViewDocumentComponent } from 'src/app/bill-process/view-document/view-document.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


@Component({
  selector: 'app-rbipayment-files',
  templateUrl: './rbipayment-files.component.html',
  styleUrls: ['./rbipayment-files.component.scss']
})
export class RBIPaymentFilesComponent implements OnInit {
  @ViewChild('test2', { static: false }) el!: ElementRef;
  @ViewChild('test1', { static: false }) el2!: ElementRef;
  filename = "RBIPaymentFiles.xlsx";
  exportcompletedata: any[] = []
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.GetRBIPaymentFilesdata.sort = sort;


  }
  @ViewChild(MatPaginator) set MatPaginator(paginator: MatPaginator) {
    this.GetRBIPaymentFilesdata.paginator = paginator;
  }
  // @ViewChild(MatSort) set matSort2(sort: MatSort) {
  //   this.GetRBIPaymentmatchedFilesdata.sort = sort;
  // }
  //  @ViewChild(MatPaginator) set MatPaginator2(paginator: MatPaginator) {
  //   this.GetRBIPaymentmatchedFilesdata.paginator = paginator;

  // }

  RBIPaymetFilesForm: any;
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []
  finYr: any;
  base64data: any;
  display: boolean = true;
  //indisplay: boolean = false;
  mat_radio_1: boolean = true;
  mat_radio_2: boolean = false;
  GetRBIPaymentFilesdata: MatTableDataSource<any> = new MatTableDataSource();
  showRBIPaymentFilesTable: boolean = false;
  showRBIPaymentmatchedFilesTable: boolean = false;
  GetRBIPaymentmatchedFilesdata: MatTableDataSource<any> = new MatTableDataSource();


  // display: boolean = false;
  displayedColumns =  ['SrNo', 'token_no', 'cde_refno', 'file_name', 'file_date', 
  'vchr_no', 'vchr_date',
  'net_amnt', 'gross_amnt', 
  ]
  displayColumns = ['SrNo', 'token_no', 'cde_refno', 'file_name', 'file_date', 
  'vchr_no', 'vchr_date',
   'net_amnt','gross_amnt'
  ]

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
    this.finYr = this.finyear_.forwardYear.toString();
    this.RBIPaymetFilesForm = new FormGroup({
      finyear: new FormControl({ value: this.finYr, disabled: true }),
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
        this.Treasuryoptions = this.RBIPaymetFilesForm.controls['treasuryval'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            return typeof value === 'string' ? value : value.treasuryCode
          }),
          map((treasury: any) => {

            return treasury ? this._filtertreasury(treasury, data) : data.slice()
          })
        );
        const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.TCode.Treasury_Code)[0];
        this.RBIPaymetFilesForm.patchValue({
          treasuryval: treasury
        })
      }
    })
    this.loader.setLoading(false);
  }
  _filtertreasury(value: string, data: any) {
    return data.filter((option: any) => {
      if(option){
        return option.TreasuryName.toLowerCase().includes(value.toLowerCase())
            
      }
          
            
    });
  }
  displaytreasury(selectedoption: any) {
    console.log("display_fun_call aaa", selectedoption.TreasuryName);
    return selectedoption ? selectedoption.TreasuryName : undefined;
  }

  radioButtonGroupChange(event: any) {
    console.log("evnenrt______", event.value);
    this.display = !this.display
    if (event.value == 1) {
      console.log("event__", event.value)
      this.mat_radio_1 = true
      this.RBIPaymetFilesForm.enable();
      this.RBIPaymetFilesForm.controls['treasuryval'].disable();
    this.RBIPaymetFilesForm.controls['finyear'].disable();
      this.RBIPaymetFilesForm.controls['fromDate'].setValue(new Date());
      this.RBIPaymetFilesForm.controls['toDate'].setValue(new Date());
      this.mat_radio_2 = false
      this.showRBIPaymentFilesTable = false
      this.showRBIPaymentmatchedFilesTable = false
      this.display = true;
      // this.RBIPaymetFilesForm.reset();

    }

    else {
      this.mat_radio_2 = true
      this.mat_radio_1 = false
      this.RBIPaymetFilesForm.enable();
      this.RBIPaymetFilesForm.controls['treasuryval'].disable();
    this.RBIPaymetFilesForm.controls['finyear'].disable();
      this.RBIPaymetFilesForm.controls['fromDate'].setValue(new Date());
      this.RBIPaymetFilesForm.controls['toDate'].setValue(new Date());
      this.showRBIPaymentmatchedFilesTable = false
      this.display = true;
      this.showRBIPaymentFilesTable = false
      //  this.RBIPaymetFilesForm.reset();
    }
  }

  onSearch() {
    this.GetRBIPaymentFilesdata.filter = "";
    // this.GetRBIPaymentmatchedFilesdata.filter = "";
    let Date1 = this.RBIPaymetFilesForm.controls['fromDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');
    let Date2 = this.RBIPaymetFilesForm.controls['toDate'].value;
    let tDate = new DatePipe('en-US').transform(Date2, 'yyyy-MM-dd');
    if (Date1 === "" || Date2 === "" || Date1 === null || Date2 === null) {
      console.log("f", fDate)
      this.snackbar.show('Please Enter Date', 'alert')
      return;
    }
    else {
      console.log("fff", fDate)
        }
    this.loader.setLoading(true);
       //api call of RBI Payment Files
    if (this.mat_radio_1) {

    let  getRBIPaymentFilesmodel=   {
        "fromDate":fDate!,
        "toDate":tDate!,
        "type":0
    }
    console.log("Before_Calling_API_iipfmsbilltopaymangermodel_Result",getRBIPaymentFilesmodel);
      this.ApiMethods.postresultservice(this.ApiService.getRBIPaymentFilesDetails,getRBIPaymentFilesmodel).subscribe((resp: any) => {
        console.log("After_Calling_API_ipfmsbilltopaymangermodel_Result", resp);
        if (resp.result.length > 0) {
          let arr = resp.result;
          this.GetRBIPaymentFilesdata.data = arr
          this.exportcompletedata = arr;
          console.log("paymenydata__", this.GetRBIPaymentFilesdata.data);
          // console.log("paydata__", arr);
          this.showRBIPaymentFilesTable = true;
          this.loader.setLoading(false);
           this.RBIPaymetFilesForm.disable();
        }
        else {
          this.snackbar.show('No Data Found !', 'alert')
          this.loader.setLoading(false);
          this.showRBIPaymentFilesTable = false;
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
    else {
      let  getRBIPaymentFilesmodel=   {
        "fromDate":fDate!,
        "toDate":tDate!,
        "type":1
    }
    console.log("Before_Calling_API_iipfmsbilltopaymangermodel_Result",getRBIPaymentFilesmodel);
      this.ApiMethods.postresultservice(this.ApiService.getRBIPaymentFilesDetails,getRBIPaymentFilesmodel).subscribe((resp: any) => {
        console.log("After_Calling_API_getRBIPaymenmatchfileDetails_Result", resp);
        if (resp.result.length > 0) {
          let arr2 = resp.result;
          this.GetRBIPaymentFilesdata.data = arr2
          this.exportcompletedata = arr2;
          console.log("PaymentmatchedFilesdata___", this.GetRBIPaymentFilesdata.data);
          this.showRBIPaymentmatchedFilesTable = true;
          this.loader.setLoading(false);
          this.RBIPaymetFilesForm.disable();
        }
        else {
          this.snackbar.show('No Data Found !', 'alert')
          this.loader.setLoading(false);
          this.showRBIPaymentmatchedFilesTable = false;
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
  }
  onReset() {
   // window.location.reload();
   this.RBIPaymetFilesForm.enable();
   this.RBIPaymetFilesForm.controls['treasuryval'].disable();
    this.RBIPaymetFilesForm.controls['finyear'].disable();
   this.RBIPaymetFilesForm.controls['fromDate'].setValue( new Date());
   this.RBIPaymetFilesForm.controls['toDate'].setValue( new Date());
  // this.RBIPaymetFilesForm.controls['Referenceno'].setValue('');
    this.showRBIPaymentmatchedFilesTable = false;
    this.showRBIPaymentFilesTable = false;
  }
  applyFilter(filterValue: string) {
     this.GetRBIPaymentFilesdata.filter = filterValue.trim().toLowerCase();
    //  this.GetRBIPaymentmatchedFilesdata.filter = filterValue.trim().toLowerCase();
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
        disableClose: true

      }

    );
    dialogRef.componentInstance.getBase64ImgDocumentId(cde_refno);
  }


  /// complete excel data
  exportexcel(json: any[], excelFileName: string): void {
    var Heading: any =[
    [' Sr No.','File Name','File Date']
    ]

    let arr:any[]=[]
    json.forEach((item:any,index:any)=>{
      let a={
        " Sr No.":index+1,
      // "CDE_REFNO":item.cde_refno,
       // "File Status":item.fileStatus,
        "File Name":item.file_name,
         "File Date":item.file_date,
       // "Payload":item.requestBody,
          }
  arr.push(a)
  console.log("a__",a)
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

  // exportToPdf() {
  //     var doc: any = new jsPDF('l', 'mm', 'a4');
  //   doc.setFontSize(11);
  //   doc.setTextColor(100);
  //   if(this.mat_radio_1){
  //     autoTable(doc, { html: '#test1', showFoot: 'lastPage' });
  //   }else{
  //     autoTable(doc, {
  //       html: '#test2',
  //       showFoot: 'lastPage',
  //     //  startY: finalY + 15,
  //       columnStyles: {
  //         0: {cellWidth: 11},
  //         1: {cellWidth: 25},
  //         2: {cellWidth: 25},
  //         3: {cellWidth: 20},
  //         4: {cellWidth: 40},
  //         5: {cellWidth: 25},
  //         6: {cellWidth: 40},
  //         7: {cellWidth: 40},
  //         8: {cellWidth: 20},
  //         9: {cellWidth: 25},

  //       }
  //     });
  //   }    
  //   doc.text('https://rajkosh.rajasthan.gov.in', 10, 200);
  //   doc.save('RBIPaymetFiles.pdf');
  // }
  exportToPdf() {
    this.loader.setLoading(true);
    setTimeout(() => {
      let str: string = ''
      var Heading: any =
        [' Sr No.','File Name','File Date']
         let table = document.createElement('table');
      table.setAttribute('id', 'testpdTable');
      let heasRow = ''
      Heading.forEach((value: any) => {
        heasRow = heasRow + `<th scope="col" >${value}</th>`
      })
      heasRow = `<tr>${heasRow} <tr> `
      let tableData = this.GetRBIPaymentFilesdata.data.map((value1: any, index) => {

        str = str + `<td >${index + 1}</td>`
        this.displayedColumns.map((value: any) => {
          if(value !==  'SrNo')
          {
            // if( value == 'cde_refno'){
            //   str=  str + `<td >${value1['cde_refno']}</br></td>`
            // }

           if( value == 'file_name'){
                str=  str + `<td >${value1['file_name']}</td>`
             }
             else if( value == 'file_date'){
              str=  str + `<td >${value1['file_date']}</td>`
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
      table.innerHTML = `<thead><tr>${heasRow} <tr></thead> ` + `<tbody>${tableData}</tbody>`
      var doc = new jsPDF("p", "pt", "a4");
      autoTable(doc, {
        html: table,
        // columnStyles: {
        //          0: {cellWidth: 11},
        //            1: {cellWidth: 25},
        //            2: {cellWidth: 25},
        //            3: {cellWidth: 20},
        //            4: {cellWidth: 40},
        //            5: {cellWidth: 25},
        //            6: {cellWidth: 40},
        //            7: {cellWidth: 40},
        //            8: {cellWidth: 20},
        //           9: {cellWidth: 25},

        //          }
      });
      doc.save("RBIPaymetFiles.pdf");
      this.loader.setLoading(false);
    }, 500);
  }

  exporttopdf() {
    this.loader.setLoading(true);
    setTimeout(() => {
      let str: string = '';
      var Heading: any =
      [' Sr No.','Token No','CDE_REFNO','File Name','File Date','Voucher No.','Voucher Date','GROSS AMOUNT',"Net Amount"]
      let table = document.createElement('table');
      table.setAttribute('id', 'testpdTable');
      let heasRow = ''
      Heading.forEach((value: any) => {
        heasRow = heasRow + `<th scope="col" >${value}</th>`
      })
      heasRow = `<tr>${heasRow} <tr> `
      let tableData = this.GetRBIPaymentFilesdata.data.map((value1: any, index) => {

        str = str + `<td >${index + 1}</td>`
        this.displayColumns.map((value: any) => {
          if (value !== 'SrNo') {
            str = str + `<td >${value1[value]}</td>`
          }
        })
        let str1 = `<tr>${str} <tr> `
        str = ''
        return (
          str1
        );

      }).join('');
      const footer: any = document.querySelector("#footer");
      table.innerHTML = `<thead><tr>${heasRow} <tr></thead> ` + `<tbody>${tableData}</tbody>`
      var doc = new jsPDF("l", "mm", "a2");
      autoTable(doc, {
        html: table,
        // columnStyles: {
        //   0: { cellWidth: 11 },
        //   1: { cellWidth: 40 },
        //   2: { cellWidth: 50 },
        //   3: { cellWidth: 50 },
        //   4: { cellWidth: 75 },
        //   5: { cellWidth: 40 },
        //   6: { cellWidth: 75 },
        //   7: { cellWidth: 75 },
        //   8: { cellWidth: 35 },
        //   9: { cellWidth: 35 },

        // }
      }
      );
      doc.save("RBIPaymetFiles.pdf");
      this.loader.setLoading(false);
    }, 500);
  }

  exporttoexcel(json: any[], excelFileName: string): void {
    var Heading: any =[
    [' Sr No.','Token No','CDE_REFNO','File Name','File Date','Voucher No.','Voucher Date','GROSS AMOUNT',"Net Amount"]
    ]

    let arr:any[]=[]
    json.forEach((item:any,index:any)=>{
      let a={
        " Sr No.":index+1,
        "Token No":item.token_no,
       "CDE_REFNO":item.cde_refno,
       // "File Status":item.fileStatus,
        "File Name":item.file_name,
         "File Date":item.file_date,
        "Voucher No.":item.vchr_no,
        "Voucher Date":item.vchr_date,
        "GROSS AMOUNT":item.gross_amnt,
        "Net Amount":item.net_amnt
          }
  arr.push(a)
  console.log("a__",a)
    })
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(arr);
    XLSX.utils.sheet_add_aoa(worksheet, Heading)
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveExcelFile(excelBuffer, excelFileName);
  }
  saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    // fileSaver.saveAs(exportcompletedata, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
    fileSaver.saveAs(data, fileName);
  }
}

