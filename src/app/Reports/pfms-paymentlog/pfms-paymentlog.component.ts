import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from 'src/app/services/loaderservice';
import { Helper } from 'src/app/utils/Helper';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import { Observable, map, startWith } from 'rxjs';
import * as Val from '../../utils/Validators/ValBarrel'
import { PFMSLOG } from '../Interface';
import { ViewDocumentComponent } from 'src/app/bill-process/view-document/view-document.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
import { CommonDialogComponent } from 'src/app/bill-process/common-dialog/common-dialog.component';
import { Router } from '@angular/router';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

@Component({
  selector: 'app-pfms-paymentlog',
  templateUrl: './pfms-paymentlog.component.html',
  styleUrls: ['./pfms-paymentlog.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PfmsPaymentlogComponent implements OnInit {
  @ViewChild('LIST', { static: false }) el!: ElementRef
  filename = "Pfmspaymnetlogreport.xlsx";
  exportcompletedata: any[] = []
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.GetPfmspaymnetlogdata.sort = sort;
  }
  @ViewChild(MatPaginator) set MatPaginator(paginator: MatPaginator) {
    this.GetPfmspaymnetlogdata.paginator = paginator;
  }
  changeText!: boolean;
  Pfmspaymentlogreportform: any;
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []
  finYr: any;
  base64data: any;
  expandedElement: any;
  GetPfmspaymnetlogdata: MatTableDataSource<any> = new MatTableDataSource();
  showPfmspaymnetdebitreportTable: boolean = false;
  showPfmspaymnetCreditreportTable: boolean = false;
  headers!: string[];
  display: boolean = true;
  mat_radio_1: boolean = true;
  mat_radio_2: boolean = false;

  displayedColumns = [
    'SrNo',
    'bill_number',
    'bill_date',
    'bill_type',
    'bill_net_amount',
    'bill_gross_amount',
    'component_code',
    'component_amount',
  ];

  displayeColumns = [
    'SrNo',
    'bill_number',
    'bill_date',
    'bill_type',
    'benefeciary_name',
    'benefeciary_id',
    'ifsc_code',
    'net_amount',
    'component_code',
    'component_amount',
  ];

  constructor(private router:Router,private Tcode: Helper, private ApiMethods: ApiMethods, public loader: LoaderService, private ApiService: ApiService, private finyear_: Helper, private TCode: Helper, public dialog: MatDialog, private snackbar: SnackbarService) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);

    };

  }
  ngOnInit(): void {

    this.getTreasuryList();
    this.finYr = this.finyear_.forwardYear.toString();
    this.Pfmspaymentlogreportform = new FormGroup({
      finyear: new FormControl({ value: this.finYr, disabled: true }),
      treasuryval: new FormControl({ value: '', disabled: true }, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
      toDate: new FormControl({ value:'', disabled: false }, [ Val.maxLength(12)]),
      fromDate: new FormControl({ value:'', disabled: false }, [ Val.maxLength(12)]),
       // Referenceno: new FormControl('', [Val.maxLength(6), Val.SpecialChar, Val.Numeric, Val.cannotContainSpace]),
      billNo: new FormControl('', [Validators.required ,Val.maxLength(6), Val.SpecialChar,Val.Decimal, Val.Numeric, Val.cannotContainSpace]),
      billType: new FormControl('', [Validators.required,Val.maxLength(6), Val.SpecialChar,Val.Decimal, Val.Numeric, Val.cannotContainSpace]),
    })
  }



  getTreasuryList() {
    this.loader.setLoading(true);
    this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe((resp: any) => {
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.TreasuryListarr = resp.result
        //console.log("Show_Treasury_AuditorList", this.TreasuryListarr);
        this.Treasuryoptions = this.Pfmspaymentlogreportform.controls['treasuryval'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            return typeof value === 'string' ? value : value.treasuryCode
          }),
          map((treasury: any) => {
            return treasury ? this._filtertreasury(treasury, data) : data.slice()
          })
        );
        const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.TCode.Treasury_Code)[0];
        this.Pfmspaymentlogreportform.patchValue({
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

  radioButtonGroupChange(event: any) {
    console.log("evnenrt______", event.value);
    this.display = !this.display
    if (event.value == 1) {
      console.log("event__", event.value)
      this.mat_radio_1 = true
      this.mat_radio_2 = false
      this.Pfmspaymentlogreportform.enable();
      this.Pfmspaymentlogreportform.controls['treasuryval'].disable();
      this.Pfmspaymentlogreportform.controls['finyear'].disable();
      this.Pfmspaymentlogreportform.controls['fromDate'].setValue('');
      this.Pfmspaymentlogreportform.controls['toDate'].setValue('');
      this.Pfmspaymentlogreportform.controls['billNo'].setValue('');
      this.Pfmspaymentlogreportform.controls['billType'].setValue('');
    //  this.Pfmspaymentlogreportform.controls['Referenceno'].setValue('');
    this.Pfmspaymentlogreportform.controls['billNo'].setValidators([
      Validators.required,
    ]);
    this.Pfmspaymentlogreportform.controls['billType'].setValidators([
      Validators.required,
    ]);
    this.Pfmspaymentlogreportform.get('billNo').updateValueAndValidity();
    this.Pfmspaymentlogreportform.get('billType').updateValueAndValidity();
      this.showPfmspaymnetdebitreportTable = false
      this.showPfmspaymnetCreditreportTable = false
      this.display = true;
    }
    else {
      this.mat_radio_2 = true
      this.mat_radio_1 = false;
      this.Pfmspaymentlogreportform.enable();
      this.Pfmspaymentlogreportform.controls['treasuryval'].disable();
      this.Pfmspaymentlogreportform.controls['finyear'].disable();
      this.Pfmspaymentlogreportform.controls['fromDate'].setValue('');
      this.Pfmspaymentlogreportform.controls['toDate'].setValue('');
      this.Pfmspaymentlogreportform.controls['billNo'].setValue('');
      this.Pfmspaymentlogreportform.controls['billType'].setValue('');
     // this.Pfmspaymentlogreportform.controls['Referenceno'].setValue('');
     this.Pfmspaymentlogreportform.controls['billNo'].setValidators([
      Validators.required,
     ]);
     this.Pfmspaymentlogreportform.controls['billType'].setValidators([
      Validators.required,
     ]);
     this.Pfmspaymentlogreportform.get('billNo').updateValueAndValidity();
     this.Pfmspaymentlogreportform.get('billType').updateValueAndValidity();
      this.showPfmspaymnetCreditreportTable = false
      this.display = true;
      this.showPfmspaymnetdebitreportTable = false

    }
  }


  onChangeValidation(){
    this.Pfmspaymentlogreportform.get('fromDate').setValidators([
      Validators.required,
    ]);
    this.Pfmspaymentlogreportform.get('fromDate').updateValueAndValidity();

    this.Pfmspaymentlogreportform.get('toDate').setValidators([
      Validators.required,
    ]);
    this.Pfmspaymentlogreportform.controls['billNo'].setValidators([
    
    ]);
    this.Pfmspaymentlogreportform.controls['billType'].setValidators([
    
    ]);
    this.Pfmspaymentlogreportform.get('billNo').updateValueAndValidity();
    this.Pfmspaymentlogreportform.get('toDate').updateValueAndValidity();
    this.Pfmspaymentlogreportform.controls['billNo'].setValue('')
    this.Pfmspaymentlogreportform.get('billType').updateValueAndValidity();
    this.Pfmspaymentlogreportform.controls['billType'].setValue('')
  }

  onchange(){
    console.log("control value",this.Pfmspaymentlogreportform)
    this.Pfmspaymentlogreportform.get('fromDate').removeValidators([
      Validators.required,
    ]);

    this.Pfmspaymentlogreportform.get('toDate').removeValidators([
      Validators.required,
    ]);
    this.Pfmspaymentlogreportform.controls['billNo'].setValidators([
      Validators.required,
     ]);
     this.Pfmspaymentlogreportform.get('billNo').updateValueAndValidity();
    this.Pfmspaymentlogreportform.controls['billType'].removeValidators([
      Validators.required,
    ]);
    this.Pfmspaymentlogreportform.get('billType').updateValueAndValidity();
    // this.Pfmspaymentlogreportform.controls['billNo'].setValidators([
    //   Validators.required,
    // ]);
   
   
  }

  onbilltypechange(){
    this.Pfmspaymentlogreportform.controls['billType'].setValidators([
      Validators.required,
     ]);
     this.Pfmspaymentlogreportform.get('billType').updateValueAndValidity();
    this.Pfmspaymentlogreportform.controls['billNo'].removeValidators([
      Validators.required,
    ]);
    this.Pfmspaymentlogreportform.get('billNo').updateValueAndValidity();
  }
  onReset() {
    //window.location.reload()
    this.Pfmspaymentlogreportform.enable();
    this.Pfmspaymentlogreportform.controls['treasuryval'].disable();
    this.Pfmspaymentlogreportform.controls['finyear'].disable();
    this.Pfmspaymentlogreportform.controls['fromDate'].setValue('');
    this.Pfmspaymentlogreportform.controls['toDate'].setValue('');
    // this.Pfmspaymentlogreportform.controls['Referenceno'].setValue('');
    this.Pfmspaymentlogreportform.controls['billNo'].setValue('');
    this.Pfmspaymentlogreportform.controls['billType'].setValue('');
    this.onchange()
   //this.router.navigate(['PfmsPaymentlogComponent'])
   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate(['/PfmsPaymentlogComponent']);
  });
    this.showPfmspaymnetdebitreportTable = false;
    this.showPfmspaymnetCreditreportTable = false;
  }

  applyFilter(filterValue: string) {
    this.GetPfmspaymnetlogdata.filter = filterValue.trim().toLowerCase();
  }

  getPfmspaymnetlogreport() {
    let Date1 = this.Pfmspaymentlogreportform.controls['fromDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');
    let Date2 = this.Pfmspaymentlogreportform.controls['toDate'].value;
    let tDate = new DatePipe('en-US').transform(Date2, 'yyyy-MM-dd');

    let getPfmspaymnetlogreportmodel = {

      "fromDate": fDate!,
      "toDate": tDate!,
      "treasuryCode": this.Tcode.Treasury_Code,
      "billNo": this.Pfmspaymentlogreportform.controls['billNo'].value,
     // "Referenceno": this.Pfmspaymentlogreportform.controls['Referenceno'].value
      "billType": this.Pfmspaymentlogreportform.controls['billType'].value
    }
    this.loader.setLoading(true);

    //api call of pfmslogreport

    if (this.mat_radio_1) {
      this.ApiMethods.postresultservice(this.ApiService.PFMSdebit, getPfmspaymnetlogreportmodel).subscribe((resp: any) => {
        console.log("After_Calling_API_getPfmspaymnetlogreportmodel_Result", resp);
        if (resp.result.length > 0) {
          let arr = resp.result;
          let exceldata: any = resp.result;
          // let final: any = []
          // arr.forEach((element: any) => {
          //   let data_ = JSON.stringify(element.payloadData,)
          //   let str = JSON.stringify(element.payloadData,).substring(0, 50);
          //   console.log("str__", str)
          //   let obj: any = {
          //     ...element,
          //     "payloadData": data_,
          //     "payload": str,
          //     // ...element.payloadData.data
          //   }
          //   let excelobj: any = {
          //     ...element,
          //     "payloadData": data_,
          //   }
          //   final.push(obj)
          //   exceldata.push(excelobj)
          // });
          // console.log("finaldata_", final);
          this.GetPfmspaymnetlogdata.data = arr
          this.exportcompletedata = exceldata;
          this.showPfmspaymnetdebitreportTable = true;
          this.loader.setLoading(false);
          this.Pfmspaymentlogreportform.disable();
        }
        else {
          this.snackbar.show('No Data Found !', 'alert')
          this.loader.setLoading(false);
          this.showPfmspaymnetdebitreportTable = false;
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
      this.ApiMethods.postresultservice(this.ApiService.PFMScredit, getPfmspaymnetlogreportmodel).subscribe((resp: any) => {
        console.log("After_Calling_API_getPfmspaymnetlogreportmodel_Result", resp);
        if (resp.result.length > 0) {
          let arr = resp.result;
          let exceldata: any =resp.result
          this.GetPfmspaymnetlogdata.data = arr
          this.exportcompletedata = exceldata;
          this.showPfmspaymnetCreditreportTable = true;
          this.loader.setLoading(false);
          this.Pfmspaymentlogreportform.disable();
        }
        else {
          this.snackbar.show('No Data Found !', 'alert')
          this.loader.setLoading(false);
          this.showPfmspaymnetCreditreportTable = false;
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


  //  // // export to excel
  //  exportexcel(): void {
  //   let user = document.getElementById('LIST')
  //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(user);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new()
  //   XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
  //   XLSX.writeFile(wb, this.filename);
  // }

  /// complete excel data
  exporttoexcel(json: any[], excelFileName: string): void {
    var Heading: any = [
      [ "Bill Number", "Bill Date", 'Bill Type',  'Net Amount','Gross Amount', ' Component Code', 'Component Amount']
    ];
    console.log(json);
    let arr: any[] = []
    json.forEach((item: any, index: any) => {
      let a = {
       // " Sr No.": index + 1,
        "Bill Number": item.bill_number,
        "Bill Date": item.bill_date,
        "Bill Type": item.bill_type,
        "Net Amount": item.bill_net_amount,
        "Gross Amount": item.bill_gross_amount,
         "Component Code": item.component_code,
        "Component Amount": item.component_amount,

      }
      arr.push(a)
    })
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(arr);
    // var elt = document.getElementById('LIST');
    // const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.exportcompletedata);
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


  exportexcel(json: any[], excelFileName: string): void {
    var Heading: any = [
      [ 'Bill Number', 'Bill Date', 'Bill Type', 'Benefeciary Name', 'Benefeciary Id', 'Ifsc Code', 'Net Amount', "Component Code"," Component Amount"]
    ]

    let arr: any[] = []
    json.forEach((item: any, index: any) => {
      let a = {
       // " Sr No.": index + 1,
        "Bill Number": item.bill_number,
        "Bill Date": item.bill_date,
        // "File Status":item.fileStatus,
        "Bill Type": item.bill_type,
        "Benefeciary Name": item.benefeciary_name,
        "Benefeciary Id": item.benefeciary_id,
        "Ifsc Code": item.ifsc_code,
        "Net Amount": item.net_amount,
        "Component Code": item.component_code,
        "Component Amount": item.component_amount
      }
      arr.push(a)
      console.log("a__", a)
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

  // //export to pdf 
  exportToPdf() {
    this.loader.setLoading(true);
    setTimeout(() => {
      let str: string = '';
      var Heading: any =
      [' Sr No.', 'Bill Number', 'Bill Date', 'Bill Type', 'Benefeciary Name', 'Benefeciary Id', 'Ifsc Code', 'Net Amount', "Component Code"," Component Amount"]

      let table = document.createElement('table');
      table.setAttribute('id', 'testpdTable');
      let heasRow = ''
      Heading.forEach((value: any) => {
        heasRow = heasRow + `<th scope="col" >${value}</th>`
      })
      heasRow = `<tr>${heasRow} <tr> `
      let tableData = this.GetPfmspaymnetlogdata.data.map((value1: any, index) => {

        str = str + `<td >${index + 1}</td>`
        this.displayeColumns.map((value: any) => {
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
      // footer.setAttribute('class','thead-dark')
      table.innerHTML = `<thead><tr>${heasRow} <tr></thead> ` + `<tbody>${tableData}</tbody>`
      var doc = new jsPDF("l", "mm", "a2");
      // doc.text("pfmsApilog", 170, 10);
      autoTable(doc, { html: table });
      // doc.text("https://rajkosh.rajasthan.gov.in", 10, 200);
      doc.save("Pfmspaymnetlogreport.pdf");
      this.loader.setLoading(false);
    }, 500);

  }


   // //export to pdf 
   exportPdf() {
    this.loader.setLoading(true);
    setTimeout(() => {
      let str: string = '';
      var Heading: any =
      ["Sr No.", "Bill Number", "Bill Date", 'Bill Type', 'Gross Amount', 'Net Amount', ' Component Code', 'Component Amount']

      let table = document.createElement('table');
      table.setAttribute('id', 'testpdTable');
      let heasRow = ''
      Heading.forEach((value: any) => {
        heasRow = heasRow + `<th scope="col" >${value}</th>`
      })
      heasRow = `<tr>${heasRow} <tr> `
      let tableData = this.GetPfmspaymnetlogdata.data.map((value1: any, index) => {

        str = str + `<td >${index + 1}</td>`
        this.displayedColumns.map((value: any) => {
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
      // footer.setAttribute('class','thead-dark')
      table.innerHTML = `<thead><tr>${heasRow} <tr></thead> ` + `<tbody>${tableData}</tbody>`
      var doc = new jsPDF("l", "mm", "a2");
      // doc.text("pfmsApilog", 170, 10);
      autoTable(doc, { html: table });
      // doc.text("https://rajkosh.rajasthan.gov.in", 10, 200);
      doc.save("Pfmspaymnetlogreport.pdf");
      this.loader.setLoading(false);
    }, 500);

  }
  // viewDocumentPopup(element: any) {
  //   //this.loader.setLoading(true);
  //   this.showmodal(element.cdeRefno);

  // }
  // showmodal(cdeRefno: any) {
  //   const dialogRef = this.dialog.open(ViewDocumentComponent,
  //     {
  //       // width: '50%',
  //       // height: '63%',
  //       width: '1000px',
  //       height: '800px',
  //       disableClose: true
  //       // , data: {
  //       //   // result: ''
  //       // }
  //     }

  //   );
  //   dialogRef.componentInstance.getBase64ImgDocumentId(cdeRefno);
  // }

  // viewBillDetailPopup(element: any) {
  //   this.showmodal(element.cdeRefno);

  // }
  // showmodal(cdeRefno: any) {
  //   const dialogRef = this.dialog.open(CommonDialogComponent,
  //     {

  //       width: '1000px',
  //       height: '800px',
  //       disableClose: true,
  //       data: {
  //         message: "",
  //         id: 'PFMSBilllist',
  //       }


  //     }

  //   );
  //   dialogRef.componentInstance.getPFMSBillDetailReport(cdeRefno);
  // }

}


