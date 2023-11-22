import { Component, OnInit, ElementRef, ViewChild, } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import { Router } from '@angular/router';
import { LoaderService } from '../../services/loaderservice';
// import { IGetAccountOfficerForwardList, IGetAccountOfficerForwardListUpdate, IGetAccountOfficerList, IGetAccountOfficerRevertList, IgetVoucherModelData } from '../Interface/Master';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';

import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';

import * as Val from '../../../app/utils/Validators/ValBarrel'
import { ObjectiondialogComponent } from '../objection-dialog/objection-dialog.component';
import { Helper } from 'src/app/utils/Helper';
import { IGetAccountOfficerForwardList, IGetAccountOfficerForwardListUpdate, IGetAccountOfficerList, IGetAccountOfficerRevertList, IPFMS, IgetVoucherModelData } from 'src/app/utils/Master';
import { Console, log } from 'console';
import { ViewDocumentComponent } from '../view-document/view-document.component';
import { formatDate } from '@angular/common';

export interface SchemaOffList {
  schemeCode: number;
  cashAmount: number;
  grossAmount: number;
  budgetHead: number;
  cdeRefNo: number;
}




@Component({
  selector: 'app-digital-sign',
  templateUrl: './digital-sign.component.html',
  styleUrls: ['./digital-sign.component.scss']
})
export class DigitalSignComponent implements OnInit {
  BillType: number = 0;

  SchemaCodeListData: MatTableDataSource<SchemaOffList> = new MatTableDataSource();
  displayedColumns = [
    'SrNo',
    'cdeRefNo',
    'tokenno',
    'budgetHead',
    'grossAmount',

    'cashAmount',

    // 'ViewDocs',
    'Chk_Pass',
    // 'Chk_Revert',
  ];

  checked: any;
  Ischecked: boolean = false;
  IscheckedRevert: boolean = false;
  isObjBtnDisabled: boolean = false; // Set this variable to true or false based on your condition

  // Form Module
  AccountOfficeForm: any;
  SelectAuditor: any = ''
  chk_ForwardList: any = []
  Check_All: any = []

  Forwardstatus: any;
  Auditoroptions: Observable<any[]> | undefined;
  chk_RevertList: any = []
  Revertstatus: any;
  AuditorListarr: any = []
  financialYr: any;
  finYr: any;


  isChkDisabled: boolean[] = []
  isButtonDisabled: boolean[] = []
  IscheckedRevertArray: boolean[] = []
  IscheckedArray: boolean[] = []


 
  @ViewChild(MatPaginator) set MatPaginator(paginator: MatPaginator) {
    this.SchemaCodeListData.paginator = paginator;
  }

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.SchemaCodeListData.sort = sort;
  }

  loading: any;


  showTab_BtnForward: boolean = false


  ChooseOption: any = '';
  SchemaCodeoptions: Observable<any[]> | undefined;
  SchemaCodeListarr: any[] = []



  GetIPFMS: IPFMS = {
    asignmentId: 0,
    userid: this.UId.UserId,
    ipAddress: "172.22.32.105",
    cde_refNo: 0,
    schemecode: 0,
  }


  // dialog: any;
  selectedOption: any;
