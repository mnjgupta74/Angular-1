import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Observable, map, startWith } from 'rxjs';
import { LoaderService } from 'src/app/services/loaderservice';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { Helper } from 'src/app/utils/Helper';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { ApiService } from 'src/app/utils/utility.service';
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-pdac-status-report',
  templateUrl: './pdac-status-report.component.html',
  styleUrls: ['./pdac-status-report.component.scss']
})
export class PDAcStatusReportComponent implements OnInit {
  @ViewChild('test', { static: false }) el!: ElementRef
  filename = "PDAcStatusReport.xlsx";
  exportcompletedata:any[]=[]
  PdAoountReportFrom:any;
  pdaccountstatus:any;
  TreasuryListarr:any;
  Treasuryoptions: Observable<any[]> | undefined;
  displayedColumns:any[]=['TreasuryName','BudgetHead','PDAcNo','organization','intBearing','closingBalances','lastActiveon'];
  displayedColumnsummery:any[]=['Information','noOfPdAccounts','balances'];
  dataSource:any;

  constructor(private _liveAnnouncer: LiveAnnouncer,private router: Router, private apiMethod: ApiMethods, public loader: LoaderService, private apiService: ApiService, private snackbar: SnackbarService, private renderer: Renderer2,private Helper:Helper) {

   }

  ngOnInit(): void {

    this.PdAoountReportFrom = new FormGroup({
      TreasuryControl: new FormControl({ value: '', disabled: true }, [Validators.required]),
      reportType: new FormControl({ value: '', disabled: false }, [Validators.required]),

    });

    this.getTreasuryList();
  }


  PdAoountReportSubmit(){

  }

  getTreasuryList() {
    this.loader.setLoading(true);
       this.apiMethod.getservice(this.apiService.treasuryList).subscribe((resp:any) => {

       console.log("Auditor__res", resp);
       let data = resp.result
       if (resp.result && resp.result.length > 0) {
         this.TreasuryListarr = resp.result
         this.Treasuryoptions = this.PdAoountReportFrom.controls['TreasuryControl'].valueChanges.pipe(
           startWith(''),
           map((value: any) => {
             return typeof value === 'string' ? value : value.treasuryCode
           }),
           map((treasury: any) => {

             return treasury ? this._filterTreas(treasury, data) : data.slice()
           })
         );
         const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.Helper.Treasury_Code)[0];
         this.PdAoountReportFrom.patchValue({
           TreasuryControl: treasury

         })

         if(this.Helper.Treasury_Code !="5000")
         {
           this.PdAoountReportFrom.controls['TreasuryControl'].disable();
         }
       }
     })
     this.loader.setLoading(false);

    }

    _filterTreas(value: string, data: any) {
      return data.filter((option: any) => {
        return option.TreasuryName.toLowerCase().includes(value.toLowerCase())
      });
    }

    displayTreasFn(selectedoption: any) {
      console.log("display_fun_call aaa", selectedoption.TreasuryName);
      return selectedoption ? selectedoption.TreasuryName : undefined;
    }

    ResetPage(){
      window.location.reload();

    }

    announceSortChange(sortState: Sort) {
      if (sortState.direction) {
        this._liveAnnouncer.announce('Sorted ${sortState.direction}ending');
      } else {
        this._liveAnnouncer.announce('Sorting cleared');
      }
    }

       // TO Load Data Searching..............
       applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
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
      let tableData = this.pdaccountstatus.data.map((value1:any,index: number) => {
      
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
      doc.save("pfmsbilltopaymangerdata.pdf");
      this.loader.setLoading(false);
    }, 500);
   
  }

  // // // export to excel
  // exportexcel(): void {
  //   let user = document.getElementById('test')
  //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(user);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new()
  //   XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
  //   XLSX.writeFile(wb, this.filename);
  // }
    /// complete excel data
exportexcel(json: any[], excelFileName: string): void {
  var Heading: any = [
    [' Sr No.',' PFMS Ref No.','File Status','status','transactionDate','balances (In Crores)']
  ];
  let arr:any[]=[]
  json.forEach((item:any,index:any)=>{
    let a={
      " Sr No.":index+1,
      "PFMS Ref No.":item.cde_ref_no,
      "File Status":item.fileStatus,
      " status":item.status,
       "transactionDate":item.transactionDate,
      "balances (In Crores)":item.requestBody,
        }
arr.push(a)
//console.log("a__",a)
  })
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(arr);
  XLSX.utils.sheet_add_aoa(worksheet, Heading)
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
