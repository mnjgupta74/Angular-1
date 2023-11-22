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
import jsPDF from 'jspdf';
import autoTable, { Cell } from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
import jspdf from 'jspdf';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-pfms-track-report',
  templateUrl: './pfms-track-report.component.html',
  styleUrls: ['./pfms-track-report.component.scss']
})
export class PfmsTrackReportComponent implements OnInit {
  @ViewChild('LIST') el!: ElementRef;
  filename = "PfmsTrackReport.xlsx";
  exportcompletedata:any[]=[]
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.Getpfmstrackdata.sort = sort;
  }
  @ViewChild(MatPaginator) set MatPaginator(paginator: MatPaginator) {
    this.Getpfmstrackdata.paginator = paginator;
  }

  PfmsTrackReportform: any;
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []
  finYr: any;
  base64data: any;
  Getpfmstrackdata: MatTableDataSource<any> = new MatTableDataSource();
  showpfmstrackTable: boolean = false;
  getpfmstrackmodel: PFMSLOG = {
    fromDate: "",
    toDate: "",
    cde_refNo: null,
  }
  mat_radio_1: boolean = true
  mat_radio_2: boolean = false
  display: boolean = false;
  displayedColumns = [
    'SrNo',
    'CDE_REFNO',
    'TREASURY_CODE',
    'TOKENNO',
    'AUDITOR_ACTION_BY',
    'CHECKER_ACTION_BY',
    'TO_ACTION_BY',
    'SNA_ACTION_BY',
    'PFMS_ACTION_BY',
  ];

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
    this.PfmsTrackReportform = new FormGroup({
      finyear: new FormControl({ value: this.finYr, disabled: true }),
      treasuryval: new FormControl({ value: '', disabled: true }, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
      toDate: new FormControl({ value: new Date(), disabled: false }, [Val.Required, Val.maxLength(12)]),
      fromDate: new FormControl({ value: new Date(), disabled: false }, [Val.Required, Val.maxLength(12)]),
      Referenceno: new FormControl('', [Val.maxLength(16), Val.SpecialChar, Val.Numeric, Val.cannotContainSpace]),
      rblTypeCtrl: new FormControl('1', Validators.required),
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
        this.Treasuryoptions = this.PfmsTrackReportform.controls['treasuryval'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            return typeof value === 'string' ? value : value.treasuryCode
          }),
          map((treasury: any) => {

            return treasury ? this._filtertreasury(treasury, data) : data.slice()
          })
        );
        const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.TCode.Treasury_Code)[0];
        this.PfmsTrackReportform.patchValue({
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
  viewDocumentPopup(element: any) {
    //this.loader.setLoading(true);
    this.showmodal(element.CDE_REFNO);

  }
  showmodal(CDE_REFNO: any) {
    const dialogRef = this.dialog.open(ViewDocumentComponent,
      {
        // width: '50%',
        // height: '63%',
        width: '1000px',
        height: '800px',
        disableClose: true
        // , data: {
        //   // result: ''
        // }
      }

    );
    dialogRef.componentInstance.getBase64ImgDocumentId(CDE_REFNO);
  }
  radioButtonGroupChange(event: any) {
    console.log("evnenrt______", event.value);
    this.display = !this.display

  }
  onSearch() {
    this.Getpfmstrackdata.filter ="";
    let Date1 = this.PfmsTrackReportform.controls['fromDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');
    let Date2 = this.PfmsTrackReportform.controls['toDate'].value;
    let tDate = new DatePipe('en-US').transform(Date2, 'yyyy-MM-dd');

    console.log("a", this.PfmsTrackReportform.controls['rblTypeCtrl'].value)
    console.log("b", fDate)
    console.log("c", tDate)
    console.log("d", this.PfmsTrackReportform.controls['Referenceno'].value)
    if (this.PfmsTrackReportform.controls['rblTypeCtrl'].value == "1") {

      if (Date1 === "" || Date2 === "" || Date1 === null || Date2 === null) {
        console.log("f", fDate)
        this.snackbar.show('Please Enter Date', 'alert')
        return;
      }
      else {
        console.log("fff", fDate)
        this.getpfmstrackmodel.fromDate = fDate!;
        this.getpfmstrackmodel.toDate = tDate!;
        this.getpfmstrackmodel.cde_refNo = null;
      }

    }
    else {
      if (this.PfmsTrackReportform.controls['Referenceno'].value == "") {
        this.snackbar.show('Please Enter RefNo', 'alert')
        return;
      }
      else {
        this.getpfmstrackmodel.fromDate = "";
        this.getpfmstrackmodel.toDate = "";
        this.getpfmstrackmodel.cde_refNo = this.PfmsTrackReportform.controls['Referenceno'].value;
      }


    }
    this.loader.setLoading(true);
    console.log("Before_Calling_API_iipfmsbilltopaymangermodel_Result", this.getpfmstrackmodel);

    //api call of pfmslogreport
    this.ApiMethods.postresultservice(this.ApiService.PFMSTrack, this.getpfmstrackmodel).subscribe((resp: any) => {
      console.log("After_Calling_API_ipfmsbilltopaymangermodel_Result", resp);
      let arr = resp.result;
      if (resp.result.length > 0) {
          this.Getpfmstrackdata.data = arr;
          this.exportcompletedata=arr;
        this.showpfmstrackTable = true;
        this.loader.setLoading(false);
        this.PfmsTrackReportform.disable();
      }
      else {
        this.snackbar.show('No Data Found !', 'alert')
        this.loader.setLoading(false);
        this.showpfmstrackTable = false;
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
  onReset() {
  //  window.location.reload()
  
 this.PfmsTrackReportform.enable();
 this.PfmsTrackReportform.controls['treasuryval'].disable();
  this.PfmsTrackReportform.controls['finyear'].disable();
 this.PfmsTrackReportform.controls['fromDate'].setValue( new Date());
 this.PfmsTrackReportform.controls['toDate'].setValue( new Date());
 this.PfmsTrackReportform.controls['Referenceno'].setValue('');
// this.PfmsTrackReportform.reset();
  this.showpfmstrackTable = false;
 // console.log("vinay s date " ,this.PfmsTrackReportform.controls['fromDate'].value= new Date())

  }

  applyFilter(filterValue: string) {
    this.Getpfmstrackdata.filter = filterValue.trim().toLowerCase();
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
  let tokenstring:string='Token No'+'<br/>'+'Token By'+'<br/>'+' Token Date'+'<br/>'+'Token Status';
  let auditorstring:string='Auditor By'+'<br/>'+ 'Auditor Date'+'<br/>' +'Auditor Status';
  let checkerstring:string='Checker By'+'<br/>'+' Checker Date'+'<br/>'+' Checker Status';
  let tostr:string='TO By'+'<br/>'+'TO Date'+'<br/>'+ 'TO Status';
  let snastr:string='SNA By'+'<br/>'+ 'SNA Date'+'<br/>'+' SNA Status';
  let pfmsstr:string='PFMS By '+'<br/>'+ 'PFMS Date'+'<br/>'+ 'PFMS Status'
  let Heading:any[]=[" Sr No.","Cde_Reference No.","Treasury Name",tokenstring,auditorstring,checkerstring,tostr,snastr,pfmsstr]
 let  templateToExcel:string[][] = [Heading,[]];

//var elt = document.getElementById('LIST');
 // const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(elt);
  // const worksheet1:any = XLSX.utils.sheet_to_html(worksheet);
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
  // console.log(worksheet1);
  for (var i in worksheet) {
      console.log(worksheet[i]);
      if (typeof worksheet[i] != 'object') continue;
      let cell = XLSX.utils.decode_cell(i);
      console.log("cell_", cell);
      worksheet[i].s = {
        // styling for all cells
        font: {
          name: 'arial',
          // color:'ff150059'
         },
        alignment: {
          vertical: 'center',
          horizontal: 'center',
          wrapText: '1', // any truthy value here
        },
        border: {
          right: {
            style: 'thin',
            color: 'ff150059',
          },
          left: {
            style: 'thin',
            color: 'ff150059',
          },
        },
      };
    }
  
 // XLSX.utils.sheet_add_aoa(worksheet, templateToExcel)
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
        let str:string=''
        let tokenstring:string='Token No'+'<br/>'+'Token By'+'<br/>'+' Token Date'+'<br/>'+'Token Status';
        let auditorstring:string='Auditor By'+'<br/>'+ 'Auditor Date'+'<br/>' +'Auditor Status';
        let checkerstring:string='Checker By'+'<br/>'+' Checker Date'+'<br/>'+' Checker Status';
        let tostr:string='TO By'+'<br/>'+'TO Date'+'<br/>'+ 'TO Status';
        let snastr:string='SNA By'+'<br/>'+ 'SNA Date'+'<br/>'+' SNA Status';
        let pfmsstr:string='PFMS By '+'<br/>'+ 'PFMS Date'+'<br/>'+ 'PFMS Status'
        let Heading:any[]=[" Sr No.","Cde_Reference No.","Treasury Name",tokenstring,auditorstring,checkerstring,tostr,snastr,pfmsstr]
        let table = document.createElement('table');
        table.setAttribute('id','testpdTable');
        let heasRow=''
        Heading.forEach((value:any)=> {
          heasRow = heasRow+`<th scope="col" >${value}</th>`
        })
        heasRow= `<tr>${heasRow} <tr> `
        let tableData = this.Getpfmstrackdata.data.map((value1:any,index) => {
        
        str =  str + `<td >${index+1}</td>`
        this.displayedColumns.map((value:any)=> {
          if(value !==  'SrNo')
          {
            if( value == 'TOKENNO'){
              str=  str + `<td >${value1['TOKENNO']}</br>${value1['TOKEN_ACTION_BY']}</br>  ${value1['TOKEN_ACTION_DATE']}</br>  ${value1['TOKEN_ACTION_FLAG']}</td>`
            }

           else if( value == 'AUDITOR_ACTION_BY'){
                str=  str + `<td >${value1['AUDITOR_ACTION_BY']}</br>${value1['AUDITOR_ACTION_DATE']}</br>  ${value1['AUDITOR_ACTION_FLAG']}</td>`
             }
             else if( value == 'CHECKER_ACTION_BY'){
              str=  str + `<td >${value1['CHECKER_ACTION_BY']}</br>${value1['CHECKER_ACTION_DATE']}</br>  ${value1['CHECKER_ACTION_FLAG']}</td>`
             }
             else if( value == 'TO_ACTION_BY'){
              str=  str + `<td >${value1['TO_ACTION_BY']}</br>${value1['TO_ACTION_DATE']}</br>  ${value1['TO_ACTION_FLAG']}</td>`
             }
  
             else if( value == 'SNA_ACTION_BY'){
              str=  str + `<td >${value1['SNA_ACTION_BY']}</br>${value1['SNA_ACTION_DATE']}</br>  ${value1['SNA_ACTION_FLAG']}</td>`
             }
  
             else if( value == 'PFMS_ACTION_BY'){
              str=  str + `<td >${value1['PFMS_ACTION_BY']}</br>${value1['PFMS_ACTION_DATE']}</br>  ${value1['PFMS_ACTION_FLAG']}</td>`
             }
           else{ str=  str + `<td >${value1[value]}</td>`}
            
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
              autoTable(doc, { html: table,
                // ----------for the coluring the cell used didparsecelll method start---------------->>>
            //   didParseCell(data:any) {
            //     var rows = data.table.body;
            //   //  console.log("rows-",Object.keys(rows.result));
            //     console.log("data---",rows[0].raw[3].content);
            //     // Object.entries(rows[0].raw[3].content)
            //     //  console.log("value--",Object.entries(rows[0].raw[3].content));
              
            //      if ( rows[0].raw[3].content.includes("PASS")) {
            //     ///console.log("dta-",data.row.index);
            //    // console.log("lenght-",rows.raw[3].Content.TOKEN_ACTION_FLAG);
            //    //console.log('hgjggjgjjggjgjgjgjgjgjgj',rows[0].cells[3]);
               
            //   //  rows[0].raw[3]._element.style.backgroundColor ='#e00000';
            //   //  rows[0].raw[3].styles['backgroundColor'] ='#e00000';
            //   //  rows[0].cells[3].styles.fillColor=[245,255,0,0]
            //       rows[0].cells[3].styles.textColor=[245,0,0,0]
            //     }
            // }
             // ----------for the coluring the cell used didparsecelll method End---------------->>>

            });
       // doc.text("https://rajkosh.rajasthan.gov.in", 10, 200);
        doc.save("PfmsTrackReport.pdf");
        this.loader.setLoading(false);
      }, 500);
     
    }

    // //test colour of pdf in jspdf//////////////
    // capture() {

    //   var doc = new jsPDF("l", "mm", "a2");
  
    //   // var cols= [{ title: 'Id', dataKey: 'id' },
    //   // { title: 'Source-Field Resolved Path', dataKey: 'sourceName' },  { title: 'Target Data Type', dataKey: 'tdataType' }, 
    //   // { title: 'Data Type Verified', dataKey: 'datatypeVerified' }]
  
    //   // var tableData =[];
    //   // for(var i = 0 ; i <this.exportcompletedata.length; i ++){
    //   //   tableData.push({'TOKENNO':this.exportcompletedata[i].TOKENNO, 'AUDITOR_ACTION_BY': this.exportcompletedata[i]. AUDITOR_ACTION_BY  ,'TOKEN_ACTION_FLAG': this.exportcompletedata[i].TOKEN_ACTION_FLAG })
    //   // }
    //     autoTable(doc, {
    //         didParseCell:(data:any)=> {
    //          console.log("Data = ", data)
    //        //console.log("cell = ", cell)
    //          if (data.section === 'body' && data.column.index === 0) {
    //         var base64Img = 'data:image/jpeg;base64,iVBORw0KGgoAAAANS...'
    //         doc.addImage(base64Img, 'JPEG', data.cell.x + 2, data.cell.y + 2, 10, 10)
    //       }
    //         var tdElement;
      //         //  tdElement = cell.row.raw.backgroundColor
      //           console.log("tdElement = ", tdElement)
    //          // if(tdElement == false && cell.column.raw.dataKey =="datatypeVerified" ){
      //          //   cell.cell.styles.fontStyle = 'bold';
    //          //   cell.cell.styles.textColor = [255,0,0]
    //          // }
  
    //   }
     // })
      //  //  document.getElementById('obj').dataset.data = doc.output("datauristring");
    //      var blob = doc.output("blob");
    //     window.open(URL.createObjectURL(blob));
  
    // }
   
}
