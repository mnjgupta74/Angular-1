
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
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
import { PFMSDNFile, PFMSLOG } from '../Interface';
import { ViewDocumentComponent } from 'src/app/bill-process/view-document/view-document.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-pfms-dn-file-report',
  templateUrl: './pfms-dn-file-report.component.html',
  styleUrls: ['./pfms-dn-file-report.component.scss']
})
export class PfmsDnFileReportComponent implements OnInit {
  panelOpenState: boolean = false;


  //nested Table

  @ViewChild('outerSort', { static: true })
  sort!: MatSort;
  @ViewChildren('innerSort')
  innerSort!: QueryList<MatSort>;
  @ViewChildren('innerTables')
  innerTables!: QueryList<MatTable<Address>>;
  //data: User[] = USERS;

  USERS: User[] = [];

  pfmsdnFileDetailsData:any;
  pfmsdnFileDetailsDataFilter:any;

  dataSource!: MatTableDataSource<User>;
  usersData: User[] = [];
  columnsToDisplay=['SrNo','FILE_NAME', 'SLSSCHCD', 'CSSSCHCD','SANCTIONNO','SANCTIONDATE','MOTHERSANCTIONNO','MOTHERSANCTIONDATE','CTRLSUM'];


  innerDisplayedColumns = ['SrNo1','REFNO', 'BENFILENAME', 'ENDTOENDID','TOTALAMT','AMOUNTCENTERSHARE','FILERCVDDATE','STATUS'];
  innerInnerDisplayedColumns = ['CDE_REFNO','GROSSAMT'];
  expandedElement!: User | null;
  expandedElements: any[] = [];
  //end

