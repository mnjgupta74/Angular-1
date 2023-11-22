import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
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
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
import { CommonDialogComponent } from 'src/app/bill-process/common-dialog/common-dialog.component';
import { Route, Router } from '@angular/router';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

@Component({
  selector: 'app-payment-reconcilationlog',
  templateUrl: './payment-reconcilationlog.component.html',
  styleUrls: ['./payment-reconcilationlog.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PaymentReconcilationlogComponent implements OnInit {
  billNumberArr: any[] = [];
  // inner table
  @ViewChildren('innerTables') innerTables!: QueryList<MatTable<any>>;

  @ViewChild('LIST', { static: false }) el!: ElementRef
  filename = "PaymentReconciliationlogreport.xlsx";
  exportcompletedata: any[] = []
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.GetReconciliationdata.sort = sort;
  }
  @ViewChild(MatPaginator) set MatPaginator(paginator: MatPaginator) {
    this.GetReconciliationdata.paginator = paginator;
  }
  changeText!: boolean;
  paymentReconciliationreportform: any;
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []
  GetPdfdata:any[]=[]
  finYr: any;
  base64data: any;
  expandedElement: any;
  GetReconciliationdata: MatTableDataSource<any> = new MatTableDataSource();
  GetReconciliationdatapayload: MatTableDataSource<any> = new MatTableDataSource();
  getpayloaddata:any[]=[]
  showReconciliationTable: boolean = false;
  headers!: string[];



  displayedColumns = [
    'SrNo',
   // 'Id',
  //  'bill_number',
   'ref_no',
    'file_name',
    'status',
    'rjected_reason',
    'Payload',
    'request_id',
    'file_req_date',
    'file_rcvd_date',
    // 'ref_no',
    
    
    // 'sign_date',
    // 'sanction_date',
    // 'sanction_no',
    
    //'gross_amount',
   // 'net_amount',
    //'Action'

  ];

  innerTableDisplayedColumns = [
    'Bill No.',
    "Token No.",
    "Net Amount.",
    "Gross Amount.",
    
    //'payloaddata',
  ]
  constructor(private router:Router,private cd: ChangeDetectorRef, private ApiMethods: ApiMethods, public loader: LoaderService, private ApiService: ApiService, private finyear_: Helper, private TCode: Helper, public dialog: MatDialog, private snackbar: SnackbarService) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
      //this.changeText = false;
    };
  }
  ngOnInit(): void {
    this.getTreasuryList();
    this.finYr = this.finyear_.forwardYear.toString();
    this.paymentReconciliationreportform = new FormGroup({
      finyear: new FormControl({ value: this.finYr, disabled: true }),
      treasuryval: new FormControl({ value: '', disabled: true }, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
      toDate: new FormControl({ value:'', disabled: false }, ),
      fromDate: new FormControl({ value:'', disabled: false }, ),
      Referenceno: new FormControl('', [Validators.required,Val.maxLength(6), Val.SpecialChar, Val.Numeric, Val.cannotContainSpace]),
    })
  }

  getTreasuryList() {
    this.loader.setLoading(true);
    this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe((resp: any) => {
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.TreasuryListarr = resp.result
        //console.log("Show_Treasury_AuditorList", this.TreasuryListarr);
        this.Treasuryoptions = this.paymentReconciliationreportform.controls['treasuryval'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            return typeof value === 'string' ? value : value.treasuryCode
          }),
          map((treasury: any) => {
            return treasury ? this._filtertreasury(treasury, data) : data.slice()
          })
        );
        const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.TCode.Treasury_Code)[0];
        this.paymentReconciliationreportform.patchValue({
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

  onChangeValidation(){
    this.paymentReconciliationreportform.get('fromDate').setValidators([
      Validators.required,
    ]);
    this.paymentReconciliationreportform.get('fromDate').updateValueAndValidity();

    this.paymentReconciliationreportform.get('toDate').setValidators([
      Validators.required,
    ]);
    this.paymentReconciliationreportform.controls['Referenceno'].setValidators([
    
    ]);
    this.paymentReconciliationreportform.get('Referenceno').updateValueAndValidity();
    this.paymentReconciliationreportform.get('toDate').updateValueAndValidity();
    this.paymentReconciliationreportform.controls['Referenceno'].setValue('')
  }

  onchange(){
    this.paymentReconciliationreportform.get('fromDate').removeValidators([
      Validators.required,
    ]);

    this.paymentReconciliationreportform.get('toDate').removeValidators([
      Validators.required,
    ]);
    this.paymentReconciliationreportform.controls['Referenceno'].setValidators([
      Validators.required,
    ]);
   
  }

  onReset() {
    //window.location.reload()
  
    this.paymentReconciliationreportform.enable();
    this.paymentReconciliationreportform.controls['treasuryval'].disable();
    this.paymentReconciliationreportform.controls['finyear'].disable();
    this.paymentReconciliationreportform.controls['fromDate'].setValue("");
    this.paymentReconciliationreportform.controls['toDate'].setValue("");
   
   this.paymentReconciliationreportform.controls['Referenceno'].setValue('');
   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate(['/PaymentReconcilationlogComponent']);
  });
   this.onchange()
  // this.paymentReconciliationreportform.controls['Referenceno'].setErrors(null);

    this.showReconciliationTable = false;

  }

  applyFilter(filterValue: string) {
    this.GetReconciliationdata.filter = filterValue.trim().toLowerCase();
  }

  getPfmspaymnetlogreport() {
    let Date1 = this.paymentReconciliationreportform.controls['fromDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');
    let Date2 = this.paymentReconciliationreportform.controls['toDate'].value;
    let tDate = new DatePipe('en-US').transform(Date2, 'yyyy-MM-dd');
    let Ref_no= this.paymentReconciliationreportform.controls['Referenceno'].value;
    const paymentReconciliationreportmodel = {
      "fromDate": fDate!,
      "toDate": tDate!,
      "fileName": null,
      "status": null,
      "cdeRefNo":Ref_no
    }
    this.loader.setLoading(true);
    console.log("Before_Calling_API_paymentReconciliationreportmodelResult", paymentReconciliationreportmodel);


    //api call of pfmslogreport
    this.ApiMethods.postresultservice(this.ApiService.PFMSreconciliation, paymentReconciliationreportmodel).subscribe((resp: any) => {
      console.log("After_Calling_API_paymentReconciliationreportmodelmodel_Result", resp);
      if (resp.result.length > 0) {
        let arr = resp.result;
        let exceldata: any = [];
        let final: any = []
        let finalArr: any = [];
        //let billNumberArr:any=[];
        arr.forEach((element: any) => {
          if (this.billNumberArr[element.file_name]) {
            console.log("if block_")
            this.billNumberArr[element.file_name].push(element);
          } else {
            console.log("else block_")
            this.billNumberArr[element.file_name] = [element];
          }
          if (!finalArr[element.file_name]) {
            finalArr[element.file_name] = element;

            let data_ = JSON.stringify(element.rjected_reason,)
            let str = JSON.stringify(element.rjected_reason,).substring(0, 50);
            console.log("str__", str)
            let obj: any = {
              ...element,
              "rjected_reason": data_,
              "rjected": str,
              // ...element.payloadData.data
            }
            let excelobj: any = {
              ...element,
              "rjected_reason": data_,
            }
            final.push(obj)
            exceldata.push(excelobj)
          }
        });
        console.log("billNumberArr_", this.billNumberArr);
        console.log("finaldata_", final);
        this.GetReconciliationdata.data = final
         this.GetPdfdata =arr 
        this.exportcompletedata = exceldata;
        this.showReconciliationTable = true;
        this.loader.setLoading(false);
        this.paymentReconciliationreportform.disable();
      }
      else {
        this.snackbar.show('No Data Found !', 'alert')
        this.loader.setLoading(false);
        this.showReconciliationTable = false;
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


  /// complete excel data
  exportexcel(json: any[], excelFileName: string): void {
    var Heading: any = [
      [" Sr No."," Cde_Refno", "File Name ", "Status", 'Rejected Reason',  'Request Id ', ' Request Date ', 'Received Date']
    ];
    console.log(json);
    let arr: any[] = []
    json.forEach((item: any, index: any) => {
      let a = {
        " Sr No.": index + 1,
        "Cde_Refno": item.ref_no,
        "File Name": item.file_name,
        "Status:": item.status,
        "Rejected Reason:": item.rjected_reason,
      //  "Payload:": item.Payload,
        "Request Id :": item.request_id,
        " Request Date:": item.file_req_date,
        "Received Date:": item.file_rcvd_date,

      }
      arr.push(a)
    })
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(arr);
    //var elt = document.getElementById('LIST');
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

  // //export to pdf 
  exportToPdf() {
    this.loader.setLoading(true);
    setTimeout(() => {

      let str: string = '';
      var Heading: any =
        [" Sr No."," Cde_Refno", "File Name ", "Status", 'Rejected Reason','Request Id ', ' Request Date ', 'Received Date']

      let table = document.createElement('table');
      table.setAttribute('id', 'testpdTable');
      let heasRow = ''
      Heading.forEach((value: any) => {
        heasRow = heasRow + `<th scope="col" >${value}</th>`
      })
      heasRow = `<tr>${heasRow} <tr> `
      let tableData = this.GetPdfdata.map((value1: any, index) => {

        str = str + `<td >${index + 1}</td>`
        this.displayedColumns.map((value: any) => {
          if (value !== 'SrNo' && value !== 'Payload') {
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
      doc.save("PaymentReconciliationlogreport.pdf");
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


  // -------------get payload pop-up start-----------------////
  viewBillDetailPopup(element: any,event:any) {
    event.stopPropagation();
    this.showmodal(element.Id);
  }
  showmodal(Id: any) {
    const dialogRef = this.dialog.open(CommonDialogComponent,
      {
        width:`${window.innerWidth}px`,
        height: '500px',
        disableClose: true,
        data: {
          message: "",
          id: 'payload',
          elementId:Id
        }
      }

    );
    // dialogRef.componentInstance.viewpayload(Id);
  }

  // -------------get payload pop-up End-----------------////

  // -------------get REjected Reason pop-up start-----------------////

  viewReasonDetailPopup(element: any,event:any) {
    event.stopPropagation();
    this.showReasonmodal(element.rjected_reason);
  }
  showReasonmodal(rjected_reason: any) {
    const dialogRef = this.dialog.open(CommonDialogComponent,
      {
        width:`${window.innerWidth}px`,
        height: '500px',
        disableClose: true,
        data: {
          message: "",
          id: 'rejectedReason',
          elementId:rjected_reason
        }
      }

    );
    // dialogRef.componentInstance.viewpayload(Id);
  }
// -------------get payload pop-up End-----------------////

  // for nested table///////
  // toggle row 
  toggleRow(element: any) {
    console.log(element.Id);
           let final: any = []
          this.billNumberArr[element.file_name].forEach((value: any) => {
          let billno = value.bill_number;
          let tokenno = value.token_no;
          let cashamt = value.net_amount;
          let grossamt = value.gross_amount;
         
               let obj: any = {
              ...element,
              "Bill No.": billno,
              "Token No.": tokenno,
              "Net Amount.": cashamt,
              "Gross Amount.": grossamt,
              
              // ...element.payloadData.data
            }
             final.push(obj)
            //exceldata.push(excelobj)
          });
                console.log("finaldata_", final);
        this.GetReconciliationdatapayload.data = final
   element.file_name && (element.file_name as MatTableDataSource<any>) ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
    // console.log("ddjjdp-",element.file_name);
    // this.cd.detectChanges();
  };


}
