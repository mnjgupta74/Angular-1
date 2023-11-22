import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
//import { ApiMethods } from 'src/app/shared/Service/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loaderservice';
import { SnackbarService } from 'src/app/utils/snackbar.service';
//import { IGetOnlineBillList } from '../Interface/Master';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Helper } from 'src/app/utils/Helper';
import { IGetOnlineBillList } from 'src/app/utils/Master';
import { log } from 'console';
import { ViewDocumentComponent } from '../view-document/view-document.component';
import { MatDialog } from '@angular/material/dialog';



export interface OBList {
  BillTypeName: string;
  TokenNo: number;
  RefNo: number;
  DDOCode: number;
  DdoName: string;
  MajorHead: number;
  PayManager_RefNo: number;
  GrossAmt: number;
  CashAmt: number;
}

@Component({
  selector: 'app-online-bill-list',
  templateUrl: './online-bill-list.component.html',
  styleUrls: ['./online-bill-list.component.scss']
})

export class OnlineBillListComponent implements OnInit {
  OBListdata: MatTableDataSource<OBList> = new MatTableDataSource();
  displayedColumns = [
    'SrNo',
    'TokenNo',
    'PayManager_RefNo',
    'DDOCode',
    'BillType',
    // 'BillTypeName',
    // 'RefNo',
    // 'DdoName',
    'MajorHead',
    'GrossAmt',
    'CashAmt',
    'Action',
  ];

  // Form Module
  OnlineBillListForm: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) Sort!: MatSort;

  loading: any;

  Payment_radio: boolean = true
  Receipt_radio: boolean = false


  //LIst array
  OnLineBillListarr: any[] = []
  radioButtonvalue: any;
  //showTab_Table: boolean = false

  GetOnlineBillListModal: IGetOnlineBillList = {
    treasurycode: this.TCode.Treasury_Code.toString().trim(),
    finyear: this.finyear_.year.toString(),
    userid: sessionStorage.getItem('rajkoshId'),
    type: "P"
  }


  constructor(private router: Router, private ApiMethods: ApiMethods, public loader: LoaderService, private ApiService: ApiService, private _liveAnnouncer: LiveAnnouncer, private finyear_: Helper, private toyear_: Helper, private TCode: Helper, private UId: Helper, private snackbar: SnackbarService, public dialog: MatDialog) {
    history.pushState(null, '', location.href);
    this.GetBillList();
    window.onpopstate = function () {
      history.go(1);
    };
  }


  ngOnInit() {
    console.log('Test Online BillList');
  }




  radioButtonGroupChange(event: any) {
    // console.log("XXXXXXXXXXXXXXX_mat_radioVal", event.value);
    if (event.value == 1) {
      this.radioButtonvalue = "P"
    }
    else {
      this.radioButtonvalue = "R"
    }
    this.GetOnlineBillListModal.type = this.radioButtonvalue;
    //console.log("radioButtonvalue_Result",this.GetOnlineBillListModal.type);
  }


  GetBillList() {

    this.loader.setLoading(true);
    console.log("Before_Calling_API_OnlineBillList_Result_XXXXXX_ZZZZZ", this.GetOnlineBillListModal);

    //api call of Online Bill List
    //let url=this.ApiService.OnlineBillList + this.GetOnlineBillListModal.treasurycode+"/"+this.GetOnlineBillListModal.finyear+"/"+this.GetOnlineBillListModal.userid+"/"+this.GetOnlineBillListModal.type;
    //this.ApiMethods.getservice(url).subscribe(resp => {
    this.ApiMethods.getservice(this.ApiService.OnlineBillList + this.GetOnlineBillListModal.treasurycode + '/' + this.GetOnlineBillListModal.finyear + '/' + this.GetOnlineBillListModal.userid + '/' + this.GetOnlineBillListModal.type).subscribe((resp:any) => {


      console.log("After_Calling_API_OnlineBillList_Result", resp);

     if (resp.result.length > 0) 
      {
        console.log("OnlineBillList__", resp.result);
        // this.OnLineBillListarr = resp.result

        //this.OBListdata = resp.result

        this.OBListdata.data = resp.result;
        this.OBListdata.paginator = this.paginator;
        this.OBListdata.sort = this.Sort;

        //this.showTab_Table = true;


        //this.showtrantab = true
        this.loader.setLoading(false);
        document.getElementById("myelem")?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      else {
        // this.toastrService.info('No Bill List Found !', 'Info!');
        // this.snackbar.show('No Bill List Found !', 'alert')
        this.loader.setLoading(false);
      }
    },
      (res:any) => {
        console.log("errror message___", res.status);

        if (res.status != 200) {
          this.loader.setLoading(false);
          // this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert !');
          this.snackbar.show('Something Went Wrong! Please Try Again !', 'danger')

        }

      }
    );

  }

  GoToOnlineBillEntry(param: any) {
    console.log("check___", param);
    if (param.PayManager_RefNo == 0) {
      this.router.navigate(['BillEntryOffline'], { queryParams: { billToken: param.TokenNo, billRef: param.PayManager_RefNo } });
    }
    else {
      this.router.navigate(['BillEntry'], { queryParams: { billToken: param.TokenNo, billRef: param.PayManager_RefNo } });
    }
  }


  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce('Sorted ${sortState.direction}ending');
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  applyFilter(filterValue: string) {
    this.OBListdata.filter = filterValue.trim().toLowerCase();
    if (this.OBListdata.paginator) {
      this.OBListdata.paginator.firstPage();
    }
  }


  viewDocumentPopup(element: any) {
    //this.loader.setLoading(true);
    this.showmodal(element.PayManager_RefNo);

  }



  showmodal(PayManager_RefNo: any) {
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
    dialogRef.componentInstance.getBase64ImgDocumentId(PayManager_RefNo);

    // Back From Objection Dialogbox and refresh TreasuryOfficer List page-----------------------begiN-------
    // dialogRef.afterClosed().subscribe(res => {
    //   if (res === 1) {
    //    // this.GetTreasOfficeList();
    //   }
    // })
    // --------------------------------------------------------------------------------------------enD-------
  }



}
