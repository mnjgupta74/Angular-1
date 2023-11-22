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
import { animate, state, style, transition, trigger } from '@angular/animations';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
//const ipaddr = require('ipaddr.js');



export interface pfmslist {
  cde_ref_no: string;
  fileStatus: number;
  status: number;
  transactionDate: number;
  treasuryRefNo: number;
  requestBody: number;
  srNO: number
}


@Component({
  selector: 'app-pfms-apilog',
  templateUrl: './pfms-apilog.component.html',
  styleUrls: ['./pfms-apilog.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})



export class PfmsApilogComponent implements OnInit {
  @ViewChild('LIST', { static: false }) el!: ElementRef
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.Getpfmsdata.sort = sort;
  }
  @ViewChild(MatPaginator) set MatPaginator(paginator: MatPaginator) {
    this.Getpfmsdata.paginator = paginator;
  }
  
  filename = "pfms-apilog.xlsx";
  exportcompletedata:any[]=[]
  expandedElement:any;
  Pfmsform: any;   
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []
  finYr: any;
  base64data: any;
  Getpfmsdata: MatTableDataSource<pfmslist> = new MatTableDataSource();
  showpfmsTable: boolean = false;
  ipfmsmodel: PFMSLOG = {
    fromDate: "",
    toDate: "",
    cde_refNo: null,
  }

  displayedColumns = [
    'srNO',
    'cde_ref_no',
    'fileStatus',
    'status',
    'transactionDate',
    //'treasuryRefNo',
    'requestBody',
    //'refNo',
  ];
  constructor(private  http: HttpClient,private sanitizer: DomSanitizer, private ApiMethods: ApiMethods, private _formBuilder: FormBuilder, public loader: LoaderService, private ApiService: ApiService, private _liveAnnouncer: LiveAnnouncer, private finyear_: Helper, private toyear_: Helper, private TCode: Helper, private UId: Helper, private datePipe: DatePipe, public dialog: MatDialog, private snackbar: SnackbarService) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
     // this.Ip();
    };
   // const addr  = ipaddr.parse('2001:db8:1234::1');
     //const ipaddr=
    //console.log( addr.kind());
    // addr.kind()
  }


  ngOnInit(): void {
    this.getTreasuryList();
    this.finYr = this.finyear_.forwardYear.toString();
    this.Pfmsform = new FormGroup({
      finyear: new FormControl({ value: this.finYr, disabled: true }),
      treasuryval: new FormControl({ value: '', disabled: true }, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
      toDate: new FormControl({ value: new Date(), disabled: false }, [Val.Required, Val.maxLength(12)]),
      fromDate: new FormControl({ value: new Date(), disabled: false }, [Val.Required, Val.maxLength(12)]),
     // Referenceno: new FormControl({ value: 0, disabled: false }, [Val.maxLength(6), Val.SpecialChar, Val.Numeric, Val.cannotContainSpace]),
     Referenceno: new FormControl("", [Val.maxLength(16), Val.SpecialChar, Val.Numeric, Val.cannotContainSpace]),})
  }

  

  getTreasuryList() {
    this.loader.setLoading(true);
    this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe((resp: any) => {
       console.log("Auditor__res", resp);
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.TreasuryListarr = resp.result
        //console.log("Show_Treasury_AuditorList", this.TreasuryListarr);
        this.Treasuryoptions = this.Pfmsform.controls['treasuryval'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            return typeof value === 'string' ? value : value.treasuryCode
          }),
          map((treasury: any) => {

            return treasury ? this._filtertreasury(treasury, data) : data.slice()
          })
        );
        const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.TCode.Treasury_Code)[0];
        this.Pfmsform.patchValue({
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
   // window.location.reload();
   this.Pfmsform.enable();
   this.Pfmsform.controls['treasuryval'].disable();
    this.Pfmsform.controls['finyear'].disable();
   this.Pfmsform.controls['fromDate'].setValue( new Date());
   this.Pfmsform.controls['toDate'].setValue( new Date());
   this.Pfmsform.controls['Referenceno'].setValue('');
    this.showpfmsTable = false;
  }

  applyFilter(filterValue: string) {
    this.Getpfmsdata.filter = filterValue.trim().toLowerCase();
    }

  getpfmslogreport() {
    let Date1 = this.Pfmsform.controls['fromDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');
    let Date2 = this.Pfmsform.controls['toDate'].value;
    let tDate = new DatePipe('en-US').transform(Date2, 'yyyy-MM-dd');
    this.ipfmsmodel.fromDate = fDate!;
    this.ipfmsmodel.toDate = tDate!;
    this.ipfmsmodel.cde_refNo = this.Pfmsform.controls['Referenceno'].value;


    this.loader.setLoading(true);
    console.log("Before_Calling_API_ipfmsmodel_Result", this.ipfmsmodel);


    //api call of pfmslogreport
    this.ApiMethods.postresultservice(this.ApiService.PFMSlogview, this.ipfmsmodel).subscribe((resp: any) => {
      console.log("After_Calling_API_ipfmsmodel_Result", resp);
      if (resp.result.length > 0) {
        let arr  = resp.result;
        let exceldata:any=[];
        let final:any=[]
        arr.forEach((element:any) => {
        let data=  JSON.stringify(element.requestBody);
       // let data1=  JSON.stringify(element.status);
        let str=  JSON.stringify(element.requestBody).substring(0,50);
       // let str1=  JSON.stringify(element.status).substring(0,50);
          let obj:any={
            ...element,
            "requestBody":data,
            "request":str,
        //    "status":data1,
        //    "status1":str1
            // ...element.payloadData.data
        }
        
          let excelobj:any={
            ...element,
             "requestBody":data,
          }

          final.push(obj)
          exceldata.push(excelobj)

        });
        console.log(exceldata);
        
        this.Getpfmsdata.data =final
        this.exportcompletedata=exceldata
       // this.Getpfmsdata = resp.result;
        this.showpfmsTable = true;
        this.loader.setLoading(false);
        this.Pfmsform.disable();
      }
      else {
        this.snackbar.show('No Data Found !', 'alert')
        this.loader.setLoading(false);
        this.showpfmsTable = false;
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
   
  // // // export to excel
  // exportexcel(): void {
  //   let user = document.getElementById('LIST')
  //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(user);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new()
  //   XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
  //   XLSX.writeFile(wb, this.filename);

  // }

    /// complete excel data
exportexcel(json: any[], excelFileName: string): void {
  var Heading: any = [
    [' Sr No.',' PFMS Ref No.','File Status','File Name','transactionDate','Payload']
  ];
  let arr:any[]=[]
  json.forEach((item:any,index:any)=>{
    let a={
      " Sr No.":index+1,
      "PFMS Ref No.":item.cde_ref_no,
      "File Status":item.fileStatus,
      "File Name":item.status,
       "transactionDate":item.transactionDate,
      "Payload":item.requestBody,
        }
arr.push(a)
//console.log("a__",a)
  })
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(arr);
 // var elt = document.getElementById('LIST');
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

  // viewDocumentPopup(element: any) {
  //   //this.loader.setLoading(true);
  //   this.showmodal(element.cde_ref_no);

  // }
  // showmodal(cde_ref_no: any) {
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
  //   dialogRef.componentInstance.getBase64ImgDocumentId(cde_ref_no);
  // }

  // //export to pdf 
  exportToPdf() {
    this.loader.setLoading(true);
    setTimeout(() => {
      let str:string=''
      let heading:any=[' Sr No.',' PFMS Ref No.','File Status','File Name','transactionDate','Payload']
      let table = document.createElement('table');
      table.setAttribute('id','testpdTable');
      let heasRow=''
      heading.forEach((value:any)=> {
        heasRow = heasRow+`<th scope="col" >${value}</th>`
      })
      heasRow= `<tr>${heasRow} <tr> `
      let tableData = this.Getpfmsdata.data.map((value1:any,index) => {
      
      str =  str + `<td >${index+1}</td>`
      this.displayedColumns.map((value:any)=> {
        if(value !==  'srNO'){
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
      doc.save("pfmsApilog.pdf");
      this.loader.setLoading(false);
    }, 500);
   
  }

}
