import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { of, Observable } from "rxjs";
import { formatDate } from '@angular/common';
import * as moment from 'moment';
import { map, startWith } from 'rxjs/operators';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { LoaderService } from 'src/app/services/loaderservice';
import { ApiService } from 'src/app/utils/utility.service';
import { GetBillVoucher, IBudgetAmountCheck, IGetObjectionDataList, ISaveBillEntry, ISaveObjection } from 'src/app/utils/Master';
import { Helper } from 'src/app/utils/Helper';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { MatDialog, } from '@angular/material/dialog';
import * as Val from '../../utils/Validators/ValBarrel'
export interface BillTypeMaster {
  TokenNum: number;
  BillRef: number;
}
@Component({
  selector: 'app-challan-entry',
  templateUrl: './challan-entry.component.html',
  styleUrls: ['./challan-entry.component.scss']
})
export class ChallanEntryComponent implements OnInit {
  IsOpen: boolean = true;
  IsObjectionOpen: boolean = false
  IsObjectionBill: any = {
    Objbillcode: '',
    Objbilltype: '',
    userType: 2,
    userId: this.Tcode.UserId,
    pageType: "1",
    routeFrom: 'BillEntry'
  }
  ChooseOption: any = '';

  ChallanEntryForm: any
  DodoNameList: Observable<any[]> | undefined;
  DdoNameListarr: any[] = []
  Ddomaster: MatTableDataSource<BillTypeMaster> = new MatTableDataSource();



  MajorHeadList: Observable<any[]> | undefined;
  MajorHeadListarr: any[] = []

  DivisionList: Observable<any[]> | undefined;
  DivisionListarr: any[] = []

  SelectBilltype: any = ''
  SelectDdoName: any = ''
  SelectMajorHead: any = ''

  SelectDivision: any = ''



  BankList: any[] = []
  BillTypeList: Observable<any[]> | undefined;
  BillTypeListarr: any[] = []

  BillSubTypeList: Observable<any[]> | undefined;
  ObjectHeadList: Observable<any[]> | undefined;
  OfficeNameListarr: Observable<any[]> | undefined;


  bankSelect: any;


