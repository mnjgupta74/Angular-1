import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import { DatePipe } from '@angular/common';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { LoaderService } from 'src/app/services/loaderservice';
import { Helper } from 'src/app/utils/Helper';

@Component({
  selector: 'app-pd-account-certification',
  templateUrl: './pd-account-certification.component.html',
  styleUrls: ['./pd-account-certification.component.scss']
})
export class PdAccountCertificationComponent implements OnInit {
  PdAccountForm:any;
  majorHeadData:any;
  budgetHeadData:any;
  PdAccountNoData:any;
  majorHeadlist: Observable<any[]> | undefined;
  budgetHeadlist: Observable<any[]> | undefined;
  PdAccountNolist: Observable<any[]> | undefined;
  startYear = new Date().getFullYear();
  Years: any[] = [];
  PdAccountVerificationForm:any;
  majorHeadArray:Observable<any[]> | undefined;
  iSPdAccountVerificationShow:boolean=false;
  userinfo:any;
  treasuryCode:any;
  blockamt:any=0;
  closingbal:any=0;
  certificationdate:any;
  verificationdate:any;
  
  ChooseOption: any = '';
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []

  
  constructor(private ApiMethods: ApiMethods,private ApiService: ApiService,private datePipe: DatePipe,private snackbar:SnackbarService, public loader: LoaderService,private TCode:Helper) {
    this.PdAccountForm=new FormGroup({
      majorHead: new FormControl('',{ validators: [this.ApiMethods.autocompleteObjectValidator(),Validators.required] }),
      budgetHead: new FormControl('',{ validators: [this.ApiMethods.autocompleteObjectValidator(),Validators.required] }),
      PdAccountNo: new FormControl('',{ validators: [this.ApiMethods.autocompleteObjectValidator(),Validators.required] }),
      finYear: new FormControl('',{ validators: [this.ApiMethods.autocompleteObjectValidator(),Validators.required] }),
      TreasuryControl: new FormControl({ }, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
    });

    this.PdAccountVerificationForm = new FormGroup({
      certificateDate: new FormControl('',Validators.required),
      verificationDate: new FormControl('',Validators.required)

    });
    this.fetchMajorHead();
  }

  ngOnInit(): void {
    this.userinfo = this.ApiMethods.getUserInfo();
    this.treasuryCode=this.TCode.Treasury_Code
    for (let i = 0; i < 2; i++) {
      this.Years.push(this.startYear - i);
    }

    this.getTreasuryList();

  }



        // Call Treasury List API >>>------------------->
   
        getTreasuryList() {
          this.loader.setLoading(true);
           //this.ApiMethods.getservice(this.ApiService.autoProcessStatus + this.GetAutoProcessStatusModal.treasuryCode + "/" + this.GetAutoProcessStatusModal.tblName).subscribe(resp => {
             this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe((resp:any) => {
       
             console.log("Auditor__res", resp);
             let data = resp.result
             if (resp.result && resp.result.length > 0) {
               this.TreasuryListarr = resp.result
               //console.log("Show_Treasury_AuditorList", this.TreasuryListarr);
               this.Treasuryoptions = this.PdAccountForm.controls['TreasuryControl'].valueChanges.pipe(
                 startWith(''),
                 map((value: any) => {
                   return typeof value === 'string' ? value : value.treasuryCode
                 }),
                 map((treasury: any) => {
       
                   return treasury ? this._filterTreas(treasury, data) : data.slice()
                 })
               );
               const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.treasuryCode)[0];
               this.PdAccountForm.patchValue({
                 TreasuryControl: treasury
       
               })
        

               console.log("this.treasuryCode__res", this.treasuryCode);

               if(this.treasuryCode !="5000")
               {
                 this.PdAccountForm.controls['TreasuryControl'].disable();
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


  displayMajorHead(selectedoption: any) {
    console.log("displayfuncall");
    return selectedoption ? selectedoption.majorheadname : undefined;
  }

  fetchMajorHead(){
    this.ApiMethods.getservice(this.ApiService.MajorHeadList+ '/' +9 ).subscribe((data:any) => {
      if (data.result.length > 0) {
        this.majorHeadData = data.result;
        console.log('majorHeadData', this.majorHeadData);
      }
      this.majorHeadlist = this.PdAccountForm.controls['majorHead']
      .valueChanges.pipe(
        startWith(''),
        map((value: any) => {
          console.log("firstmap__", value);
          return typeof value === 'string' ? value : value.majorHeadData
        }),
        map((majorheadname: any) => {
          return majorheadname ? this._filterMajorHead(majorheadname,  this.majorHeadData ) :  this.majorHeadData.slice()
        })
      );
    });

  }


  _filterMajorHead(value: string, data: any) {
    return data.filter((option: any) => {
      return option.majorheadname.toLowerCase().includes(value.toLowerCase())
    });
  }

  displayBudgetHead(selectedoption: any) {
    return selectedoption ? selectedoption.groupsubheadname : undefined;
  }

  onMajorHeadSelected(){
    this.PdAccountForm.get('budgetHead').reset();
    let majorheadcode=this.PdAccountForm.value.majorHead.majorheadcode ;
    this.ApiMethods.getservice(this.ApiService.fetchGroupSubHead+5+'/'+majorheadcode).subscribe((data:any) => {
      if (data.result.length > 0) {
        this.budgetHeadData = data.result;
      }
      this.budgetHeadlist = this.PdAccountForm.controls['budgetHead']
      .valueChanges.pipe(
        startWith(''),
        map((value: any) => {
          return typeof value === 'string' ? value : value.budgetHeadData
        }),
        map((groupsubheadname: any) => {
          return groupsubheadname ? this._filterSubHead(groupsubheadname,  this.budgetHeadData ) :  this.budgetHeadData.slice()
        })
      );
    });
  }

  _filterSubHead(value: string, data: any) {
    return data.filter((option: any) => {
      return option.groupsubheadname.toLowerCase().includes(value.toLowerCase())
    });
  }

  onBudgetHeadSelected(){
    this.PdAccountForm.get('PdAccountNo').reset();
    let budgetHeadcode=this.PdAccountForm.value.budgetHead.code ;
    this.ApiMethods.getservice(this.ApiService.fetchpdaccount+this.treasuryCode+'/'+budgetHeadcode).subscribe((data:any) => {
        this.PdAccountNoData = data.result;
      this.PdAccountNolist = this.PdAccountForm.controls['PdAccountNo']
      .valueChanges.pipe(
        startWith(''),
        map((value: any) => {
          return typeof value === 'string' ? value : value.PdAccountNoData
        }),
        map((PdAccName: any) => {
          return PdAccName ? this._filterPdAccount(PdAccName,  this.PdAccountNoData ) :  this.PdAccountNoData.slice()
        })
      );


    });

  }

  _filterPdAccount(value: string, data: any) {
    return data.filter((option: any) => {
      return option.PdAccName.toLowerCase().includes(value.toLowerCase())
    });
  }

  displayPdAccountNo(selectedoption: any) {
    console.log("displayfuncall");
    return selectedoption ? selectedoption.PdAccName : undefined;
  }



  showPDAccountData()
  {

    this.loader.setLoading(true);
   let PdAccountFormValue= this.PdAccountForm.controls.value;
    this.PdAccountForm.disable();
    this.iSPdAccountVerificationShow=true;
    let dataParame ={
      "treasuryCode": this.treasuryCode,
      "budgetHead":this.PdAccountForm.value.budgetHead.code,
      "pdAcNo": this.PdAccountForm.value.PdAccountNo.PdAccNo,
      "finYear": this.PdAccountForm.value.finYear,
    }

    //console.log("HHHH_Before_Calling_API_this.PdAccountForm.value.finYear", this.PdAccountForm.value.finYear);

    this.ApiMethods.postresultservice(this.ApiService.pdaCertification,dataParame).subscribe((data:any) => {
      if (data.result) {
        this.PdAccountNoData = data.result;
       this.blockamt= data.result.balance.Blockamt;
       this.closingbal= data.result.balance.closingbal;
       this.certificationdate= data.result.details.Certificationdate;
       this.verificationdate= data.result.details.Verificationdate;
       this.PdAccountVerificationForm.patchValue({
        certificateDate:this.certificationdate,
        verificationDate:this.verificationdate
        
       })

       //console.log("certificationdate==>",this.certificationdate);

       this.loader.setLoading(false);

       if (this.certificationdate!=undefined && this.certificationdate!=null && this.certificationdate!="NULL") {
        this.PdAccountVerificationForm.disable();
        this.snackbar.show('This PD Account is Already Certified for selected year !', 'alert');
       }

      }
    });
  }

  showPDAccountDataReset(){
    window.location.reload();
  }

  PdAccountVerificationSubmit(){
    this.loader.setLoading(true);
    this.PdAccountVerificationForm.disable();
    let certificateDate= this.PdAccountVerificationForm.value.certificateDate;
    let treasuryDate= this.PdAccountVerificationForm.value.verificationDate;
    let data ={
      "treasuryCode": this.treasuryCode,
      "budgetHead":this.PdAccountForm.value.budgetHead.code,
      "pdAcNo": this.PdAccountForm.value.PdAccountNo.PdAccNo,
      "finYear": this.PdAccountForm.value.finYear,
      "certificationDate": this.datePipe.transform(certificateDate, 'yyyy-MM-dd'),
      "treasuryDate": this.datePipe.transform(treasuryDate, 'yyyy-MM-dd'),
    }
    this.ApiMethods.postresultservice(this.ApiService.pdaCertifyUpdate,data).subscribe((data:any) => {
      if (data.result[0].status == 1) {
        this.loader.setLoading(false);
        this.snackbar.show('PD Account Certification Updated !', 'success');
      }else{
        this.snackbar.show('PD Account Certification Updated !', 'success');
      }

    });
  }

}
