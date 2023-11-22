import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import { LoaderService } from 'src/app/services/loaderservice';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-updatepayids',
  templateUrl: './updatepayids.component.html',
  styleUrls: ['./updatepayids.component.scss']
})

export class UpdatepayidsComponent implements OnInit {
  updateDivGrp: any;
  radioButtonvalue: any;
  radioOptions: string = '1';
  display: boolean = true;
  SelectMajorHead: any = '';
  // SelectYear:any = '';
  MajorHeadListarr: any = [];
  MajorHeadoptions: Observable<any[]> | undefined;
  MajorHeadobj: any = '';
  lstPayDetails: any = [];
  lstDivDetails: any = [];
  ngModelDivisionCode: any;
  BTSource = new MatTableDataSource();
  displayedColumns1: string[] = ['PayID', 'BudgetHead', 'ObjectHead', 'PDAcNo', 'BFCType', 'HeadType', 'SanctionNo', 'SanctionDate', 'Remark', 'Amount', 'Status', 'Treasury'];

  constructor(
    private router: Router,
    private apiMethod: ApiMethods,
    public loader: LoaderService,
    private apiService: ApiService,
  ) {
    this.getMajorHeadList(); // Call Major Head List
  }

  ngOnInit(): void {
    this.updateDivGrp = new FormGroup({
      rblTypeCtrl: new FormControl(['1']),
      frmRefNo: new FormControl('0'),
      frmVoucherNo: new FormControl('0'),
      drpMajorHeadControl: new FormControl(''),
      divisionCtrl: new FormControl(''),
      frmFinYear: new FormControl('2022'),
    });
  }
  onRadioButtonChange(data: MatRadioChange) {
    console.log(data.value);
    if (data.value == 1) {
      this.display = true;
    } else {
      // this.getDepartmentList();
      this.display = false;
    }
  }
  getMajorHeadList() {
    this.apiMethod.getservice(this.apiService.MajorHeadList+0).subscribe(
      (resp:any) => {
        console.log('MajorHeadList__res', resp);
        let data = resp.result;
        if (resp.result && resp.result.length > 0) {
          this.MajorHeadListarr = resp.result;
        }
        console.log('MajorHeadList_inbetween', this.MajorHeadListarr);
        this.MajorHeadoptions = this.updateDivGrp.controls[
          'drpMajorHeadControl'
        ].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            console.log('firstmap__', value);
            return typeof value === 'string' ? value : value.majorheadname;
          }),
          map((majorheadname: any) => {
            // console.log("second__map", majorheadname);

            return majorheadname
              ? this._filterMajor(majorheadname, data)
              : data.slice();
          })
        );
      }
    );
  }
  _filterMajor(value: string, data: any) {
    // console.log("filterval__", value);
    return data.filter((option: any) => {
      // console.log("option_val__", option);
      return option.majorheadname.toLowerCase().includes(value.toLowerCase());
    });
  }

  displayMajor(selectedoption: any) {
    console.log('displayfuncall');

    return selectedoption ? selectedoption.majorheadname : undefined;
  }
  OnMajorHeadSelected(SelectMajorHead: any) {
    console.log('befort______SelectMajorHead', SelectMajorHead);
    console.log('slelction__________option__majorhead', this.SelectMajorHead);
    // this.SaveBudgetModal.majorHead = this.SelectMajorHead.majorheadcode
    // "DetailHead": "8443001060000",
    //   "Amount": "9000.0000",
    //   "TreasuryCode": "2100",
    //   "DivisionCode": "00  ",
    //   "BillCode": "10435887"
  }
  searchFn() {
    this.lstPayDetails = [];
    this.lstDivDetails = [];
    this.loader.setLoading(true);
    console.log(
      'MajorHeadControl',
      this.updateDivGrp.controls['drpMajorHeadControl'].value,
      this.SelectMajorHead
    );
    let refvalue;
    let MhValue;
    let apiCalling;
    if (this.updateDivGrp.controls['rblTypeCtrl'].value == '1') {
      refvalue = this.updateDivGrp.controls['frmRefNo'].value;
      MhValue = null;
      apiCalling = this.apiService.getPaymanagerData;
    } else {
      refvalue = null;
      MhValue = this.updateDivGrp.controls['drpMajorHeadControl'].value.majorheadcode;
      apiCalling = this.apiService.getPaymanagerDivison;
    }
    let data = {
      voucherNo: this.updateDivGrp.controls['frmVoucherNo'].value,
      treasuryCode: '2100',
      finYear: this.updateDivGrp.controls['frmFinYear'].value,
      refNo: refvalue,
      majorHead: MhValue,
    };
    console.log('data', data, refvalue, MhValue);

    this.apiMethod
      .postresultservice(apiCalling, data)
      .subscribe(
        (resp:any) => {
          console.log('After_API_Save_Result__', resp);
          console.log('apiclllll__', this.updateDivGrp.controls['rblTypeCtrl'].value);

          if (resp.result.length > 0) {
            console.log(resp);
            if (this.updateDivGrp.controls['rblTypeCtrl'].value == '1' && Object.keys(resp.result[0]).length > 0) {
              this.lstPayDetails.push(resp.result[1]);
              this.BTSource.data = this.lstPayDetails
              console.log("trrrr___", this.lstPayDetails);
            }
            else {
              this.lstDivDetails = resp.result[0];
            }
            console.log('data_sendbefore__', this.lstDivDetails);
            this.loader.setLoading(false);
          } else {
            this.loader.setLoading(false);
            this.lstPayDetails = [];
            this.lstDivDetails = [];
          }
        },
        (res:any) => {
          console.log('errror message___', res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
          }
        }
      );
  }
  onEdit(item: any) {
    console.log("item", item);//DivisionCode
    this.ngModelDivisionCode = item.DivisionCode.toString();
    this.lstDivDetails.forEach((element: any) => {
      element.flag = false;
    });
    item.flag = true;
  }
  onUpdate(item: any) {
    console.log("item", item);
    let divCode = this.updateDivGrp.controls['divisionCtrl'].value;
    let detailHead = item.DetailHead;
    let treasuryCode = item.TreasuryCode;
    let billCode = item.BillCode;
    let userId = 1115;
    let data = {
      detailHead: detailHead,
      treasuryCode: treasuryCode,
      divCode: divCode,
      billCode: billCode,
      userId: userId
    }
    console.log("data", data);

    this.apiMethod.postresultservice( this.apiService.UpdatePaymanagerDivison, data).subscribe((resp:any) => {
        console.log('After_API_Save_Result__', resp.message);
        this.loader.setLoading(false);
        this.searchFn();
      },
      (res:any) => {
        console.log('errror message___', res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
        }
      }
    );
  }

}

