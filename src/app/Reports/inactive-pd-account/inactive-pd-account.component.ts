import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-inactive-pd-account',
  templateUrl: './inactive-pd-account.component.html',
  styleUrls: ['./inactive-pd-account.component.scss']
})
export class InactivePdAccountComponent implements OnInit {
  @ViewChild('LIST', { static: false }) el!: ElementRef
  filename = "InactivePdAccount.xlsx";
  exportcompletedata:any[]=[]
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.inactivePdReportdata.sort = sort;
  }
  @ViewChild(MatPaginator) set MatPaginator(paginator: MatPaginator) {
    this.inactivePdReportdata.paginator = paginator;
  }
  displayedColumns=['SrNo','Budget Head','Pd Account No','Last Tr. Date','Inactive by 5 years']
  Getinactivepddata:any;
  inactivePdReportform:any;
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []
  finYr: any;
  inactivePdReporttable:boolean=true;
  inactivePdReportdata:MatTableDataSource<any> = new MatTableDataSource();
  constructor(private router : Router,private sanitizer: DomSanitizer, private ApiMethods: ApiMethods, private _formBuilder: FormBuilder, public loader: LoaderService, private ApiService: ApiService, private _liveAnnouncer: LiveAnnouncer, private finyear_: Helper, private toyear_: Helper, private TCode: Helper, private UId: Helper, private datePipe: DatePipe, public dialog: MatDialog, private snackbar: SnackbarService) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
    };
  }

  ngOnInit(): void {
      this.getTreasuryList();
     this.finYr = this.finyear_.forwardYear.toString();
     this.inactivePdReportform = new FormGroup({
       finyear: new FormControl({ value: this.finYr, disabled: true }),
       treasuryval: new FormControl({ value: '', disabled: true }, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
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
        this.Treasuryoptions = this.inactivePdReportform.controls['treasuryval'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            return typeof value === 'string' ? value : value.treasuryCode
          }),
          map((treasury: any) => {

            return treasury ? this._filtertreasury(treasury, data) : data.slice()
          })
        );
        const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.TCode.Treasury_Code)[0];
        this.inactivePdReportform.patchValue({
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

  onSearch(){

  }

  applyFilter(filterValue: string) {
    this.inactivePdReportdata.filter = filterValue.trim().toLowerCase();
   }
  onReset(){
    window.location.reload()
  }
    // //export to pdf 
    exportToPdf() {
      this.loader.setLoading(true);
      setTimeout(() => {
        let str:string=''
        let table = document.createElement('table');
        table.setAttribute('id','testpdTable');
        let heasRow=''
        this.displayedColumns.forEach((value:any)=> {
          heasRow = heasRow+`<th scope="col" >${value}</th>`
        })
        heasRow= `<tr>${heasRow} <tr> `
        let tableData = this.Getinactivepddata.data.map((value1:any,index: number) => {
        
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
        doc.save("Getinactivepddata.pdf");
        this.loader.setLoading(false);
      }, 500);
     
    }

    /// complete excel data
exportexcel(json: any[], excelFileName: string): void {
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
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
