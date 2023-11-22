import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { map, startWith } from 'rxjs';
import { LoaderService } from 'src/app/services/loaderservice';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { Helper } from 'src/app/utils/Helper';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { ApiService } from 'src/app/utils/utility.service';

@Component({
  selector: 'app-te-voucher-entry',
  templateUrl: './te-voucher-entry.component.html',
  styleUrls: ['./te-voucher-entry.component.scss']
})
export class TeVoucherEntryComponent implements OnInit {
  tEVoucherEntryForm:any;
  YearLIst:any=[];
  currentYear: number=0;
  majorHeadData:any;
  majorHeadlist:any;
  voucherData:any;
  GrnMinusEntryFormDetails:any;
  BankList:any;
  BankNameList:any;
  maxDate:any;
  DdoNameListarr:any;
  DodoNameList:any;
  BudgetHeadData:any;
  ObjectHeadData:any;
  DivisionData:any;
  treasuryCode:any;
  BTTEVoucherEntry:any;
  OfficeNameListarr:any;
  OfficeNameList:any;
  ObjectHeadList:any;
  PdAccNameListarr:any;
  PdAccNameList:any;
  BudgetHeadDataList:any;
  tEVoucherEntryData= new MatTableDataSource();
  isShowGrnMinusEntryFormDetails:boolean=false;
  budgetDetailTEData= new MatTableDataSource();
  TREASURY_REFNO:any;
  budgetAllocationTeData:any;
  isEditGrnMinusEntryFormDetails:boolean=false;
  selectType:number=0;
  addNewBTDetail:boolean=false;
  tempArray=new MatTableDataSource();
  tempArrayResult:any[]=[];
  btArrayData:any=[];
  lblbttotal:number=0.00;
  lblfinalbt:number=0.00;
  selectedDDOCode:any;
  selectedOfficeId:any;

  displayedColumns: string[] = ['SrNo', 'VoucherNo','VoucherDate','OfficeID','DDOCode','BudgetHead','BillType','ObjectHead','PNP','VC','NetAmount','GrossAmount','PDAcNo'];

  displayedColumns1: string[] = ['SrNo', 'OfficeID','DetailsHead','ObjectHead','SFCA','VotedCharged','Amount'];

  displayedColumnsBTType: string[] = ['SrNo','BudgetHead','PDAcNo','ObjectHead','VotedCharged','SFCA','Amount'];

  displayedColumnsBTTypeOld: string[] = ['BudgetHead','PDAcNo','ObjectHead','VotedCharged','SFCA','OldBudgetHead','oldPDAcNo','Amount','SrNo'];