  @ViewChild('LIST', { static: false }) el!: ElementRef;
  filename = "PfmsDnFileReport.xlsx";
  exportcompletedata:any[]=[]
  //sort: MatSort | null;
  // @ViewChild(MatSort) set matSort(sort: MatSort) {
  //   this.Getpfmsdnfiledata.sort = sort;
  // }
  @ViewChild(MatPaginator) set MatPaginator(paginator: MatPaginator) {
    this.pfmsdnFileDetailsData.paginator = paginator;
  }

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.pfmsdnFileDetailsData.sort = sort;
    // this.tokendeleteARR.sort = sort;
  }

  // @ViewChild(MatSort) set matSort(sort: MatSort) {
  //   this.USERS.sort = sort;
  // }

  PfmsDNFileReportform: any;
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []
  finYr: any;
  base64data: any;
  Getpfmsdnfiledata: MatTableDataSource<any> = new MatTableDataSource();
  showpfmstrackTable: boolean = false;
  showpfmstrackNestedTable: boolean = false;

  getpfmsdnfilemodel: PFMSDNFile = {
    fromDate: "",
    toDate: "",
  }
  mat_radio_1: boolean = true
  mat_radio_2: boolean = false

  displayedColumns = ["ENDTOENDID","TOKENNO","FILERCVDDATE", "NETAMT","BENFILENAME","FILE_NAME","AMOUNTCENTERSHARE","SLSSCHCD","CSSSCHCD","SANCTIONDATE","STATUS","VOUCHERDATE","SANCTIONNO","REFNO","VOUCHERNO","TOTALAMT","MOTHERSANCTIONNO","MOTHERSANCTIONDATE","GROSSAMT","CDE_REFNO","CTRLSUM"];



  constructor(private cd: ChangeDetectorRef,private sanitizer: DomSanitizer, private ApiMethods: ApiMethods, private _formBuilder: FormBuilder, public loader: LoaderService,
    private ApiService: ApiService, private _liveAnnouncer: LiveAnnouncer, private finyear_: Helper, private toyear_: Helper, private TCode: Helper,
    private UId: Helper, private datePipe: DatePipe, public dialog: MatDialog, private snackbar: SnackbarService) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
    };
  }

  ngOnInit(): void {

    //nested Table

    //this.pfmsdnFileDetails();

    this.USERS.forEach(user => {
      if (
        user.addresses &&
        Array.isArray(user.addresses) &&
        user.addresses.length
      ) {
        this.usersData = [
          ...this.usersData,
          { ...user, addresses: new MatTableDataSource(user.addresses) }
        ];
      } else {
        this.usersData = [...this.usersData, user];
      }
    });
    this.dataSource = new MatTableDataSource(this.usersData);
    console.log("dataSource==>>",this.dataSource);
    this.dataSource.sort = this.sort;

    //End


    this.getTreasuryList();
    this.finYr = this.finyear_.forwardYear.toString();
    this.PfmsDNFileReportform = new FormGroup({
      finyear: new FormControl({ value: this.finYr, disabled: true }),
      treasuryval: new FormControl({ value: '', disabled: true }, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
    //  toDate: new FormControl({ value: '', disabled: false }, [Val.Required, Val.maxLength(12)]),
      toDate: new FormControl({ value: '', disabled: false }, []),
      fromDate: new FormControl({ value:'', disabled: false }, []),
      cde_refNo: new FormControl({ value: '0', disabled: false }),
      selectTypes: new FormControl({ value: '1', disabled: false }),
      referenceNo: new FormControl({ value: '0', disabled: false }),
    })

    this.radioButtonGroupChange();
  }
  getTreasuryList() {
    this.loader.setLoading(true);
    this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe((resp: any) => {
      console.log("Auditor__res", resp);
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.TreasuryListarr = resp.result
        //console.log("Show_Treasury_AuditorList", this.TreasuryListarr);
        this.Treasuryoptions = this.PfmsDNFileReportform.controls['treasuryval'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            return typeof value === 'string' ? value : value.treasuryCode
          }),
          map((treasury: any) => {

            return treasury ? this._filtertreasury(treasury, data) : data.slice()
          })
        );
        const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.TCode.Treasury_Code)[0];
        this.PfmsDNFileReportform.patchValue({
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
   // this.showmodal(element.CDE_REFNO);

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

  onShow() {
    this.Getpfmsdnfiledata.filter ="";
    let Date1 = this.PfmsDNFileReportform.controls['fromDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');
    let Date2 = this.PfmsDNFileReportform.controls['toDate'].value;
    let tDate = new DatePipe('en-US').transform(Date2, 'yyyy-MM-dd');

   // console.log("a", this.PfmsDNFileReportform.controls['rblTypeCtrl'].value)
    console.log("b", fDate)
    console.log("c", tDate)

    const formData ={
      "fromDate": fDate!,
      "toDate": tDate!,

  }


      if (Date1 === "" || Date2 === "" || Date1 === null || Date2 === null) {
        console.log("f", fDate)
        this.snackbar.show('Please Enter Date', 'alert')
        return;
      }
      else {
        console.log("fff", fDate)
        this.getpfmsdnfilemodel.fromDate = fDate!;
        this.getpfmsdnfilemodel.toDate = tDate!;



      }


    this.loader.setLoading(true);
    console.log("Before_Calling_API_iipfmsbilltopaymangermodel_Result", this.PfmsDNFileReportform);

    //api call of pfmsdnfilereport
    this.ApiMethods.postresultservice(this.ApiService.PFMSDNFile, formData).subscribe((resp: any) => {
      console.log("After_Calling_API_ipfmsbilltopaymangermodel_Result", resp);
      if (resp.result.length > 0) {
        let arr = resp.result;
        let final: any = []
        arr.forEach((element: any) => {
          let str = JSON.stringify(element.payloadData,)
          let obj: any = {
            ...element,
            "payloadData": str
            // ...element.payloadData.data
          }
          final.push(obj)
        });
        console.log("finaldata_", final);
        this.Getpfmsdnfiledata.data = final;
        this.exportcompletedata= resp.result;
        this.showpfmstrackTable = true;
        this.loader.setLoading(false);
        this.PfmsDNFileReportform.disable();
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


  pfmsdnFileDetails() {
    this.pfmsdnFileDetailsData=[];
    this.USERS =[];
    let Date1 = this.PfmsDNFileReportform.controls['fromDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');
    let Date2 = this.PfmsDNFileReportform.controls['toDate'].value;
    let tDate = new DatePipe('en-US').transform(Date2, 'yyyy-MM-dd');
    let cde_refNo = this.PfmsDNFileReportform.controls['cde_refNo'].value;
    let selectTypes = this.PfmsDNFileReportform.controls['selectTypes'].value;
    let referenceNo = this.PfmsDNFileReportform.controls['referenceNo'].value;

    const formData ={
    "fromDate": fDate,
    "toDate": tDate,
    "cde_refNo": cde_refNo,
    "type": selectTypes,
    "referenceNo": referenceNo,
    //"fileName":'DNV6CSSP007658101005202311080002001',

  }

  this.ApiMethods.postresultservice(this.ApiService.pfmsdnFileDetails, formData).subscribe((resp: any) => {
    this.pfmsdnFileDetailsData=[];
    if (resp.result.length > 0) {
      this.pfmsdnFileDetailsData=resp.result;
      this.pfmsdnFileDetailsDataFilter=resp.result;
      this.showpfmstrackNestedTable = true;
      console.log('pfmsdnFileDetailsData',this.pfmsdnFileDetailsData);

      this.exportcompletedata= resp.result;

      let arr = resp.result;
        let final: any = []
        arr.forEach((element: any) => {
          let str = JSON.stringify(element.payloadData,)
          let obj: any = {
            ...element,
            "payloadData": str
            // ...element.payloadData.data
          }
          final.push(obj)
        });
        console.log("finaldata_", final);
        this.Getpfmsdnfiledata.data = final;

      this.featchDataGroup()

    }else{
      this.snackbar.show('No Data Found !', 'alert');
    }

  },
  (res: any) => {
    console.log("errror message___", res.status);
    if (res.status != 200) {
      this.showpfmstrackNestedTable = false;
      this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger')
      this.loader.setLoading(false);
    }
  }
  );

}


featchDataGroup(){
  this.USERS =[]
      let pfmsUser:any = [];
      let pfmsUserArr:any=[];
      let pfmsAddress:any[] = [];
      let pfmsCommit:any[] = [];
      let pfmsUserREFNO:any = {};
      let pfmsUserCDE_REFNO:any = {};

      this.pfmsdnFileDetailsData.forEach((element:any) => {
        if (!pfmsUser[element.FILE_NAME]) {
          pfmsUser[element.FILE_NAME] = [element];
          pfmsUserArr.push(element)
        }

        if (!pfmsAddress[element.FILE_NAME]) {
          pfmsAddress[element.FILE_NAME] = [element];
        } else {
          pfmsAddress[element.FILE_NAME].push(element)

        }



        if (!pfmsCommit[element.CDE_REFNO]) {
          pfmsCommit[element.CDE_REFNO] = [element];
        } else {
          pfmsCommit[element.CDE_REFNO].push(element)

        }



        ///////////////////
        if(!pfmsUserREFNO[element.FILE_NAME]){
          pfmsUserREFNO[element.FILE_NAME] = []
        }

          if(!pfmsUserREFNO[element.FILE_NAME].includes(element.REFNO)){
            pfmsUserREFNO[element.FILE_NAME].push(element.REFNO)
          }


          if(!pfmsUserCDE_REFNO[element.REFNO]){
            pfmsUserCDE_REFNO[element.REFNO] = []
          }


          if(!pfmsUserCDE_REFNO[element.REFNO].includes(element.CDE_REFNO)){
            pfmsUserCDE_REFNO[element.REFNO].push(element.CDE_REFNO)
          }



      });



      pfmsUserArr.forEach((el:any) => {
        let masterEl = {...el};
        let masterEl2 = {...el};
        let addresses:any = [];
        pfmsUserREFNO[el.FILE_NAME].forEach((el2:any) => {
          el['REFNO'] = el2;
          let comments:any = [];
          pfmsUserCDE_REFNO[el2].forEach((el3:any) => {
            el['CDE_REFNO'] = el3;

            masterEl = {...el}
            delete masterEl["comments"];
            delete masterEl["addresses"];
            comments.push(masterEl);
          })
          el["comments"] = comments;


          masterEl2 = {...el}
          // delete masterEl2["comments"];
          delete masterEl2["addresses"];
          addresses.push(masterEl2);
        });
        el["addresses"] = addresses;
      });

      this.USERS = [...pfmsUserArr];

      console.log('pfmsUserArr=>>>', pfmsUserArr);
      console.log('pfmsUserREFNO', pfmsUserREFNO);
      console.log('pfmsUserCDE_REFNO', pfmsUserCDE_REFNO);
      console.log("USERS==>",this.USERS)
}




  onReset() {
    window.location.reload()
   // this.PfmsDNFileReportform.reload();
  }

  applyFilternew(filterValue: string) {
    let pfmsUserArr:any = [];
    this.USERS=[];
    let filterValueTrim=filterValue.trim();
    if(filterValueTrim.length>0){
      this.pfmsdnFileDetailsData.forEach((el:any) => {
        if(el.FILE_NAME.trim().toLowerCase().includes(filterValue.trim().toLowerCase())){
          pfmsUserArr.push(el);
        }
      });
      this.pfmsdnFileDetailsData=pfmsUserArr;
    }else{
      this.pfmsdnFileDetailsData=this.pfmsdnFileDetailsDataFilter;
    }
    this.featchDataGroup();
  }

  announceSortChange(sortState: Sort) {
      if (sortState.direction) {
        this._liveAnnouncer.announce('Sorted ${sortState.direction}ending');
      } else {
        this._liveAnnouncer.announce('Sorting cleared');
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
      let tableData = this.Getpfmsdnfiledata.data.map((value1:any,index) => {

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
      doc.save("PfmsDnFileReport.pdf");
      this.loader.setLoading(false);
    }, 500);

  }

  // nested Table



  applyFilter(filterValue: string) {
    this.innerTables.forEach(
      (table, index) =>
        ((table.dataSource as MatTableDataSource<
          Address
        >).filter = filterValue.trim().toLowerCase())
    );
  }

  toggleRow(element: User) {
    element.addresses &&
    (element.addresses as MatTableDataSource<Address>).data.length
      ? this.toggleElement(element)
      : null;
    this.cd.detectChanges();
    this.innerTables.forEach(
      (table, index) =>
        ((table.dataSource as MatTableDataSource<
          Address
        >).sort = this.innerSort.toArray()[index])
    );
  }

  isExpanded(row: User): string {
    const index = this.expandedElements.findIndex(x => x.FILE_NAME == row.FILE_NAME);
    if (index !== -1) {
      return 'expanded';
    }
    return 'collapsed';
  }

  toggleElement(row: User) {
    const index = this.expandedElements.findIndex(x => x.FILE_NAME == row.FILE_NAME);
    if (index === -1) {
      this.expandedElements.push(row);
    } else {
      this.expandedElements.splice(index, 1);
    }

    //console.log(this.expandedElements);
  }
  //End

  radioButtonGroupChange(){
    this.showpfmstrackNestedTable=false;
    this.USERS=[];
    if(this.PfmsDNFileReportform.controls.selectTypes.value=='1'){
      this.PfmsDNFileReportform.get('fromDate').setValidators([
        Validators.required,
      ]);
      this.PfmsDNFileReportform.patchValue({ fromDate: new Date});
      this.PfmsDNFileReportform.get('fromDate').updateValueAndValidity();


      this.PfmsDNFileReportform.get('toDate').setValidators([
        Validators.required,
      ]);
      this.PfmsDNFileReportform.patchValue({ toDate: new Date});
      this.PfmsDNFileReportform.get('toDate').updateValueAndValidity();

    }else{

      this.PfmsDNFileReportform.get('fromDate').removeValidators([
        Validators.required,
      ]);
      this.PfmsDNFileReportform.patchValue({ fromDate: ''});
      this.PfmsDNFileReportform.get('fromDate').updateValueAndValidity();


      this.PfmsDNFileReportform.get('toDate').removeValidators([
        Validators.required,
      ]);
      this.PfmsDNFileReportform.patchValue({ toDate: ''});
      this.PfmsDNFileReportform.get('toDate').updateValueAndValidity();


      // let selectTypes=this.PfmsDNFileReportform.getRawValue().selectTypes;
      // if(selectTypes==1){

      //   let displayData:any[]=['SrNo','FILE_NAME', 'SLSSCHCD', 'CSSSCHCD','SANCTIONNO','SANCTIONDATE','MOTHERSANCTIONNO','MOTHERSANCTIONDATE','CTRLSUM'];


      //   this.columnsToDisplay=displayData;


      // }else{
      //   this.columnsToDisplay = ['SrNo','FILE_NAME', 'SLSSCHCD', 'CSSSCHCD','SANCTIONNO','SANCTIONDATE','MOTHERSANCTIONNO','MOTHERSANCTIONDATE','CTRLSUM'];

      // }


    }




  }

  onChangeValidation(){

    this.PfmsDNFileReportform.get('fromDate').setValidators([
      Validators.required,
    ]);
    this.PfmsDNFileReportform.get('fromDate').updateValueAndValidity();

    this.PfmsDNFileReportform.get('toDate').setValidators([
      Validators.required,
    ]);
    this.PfmsDNFileReportform.get('toDate').updateValueAndValidity();

  }





}

export interface User {
  FILE_NAME: string;
  SLSSCHCD: string;
  CSSSCHCD: string;
  SANCTIONNO: string;
  SANCTIONDATE: string;
  MOTHERSANCTIONNO: string;
  MOTHERSANCTIONDATE: string;
  CTRLSUM: string;
  addresses?: Address[] | MatTableDataSource<Address>;
}

export interface Comment{
  CDE_REFNO: string;
  GROSSAMT: string;

}


export interface Address {
  REFNO: string;
  BENFILENAME: string;
  ENDTOENDID: string;
  TOTALAMT: string;
  AMOUNTCENTERSHARE: string;
  FILERCVDDATE: string;
  STATUS: string;
  comments?: Comment[] | MatTableDataSource<Comment>;
}