  // helpermsg: any = Helper
  maxDate: any = new Date()
  Helper: any;
  // display: Observable<'open' | 'close'>;
  // <-------- radio flag end
  constructor(private router: Router, public _dialog: MatDialog, private routing: ActivatedRoute, private ApiMethods: ApiMethods, public loader: LoaderService, private ApiService: ApiService,
    public Tcode: Helper, private finyear_: Helper, private toyear_: Helper,
    private snackbar: SnackbarService
  ) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
    };
    // this.Billselected = "20";

    this.getBankList()  // Call Bank List
    this.getBillTypeList() //call bill type list
    this.getDdoNameList()  //call ddo name list
    this.getMajorHeadList()  //Call Major Head List
    this.getDivisionList() // call division list
  }


  ngOnInit() {
    //Bill entry form
    this.ChallanEntryForm = new FormGroup({
      TanNo: new FormControl('', [Val.Required, Val.TanFormat]),

      ChallanDate: new FormControl(''),
      Billtype: new FormControl(''),
      Remitter: new FormControl('', [Val.Required, Val.maxLength(50), Val.Alphabet]),
      BudgetHead: new FormControl('', [Val.Required, Val.maxLength(13), Val.Numeric]),
      Division: new FormControl('0', [Val.Required]),
      Amount: new FormControl('', [Val.Required, Val.maxLength(12), Val.Numeric]),
      Commission: new FormControl('', [Val.Required, Val.maxLength(8), Val.Numeric]),
      MajorHead: new FormControl(''),
      bankName: new FormControl(''),
      DDOCode: new FormControl(''),
    })

    this.getOfficeNameList()

  }

  getOfficeNameList() {
    this.ApiMethods.getservice(this.ApiService.officeNameList + '/' + this.Helper.Treasury_Code + '/' + '100').subscribe((resp: any) => {
      console.log("getDdoNameList__res", resp);
      if (resp.result && resp.result.length > 0) {
        this.OfficeNameListarr = resp.result;
        // this.OfficeNameList = this.GrnMinusEntryFormDetails.controls['OfficeName'].valueChanges.pipe(
        //   startWith(''),
        //   map((value: any) => {
        //     // console.log("firstmap__DdoName", value);
        //     return typeof value === 'string' ? value : value.OfficeName
        //   }),
        //   map((OfficeName: any) => {
        //     // console.log("second__map_DdoName", DDO_NAME);
        //     return OfficeName ? this.officeName_filter(OfficeName, resp.result) : resp.result.slice()
        //   })
        // );



        // const ddoNameList = this.OfficeNameListarr.filter((item: any) => item.ddo_code === this.selectedDDOCode)[0];
        // this.GrnMinusEntryFormDetails.patchValue({
        //   DDOCode: ddoNameList

        // });

      }
    })
  }



  // Calling API for Bank List  
  getBankList() {
    console.log("bankList_before", this.BankList);
    this.ApiMethods.getservice(this.ApiService.BankList + '/' + this.Tcode.Treasury_Code + '/' + 3).subscribe((resp: any) => {
      console.log("BankList__res", resp);
      if (resp.result && resp.result.length > 0) {
        this.BankList = resp.result
      }
    })
    console.log("BankList_after", this.BankList);
  }


  // Calling API for Bill Type List
  getBillTypeList() {
    console.log("BillTypeList_before", this.BankList);

    this.ApiMethods.getservice(this.ApiService.BillTypeList + 5).subscribe((resp: any) => {
      console.log("BillTypeList__res", resp);
      if (resp.result && resp.result.length > 0) {
        // this.BillTypeList = resp.result
        this.BillTypeListarr = resp.result

        this.BillTypeList = this.ChallanEntryForm.controls['Billtype'].valueChanges.pipe(
          startWith(''),

          map((value: any) => {
            // console.log("firstmap__", value);
            return typeof value === 'string' ? value : value.BillType
          }),
          map((BillType: any) => {
            // console.log("second__map", BillType);

            return BillType ? this._filter(BillType, resp.result) : resp.result.slice()
          })
        );
      }

    })
    console.log("BillTypeList_after", this.BankList);
  }


  //  Bill type List Select >>>------------------->
  OnBilltypeSelected() {
    this.SelectBilltype = this.ChallanEntryForm.value.Billtype

    console.log("slelction__________option_____Biltypoe", this.SelectBilltype, this.ChallanEntryForm.value.Billtype);



  }


  //  Auditor List filter >>>------------------->
  _filter(value: string, data: any) {
    // console.log("filterval__", value);
    return data.filter((option: any) => {
      console.log("option_val__", option);
      return option.BillType.toLowerCase().includes(value.toLowerCase())
    });
  }



  //  Auditor display Function >>>------------------->
  displayFn(selectedoption: any) {
    // console.log("display_fun_call");
    return selectedoption ? selectedoption.BillType : undefined;
  }




  //<............Ddo Name list get flow start......
  getDdoNameList() {
    this.ApiMethods.getservice(this.ApiService.getDdoNamelist + this.Tcode.Treasury_Code + '/0').subscribe((resp: any) => {
      console.log("ObjectList__res", resp);
      if (resp.result && resp.result.length > 0) {
        // this.DodoNameList = resp.result;
        // console.log("");

        this.DdoNameListarr = resp.result;

        this.DodoNameList = this.ChallanEntryForm.controls['DDOCode'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            console.log("firstmap__DdoName", value);
            return typeof value === 'string' ? value : value.DDO_NAME
          }),
          map((DDO_NAME: any) => {
            // console.log("second__map_DdoName", DDO_NAME);
            return DDO_NAME ? this.DdoName_filter(DDO_NAME, resp.result) : resp.result.slice()
          })
        );
      }
    })
  }
  //  Ddo name List Select >>>------------------->
  OnDdoNameSelected() {
    this.SelectDdoName = this.ChallanEntryForm.value.DdoName
    // console.log("slelction__________DdoName", this.SelectDdoName, this.ChallanEntryForm.value.DdoName);
  }

  //  Ddo name List filter >>>------------------->
  DdoName_filter(value: string, data: any) {
    // console.log("filterval__DdoName", value);
    return data.filter((option: any) => {
      // console.log("option_val__DdoName", option);
      return option.DDO_NAME.toLowerCase().includes(value.toLowerCase())
    });
  }
  displayDdoName(selectedoption: any) {
    return selectedoption ? selectedoption.DDO_NAME : undefined;
  }
  //..................end.................>


  //<.....BT.......Major Head list get flow start......
  getMajorHeadList() {
    this.ApiMethods.getservice(this.ApiService.getMajorheadlist).subscribe((resp: any) => {
      // console.log("Majorhead__res", resp);
      if (resp.result && resp.result.length > 0) {

        this.MajorHeadListarr = resp.result;

        this.MajorHeadList = this.ChallanEntryForm.controls['MajorHead'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            console.log("Majorheadp__", value);
            return typeof value === 'string' ? value : value.MajorHeadCodeName
          }),
          map((MajorHeadCodeName: any) => {
            // console.log("sMajorhead_", MajorHeadCodeName);
            return MajorHeadCodeName ? this.MajorHead_filter(MajorHeadCodeName, resp.result) : resp.result.slice()
          })
        );
      }
    })
  }
  //  MajorHead SelectedList Select >>>------------------->
  OnMajorHeadSelected(SelectMajorHead: any) {
    console.log("slelction__________SelectMajorHead", SelectMajorHead);
  }

  //  Major Head List filter >>>------------------->
  MajorHead_filter(value: string, data: any) {
    // console.log("filterval__Major", value);
    return data.filter((option: any) => {
      // console.log("option_val__Major", option);
      return option.MajorHeadCodeName.toLowerCase().includes(value.toLowerCase())
    });
  }

  //  Major Head display Function >>>------------------->
  display_Major(selectedoption: any) {
    // console.log('selectedoption===>>>', selectedoption);
    // console.log("display_fun_call_Major", selectedoption);
    //  return selectedoption ? selectedoption.MajorHeadCodeName : 'undefined';
    return selectedoption ? selectedoption.MajorHeadCodeName : selectedoption.MajorHeadCodeName
      ;
  }
  //..................end.................>


  //<.....Division list get flow start......
  getDivisionList() {
    this.ApiMethods.getservice(this.ApiService.getDivisionlist + this.Tcode.Treasury_Code + '/' + 8782).subscribe((resp: any) => {
      console.log("Divisionlist__res", resp);
      if (resp.result && resp.result.length > 0) {

        this.DivisionListarr = resp.result;

        this.DivisionList = this.ChallanEntryForm.controls['Division'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            // console.log("Division__", value);
            return typeof value === 'string' ? value : value.DivisionName
          }),
          map((DivisionName: any) => {
            // console.log("sDivision_", DivisionName);
            return DivisionName ? this.Division_filter(DivisionName, resp.result) : resp.result.slice()
          })
        );
      }
    })
  }

  //  Division List Select >>>------------------->
  OnDivisionSelected(SelectDivision: any) {
    // console.log("slelction__________Division", SelectDivision);
  }

  //  Division List filter >>>------------------->
  Division_filter(value: string, data: any) {
    // console.log("filterval__Division", value);
    return data.filter((option: any) => {
      // console.log("option_val__Division", option);
      return option.DivisionName.toLowerCase().includes(value.toLowerCase())
    });
  }

  //  Division display Function >>>------------------->
  display_Division(selectedoption: any) {
    // console.log('selectedoption===>>>', selectedoption);
    // console.log("display_fun_call_Division", selectedoption);
    return selectedoption ? selectedoption.DivisionName : selectedoption.DivisionName;
  }
  //..................end.................>


  onReset() {
    window.location.reload();
  }

  Save() {

  }


  get ChallanDate() { return this.ChallanEntryForm.get('ChallanDate') }
  get Billtype() { return this.ChallanEntryForm.get('Billtype') }
  get DDOCode() { return this.ChallanEntryForm.get('DDOCode') }

  get BudgetHead() { return this.ChallanEntryForm.get('BudgetHead') }
  get MajorHead() { return this.ChallanEntryForm.get('MajorHead') }
  get Division() { return this.ChallanEntryForm.get('Division') }
  get Amount() { return this.ChallanEntryForm.get('Amount') }
  get Commission() { return this.ChallanEntryForm.get('Commission') }
  get TanNo() { return this.ChallanEntryForm.get('TanNo') }
  get Remitter() { return this.ChallanEntryForm.get('Remitter') }


  viewDocument() {
    this.IsOpen = !this.IsOpen;
  }


  tokenStatus(field: any, title: any, btnText: any) {
    // this._dialog.open(CommonDialogComponent,
    //   {
    //     panelClass: 'dialog-w-50', autoFocus: false
    //     ,
    //     height: "auto",
    //     width: "40%",
    //     data: {
    //       message: title,
    //       // field: field,
    //       error_info: this.Popup_error_list,
    //       id: 'billError',
    //       // btnText: btnText
    //     }
    //   }
    // );
  }


}




