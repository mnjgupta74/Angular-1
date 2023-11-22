import { Component, OnInit } from '@angular/core';
import {  FormBuilder,FormControl,FormGroup,Validators,} from '@angular/forms';
import { Observable, forkJoin, map, startWith } from 'rxjs';
import { LoaderService } from 'src/app/services/loaderservice';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { Helper } from 'src/app/utils/Helper';
import { DdoModel, TreasaryModel } from 'src/app/utils/Master';
import { ApiService } from 'src/app/utils/utility.service';

@Component({
  selector: 'app-check-budget',
  templateUrl: './check-budget.component.html',
  styleUrls: ['./check-budget.component.scss'],
})
export class CheckBudgetComponent implements OnInit {
  hideContent: boolean = false;
  filteredOptions!: Observable<any[]>;
  budgetCheckFrom!: FormGroup;
  panelOpenState = false;
  treasaryData: TreasaryModel[] = [];
  objectHeadData: DdoModel[] = [];
  ddoList: [] = [];
  officeList: [] = [];
  userinfo!: any;
  treasuryCode!: any;
  budgetDetails: any;
  submitted: boolean = false;
  Selectobject!: string | number;
  selectddoCode!: string | number;
  BillTypeoptions: Observable<any[]> | undefined;
  ddoOptions: Observable<any[]> | undefined;
  objectHeadOptions: Observable<any[]> | undefined;
  constructor(
    private fb: FormBuilder,
    private apiMethods: ApiMethods,
    private ApiService: ApiService,
    public loader: LoaderService,
    private helper: Helper,
    private finyear_:Helper,
    private toyear_:Helper,
  ) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
    };
  }

  ngOnInit(): void {
    //getting User Details
    this.userinfo = this.apiMethods.getUserInfo();
    let financialYr  = this.finyear_.year.toString().substring(2,4) + this.toyear_.finyear.toString().substring(2,4);   // It Shows = 2324

    this.budgetCheckFrom = this.fb.group({
      treasaryCode: ['', [this.apiMethods.autocompleteObjectValidator(),Validators.required]],
      ddOCode: ['', [this.apiMethods.autocompleteObjectValidator(),Validators.required]],
      officeName: ['', [this.apiMethods.autocompleteObjectValidator(),Validators.required]],
      budgetHead: ['', [ Validators.required, Validators.maxLength(13),Validators.minLength(13)]],
      objectHead: ['', [this.apiMethods.autocompleteObjectValidator(),Validators.required]],
      SF: ['P', Validators.required],
      vOrCharge: ['V', Validators.required],
      Year: new FormControl({ value:  financialYr, disabled: true }),
    });
    //caaling initial Api's
    this.initialApiCall();
    this.gettreasuryList();
  }

  get budgetHead() {
    return this.budgetCheckFrom.get('budgetHead');
  }
  get registerFormControl() {
    return this.budgetCheckFrom.controls;
  }

  initialApiCall() {
    this.treasuryCode = this.userinfo.treasCode;
    this.loader.setLoading(true);
    let objectHeadlist = `${this.ApiService.trgGetObjectHeadCodelist}/1/1`;
    forkJoin({
      objeactHead: this.apiMethods.getservice(objectHeadlist),
    }).subscribe(
      (response:any) => {
        if (response.objeactHead) {
          this.objectHeadData = response.objeactHead.result;
          this.objectHeadOptions = this.budgetCheckFrom.controls[
            'objectHead'
          ].valueChanges.pipe(
            startWith(''),
            map((value: any) => {
              return typeof value === 'string' ? value : value.objectHeadData;
            }),
            map((objectHeadCodeName: any) => {
              return objectHeadCodeName
                ? this._objectFilter(
                    objectHeadCodeName,
                    response.objeactHead.result
                  )
                : response.objeactHead.result.slice();
            })
          );
        }
        this.loader.setLoading(false);
      },
      (res:any) => {
        if (res.status != 200) {
          this.loader.setLoading(false);
        }
      }
    );
  }

  _objectFilter(value: string, data: any) {
    return data.filter((option: any) => {
      return option.objectHeadCodeName
        .toLowerCase()
        .includes(value.toLowerCase());
    });
  }

  objectDisplayFn(selectedoption: any) {
    return selectedoption ? selectedoption.objectHeadCodeName : undefined;
  }

  gettreasuryList() {
    this.loader.setLoading(true);
    this.treasuryCode = this.userinfo.treasCode;
    this.apiMethods.getservice(this.ApiService.treasuryList).subscribe((resp:any) => {
        let data = resp.result;
        if (resp.result && resp.result.length > 0) {
          this.treasaryData = resp.result;
        }

        this.BillTypeoptions = this.budgetCheckFrom.controls[
          'treasaryCode'
        ].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            return typeof value === 'string' ? value : value.BillTypeListarr;
          }),
          map((TreasuryName: any) => {
            return TreasuryName
              ? this._filter(TreasuryName, data)
              : data.slice();
          })
        );
        this.loader.setLoading(false);
      },
      (res:any) => {
        if (res.status != 200) {
          this.loader.setLoading(false);
        }
      }
    );
  }
  //trasary List Filter function
  _filter(value: string, data: any) {
    return data.filter((option: any) => {
      return option.TreasuryName.toLowerCase().includes(value.toLowerCase());
    });
  }
  //trasary List Display function
  displayFn(selectedoption: any) {
    return selectedoption ? selectedoption.TreasuryName : undefined;
  }

  //DDO List Api CAll
  getDDOList() {
    this.loader.setLoading(true);
    this.treasuryCode = this.userinfo.treasCode;
    let ddolist = `${this.ApiService.payTrgGetDDOCode}/${this.budgetCheckFrom.value.treasaryCode.TreasuryCode}/1`;
    this.apiMethods.getservice(ddolist).subscribe(
      (resp:any) => {
        let data = resp.result;
        if (resp.result && resp.result.length > 0) {
          this.ddoList = resp.result;
        }
        this.ddoOptions = this.budgetCheckFrom.controls[
          'ddOCode'
        ].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            return typeof value === 'string' ? value : value.ddoList;
          }),
          map((DDO_NAME: any) => {
            return DDO_NAME ? this._ddoFilter(DDO_NAME, data) : data.slice();
          })
        );
        this.loader.setLoading(false);
      },
      (res:any) => {
        if (res.status != 200) {
          this.loader.setLoading(false);
        }
      }
    );
  }
  // DDlo list filter function
  _ddoFilter(value: string, data: any) {
    return data.filter((option: any) => {
      return option.DDO_NAME.toLowerCase().includes(value.toLowerCase());
    });
  }
  //DDo List Display Function
  ddoDisplayFn(selectedoption: any) {
    return selectedoption ? selectedoption.DDO_NAME : undefined;
  }
  //change options function for trasary code and DDO code
  changeOption(field: string) {
    if (field == 'Treasury') {
      this.budgetCheckFrom.controls['ddOCode'].patchValue('');
      this.budgetCheckFrom.controls['officeName'].patchValue('');
      this.officeList = [];
      this.getDDOList();
    } else if (field == 'ddoCode') {
      this.budgetCheckFrom.controls['officeName'].patchValue('');
      this.loader.setLoading(true);
      let officeList = `${this.ApiService.officeNameList}/${this.budgetCheckFrom.value.treasaryCode.TreasuryCode}/${this.budgetCheckFrom.value.ddOCode.ddo_code}`;

      this.apiMethods.getservice(officeList).subscribe( (res:any) => {

        if (res.result && res.result.length > 0) {

          this.officeList = res.result;
          console.log('YYYYYYYYYYYYYYYYYYYY_errror message___', res.result);

          console.log('ZZZZZZZZZZZZZZZZZZZZ_errror message___', this.budgetCheckFrom.value.ddOCode.ddo_code);

          const OfficeName = this.officeList.filter((item:any)=> item.officeid == this.budgetCheckFrom.value.ddOCode.ddo_code)[0];
          this.budgetCheckFrom.patchValue({
          officeName:  OfficeName
          })
          //this.budgetCheckFrom.controls['officeName'].disable();
          }
          this.loader.setLoading(false);
        },
        (res:any) => {
          console.log('errror message___', res.status);
          this.loader.setLoading(false);
          if (res.status != 200) {
            // this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');
            // this.snackbar.show('Something Went Wrong! Please Try Again', 'danger')
          }
        }
      );
    }
  }

  displayFnOffice(SelectOffice: any) {
    console.log("displayfuncall===>>>", SelectOffice);
    return SelectOffice ? SelectOffice.OfficeName : undefined;
  }

  showAmtTypeRow() {
    this.hideContent = !this.hideContent;
  }

  submit() {

    if (this.budgetCheckFrom.status == 'VALID') {
      this.loader.setLoading(true);

      let object = {
        treasurycode: this.budgetCheckFrom.value?.treasaryCode?.TreasuryCode,
        detailHead: this.budgetCheckFrom.value?.budgetHead,

        objectHead: this.budgetCheckFrom.value?.objectHead?.objectHeadCode
          ? this.budgetCheckFrom.value?.objectHead?.objectHeadCode
          : this.Selectobject
          ? this.Selectobject
          : '',

        officeId: this.budgetCheckFrom.value?.officeName.officeid,
        bfcType: this.budgetCheckFrom.value?.SF,
        headType: this.budgetCheckFrom.value?.vOrCharge,

        

        finFromYear: this.helper.year.toString(),
        type: null,

        demandNumber: null,
      };


      console.log("XXXXXXXXXXXXXXXXX_officeId");


      this.submitted = true;

      console.log("AAAAAAAAAAAAAAAAAAA", object);

      this.apiMethods
        .postresultservice(`${this.ApiService.checkBudgetAmount}`, object)
        .subscribe(
          (res: any) => {
            if (res.result && res.result.length > 0) {
              this.budgetDetails = res.result[0];
            }

            console.log("BBBBBBBBBBBBBBBBBBBBBBB", object);

            this.loader.setLoading(false);
            this.budgetCheckFrom.disable();
          },
          (res:any) => {
            this.loader.setLoading(false);
            if (res.status != 200) {
              this.budgetDetails = undefined;
              this.submitted = true;
              //  this.snackbar.show('Something Went Wrong! Please Try Again', 'alert')
            }
          }
        );
    }
  }

  public inputValidator(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }


  Reset(){
    window.location.reload();
  }

}
