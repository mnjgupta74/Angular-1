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
import { ViewDocumentComponent } from 'src/app/bill-process/view-document/view-document.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
//import * as XLSX from 'xlsx-js-style';
import * as fileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
//import { font } from './font';
//import './RobotoBlackNormal';
//import Roboto from '@/assets/fonts/Roboto'
//import RobotoBold from '@/assets/fonts/Roboto-Bold-bold.js'


@Component({
  selector: 'app-pfms-cn',
  templateUrl: './pfms-cn.component.html',
  styleUrls: ['./pfms-cn.component.scss']
})
export class PfmsCnComponent implements OnInit {
  @ViewChild('LIST', { static: false }) el!: ElementRef;
  @ViewChild('Content', { static: false }) el2!: ElementRef
  filename = "PfmsCn.xlsx";
  exportcompletedata: any[] = []

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
  display: boolean = false;
  displayedColumns = [
    'SrNo',
    'END_TO_END_ID',
    'FILE_DT',
    'PYMT_INTF_ID',
    'NO_OF_ENTRIES',
    'DN_AMNT',
    'CR_DR_IND',
    'FILE_NAME',
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

  onSearch() {
    this.Getpfmstrackdata.filter = "";
    let Date1 = this.PfmsTrackReportform.controls['fromDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');
    let Date2 = this.PfmsTrackReportform.controls['toDate'].value;
    let tDate = new DatePipe('en-US').transform(Date2, 'yyyy-MM-dd');

    console.log("b", fDate)
    console.log("c", tDate)

    if (Date1 === "" || Date2 === "" || Date1 === null || Date2 === null) {
      console.log("f", fDate)
      this.snackbar.show('Please Enter Date', 'alert')
      return;
    }
    else {
      console.log("fff", fDate)
      var body = {
        "fromDate": fDate,
        "toDate": tDate
      }
    }
    this.loader.setLoading(true);
    console.log("Before_Calling_API_body", body);

    //api call of pfmslogreport
    this.ApiMethods.postresultservice(this.ApiService.PFMSCNTrack, body).subscribe((resp: any) => {
      console.log("After_Calling_API_pfms_cn_Result", resp);
      if (resp.result.length > 0) {
        let arr = resp.result;
        // let final: any = []
        // arr.forEach((element: any) => {
        //   let str = JSON.stringify(element.payloadData,)
        //   let obj: any = {
        //     ...element,
        //     "payloadData": str
        //     // ...element.payloadData.data
        //   }
        //   final.push(obj)
        // });
        // console.log("finaldata_", final);
        this.Getpfmstrackdata.data = arr;
        this.exportcompletedata = resp.result;
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
    //window.location.reload();
    this.PfmsTrackReportform.enable();
    this.PfmsTrackReportform.controls['treasuryval'].disable();
    this.PfmsTrackReportform.controls['finyear'].disable();
    this.PfmsTrackReportform.controls['fromDate'].setValue(new Date());
    this.PfmsTrackReportform.controls['toDate'].setValue(new Date());
    this.showpfmstrackTable = false;
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
    var Heading: any = [
      [" END TO END ID", "FILE Date", "PYMT INTF ID", " NO OF ENTRIES", " DN AMOUNT", " CR DR IND", "PFMS By"]
    ];
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
     XLSX.utils.sheet_add_aoa(worksheet, Heading)

  // --------->>for coloring the header in excel file--------------------------->>>>>>>>>//
    // for (var i in worksheet) {
    //   console.log(worksheet[i]);
    //   if (typeof worksheet[i] != 'object') continue;
    //   let cell = XLSX.utils.decode_cell(i);
    //   console.log("cell_", cell);


    //   worksheet[i].s = {
    //     // styling for all cells
    //     font: {
    //       name: 'arial',
    //       // color:'ff150059'
    //      },
    //     // alignment: {
    //     //   vertical: 'center',
    //     //   horizontal: 'center',
    //     //   wrapText: '1', // any truthy value here
    //     // },
    //     // border: {
    //     //   right: {
    //     //     style: 'thin',
    //     //     color: 'ff150059',
    //     //   },
    //     //   left: {
    //     //     style: 'thin',
    //     //     color: 'ff150059',
    //     //   },
    //     // },
    //   };
    //   if (cell.r == 0) {
    //     // every other row
    //     worksheet[i].s.fill = {
    //       // background color
    //       patternType: 'solid',
    //       fgColor: { rgb: 'e00000' },
    //       bgColor: { rgb: 'e00000' },
    //     };
    //   }
    // }
    // --------->>for coloring the header in excel file--------------------------->>>>>>>>>//
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
      let str: string = ''
      var Heading: any =
        ["Sr No.", " END TO END ID", "FILE Date", "PYMT INTF ID", " NO OF ENTRIES", " DN AMOUNT", " CR DR IND", "PFMS By"]

      let table = document.createElement('table');
      table.setAttribute('id', 'testpdTable');
      let heasRow = ''
      Heading.forEach((value: any) => {
        heasRow = heasRow + `<th scope="col" >${value}</th>`
      })
      heasRow = `<tr>${heasRow} <tr> `
      let tableData = this.Getpfmstrackdata.data.map((value1: any, index) => {

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
        autoTable(doc, { html: table,
      //   didParseCell(data:any) {
      //     var rows = data.table.body;
      //     console.log("rows-",rows);
      //      if (data.row.index === rows.length - 1) {
      //     console.log("dta-",data.row.index);
      //     console.log("lenght-",rows.length);
      //      data.cell.styles.fillColor = [239, 154, 154];
      //     }
      // } 
    });
    
      //   var img = new Image()
      //   img.src = './assets/images/pdf.png'
      //  // var doc = new jsPDF("p", "pt", "a4")
      //   doc.addImage(img, 40, 30, 100, 76) 
      // doc.text("https://rajkosh.rajasthan.gov.in", 10, 200);
      doc.save("PfmsCn.pdf");
      this.loader.setLoading(false);
    }, 500);

  }

  // ExporttoPdf() {
  //   var doc = new jsPDF('p', 'pt', 'a2');
  //   //const doc = new jsPDF();
  //   console.log("fontlist",doc.getFontList());
  // //  doc.html(this.el2.nativeElement, {
  //  //   callback: function (doc) {

  //     doc.addFileToVFS('NotoSerifDevanagari-VariableFont_wdth,wght.ttf', './assets/fonts/NotoSerifDevanagari-VariableFont_wdth,wght.ttf');
  //     doc.addFont('./assets/fonts/NotoSerifDevanagari-VariableFont_wdth,wght.ttf', 'NotoSerifDevanagari', 'normal');
  //     doc.setFont('NotoSerifDevanagari');
  //    // doc.setFontType("bold");    
  //     doc.setFillColor(255, 0, 0); //set font color to red    
  //     //  doc.addFileToVFS('NotoSerifDevanagari-VariableFont_wdth,wght.ttf','src\assets\fonts\NotoSerifDevanagari-VariableFont_wdth,wght.ttf')
  //     //  doc.addFileToVFS('Roboto-Bold.ttf', 'src\assets\fonts\Roboto-Bold.ttf')
  //     ////  doc.addFont('src\'assets\fonts\Roboto-Regular.ttf', 'Roboto', 'normal')
  //    //   doc.addFont('src\assets\fonts\Roboto-Bold.ttf', 'Roboto', 'bold')
  //     //  doc.setFont('Roboto')
  //     autoTable(doc,{
  //       margin: {top: 40},
  //       html: '#LIST',
  //     tableWidth: 'auto',
  //   styles: {overflow: 'linebreak',valign: 'middle',fontSize:9,cellPadding :3,font: 'NotoSerifDevanagari',
  //   fontStyle: 'normal'},

  //    });
  //       doc.text("https://rajkosh.rajasthan.gov.in/", 30, 330);
  //       doc.save('Token_Print.pdf');
  //   //  },
  //     // fontFaces: [{
  //     //   family: 'NanumGothic-Regular',
  //     //   src: ["/NanumGothic-Regular.ttf"]
  //     // }]
  //  // })
  // }
}