  constructor(private datePipe: DatePipe, private formBuilder: FormBuilder,private router: Router, private ApiMethods: ApiMethods, public loader: LoaderService, private ApiService: ApiService, private snackbar: SnackbarService, private _liveAnnouncer: LiveAnnouncer, private Helper:Helper) {
    this.maxDate = new Date();
  }

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.tEVoucherEntryData.sort = sort;
  }

  @ViewChild(MatPaginator) set MatPaginator(paginator: MatPaginator) {
    this.tEVoucherEntryData.paginator = paginator;
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) Sort!: MatSort;



  ngOnInit(): void {

    this.tEVoucherEntryForm =  this.formBuilder.group({
      majorHead: new FormControl('',[Validators.required]),
      finYear: new FormControl('',[Validators.required]),
      voucherNo: new FormControl('',[Validators.required]),
      blockTypes: new FormControl('1',[Validators.required]),

    });


    this.GrnMinusEntryFormDetails = new FormGroup({
      //  TreasuryCode: new FormControl(''),
      //  GRN: new FormControl(''),
      // bankName: new FormControl('',[Validators.required]),
      TEDate: new FormControl(new Date(),[Validators.required]),
      DDOCode: new FormControl('',[Validators.required]),
      OfficeName: new FormControl('',[Validators.required]),
      DetailsHead: new FormControl('',[Validators.required]),
      objectHead: new FormControl('',[Validators.required]),
      PlanNonPlan: new FormControl('',[Validators.required]),
      VotedCharged: new FormControl('',[Validators.required]),
      pdacno: new FormControl('0'),
      TREASURY_REFNO: new FormControl(''),

      grossAmount: new FormControl({value:'',disabled: true},[Validators.required]),
      Amount: new FormControl('',[Validators.required]),
    });


    this.BTTEVoucherEntry = new FormGroup({
      oldBudgetHead: new FormControl(''),
      oldpdacno: new FormControl(''),
      MajorHead: new FormControl('',[Validators.required]),
      DetailedHead: new FormControl('',[Validators.required]),
      ObjectHead: new FormControl('',[Validators.required]),
      Division: new FormControl('',[Validators.required]),
      PlanNonPlan: new FormControl('',[Validators.required]),
      PDACNO: new FormControl(''),
      VotedCharged: new FormControl('',[Validators.required]),
      Amount: new FormControl('',[Validators.required]),
      TEDate: new FormControl(new Date(),[Validators.required]),
    });


    const currentDate = new Date();
    this.currentYear = currentDate.getFullYear();
    for (let index = 1; index < 11; index++) {
      let YearName:any=[];
     // YearName["finYear"] =11-index;
      YearName["finYear"] =this.currentYear--;
      this.YearLIst.push(YearName) ;
    }

    console.log("tEVoucherEntryForm==>",this.tEVoucherEntryForm.getRawValue().blockTypes);
    this.fetchMajorHead();
   // this.getDdoNameList();
   // this.getDivisionlist();
   // this.fetchGroupSubHead();
    this.trgGetObjectHeadCodelist();
    //this.tEVoucherEntryData.data=[];
  }



  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let newValue = input.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    input.value = newValue; // Update the input field's value
  }
  Reset(){
    window.location.reload();

  }

  fetchMajorHead(){
    this.ApiMethods.getservice(this.ApiService.MajorHeadList+0 ).subscribe((data:any) => {
      if (data.result.length > 0) {
        this.majorHeadData = data.result;
        console.log('majorHeadData', this.majorHeadData);
      }
      this.majorHeadlist = this.tEVoucherEntryForm.controls['majorHead']
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


//     const treasury = this.TreasuryListarr.filter((item: any) => item.majorheadcode === this.majorheadcode)[0];
// this.MHMapGrp.patchValue({
//   TreasuryControl: treasury

// })



  }

  _filterMajorHead(value: string, data: any) {
    return data.filter((option: any) => {
      return option.majorheadname.toLowerCase().includes(value.toLowerCase())
    });
  }

  displayMajorHead(selectedoption: any) {
    console.log(selectedoption);
    return selectedoption ? selectedoption.majorheadname : undefined;
  }

  applyFilter(filterValue: string) {
    this.voucherData.filter = filterValue.trim().toLowerCase();

    if (this.voucherData.paginator) {
      this.voucherData.paginator.firstPage();
    }

  }


    applyVoucherFilter(filterValue: string) {
      this.tEVoucherEntryData.filter = filterValue.trim().toLowerCase();
  }

  applyBudgetFilter(filterValue: string) {
      this.budgetDetailTEData.filter = filterValue.trim().toLowerCase();
  }

  applyTempFilter(filterValue: string) {
      this.tempArray.filter = filterValue.trim().toLowerCase();
  }





  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce('Sorted ${sortState.direction}ending');
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  getBankList() {
    console.log("bankList_before", this.BankList);
    this.ApiMethods.getservice(this.ApiService.BankList + '/' + this.Helper.Treasury_Code + '/' + 3).subscribe((resp:any) => {
      console.log("BankList__res", resp);
      if (resp.result && resp.result.length > 0) {
        this.BankList = resp.result;
        this.BankList.forEach((element: { BankBranchCode: string | number; }) => {
          this.BankNameList[element.BankBranchCode]=element;

        });

      ///  console.log("BankNameListRecord", this.BankNameList);
      //  alert();

       // this.BankNameList[resp.result]
      }
    })
    console.log("BankList_after", this.BankList);
  }

  getDdoNameList() {
    //alert();
    this.ApiMethods.getservice(this.ApiService.getDdoNamelist + this.Helper.Treasury_Code + '/0').subscribe((resp:any) => {
       console.log("getDdoNameList__res", resp);
      if (resp.result && resp.result.length > 0) {
        // this.DodoNameList = resp.result;
        // console.log("");

        this.DdoNameListarr = resp.result;

    //  console.log("DdoNameListarr",this.DdoNameListarr);

        this.DodoNameList = this.GrnMinusEntryFormDetails.controls['DDOCode'].valueChanges.pipe(
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

        const ddoNameList = this.DdoNameListarr.filter((item: any) => item.ddo_code === this.selectedDDOCode)[0];
        this.GrnMinusEntryFormDetails.patchValue({
          DDOCode: ddoNameList

        });
       this.getOfficeNameList();
      }
    })
  }

  DdoName_filter(value: string, data: any) {
    return data.filter((option: any) => {
      return option.DDO_NAME.toLowerCase().includes(value.toLowerCase())
    });
  }

  displayDdoName(selectedoption: any) {
    return selectedoption ? selectedoption.DDO_NAME :undefined;
  }




  getDivisionlist(){
    this.treasuryCode=this.Helper.Treasury_Code;
    // let strBudgetHead=  this.grnResultData.BudgetHead.slice(0, 4);
    let DetailedHead= this.BTTEVoucherEntry.controls['DetailedHead'].value
     //let strBudgetHead= DetailedHead.slice(0, 4);
          let strBudgetHead="8782"; //for Testing
     this.ApiMethods.getservice(this.ApiService.getDivisionlist+this.treasuryCode+'/'+strBudgetHead).subscribe((resp:any) => {
       if (resp.result && Object.keys(resp.result).length >0) {
       this.DivisionData=resp.result;
       }

     });

   }

   getOfficeNameList() {
    let DDOCode=  this.GrnMinusEntryFormDetails.controls['DDOCode'].value.ddo_code;
    console.log("DDOCode===>>>",DDOCode);
    this.ApiMethods.getservice(this.ApiService.officeNameList+'/'+this.Helper.Treasury_Code+'/'+DDOCode).subscribe((resp:any) => {
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

  officeName_filter(value: string, data: any) {
    return data.filter((option: any) => {
      return option.OfficeName.toLowerCase().includes(value.toLowerCase())
    });
  }


  // trgGetObjectHeadCodelist(){
  //   this.ApiMethods.getservice(this.ApiService.trgGetObjectHeadCodelist+'/1/'+1).subscribe(resp => {
  //     if (resp.result && Object.keys(resp.result).length >0) {
  //     this.ObjectHeadData=resp.result;
  //     }

  //   });
  // }

  trgGetObjectHeadCodelist() {
    this.ApiMethods.getservice(this.ApiService.trgGetObjectHeadCodelist+'/1/'+1).subscribe((resp:any) => {
      if (resp.result && resp.result.length > 0) {
        this.ObjectHeadData = resp.result;
        console.log("ObjectHeadData",this.ObjectHeadData);

        // this.ObjectHeadList = this.GrnMinusEntryFormDetails.controls['objectHead'].valueChanges.pipe(
        //   startWith(''),
        //   map((value: any) => {
        //     // console.log("firstmap__DdoName", value);
        //     return typeof value === 'string' ? value : value.objectHeadCodeName
        //   }),
        //   map((objectHeadCodeName: any) => {
        //     // console.log("second__map_DdoName", DDO_NAME);
        //     return objectHeadCodeName ? this.ObjectHeadName_filter(objectHeadCodeName, resp.result) : resp.result.slice()
        //   })
        // );


          // this.ObjectHeadList = this.BTTEVoucherEntry.controls['objectHead'].valueChanges.pipe(
          //   startWith(''),
          //   map((value: any) => {
          //     // console.log("firstmap__DdoName", value);
          //     return typeof value === 'string' ? value : value.objectHeadCodeName
          //   }),
          //   map((objectHeadCodeName: any) => {
          //     // console.log("second__map_DdoName", DDO_NAME);
          //     return objectHeadCodeName ? this.ObjectHeadName_filter(objectHeadCodeName, resp.result) : resp.result.slice()
          //   })
          // );






      }
    })
  }

  ObjectHeadName_filter(value: string, data: any) {
    return data.filter((option: any) => {
      return option.objectHeadCodeName.toLowerCase().includes(value.toLowerCase())
    });
  }


  getSelectPdAccountList() {
    let budgetHead= this.BTTEVoucherEntry.controls['DetailedHead'].value;
    this.getPdAccountList(budgetHead);
  }

  onKeyUpgetPdAccountList() {
    let budgetHead= this.GrnMinusEntryFormDetails.controls['DetailsHead'].value;
    this.GrnMinusEntryFormDetails.controls['pdacno'].reset();
    this.getPdAccountList(budgetHead);
  }


  getDetailsHeadPdAccountList() {
    this.BTTEVoucherEntry.controls['PDACNO'].reset();
    let budgetHead= this.BTTEVoucherEntry.controls['DetailedHead'].value;
    this.getPdAccountList(budgetHead);
  }



  getPdAccountList(budgetHead:any) {
    this.ApiMethods.getservice(this.ApiService.fetchpdaccount+this.Helper.Treasury_Code+'/'+budgetHead).subscribe((resp:any) => {
       console.log("getPdAccountList__res", resp);
       this.PdAccNameListarr=[];
      if (resp.result && resp.result.length > 0) {
        this.PdAccNameListarr = resp.result;
        // this.PdAccNameList = this.BTTEVoucherEntry.controls['PDACNO'].valueChanges.pipe(
        //   startWith(''),
        //   map((value: any) => {
        //     // console.log("firstmap__DdoName", value);
        //     return typeof value === 'string' ? value : value.PdAccName
        //   }),
        //   map((PdAccName: any) => {
        //     // console.log("second__map_DdoName", DDO_NAME);
        //     return PdAccName ? this.PdAccName_filter(PdAccName, resp.result) : resp.result.slice()
        //   })
        // );
      }
    })
  }

  PdAccName_filter(value: string, data: any) {
    return data.filter((option: any) => {
      return option.PdAccName.toLowerCase().includes(value.toLowerCase())
    });
  }


  fetchGroupSubHead(){
    let MajorHead =this.BTTEVoucherEntry.controls['MajorHead'].value.majorheadcode;
    this.ApiMethods.getservice(this.ApiService.fetchGroupSubHead+'1/'+MajorHead).subscribe((resp:any) => {
      if (resp.result && resp.result.length > 0) {
        this.BudgetHeadData = resp.result;
        this.BudgetHeadDataList = this.BTTEVoucherEntry.controls['DetailedHead'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            // console.log("firstmap__DdoName", value);
            return typeof value === 'string' ? value : value.groupsubheadname
          }),
          map((groupsubheadname: any) => {
            // console.log("second__map_DdoName", DDO_NAME);
            return groupsubheadname ? this.GroupSubHead_filter(groupsubheadname, resp.result) : resp.result.slice()
          })
        );
      }
      });
  }

  GroupSubHead_filter(value: string, data: any) {
    return data.filter((option: any) => {
      return option.groupsubheadname.toLowerCase().includes(value.toLowerCase())
    });
  }

  tEVoucherEntrySubmit(){
    this.loader.setLoading(true);
    this.tEVoucherEntryForm.disable();
    this.isShowGrnMinusEntryFormDetails=false;

    if(this.tEVoucherEntryForm.getRawValue().blockTypes==1){
      this.selectType=1;
    }

    if(this.tEVoucherEntryForm.getRawValue().blockTypes==2){
      this.selectType=1;
    }

   let postData={
    "treasuryCode": this.Helper.Treasury_Code,
    "majorHead": this.tEVoucherEntryForm.getRawValue().majorHead.majorheadcode,
    "voucherNo": this.tEVoucherEntryForm.getRawValue().voucherNo,
    "ddoCode": null,
    ///"type": this.tEVoucherEntryForm.getRawValue().blockTypes,
    "type": this.selectType,
    "billCode": null,
    "finYear": this.tEVoucherEntryForm.getRawValue().finYear
}

//console.log("postData",postData);

this.ApiMethods.postresultservice(this.ApiService.voucherBudgetDetail,postData).subscribe((resp:any) => {
  this.isShowGrnMinusEntryFormDetails=true;
  this.loader.setLoading(false);
  if (resp.result && resp.result.length > 0) {
    this.tEVoucherEntryData.data=resp.result;
  //  console.log("tEVoucherEntryData",resp.result);
  }
  });


    }



    grnMinusEntryFormSubmit(){
      this.loader.setLoading(true);
     // console.log(this.GrnMinusEntryFormDetails.getRawValue());
    //this.GrnMinusEntryFormDetails.disable();
   let postData={
    "treasuryCode": this.Helper.Treasury_Code,
    "ddoCode": this.GrnMinusEntryFormDetails.getRawValue().DDOCode.ddo_code,
    "detailHead": this.GrnMinusEntryFormDetails.getRawValue().DetailsHead,
    "bfcType": this.GrnMinusEntryFormDetails.getRawValue().PlanNonPlan,
    "objectHead": this.GrnMinusEntryFormDetails.getRawValue().objectHead,
    "headType": this.GrnMinusEntryFormDetails.getRawValue().VotedCharged,
    "finYear":this.tEVoucherEntryForm.getRawValue().finYear,
    "amount": this.GrnMinusEntryFormDetails.getRawValue().Amount,
    "officeId": this.GrnMinusEntryFormDetails.getRawValue().OfficeName,
    "treasuryRefNo":this.GrnMinusEntryFormDetails.getRawValue().TREASURY_REFNO,
    "pdacno": this.GrnMinusEntryFormDetails.getRawValue().pdacno,
    "teDate":  this.GrnMinusEntryFormDetails.getRawValue().TEDate,
  };
  this.GrnMinusEntryFormDetails.controls['Amount'].reset();
      this.ApiMethods.postresultservice(this.ApiService.budgetAllocationSave,postData).subscribe((resp:any) => {

        this.loader.setLoading(false);
        if (resp.result && resp.result.length > 0) {
          if(resp.result[0].ERR_CODE!=undefined || resp.result[0].ERR_CODE){
            this.snackbar.show(resp.result[0].MSG, 'success');
          }

          // if(resp.result[0].Amount>0){
          //   this.snackbar.show('Record inserted Successfully!', 'success');
          //   this.TREASURY_REFNO=this.GrnMinusEntryFormDetails.getRawValue().TREASURY_REFNO;

          // }


        }

        this.budgetDetailTE();
        });


    }






   BTTEVoucherEntrySubmit(){
    if(this.BTTEVoucherEntry.valid){
    let rowArray:any={};
    let teDate=this.BTTEVoucherEntry.getRawValue().TEDate;
   let ddlDetailHeadBT= this.BTTEVoucherEntry.getRawValue().DetailedHead;
   let lstdivision=this.BTTEVoucherEntry.getRawValue().Division;
   let txtamount=this.BTTEVoucherEntry.getRawValue().Amount;

   if(txtamount>0){
   }else{
    this.snackbar.show('Please Enter Amount','alert');
    return
   }

   if (ddlDetailHeadBT.substring(0, 4) == "8782" || ddlDetailHeadBT.substring(0, 4) == "8793")
	{
			if ((lstdivision== 0) && ddlDetailHeadBT.substring(0, 9) != "878200101"){

        //ShowErrorMessage("Select Division from BT Block");
        this.snackbar.show('Select Division from BT Block', 'alert');
        return
            }
		    }


       if (ddlDetailHeadBT.substring(0, 4) <= 7999)

		      {
			           if (this.lblbttotal < parseFloat(txtamount))
			          {
                this.snackbar.show('Budget Insufficient', 'alert');

			          }
			      }



        let sumTotal=this.lblfinalbt  + parseFloat(txtamount);

        console.log("sumTotal==>>",this.lblfinalbt,"==>>",parseFloat(txtamount));

        console.log(this.lblbttotal,"==>>",sumTotal);

       if (this.lblbttotal < sumTotal ) {
        this.snackbar.show('Total BT Amount should be equal or less then to Main Amount', 'alert');
					   //ShowErrorMessage("Total BT Amount should be equal to Main Amount");
             return
				   }

    rowArray={
      "budgetHead":this.BTTEVoucherEntry.getRawValue().DetailedHead,
      "objectHead":this.BTTEVoucherEntry.getRawValue().ObjectHead,
      "headType":this.BTTEVoucherEntry.getRawValue().PlanNonPlan,
      "bfcType":this.BTTEVoucherEntry.getRawValue().VotedCharged,
      "amount":this.BTTEVoucherEntry.getRawValue().Amount,
      "pdaAcNo":this.BTTEVoucherEntry.getRawValue().PDACNO,
      "oldpdacno":this.BTTEVoucherEntry.getRawValue().oldpdacno,
      "oldBudgetHead":this.BTTEVoucherEntry.getRawValue().oldBudgetHead,
      "divisionCode": this.BTTEVoucherEntry.getRawValue().Division,
      "treasuryRef":this.TREASURY_REFNO,
      "teDate":this.datePipe.transform(teDate, 'yyyy-MM-dd'),
    }
    this.tempArrayResult.push(rowArray);

      this.tempArray.data= this.btArrayData.concat(this.tempArrayResult);

      //this.tempArray.data= this.tempArrayResult;



    let tempTotal=0.00;
    this.tempArray.data.forEach((item:any) => {
  tempTotal += parseFloat(item.amount);
});

this.lblfinalbt=tempTotal;
    //alert('New BT Record Inserted Successfully!');
    this.BTTEVoucherEntry.controls['Amount'].reset();
    this.snackbar.show('New BT Record Inserted Successfully!', 'success');

  } else{

    this.snackbar.show('Please fill the mandatory fields in the form !', 'alert');
    return
  }
   }

   tempRecordRemove(key:number){

    if (confirm('Are you sure you want to delete this?')) {
      let tempData:any=[];
  this.tempArray.data.forEach((value,index)=>{
        if (index!=key ) {
          tempData.push(value);
        }

      });

      this.tempArray.data=this.tempArray.data=tempData;

   }
   return false;
  }



   voucherBookEntery(){
    this.ApiMethods.postresultservice(this.ApiService.voucherBookEntery, this.tempArray.data).subscribe((resp:any) => {
      this.snackbar.show(resp.result.MSG, 'success');
        });
       // this.Reset();
   }


   selectTEVoucher(row:any){
    if(this.tEVoucherEntryForm.getRawValue().blockTypes==1){
      this.selectTEVoucherMain(row);
    }else{
      this.tebookTransferDetail(row);
    }


   }




   selectTEVoucherMain(row:any){

    this.loader.setLoading(true);
    this.isShowGrnMinusEntryFormDetails=false;
    this.isEditGrnMinusEntryFormDetails=true;
    let postData={
      "treasuryCode":this.Helper.Treasury_Code,
      "majorHead":this.tEVoucherEntryForm.getRawValue().majorHead.majorheadcode,
      "voucherNo":row.VoucherNo,
      "ddoCode":row.DDOCode,
      "type": 2,
      "billCode": row.TREASURY_REFNO,
      "finYear": row.finYear,
  }
  this.ApiMethods.postresultservice(this.ApiService.voucherBudgetDetail,postData).subscribe((resp:any) => {
    this.TREASURY_REFNO=row.TREASURY_REFNO;
    this.budgetDetailTE();
    this.loader.setLoading(false);
    if (resp.result && resp.result.length > 0) {
      let resultData= resp.result[0];
     // console.log("resultData==>>>",resultData);
      this.selectedDDOCode =resultData.DDOCode;
      this.selectedOfficeId =resultData.OfficeId;
      this.GrnMinusEntryFormDetails.patchValue({
        DDOCode: resultData.DDOCode,
       // OfficeName: resultData.OfficeId,
        DetailsHead: resultData.BudgetHead,
        grossAmount: resultData.grossamt,
      });

     this.getDdoNameList();

     let VotedCharged= resultData.VotedCharged.toUpperCase();
     let PlanNonPlan= resultData.PlanNonPlan.toUpperCase();
      this.GrnMinusEntryFormDetails.get('OfficeName').patchValue(resultData.OfficeId);
      this.GrnMinusEntryFormDetails.get('objectHead').patchValue(resultData.ObjectHead);
      this.GrnMinusEntryFormDetails.get('VotedCharged').patchValue(VotedCharged);
      this.GrnMinusEntryFormDetails.get('TREASURY_REFNO').patchValue(row.TREASURY_REFNO);
      this.GrnMinusEntryFormDetails.get('PlanNonPlan').patchValue(PlanNonPlan);
     this.getPdAccountList(resultData.BudgetHead);

    }
    });




   }

   budgetDetailTE(){
    this.loader.setLoading(true);
    this.ApiMethods.getservice(this.ApiService.budgetDetailTE+this.TREASURY_REFNO).subscribe((resp:any) => {
      this.loader.setLoading(false);
      this.budgetDetailTEData.data=[];
      if (resp.result && resp.result.length > 0) {
        this.budgetDetailTEData.data = resp.result;





       // let total = 0.00;





   }

  });

}


getDeletedSelection(sno:any){
  if (confirm('Are you sure you want to delete this?')) {

let postData={
  "treasuryRefNo":this.TREASURY_REFNO,
  "sno":sno
}
this.loader.setLoading(true);
  this.ApiMethods.postresultservice(this.ApiService.budgetAllocationTe,postData).subscribe((resp:any) => {
    this.loader.setLoading(false);
    if (resp.result && resp.result.length > 0) {
      this.snackbar.show(resp.result[0].MSG, 'success');
      this.budgetDetailTE();
    }

});

this.budgetDetailTE();
}

}


tebookTransferDetail(row:any){
  this.addNewBTDetail=false;
  this.TREASURY_REFNO=row.TREASURY_REFNO;
  let postData={
    "treasuryRefNo":this.TREASURY_REFNO,
    "type":1
  }
  this.loader.setLoading(true);
    this.ApiMethods.postresultservice(this.ApiService.tebookTransferDetail,postData).subscribe((resp:any) => {
      this.loader.setLoading(false);
      this.isShowGrnMinusEntryFormDetails=false;
      if (resp.result && resp.result.length > 0) {
        this.budgetDetailTEData.data = resp.result;
        let total=0.00;
        resp.result.forEach((item:any) => {
          total += parseFloat(item.amount);
        });

        this.lblbttotal=total;
       // alert(this.lblbttotal);
        this.getBtTeDetail();
       // alert();


}

})

}

getBtTeDetail(){
  this.loader.setLoading(true);
  this.ApiMethods.getservice(this.ApiService.getBtTeDetail+this.TREASURY_REFNO).subscribe((resp:any) => {
    this.loader.setLoading(false);
    if (resp.result && resp.result.length > 0) {
     this.btArrayData= resp.result;
      this.tempArray.data=resp.result;
      let total=0.00;
        resp.result.forEach((item:any) => {
  total += parseFloat(item.amount);
});

this.lblfinalbt=total;

 }

});


}


fetchSelection(row:any){
  this.tempArray.data=[];
  this.addNewBTDetail=true;
   //this.BTTEVoucherEntry.get('Amount').patchValue(row.amount);
   this.BTTEVoucherEntry.get('oldBudgetHead').patchValue(row.budgetHead);
   this.BTTEVoucherEntry.get('oldpdacno').patchValue(row.pdAcNo);
   this.BTTEVoucherEntry.get('Division').patchValue(row.divisionCode);
   this.BTTEVoucherEntry.get('ObjectHead').patchValue(row.objectHead);
   this.BTTEVoucherEntry.get('PlanNonPlan').patchValue(row.bfcType);
   this.BTTEVoucherEntry.get('VotedCharged').patchValue(row.headType);
   this.BTTEVoucherEntry.get('DetailedHead').patchValue(row.budgetHead);
  const selectmajorHead = this.majorHeadData.filter((item: any) => item.majorheadcode === row.budgetHead.substring(0, 4))[0];
this.BTTEVoucherEntry.patchValue({
  MajorHead: selectmajorHead

});

this.getDivisionlist();
console.log("Division==>>>",row.divisionCode);
let StrdivisionCode =row.divisionCode.toString();
this.BTTEVoucherEntry.get('Division').patchValue(StrdivisionCode);
this.getPdAccountList(row.budgetHead);
console.log("PDACNO==>>>",row.pdAcNo);
let StrPdAcNo =row.pdAcNo.toString();
this.BTTEVoucherEntry.get('PDACNO').patchValue(StrPdAcNo);
// this.BTTEVoucherEntry.setValue({
//   PDACNO: 472

// });


console.log("selectbudgetHead==>>",row.budgetHead);
//  this.BTTEVoucherEntry.get('MajorHead').patchValue(majorHead);
  this.getBtTeDetail();

}

displayMajorHeadBT(selectedoption: any) {
  //return selectedoption ? selectedoption.majorheadname :this.tEVoucherEntryForm.getRawValue().majorHead.majorheadname;
  return selectedoption ? selectedoption.majorheadname :undefined;
}



// http://172.22.32.117:9095/rajkosh/3.0/voucher/get/tebook/transfer/detail

// {
//     "treasuryRefNo": 0,
//     "type": 1
// }



}
