import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as Val from '../../utils/Validators/ValBarrel'
import { ApiMethods } from '../../utils/ApiMethods';
import { ApiService } from '../../utils/utility.service';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { LoaderService } from 'src/app/services/loaderservice';
import { Helper } from 'src/app/utils/Helper';
import { IGenerateToken, IGetAutoProcessStatus, IPayMangerToken } from 'src/app/utils/Master';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-bank-master',
  templateUrl: './bank-master.component.html',
  styleUrls: ['./bank-master.component.scss']
})

export class BankMasterComponent implements OnInit {
  // Listdata: MatTableDataSource<tokenList> = new MatTableDataSource();
  displayedColumns =
    ['BankName',
      'BranchName',
      'Address',
      'IFSCCode',
      'MICRCode',
      'BSRCode',
      'Treasury',
      'BankType',
      'ChequePrint',
    ]

  BillStatusTable: string[] = [
    'BankName',
    'BranchName',
    'Address',
    'IFSCCode',
    'MICRCode',
    'BSRCode',
    'Treasury',
    'BankType',
    'ChequePrint',
    'Action',
    'Deactive',
  ];
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) Sort!: MatSort;
  dataSource = new MatTableDataSource();
  myModel: boolean = true
  chequeP_flag: any = ''
  bank_typeselect: any = 'R'
  BankType: any = [
    {
      "Type": "Payment",
      "TypeC": 'P'
    },
    {
      "Type": "Receipt",
      "TypeC": 'R'
    },
    {
      "Type": "Pension Voucher Only",
      "TypeC": 'V'
    },
    {
      "Type": "Pymt & Rcpt Both",
      "TypeC": 'B'
    },
  ]

  treasury: any;
  BankEntryForm: any;
  BankEditForm: any
  //LIst array
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []

  BankList: any[] = []
  RFLAG: boolean = false
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) Sort!: MatSort;

  constructor(public dialog: MatDialog, private router: Router, private ApiMethods: ApiMethods, public loader: LoaderService, private _liveAnnouncer: LiveAnnouncer, private ApiService: ApiService, private snackbar: SnackbarService, public finyear_: Helper, private Tcode: Helper, private toyear_: Helper, private usercode_: Helper, private Fyear_: Helper, private asgnId: Helper, private fy_: Helper) {
    history.pushState(null, '', location.href);

  }

  ngOnInit(): void {
    // this.treasury = this.PayMangerTokenModel.treasurycode;
    this.getTreasuryList();
    // this.dataSource.data = this.result;

    this.getBankList()  // Call Bank List
    this.getBankDetails()
    console.log("treasury--", this.treasury)
    this.BankEntryForm = new FormGroup({
      TreasuryControl: new FormControl({ value: '', disabled: false }, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
      BranchName: new FormControl('', [Val.Required, Val.Alphabet, Val.minLength(4), Val.BeginSpace]),
      Address: new FormControl('', [Val.Required, Val.minLength(4), Val.maxLength(200), Val.NotHtmlTag, Val.SpecialChar, Val.Number_Wordsallowed]),
      IFSC: new FormControl('', [Val.Required, Val.maxLength(11), Val.minLength(11), Val.IFSCFormat]),
      MICR: new FormControl('', [Val.Numeric, Val.Required, Val.maxLength(9), Val.minLength(9)]),
      BSR: new FormControl('', [Val.Numeric, Val.Required, Val.maxLength(7), Val.minLength(7)]),
      bankName: new FormControl(),
    })
    this.BankEditForm = new FormGroup({
      BRANCHNAME: new FormControl('', [ Val.Alphabet, Val.minLength(4), Val.BeginSpace]),
      ADDRESS: new FormControl('', [ Val.minLength(4), Val.maxLength(200), Val.NotHtmlTag, Val.SpecialChar, Val.Number_Wordsallowed]),
      IFSCCode:new FormControl('', [ Val.maxLength(11), Val.minLength(11), Val.IFSCFormat]),
      MICRCode: new FormControl('', [Val.Numeric,  Val.maxLength(9), Val.minLength(9)]),
      BSRCode: new FormControl(),
      BankType: new FormControl(),
      ChequePrint: new FormControl(),
      Treasury: new FormControl()

    })

  }

  onReset() {
    console.log("Reset__call");

    this.BankEntryForm.reset()
    const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.Tcode.Treasury_Code)[0];
    this.BankEntryForm.patchValue({
      TreasuryControl: treasury,
      // BranchName:'',
      // Address:'',
      // IFSC:'',
      // MICR:'',
      // BSR:'',
    })
  }

  OnSave() {
    var bankinfo = this.BankEntryForm.controls['bankName'].value
    console.log("lenght__", String(bankinfo.BankBranchCode).length);
    let strlen = String(bankinfo.BankBranchCode).length
    let bsrstr = this.BankEntryForm.controls['BSR'].value.substring(0, strlen);
    let bankcodestr = String(bankinfo.BankBranchCode).substring(0, strlen)
    console.log("bsrcode__", bsrstr, "branchcode__", bankcodestr);

    if (Number(bsrstr) != Number(bankcodestr)) {
      this.snackbar.show('Starting Digit of BSR Code should be match with BankCode !', 'alert')
    }
    else {
      var Trescode = this.BankEntryForm.controls['TreasuryControl'].value
      var body = {
        "bankbranchcode": bankinfo.BankBranchCode,
        "type": 3,
        "treasurycode": Trescode.TreasuryCode,
        "ifsc": this.BankEntryForm.controls['IFSC'].value,
        "micrCode": this.BankEntryForm.controls['MICR'].value,
        "rbiCode": " ",
        "branchNAME": this.BankEntryForm.controls['BranchName'].value,
        "address": this.BankEntryForm.controls['Address'].value,
        "bankName": bankinfo.BANKNAME,
        "chequePrint": 0,
        "bsrCode": this.BankEntryForm.controls['BSR'].value,
        "bankType": this.bank_typeselect,
      }

      console.log("bankbody__before", body);

      this.loader.setLoading(true);

      this.ApiMethods.postresultservice(this.ApiService.getbankDetils, body).subscribe((resp: any) => {
        console.log("BankList__udate___res", resp.result);
        if (resp.result) {
          this.loader.setLoading(false);
          console.log("ander aa gya");
          this.getBankDetails()
          this.snackbar.show('Bank Entry Successfully Save !', 'success')
          this.onReset() // clear input entry after save
        }
        else {
          console.log("ander nhi aa gya");
        }
      },
        (res: any) => {
          console.log("errror message___", res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
            //this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');
            this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger')
          }
        })
    }

  }

  getTreasuryList() {
    this.loader.setLoading(true);
    this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe((resp: any) => {
      console.log("Auditor__res", resp);
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.TreasuryListarr = resp.result
        //console.log("Show_Treasury_AuditorList", this.TreasuryListarr);
        this.Treasuryoptions = this.BankEntryForm.controls['TreasuryControl'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            return typeof value === 'string' ? value : value.treasuryCode
          }),
          map((treasury: any) => {

            return treasury ? this._filtertreasury(treasury, data) : data.slice()
          })
        );
        const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.Tcode.Treasury_Code)[0];
        this.BankEntryForm.patchValue({
          TreasuryControl: treasury

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

  // Calling API for Bank List  
  getBankList() {
    console.log("bankList_before", this.BankList);

    //this.ApiMethods.getservice(this.ApiService.BankList).subscribe(resp => {
    this.ApiMethods.getservice(this.ApiService.BankList + '/' + this.Tcode.Treasury_Code + '/' + 5).subscribe((resp: any) => {
      console.log("BankList__res", resp);
      if (resp.result && resp.result.length > 0) {

        this.BankList = resp.result
      }
    })
    console.log("BankList_after", this.BankList);
  }

  onChange($event: any) {
    // alert($event.checked);
    this.chequeP_flag = $event.checked
  }

  // Calling API for Bank Details  
  getBankDetails() {
    this.loader.setLoading(true);

    var body = {
      "type": 1,
      "treasurycode": this.Tcode.Treasury_Code
    }

    console.log("body_send__", body);
    this.ApiMethods.postresultservice(this.ApiService.getbankDetils, body).subscribe((resp: any) => {
      console.log("bankdetilas__res", resp);
      if (resp.result && resp.result.length > 0) {
        this.loader.setLoading(false);
        const datar: any[] = resp.result
        datar.map((i: any) => i.RFLAG = false)
        this.dataSource.data = datar
        console.log(datar)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.Sort;
      }
    },
      (res: any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          //this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');
          this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger')
        }
      })
  }

  OnPensionFlagChange(entent: any) {
    console.log("entent___", entent.value);
    this.bank_typeselect = entent.value
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // if (this.AccountOffListdata.paginator) {
    //   this.AccountOffListdata.paginator.firstPage();
    // }
  }

  validate(param: any) {
    console.log("changs__alll__", param);


    let str = param.value
    console.log(" ", str);

    if (str) {
      param.setValue(str.trimEnd())
      // param.setValue(str.trimLeft())
    }
  }

  onDelete(item: any) {
    if (window.confirm('Are you sure you want to Deactive !')) {

      console.log("deactive_r__,", item);
      var body = {
        "bankbranchcode": item.BankBranchCode,
        "treasurycode": item.TreasuryCode,
      }

      this.loader.setLoading(true);

      this.ApiMethods.postresultservice(this.ApiService.BankDeactive, body).subscribe((resp: any) => {
        console.log("BankList__deactive___res", resp.result);
        if (resp.result) {
          this.loader.setLoading(false);

          this.getBankDetails()
          this.snackbar.show('Successfully Deactivated !', 'success')

        }
      },
        (res: any) => {
          console.log("errror message___", res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
            //this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');
            this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger')
          }
        })
    }
  }

  onEdit(item: any) {
    console.log('itembankbranchcode', item);

    this.BankEditForm.patchValue({
      BRANCHNAME: item.BRANCHNAME,
      ADDRESS: item.ADDRESS,
      IFSCCode: item.IFSC,
      MICRCode: item.MICRCode,
      Treasury: item.TreasuryCode,
      BankType: item.BankType
    });
    this.dataSource.data.forEach((element: any) => {
      // console.log("elemnt_hai kya__", element);

      element.RFLAG = false

    });
    item.RFLAG = true
  }

  onItemChange(value: any) {
    console.log(" Value is : ", value.checked);
  }

  onCancel(item: any) {
    this.getBankDetails()
  }

  onUpdate(item: any) {
    const regex = new RegExp(/^[A-Z]{4}[0-9]{7}$/)
    const StartSpace = new RegExp(/^\s/);
    const OnlyAlpha = new RegExp(/^[a-zA-Z ]*$/);


    // if (this.BankEditForm.controls['BRANCHNAME'].value) {
    //   if (!StartSpace.test(this.BankEditForm.controls['BRANCHNAME'].value)) {
    //     this.snackbar.show('BRANCHNAME not start with Space.', 'danger')
    //   }
    //   // else if (!OnlyAlpha.test(this.BankEditForm.controls['BRANCHNAME'].value)) {
    //   //   this.snackbar.show('In BRANCHNAME only Alphabets are allowed', 'danger')
    //   // }
    //   // else if (this.BankEditForm.controls['BRANCHNAME'].value != null && this.BankEditForm.controls['BRANCHNAME'].value.length < (4)) {
    //   //   this.snackbar.show('BRANCHNAME Length should be 4', 'danger')
    //   // }
    // }
    // else if (this.BankEditForm.controls['IFSCCode'].value) {
    //   if (!regex.test(this.BankEditForm.controls['IFSCCode'].value)) {
    //     this.snackbar.show('IFSC Code not valid (e.g. SBIN0001234', 'danger')
    //   }
    // }
    // else {
      if (window.confirm('Are you sure you want to update !')) {
        console.log("item_update__", item, this.BankEditForm.controls['ChequePrint'].value);
        var body = {
          "bankbranchcode": item.BankBranchCode,
          "type": 2,
          "treasurycode": this.BankEditForm.controls['Treasury'].value,
          "ifsc": this.BankEditForm.controls['IFSCCode'].value,
          "micrCode": this.BankEditForm.controls['MICRCode'].value,
          "rbiCode": " ",
          "branchNAME": this.BankEditForm.controls['BRANCHNAME'].value,
          "address": this.BankEditForm.controls['ADDRESS'].value,
          "bankName": item.BankName,
          "bankType": this.BankEditForm.controls['BankType'].value,
          "chequePrint": this.chequeP_flag ? 1 : 0,
          "bsrCode": item.BSRCode
        }
        this.loader.setLoading(true);

        this.ApiMethods.postresultservice(this.ApiService.getbankDetils, body).subscribe((resp: any) => {
          console.log("BankList__udate___res", resp.result);
          if (resp.result) {
            this.loader.setLoading(false);
            console.log("ander aa gya");

            this.getBankDetails()
            this.snackbar.show('Record Successfully Updated !', 'success')
            // this.dataSource.data.forEach((element: any) => {
            //   element.RFLAG = true
            // });
            // item.RFLAG = false
          }
        },
          (res: any) => {
            console.log("errror message___", res.status);
            if (res.status != 200) {
              this.loader.setLoading(false);
              //this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');
              this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger')
            }
          })
      }

    // }
  }

  get TreasuryControl() { return this.BankEntryForm.get('TreasuryControl') }
  get BranchName() { return this.BankEntryForm.get('BranchName') }
  get Address() { return this.BankEntryForm.get('Address') }
  get IFSC() { return this.BankEntryForm.get('IFSC') }
  get MICR() { return this.BankEntryForm.get('MICR') }
  get BSR() { return this.BankEntryForm.get('BSR') }
  get bankName() { return this.BankEntryForm.get('bankName') }

  get BRANCHNAME() { return this.BankEditForm.get('BRANCHNAME') }
  get ADDRESS() { return this.BankEditForm.get('ADDRESS') }
  get IFSCCode() { return this.BankEditForm.get('IFSCCode') }
  get MICRCode() { return this.BankEditForm.get('MICRCode') }
}