import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { LoaderService } from 'src/app/services/loaderservice';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { Helper } from 'src/app/utils/Helper';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { ApiService } from 'src/app/utils/utility.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-transction-detail-by-token-no',
  templateUrl: './transction-detail-by-token-no.component.html',
  styleUrls: ['./transction-detail-by-token-no.component.scss']
})
export class TransctionDetailByTokenNoComponent implements OnInit {
  @ViewChild('test', { static: false }) el!: ElementRef;
  filename = "TransctionDetailByToken.xlsx";
  exportcompletedata:any[]=[]
  TransctionDetailByTokenNoFrom:any;
  Gettransactionnotoken:any;
  dataSource:any;
  userTypeListOptions: Observable<any[]> | undefined;
  displayedColumns:any[]=['SrNo','TokenNo','VoucherNo','VoucherDate','BudgetHead','DDOCode','CashAmount','GrossAmount'];
  currentDate:any;
  constructor(private _liveAnnouncer: LiveAnnouncer,private router: Router, private apiMethod: ApiMethods, public loader: LoaderService, private apiService: ApiService, private snackbar: SnackbarService, private renderer: Renderer2,private Helper:Helper) {

  }

  ngOnInit(): void {
    const date= this.currentDate  = new Date();
    date.setDate(date.getDate() - 0);
    this.TransctionDetailByTokenNoFrom = new FormGroup({
      fromDate: new FormControl({ value: date, disabled: false }, [Validators.required]),
      toDate: new FormControl({ value: date, disabled: false }, [Validators.required]),
      statusType: new FormControl({ value: '', disabled: false }, [Validators.required]),
      auditor: new FormControl({ value: '', disabled: false }, [Validators.required]),


    });

    this.featchAuditor();
  }


  featchAuditor() {
    this.loader.setLoading(true);
    this.apiMethod.getservice(this.apiService.GetMappingUserList + this.Helper.Treasury_Code + '/' + 5).subscribe((resp:any) => {
          console.log('response', resp);
          if (resp.result && resp.result.length > 0) {
            this.loader.setLoading(false);
            let data = resp.result;
            this.userTypeListOptions = this.TransctionDetailByTokenNoFrom.controls[
              'auditor'
            ].valueChanges.pipe(
              startWith(''),
              map((value: any) => {
                console.log('firstmap__', value);
                return typeof value === 'string' ? value : value.data;
              }),
              map((EmployeeId: any) => {
                return EmployeeId
                  ? this._filterMajor(EmployeeId, data)
                  : data.slice();
              })
            );
          } else {
            this.loader.setLoading(false);

          }
        },
        (res:any) => {
          console.log('errror message___', res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
            this.snackbar.show('Something Went Wrong ! Please Try Again','danger');

          }
        }
      );
  }


  _filterMajor(value: string, data: any) {
    return data.filter((option: any) => {
      return option.EmployeeId.toLowerCase().includes(value.toLowerCase());
    });
  }


  displayUserList(data: any) {
    console.log('displayfuncall');
    return data ? data.EmployeeId : undefined;
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

    transctionDetailByTokenNoSubmit(){

    }

  //   // // export to excel
  // exportexcel(): void {
  //   let user = document.getElementById('test')
  //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(user);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new()
  //   XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
  //   XLSX.writeFile(wb, this.filename);
  // }

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
      let tableData = this.Gettransactionnotoken.data.map((value1:any,index: number) => {
      
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