IP:any;
  //isViewDocs: any ;




  page: any = {
    pageIndex: 0,
    pageSize: 5
  };


  constructor(private router: Router, private ApiMethods: ApiMethods, private snackbar: SnackbarService, public loader: LoaderService, private ApiService: ApiService, private _liveAnnouncer: LiveAnnouncer, public dialog: MatDialog, private finyear_: Helper, private toyear_: Helper, private TCode: Helper, private UId: Helper, private asgnId: Helper, private IPAdd: Helper) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);

    };
    this.getSchemaCode_List();
    this.IP= this.ApiMethods.clientIP;

  }


  ngOnInit() {
    console.log('Test Account Officer List');
    this.financialYr = this.finyear_.year.toString().substring(2, 4) + this.toyear_.finyear.toString().substring(2, 4);
    this.GetIPFMS.asignmentId = this.asgnId.assignmentId;

    console.log("assignmentId", this.asgnId);

    console.log("GetIPFMS", this.GetIPFMS);
    this.AccountOfficeForm = new FormGroup({
      fromDate: new FormControl({ value: new Date(), disabled: false }, [Validators.required, Validators.maxLength(12)]),
      toDate: new FormControl({ value: new Date(), disabled: false }, [Validators.required, Validators.maxLength(12)]),
      SchemaCodeControl: new FormControl({ value: '' }, [Validators.required]),
    });

  }


  // Call Schema Code_List List API >>>------------------->
  getSchemaCode_List() {
    this.loader.setLoading(true);
    //this.ApiMethods.getservice(this.ApiService.autoProcessStatus + this.GetAutoProcessStatusModal.treasuryCode + "/" + this.GetAutoProcessStatusModal.tblName).subscribe(resp => {
    this.ApiMethods.getservice(this.ApiService.SchemaCode).subscribe((resp: any) => {

      console.log("Auditor__res", resp);
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.SchemaCodeListarr = resp.result
        //console.log("Show_Treasury_AuditorList", this.SchemaCodeListarr);
        this.SchemaCodeoptions = this.AccountOfficeForm.controls['SchemaCodeControl'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            return typeof value === 'string' ? value : value.schemeCode
          }),
          map((schemeCode: any) => {

            return schemeCode ? this._filterSchemcode(schemeCode, resp.result) : resp.result.slice()
          })
        );

      }
    })
    this.loader.setLoading(false);

  }

  _filterSchemcode(value: string, data: any) {
    return data.filter((option: any) => {
      return option.schemeCode.toLowerCase().includes(value.toLowerCase())
    });
  }

  displayTreasFn(selectedoption: any) {
    console.log("display_funschemeCode", selectedoption.schemeCode);
    return selectedoption ? selectedoption.schemeCode : undefined;
  }

  viewDocumentPopup(element: any) {
    //this.loader.setLoading(true);
    this.showmodal(element.cdeRefNo);
  }

  showmodal(cdeRefNo: any) {
    const dialogRef = this.dialog.open(ViewDocumentComponent,
      {
        // width: '50%',
        // height: '63%',
        width: '1000px',
        height: '800px',
        disableClose: true
       
      }

    );
    dialogRef.componentInstance.getBase64ImgDocumentId(cdeRefNo);
  }

  GetPFMSList() {
    this.SchemaCodeListData.data = [];
    this.loader.setLoading(true);
    let Schema_ctrl = this.AccountOfficeForm.controls['SchemaCodeControl'].value
    let FrmDate = this.AccountOfficeForm.controls['fromDate'].value
    let ToDate = this.AccountOfficeForm.controls['toDate'].value

    var body = {
      "fromDate": formatDate(new Date(FrmDate), 'yyyy-MM-dd', 'en'),
      "toDate": formatDate(new Date(ToDate), 'yyyy-MM-dd', 'en'),
      "schemeCode": Schema_ctrl.schemeCode
    }
    console.log("Body_before", body);

    this.ApiMethods.postresultservice(this.ApiService.Getddosignlist, body).subscribe((resp: any) => {

      console.log("After_Calling_API_SchemaCode_details_Result", resp.result[0].MSG);

      if (resp.result.length > 0 && !resp.result[0].ERR_CODE) {


        console.log("SchemaCode_details_", resp.result);

        this.SchemaCodeListData.data = resp.result;
       

        this.showTab_BtnForward = true;
        // this.disableElementArray(resp.result);
        console.log("chek_kr___", this.SchemaCodeListData.data);
        this.AccountOfficeForm.disable();

        this.loader.setLoading(false);
      }
      else {
        this.loader.setLoading(false);
        //this.snackbar.show(resp.result[0].MSG, 'danger');
        this.SchemaCodeListData.data = [];
      }

    },

      (res: any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger');
          this.showTab_BtnForward = false;
        }
      }

    );

  }

  GetPFMSListReset() {
    window.location.reload();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce('Sorted ${sortState.direction}ending');
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(filterValue: string) {
    this.SchemaCodeListData.filter = filterValue.trim().toLowerCase();

    // if (this.SchemaCodeListData.paginator) {
    //   this.SchemaCodeListData.paginator.firstPage();
    // }
  }

  onChangePage(pe: PageEvent) {
    this.page = pe;
    this.Ischecked = false;
  }

  displayFn(selectedoption: any) {
    console.log("display_fun_call");
    return selectedoption ? selectedoption.EmployeeId : undefined;
  }


  Generate() {

    // chk_ForwardList
    this.chk_ForwardList = [];
    console.log(this.page)
    const dt = [...this.SchemaCodeListData.data];
    //const data = dt.splice(this.page.pageIndex * this.page.pageSize, this.page.pageSize);
    // const finalData = data.filter((x: any) => x.IsChecked === true)
    const finalData = dt.filter((x: any) => x.IsChecked === true)
    console.log("asdfasdf_____", finalData)
    // For Store Multiple Bill Code
    finalData.forEach(s => {
      console.log("adsfasd_asdffffff", s);
      this.GetIPFMS.cde_refNo = s.cdeRefNo


      this.chk_ForwardList.push({
        "cde_refNo": s.cdeRefNo,
        "ipAddress": "172.22.32.105",
        "userId": this.GetIPFMS.userid,
        "assignmentId": this.GetIPFMS.asignmentId,
        "schemecode": s.schemeCode,
        "budgetHead": s.budgetHead,
      },)
    })

    console.log("chk_ForwardList", this.chk_ForwardList);


    if (this.chk_ForwardList.length > 0)   // For ForWard Process
    {

      this.loader.setLoading(true);
      this.ApiMethods.postresultservice(this.ApiService.SchemaSave, this.chk_ForwardList).subscribe((resp: any) => {
        // this.Forwardstatus = resp.result;
        console.log("adsfasdf_____________", resp.result);

        if (resp.result) {
          this.snackbar.show(resp.result.MSG, 'success')
          this.loader.setLoading(false);
          this.GetPFMSList();
        }

      },
        (res: any) => {
          console.log("errror message___", res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
            // this.snackbar.show('Something Went Wrong! Please Try Again', 'Alert !');
            this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger')
          }
        }
      );
    }
    else {
      this.snackbar.show('Please Check Any One Record  !', 'alert');
    }



  }

  GenerateAll() {
    // Genrate ALL APi call

    this.Check_All = [];
    this.SchemaCodeListData.data.forEach(s => {
      console.log("Genarl_akkk", s);
      this.GetIPFMS.cde_refNo = s.cdeRefNo


      this.chk_ForwardList.push({
        "cde_refNo": s.cdeRefNo,
        "ipAddress": "172.22.32.105",
        "userId": this.GetIPFMS.userid,
        "assignmentId": this.GetIPFMS.asignmentId,
        "schemecode": s.schemeCode,
        "budgetHead": s.budgetHead,
      },)
    })

    console.log("Check_All", this.Check_All);


    if (this.Check_All.length > 0)   // For Genrate All Process
    {

      this.loader.setLoading(true);
      this.ApiMethods.postresultservice(this.ApiService.SchemaSave, this.Check_All).subscribe((resp: any) => {
        // this.Forwardstatus = resp.result;
        console.log("Check_ALL(((__", resp.result);

        if (resp.result) {
          this.snackbar.show(resp.result.MSG, 'success')
          this.loader.setLoading(false);
          this.GetPFMSList();
        }

      },
        (res: any) => {
          console.log("errror message___", res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
            this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger')
          }
        }
      );
    }



  }

  get TokenNum() { return this.AccountOfficeForm.get('TokenNum') }
  get AuditorControl() { return this.AccountOfficeForm.get('AuditorControl') }
}


