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
import { PFMSLOG } from '../Interface';
import { ViewDocumentComponent } from 'src/app/bill-process/view-document/view-document.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { log } from 'util';
import { animate, state, style, transition, trigger } from '@angular/animations';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
import { CommonDialogComponent } from 'src/app/bill-process/common-dialog/common-dialog.component';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


@Component({
  selector: 'app-pfms-bill-to-paymanger',
  templateUrl: './pfms-bill-to-paymanger.component.html',
  styleUrls: ['./pfms-bill-to-paymanger.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PfmsBillToPaymangerComponent implements OnInit {
  @ViewChild('LIST', { static: false }) el!: ElementRef
  filename = "pfmsbilltopaymangerdata.xlsx";
  exportcompletedata:any[]=[]
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.Getpfmsbilltopaymangerdata.sort = sort;
  }
  @ViewChild(MatPaginator) set MatPaginator(paginator: MatPaginator) {
    this.Getpfmsbilltopaymangerdata.paginator = paginator;
  }
  changeText!: boolean;
  Pfmsbilltopaymangerform: any;
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []
  finYr: any;
  base64data: any;
  expandedElement:any;
  Getpfmsbilltopaymangerdata: MatTableDataSource<any> = new MatTableDataSource();
  showpfmsbilltopaymangerTable: boolean = false;
  headers!: string[];
  config!: { inputStyles?: { [key: string]: any; } | undefined; containerStyles?: { [key: string]: any; } | undefined; allowKeyCodes?: string[] | undefined; length?: number | undefined; allowNumbersOnly?: boolean | undefined; inputClass?: string | undefined; containerClass?: string | undefined; isPasswordInput?: boolean | undefined; disableAutoFocus?: boolean | undefined; placeholder?: string | undefined; };
  getpfmsbilltopaymangermodel: PFMSLOG = {
    fromDate: "",
    toDate: "",
    cde_refNo: null,
  }

  displayedColumns = [
    'SrNo',
    'cdeRefno',
    //'billId',
    'fileName',
    'status',
    'fileDate',
    'paymentIntfid',
    'signDate',
    'payloadData',
    
  ];
  constructor(private sanitizer: DomSanitizer, private ApiMethods: ApiMethods, private _formBuilder: FormBuilder, public loader: LoaderService, private ApiService: ApiService, private _liveAnnouncer: LiveAnnouncer, private finyear_: Helper, private toyear_: Helper, private TCode: Helper, private UId: Helper, private datePipe: DatePipe, public dialog: MatDialog, private snackbar: SnackbarService) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
      //this.changeText = false;
    };
  }
  ngOnInit(): void {
  
    this.getTreasuryList();
    this.finYr = this.finyear_.forwardYear.toString();
    this.Pfmsbilltopaymangerform = new FormGroup({
      finyear: new FormControl({ value: this.finYr, disabled: true }),
      treasuryval: new FormControl({ value: '', disabled: true }, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
      toDate: new FormControl({ value: new Date(), disabled: false }, [Val.Required, Val.maxLength(12)]),
      fromDate: new FormControl({ value: new Date(), disabled: false }, [Val.Required, Val.maxLength(12)]),
      Referenceno: new FormControl('', [Val.maxLength(6), Val.SpecialChar, Val.Numeric, Val.cannotContainSpace]),
    })
  }

  getTreasuryList() {
    this.loader.setLoading(true);
    this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe((resp: any) => {
       let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.TreasuryListarr = resp.result
        //console.log("Show_Treasury_AuditorList", this.TreasuryListarr);
        this.Treasuryoptions = this.Pfmsbilltopaymangerform.controls['treasuryval'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            return typeof value === 'string' ? value : value.treasuryCode
          }),
          map((treasury: any) => {

            return treasury ? this._filtertreasury(treasury, data) : data.slice()
          })
        );
        const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.TCode.Treasury_Code)[0];
        this.Pfmsbilltopaymangerform.patchValue({
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

  onReset() {
    //window.location.reload()
    this.Pfmsbilltopaymangerform.enable();
    this.Pfmsbilltopaymangerform.controls['treasuryval'].disable();
     this.Pfmsbilltopaymangerform.controls['finyear'].disable();
    this.Pfmsbilltopaymangerform.controls['fromDate'].setValue( new Date());
    this.Pfmsbilltopaymangerform.controls['toDate'].setValue( new Date());
    this.Pfmsbilltopaymangerform.controls['Referenceno'].setValue('');
     this.showpfmsbilltopaymangerTable = false;
  }

  applyFilter(filterValue: string) {
    this.Getpfmsbilltopaymangerdata.filter = filterValue.trim().toLowerCase();
    }

    getpfmsbilltopaymangerreport() {
    let Date1 = this.Pfmsbilltopaymangerform.controls['fromDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');
    let Date2 = this.Pfmsbilltopaymangerform.controls['toDate'].value;
    let tDate = new DatePipe('en-US').transform(Date2, 'yyyy-MM-dd');
    this.getpfmsbilltopaymangermodel.fromDate = fDate!;
    this.getpfmsbilltopaymangermodel.toDate = tDate!;
    this.getpfmsbilltopaymangermodel.cde_refNo = this.Pfmsbilltopaymangerform.controls['Referenceno'].value;


    this.loader.setLoading(true);
    console.log("Before_Calling_API_iipfmsbilltopaymangermodel_Result", this.getpfmsbilltopaymangermodel);


    //api call of pfmslogreport
    this.ApiMethods.postresultservice(this.ApiService.PFMSbilltopaymangerview, this.getpfmsbilltopaymangermodel).subscribe((resp: any) => {
      console.log("After_Calling_API_ipfmsbilltopaymangermodel_Result", resp);
      if (resp.result.length > 0) {
        let arr  = resp.result;
        let exceldata:any=[];
        let final:any=[]
        arr.forEach((element:any) => {
          let data_=JSON.stringify(element.payloadData,)
        let str=  JSON.stringify(element.payloadData,).substring(0,50);
        console.log("str__",str)
          let obj:any={
            ...element,
            "payloadData":data_,
            "payload":str,
           
            // ...element.payloadData.data
          }

          
          let excelobj:any={
            ...element,
             "payloadData":data_,
          }
          
         final.push(obj)
         exceldata.push(excelobj)
        });
        console.log("finaldata_",final);
        this.Getpfmsbilltopaymangerdata.data =final 
        this.exportcompletedata=exceldata;
        this.showpfmsbilltopaymangerTable = true;
        this.loader.setLoading(false);
        this.Pfmsbilltopaymangerform.disable();
      }
      else {
        this.snackbar.show('No Data Found !', 'alert')
        this.loader.setLoading(false);
        this.showpfmsbilltopaymangerTable = false;
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


  //  // // export to excel
  //  exportexcel(): void {
  //   let user = document.getElementById('LIST')
  //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(user);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new()
  //   XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
  //   XLSX.writeFile(wb, this.filename);
  // }

 /// complete excel data
exportexcel(json: any[], excelFileName: string): void {
  var Heading: any = [
    [" Sr No.","PFMS Ref No.", "File Name",, " File Date", "Payload Data", "Payment Intfid", "Sign Date", " status"]
  ];
  console.log(json);
  let arr:any[]=[]
  json.forEach((item:any,index:any)=>{
    let a={
      " Sr No.":index+1,
      "PFMS Ref No.":item.cdeRefno,
      "File Name":item.fileName,
      " status":item.status,
      "File Date":item.fileDate,
    
      "Payment Intfid":item.paymentIntfid,
      "Sign Date":item.signDate,
      "Payload Data":item.payloadData,

    }
arr.push(a)
  })
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(arr);
var elt = document.getElementById('LIST');
  // const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.exportcompletedata);
  // XLSX.utils.sheet_add_aoa(worksheet, Heading)
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
   exportToPdf() {
    this.loader.setLoading(true);
    setTimeout(() => {
      let str:string='';
      var Heading: any = 
        [" Sr No.","  PFMS Ref No.", "File Name", "status", " File Date", " Payment Intfid", "Sign Date", "Payload Data"]
      
      let table = document.createElement('table');
      table.setAttribute('id','testpdTable');
      let heasRow=''
      Heading.forEach((value:any)=> {
        heasRow = heasRow+`<th scope="col" >${value}</th>`
      })
      heasRow= `<tr>${heasRow} <tr> `
      let tableData = this.Getpfmsbilltopaymangerdata.data.map((value1:any,index) => {
      
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
      doc.save("pfmsbilltopaymangerdata.pdf");
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

  viewBillDetailPopup(element: any) {
    this.showmodal(element.cdeRefno);

  }
  showmodal(cdeRefno: any) {
    const dialogRef = this.dialog.open(CommonDialogComponent,
      {

        width: '1000px',
        height: '800px',
        disableClose: true,
        data: {
          message: "",
          id: 'PFMSBilllist',
        }


      }

    );
    dialogRef.componentInstance.getPFMSBillDetailReport(cdeRefno);
  }

}

