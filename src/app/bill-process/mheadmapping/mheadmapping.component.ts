import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { Router } from '@angular/router';
import { debounceTime, map, Observable, of, startWith, switchMap } from 'rxjs';
import { LoaderService } from 'src/app/services/loaderservice';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import { Renderer2} from '@angular/core';
import { IUpdateMHeadsModal } from 'src/app/utils/Master';
import { Helper } from 'src/app/utils/Helper';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';



@Component({
  selector: 'app-mheadmapping',
  templateUrl: './mheadmapping.component.html',
  styleUrls: ['./mheadmapping.component.scss'],
})
export class MheadmappingComponent implements OnInit {

  constructor(private _liveAnnouncer: LiveAnnouncer,private router: Router, private apiMethod: ApiMethods, public loader: LoaderService, private apiService: ApiService, private snackbar: SnackbarService, private renderer: Renderer2,private finyear_:Helper,private toyear_:Helper,private TCode:Helper,private UId:Helper,private IPAdd:Helper) {
    this.searchFn(this.radioOptions);
  }

  MHMapGrp: any;
  radioOptions: string = '1';
  SelectUserType: string= '';
  lstUserType: any = [];
  userTypeListOptions: Observable<any[]> | undefined;
  MajorHeadControl = new FormControl();
  BudgetHeadControl = new FormControl();
  DDOCodeControl = new FormControl();
  final_HeadList: any = [];
  MajorheadList: any = [];
  MajorHeadListarr: any = [];
  BudgetHeadListarr: any = [];
  search = new FormControl();
  searchBudgetHead = new FormControl();

  tCode: any = this.TCode.Treasury_Code;
  MHAssignList: MatTableDataSource<MheadmappingComponent> = new MatTableDataSource();
  btnAdd = 'Add';
  FinalMHString : any;
  SelectUserID : number = 0 ;
  isAddBtnVisible:boolean = false;
  showTab_Table: boolean = false;
  final_BudgetHeadList:any;
 FinalBudget:any;
 final_DDOCode:any;
 FinalDDOCode:any;
 DDOCodeListarr:any;
 userinfo: any;
 ChooseOption: any = '';
 Treasuryoptions: Observable<any[]> | undefined;
 TreasuryListarr: any[] = [];
 typeMajorId:number = 0 ;
 majorHeadtypeData:any;
 majorHeadDataList: Observable<any[]> | undefined;
 MHMapGrpTable:any;
 majorHead=new FormControl();
 selecteMajorType=new FormControl();
 DDOCodesearch=new FormControl();
 DDOCode = new FormControl();
 postData:any = {};
 majorHeadsPostData:any[]=[];
 apiURL:any;
 displayedColumns:any[]=[];




  UpdateMHeadsModal: IUpdateMHeadsModal = {
    treasuryCode: this.TCode.Treasury_Code,
    userId:this.UId.UserId,
    majorHeads: "",
    action:""
  }







  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.MHAssignList.sort = sort;
    this.MHAssignList.sort = sort;
  }
  @ViewChild(MatPaginator) set MatPaginator(paginator:MatPaginator){
    this.MHAssignList.paginator = paginator;
    this.MHAssignList.paginator = paginator;
  }
  ngOnInit(): void {

    this.selecteMajorType = new FormControl();
    this.DDOCode = new FormControl();
    this.majorHead = new FormControl();
    this.searchBudgetHead = new FormControl();
    let financialYr  = this.finyear_.year.toString().substring(2,4) + this.toyear_.finyear.toString().substring(2,4);   // It Shows = 2324
    this.userinfo = this.apiMethod.getUserInfo();
    this.MHMapGrp = new FormGroup({
      rblTypeCtrl: new FormControl('', Validators.required),
      ddlUserList: new FormControl('', Validators.required),
      myInput: new FormControl(''),
      TreasuryControl: new FormControl({ value: this.TCode.Treasury_Code}, { validators: [this.apiMethod.autocompleteObjectValidator(), Validators.required], }),
      Year: new FormControl({ value:  financialYr, disabled: true }),
      typeMajor: new FormControl('', Validators.required),
      selecteMajorType: this.selecteMajorType,
      DDOCode: this.DDOCode,
      majorHead: this.majorHead,
      searchBudgetHead: this.searchBudgetHead,
      activeDate: new FormControl({ value: new Date(), disabled: false },Validators.required),

    });

    this.getTreasuryList();
  }




  getMajorHeadList(type: number, userID: number) {

    this.MajorHeadListarr = [];
    this.FinalMHString = [];
    this.MajorHeadControl.reset();

    this.loader.setLoading(true);
    this.apiMethod.getservice( this.apiService.GetMajorHeadMappingList + type + '/' +  userID + '/' + this.tCode) .subscribe(
        (resp:any) => {
          console.log('MajorHeadList__res', resp);
          let data = resp.result;
          console.log('CCCCCCCCCCCCCCCCC-Entry6',resp.result);
          if (resp.result && resp.result.length > 0)
          {
            this.loader.setLoading(false);
            this.MajorHeadListarr = resp.result;
            console.log('MajorHeadList_inbetween', this.MajorHeadListarr);

            this.majorHeadDataList = this.MHMapGrp.controls[
              'selecteMajorType'
            ].valueChanges.pipe(
              startWith(''),
              map((value: any) => {
                console.log('firstMajormap__', value);
                return typeof value === 'string' ? value : value.data;
              }),
              map((MajorHeadCodeName: any) => {
                return MajorHeadCodeName
                  ? this._filterMajorHeadCod(MajorHeadCodeName, data)
                  : data.slice();
              })
            );






            // Call Again Search List Afger User Wise Filter ------------------------begiN-----------
            this.$search = this.search.valueChanges.pipe(
              startWith(null),
              debounceTime(200),
              switchMap((res: any) => {
                if (!res) return of(this.MajorHeadListarr);
                let fff = res.toLowerCase();
                console.log(fff);
                return of(
                  this.MajorHeadListarr.filter(
                    (x: any) => x.MajorHeadCodeName.toLowerCase().indexOf(fff) >= 0

                  )
                );
              })
            );
          // Call Again Search List Afger User Wise Filter ------------------------enD------------

          }
          else
          {
            this.loader.setLoading(false);
            this.MajorHeadListarr = [];
          }
        },
        (res:any) => {
          console.log('errror message___', res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
            this.MajorHeadListarr = [];
            this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger');
          }
        }
      );
  }

  getMHUserAssignList(userID: number) {

    this.SelectUserID = userID;

    this.MHAssignList.data = [];
    this.loader.setLoading(true);
    this.apiMethod.getservice(this.apiService.MHMappingList + userID + '/' + this.tCode).subscribe((resp:any) => {

          this.MHAssignList.data = [];
          console.log('HHHHHHHHHHHHHHHHHHHH_response', userID);

          let data = resp.result;
          if (resp.result && resp.result.length > 0)
          {
              this.loader.setLoading(false);
              this.btnAdd = 'Update';

              this.MHAssignList.data = resp.result;
              this.showTab_Table = true;

          }
          else
          {
            this.btnAdd = 'Add';

            this.loader.setLoading(false);

           this.MHAssignList.data = [];
           this.showTab_Table = false;
          }
        },
        (res:any) => {
          console.log('errror message___', res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);

            this.MHAssignList.data = [];
            this.snackbar.show('Something Went Wrong ! Please Try Again','danger');
          }
        }
      );

      this.getMajorHeadList(2, this.SelectUserID);
  }


  $search = this.search.valueChanges.pipe(
    startWith(null),
    debounceTime(200),
    switchMap((res: any) => {
      if (!res) return of(this.MajorHeadListarr);
      let fff = res.toLowerCase();
      console.log(fff);
      return of(
        this.MajorHeadListarr.filter(
          (x: any) => x.MajorHeadCodeName.toLowerCase().indexOf(fff) >= 0

        )
      );
    })
  );

   onRadioButtonChange(data: any) {

    this.MHMapGrp.controls['ddlUserList'].reset();
    console.log('radioOptions', this.radioOptions);
    console.log('data', data.value);
    this.searchFn(data.value);

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

  searchFn(val: any) {
    this.lstUserType = [];
    this.loader.setLoading(true);
    let UserType;
    let tCode = this.TCode.Treasury_Code;
    let apiCalling = this.apiService.GetMappingUserList;
    if (val == '1') {
      UserType = 5;
    } else if (val == '2') {
      UserType = 4;
    } else {
      UserType = 0;
    }
    this.apiMethod.getservice(apiCalling + tCode + '/' + UserType).subscribe((resp:any) => {
          console.log('response', resp);
          if (resp.result && resp.result.length > 0) {
            this.loader.setLoading(false);
            let data = resp.result;
            this.userTypeListOptions = this.MHMapGrp.controls[
              'ddlUserList'
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
            this.lstUserType = [];
            this.lstUserType = [];
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

  OnUsertypeSelected(data: any) {
    this.MHMapGrp.controls['typeMajor'].reset();
    console.log('UserTypeSelected', data);
    this.MajorHeadListarr = [];
    let type = 2;
    this.getMajorHeadList(type, data.UserId);
    this.SelectUserID= data.UserId;
    this.typeMajorId=0;

   // console.log("typeMajor",this.MHMapGrp.controls['typeMajor']);

   // alert(this.typeMajorId);
   this.showTab_Table = false;

    if(this.typeMajorId==1 &&  this.SelectUserID>0 ){

     this.fetchMajorHeadList();
    }
    if(this.typeMajorId==2 &&  this.SelectUserID>0 ){
      this.getBudgetHeadList();
    }

    if(this.typeMajorId==3 &&  this.SelectUserID>0 ){
      this.getDDOCodeList();
    }


    //this.getMHUserAssignList(data.UserId);

    this.isAddBtnVisible = true;
  }

  selectionChange(option: any) {
    let value = this.MajorHeadControl.value || [];
    if (option.selected) value.push(option.value);
    else value = value.filter((x: any) => x != option.value);
    this.MajorHeadControl.setValue(value);
    this.final_HeadList = value;
    console.log('QQQQQQQQQQQQQQQQQ_MHMapGrp', this.MHMapGrp);

    let names : string[] = this.final_HeadList.map((a:any) => a.MajorHeadCode);
   this.FinalMHString = [];
    this.FinalMHString = names;
    if(this.FinalMHString.length>0){
      this.MHMapGrp.controls.activeDate.disable();
      this.MHMapGrp.controls.typeMajor.disable();
      this.MHMapGrp.controls.ddlUserList.disable();
      this.MHMapGrp.controls.rblTypeCtrl.disable();

    }else{
      this.MHMapGrp.controls.activeDate.enable();
      this.MHMapGrp.controls.typeMajor.enable();
      this.MHMapGrp.controls.ddlUserList.enable();
      this.MHMapGrp.controls.rblTypeCtrl.enable();

    }
  }


  // Function : Call Insert  API >>>------------------->
  assignMH() {
    this.showTab_Table = false;
    console.log("selectedValue",this.SelectUserType);
    let UserType;
    if ((this.radioOptions == '1')) {
      UserType = 5;
    } else if (this.radioOptions == '2') {
      UserType = 4;
    } else {
      UserType = 0;
    }

   // console.log("byuser",this.UId.UserId);

//return

    this.postData["treasuryCode"]=this.tCode;
    this.postData["userId"]=this.SelectUserID;
    this.postData["byuser"]=this.UId.UserId;
    this.postData["userRole"]=UserType;
   // let postDataType=this.MHMapGrp.value.typeMajor;
    let postDataType=this.MHMapGrp.controls.typeMajor.value


    if(postDataType==1){
      this.apiURL=this.apiService.majorHeadMapping;
      //this.postData["majorHeads"]= this.MHMapGrp.controls.majorHead.value;
      this.postData["majorHeads"]= this.MHMapGrp.controls.majorHead.value.map((a:any) => a.MajorHeadCode);


      if( this.postData["majorHeads"]==null || this.postData["majorHeads"].length==0 ){
        this.snackbar.show('Please Select Major Head', 'danger');
        return;
      }

    }
    if(postDataType==2){
      this.apiURL=this.apiService.budgetHeadMapping;
      this.majorHeadsPostData = [];
    //  this.majorHeadsPostData.push(this.MHMapGrp.value.selecteMajorType.MajorHeadCode);
      this.majorHeadsPostData.push(this.MHMapGrp.controls.selecteMajorType.value.MajorHeadCode);

      this.postData["majorHeads"]=this.majorHeadsPostData;
     // this.postData["budgetHead"]=this.MHMapGrp.controls.searchBudgetHead.value;
      //this.postData["budgetHead"]=this.MHMapGrp.controls.searchBudgetHead.value;

      this.postData["budgetHead"]= this.MHMapGrp.controls.searchBudgetHead.value.map((a:any) => a.code);

      if( this.postData["budgetHead"]==null || this.postData["budgetHead"].length==0 ){
        this.snackbar.show('Please Select Budget Head', 'danger');
        return;
      }
    }

    if(postDataType==3){
    this.apiURL=this.apiService.ddoCodeMapping;
      //this.postData["ddoCode"]=this.MHMapGrp.controls.DDOCode.value;
      this.postData["ddoCode"]= this.MHMapGrp.controls.DDOCode.value.map((a:any) => a.ddo_code);
      //this.postData["ddoCode"]=this.MHMapGrp.controls.DDOCode.value;

      if( this.postData["ddoCode"]==null || this.postData["ddoCode"].length==0 ){
        this.snackbar.show('Please Select DDO Code', 'danger');
        return;
      }

    }
    console.log("data",this.postData);
    console.log("drp",this.MHMapGrp.controls['ddlUserList'].value);
    console.log("Before_Calling_API_InsertMappingList_Result",this.postData );

    this.MHMapGrp.disable();
    if( this.postData.userId>0 && this.postData.byuser>0 && this.postData.userRole>0  ){
     this.apiMethod.postresultservice(this.apiURL,this.postData).subscribe((resp:any) => {
      console.log("After_Calling_API_InsertMappingList_Result",this.postData);
      if (resp.result == true) {
        this.loader.setLoading(false);
        if(postDataType==1){
          this.snackbar.show('User Map with Major Successfully !', 'success');
          this.fetchMajorHeadList();
        }
        if(postDataType==2){
          this.snackbar.show('User Map with BudgetHead Successfully !', 'success');
          this.getBudgetHeadList();
        }
        if(postDataType==3){
          this.snackbar.show('User Map with DDO Code Successfully !', 'success');
          this.getDDOCodeList();
        }

       // this.getMHUserAssignList(this.SelectUserID);
       // this.getMajorHeadList(this.postData.userRole, this.SelectUserID); // Load Major Head CheckBox List
        console.log("GGGGGGGGGGGGGGGG_After_getMajorHeadList_Result", this.postData.userRole, this.SelectUserID);

      }
    },
      (res:any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger');
        }
      }
    );

  }
   // this.getMHUserAssignList(this.SelectUserID);
  }




      ResetPage() {
        window.location.reload();
      }



      // TO Load Data Sorting >>>------------------->
    announceSortChange(sortState: Sort) {
      if (sortState.direction) {
        this._liveAnnouncer.announce('Sorted ${sortState.direction}ending');
      } else {
        this._liveAnnouncer.announce('Sorting cleared');
      }
    }
    // TO Load Data Searching..............
    applyFilter(filterValue: string) {
      this.MHAssignList.filter = filterValue.trim().toLowerCase();

      if (this.MHAssignList.paginator) {
        this.MHAssignList.paginator.firstPage();
      }
    }

    fetchBudgetHead() {
     // this.BudgetHeadControl.reset();
      this.loader.setLoading(true);
      let majorheadcode= this.majorHeadtypeData.MajorHeadCode;
            this.apiMethod.getservice(this.apiService.fetchGroupSubHead+1+'/'+majorheadcode).subscribe((resp:any) => {
            console.log('BudgeHeadList__res', resp);
            let data = resp.result;
            console.log('CCCCCCCCCCCCCCCCC-Entry8',resp.result);
            if (resp.result && resp.result.length > 0)
            {
              this.loader.setLoading(false);
              this.BudgetHeadListarr = resp.result;
              console.log('BudgetHeadList_inbetween', this.BudgetHeadListarr);


              // Call Again Search List Afger User Wise Filter ------------------------begiN-----------
              this.$searchBudgetHead = this.searchBudgetHead.valueChanges.pipe(
                startWith(null),
                debounceTime(200),
                switchMap((res: any) => {
                  if (!res) return of(this.BudgetHeadListarr);
                  let fff = res.toLowerCase();
                  console.log(fff);
                  return of(
                    this.BudgetHeadListarr.filter(
                      (x: any) => x.groupsubheadname.toLowerCase().indexOf(fff) >= 0

                    )
                  );
                })
              );
            // Call Again Search List Afger User Wise Filter ------------------------enD------------

            }
            else
            {
              this.loader.setLoading(false);
              this.BudgetHeadListarr = [];
            }
          },
          (res:any) => {
            console.log('errror message___', res.status);
            if (res.status != 200) {
              this.loader.setLoading(false);
              this.BudgetHeadListarr = [];
              this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger');
            }
          }
        );
    }

    $searchBudgetHead = this.searchBudgetHead.valueChanges.pipe(
      startWith(null),
      debounceTime(200),
      switchMap((res: any) => {
        if (!res) return of(this.BudgetHeadListarr);
        let fff = res.toLowerCase();
        console.log(fff);
        return of(
          this.BudgetHeadListarr.filter(
            (x: any) => x.groupsubheadname.toLowerCase().indexOf(fff) >= 0

          )
        );
      })
    );


    selectionBudgetChange(option: any) {
      let value = this.BudgetHeadControl.value || [];
      if (option.selected) value.push(option.value);
      else value = value.filter((x: any) => x != option.value);
      this.BudgetHeadControl.setValue(value);
      this.final_BudgetHeadList = value;
      let names : string[] = this.final_BudgetHeadList.map((a:any) => a.code);
     this.FinalBudget = [];
      this.FinalBudget = names;
      //console.log('FinalBudget', this.FinalBudget);

      if(this.FinalBudget.length>0){
        this.MHMapGrp.controls.activeDate.disable();
        this.MHMapGrp.controls.typeMajor.disable();
        this.MHMapGrp.controls.ddlUserList.disable();
        this.MHMapGrp.controls.rblTypeCtrl.disable();
        this.MHMapGrp.controls.selecteMajorType.disable();


      }else{
        this.MHMapGrp.controls.activeDate.enable();
        this.MHMapGrp.controls.typeMajor.enable();
        this.MHMapGrp.controls.ddlUserList.enable();
        this.MHMapGrp.controls.rblTypeCtrl.enable();
        this.MHMapGrp.controls.selecteMajorType.enable();

      }

    }

    selectionDDOCodeChange(option: any) {
     // alert();

      let value = this.DDOCodeControl.value || [];

      if (option.selected) value.push(option.value);
      else value = value.filter((x: any) => x != option.value);
      this.DDOCodeControl.setValue(value);
      this.final_DDOCode = value;
    // console.log("option==>>", this.final_DDOCode);

      let names : string[] = this.final_DDOCode.map((a:any) => a.ddo_code);

    // this.FinalDDOCode = [];
      this.FinalDDOCode = names;

      console.log('FinalDDOCode', this.FinalDDOCode);

      if( this.FinalDDOCode.length>0){
        this.MHMapGrp.controls.activeDate.disable();
        this.MHMapGrp.controls.typeMajor.disable();
        this.MHMapGrp.controls.ddlUserList.disable();
        this.MHMapGrp.controls.rblTypeCtrl.disable();

      }else{
        this.MHMapGrp.controls.activeDate.enable();
        this.MHMapGrp.controls.typeMajor.enable();
        this.MHMapGrp.controls.ddlUserList.enable();
        this.MHMapGrp.controls.rblTypeCtrl.enable();

      }


    }


    fetchDDOCodeList() {
    //  this.DDOCodeControl.reset();
      this.loader.setLoading(true);
      let treasaryCode= this.userinfo.treasCode;
      console.log("treasaryCodelist",treasaryCode);
            this.apiMethod.getservice(this.apiService.payTrgGetDDOCode+'/'+treasaryCode+'/1').subscribe((resp:any) => {
            console.log('DDOCodeList__res', resp);
            let data = resp.result;
            console.log('CCCCCCCCCCCCCCCCC-DDOCode-Entry8',resp.result);
            if (resp.result && resp.result.length > 0)
            {
              this.loader.setLoading(false);
              this.DDOCodeListarr = resp.result;
              console.log('DDOCodeList_inbetween', this.DDOCodeListarr);

              // Call Again Search List Afger User Wise Filter ------------------------begiN-----------
              this.$DDOCodesearch = this.DDOCodesearch.valueChanges.pipe(
                startWith(null),
                debounceTime(200),
                switchMap((res: any) => {
                  if (!res) return of(this.DDOCodeListarr);
                  let fff = res.toString().toLowerCase();
                  console.log(fff);
                  return of(
                    this.DDOCodeListarr.filter(
                      (x: any) => x.DDO_NAME.toString().toLowerCase().indexOf(fff) >= 0

                    )
                  );
                })
              );
            // Call Again Search List Afger User Wise Filter ------------------------enD------------

            }
            else
            {
              this.loader.setLoading(false);
              this.DDOCodeListarr = [];
            }
          },
          (res:any) => {
            console.log('errror message___', res.status);
            if (res.status != 200) {
              this.loader.setLoading(false);
              this.DDOCodeListarr = [];
              this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger');
            }
          }
        );
    }

    $DDOCodesearch = this.DDOCodesearch.valueChanges.pipe(
      startWith(null),
      debounceTime(200),
      switchMap((res: any) => {
        if (!res) return of(this.DDOCodeListarr);
        let fff = res.toString().toLowerCase();
        console.log(fff);
        return of(
          this.DDOCodeListarr.filter(
            (x: any) => x.DDO_NAME.toString().toLowerCase().indexOf(fff) >= 0

          )
        );
      })
    );

    displayTreasFn(selectedoption: any) {
      console.log("display_fun_call aaa", selectedoption.TreasuryName);
      return selectedoption ? selectedoption.TreasuryName : undefined;
    }

    getTreasuryList() {
      this.loader.setLoading(true);
         this.apiMethod.getservice(this.apiService.treasuryList).subscribe((resp:any) => {

         console.log("Auditor__res", resp);
         let data = resp.result
         if (resp.result && resp.result.length > 0) {
           this.TreasuryListarr = resp.result
           this.Treasuryoptions = this.MHMapGrp.controls['TreasuryControl'].valueChanges.pipe(
             startWith(''),
             map((value: any) => {
               return typeof value === 'string' ? value : value.treasuryCode
             }),
             map((treasury: any) => {

               return treasury ? this._filterTreas(treasury, data) : data.slice()
             })
           );
           const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.TCode.Treasury_Code)[0];
           this.MHMapGrp.patchValue({
             TreasuryControl: treasury

           })

           if(this.TCode.Treasury_Code !="5000")
           {
             this.MHMapGrp.controls['TreasuryControl'].disable();
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


      onMajorRadioButtonChange(data: any) {

        this.fetchDDOCodeList();
        this.majorHead.reset();
        this.selecteMajorType.reset();
        this.MHMapGrp.controls.searchBudgetHead.reset();
        //this.searchBudgetHead.reset();
        this.DDOCode.reset();
        if(this.SelectUserID>0 ){
          this.typeMajorId=data.value;
        }



      //  alert(this.typeMajorId);
        if(this.typeMajorId==1){
          this.majorHead.setValidators([]);
          this.selecteMajorType.setValidators([]);
          this.searchBudgetHead.setValidators([]);
          this.DDOCodesearch.setValidators([]);
        }

        if(this.typeMajorId==2){
          this.majorHead.setValidators([]);
          this.DDOCodesearch.setValidators([]);
          this.selecteMajorType.setValidators([]);
          this.searchBudgetHead.setValidators([]);
        }

        if(this.typeMajorId==3){
          this.majorHead.setValidators([]);
          this.selecteMajorType.setValidators([]);
          this.searchBudgetHead.setValidators([]);
          this.DDOCode.setValidators([]);
        }

        this.showTab_Table = false;

        if(this.typeMajorId==1 &&  this.SelectUserID>0 ){

          this.fetchMajorHeadList();
         }
         if(this.typeMajorId==2 &&  this.SelectUserID>0 ){
           this.getBudgetHeadList();
         }

         if(this.typeMajorId==3 &&  this.SelectUserID>0 ){
           this.getDDOCodeList();
         }
       // console.log(this.MHMapGrp);

      }

      OnMajorHeadtypeSelected(data: any) {
        this.majorHeadtypeData=data;
        console.log('majorHeadtypeData',  this.majorHeadtypeData);
        this.MHMapGrp.controls['searchBudgetHead'].reset();
        this.fetchBudgetHead()

      }

      displayMajorHeadList(data: any) {
        console.log('displayfuncall',data);

        return data ? data.MajorHeadCodeName : undefined;
      }

      _filterMajorHeadCod(value: string, data: any) {
        return data.filter((option: any) => {
          return option.MajorHeadCodeName.toLowerCase().includes(value.toLowerCase());
        });
      }


      fetchMajorHeadList() {
        this.MHAssignList.data = [];
        this.loader.setLoading(true);
        this.apiMethod.getservice(this.apiService.fetchMajorHeadMapping + this.SelectUserID + '/' + this.tCode).subscribe((resp:any) => {
              this.MHAssignList.data = [];
              console.log('HHHHHHHHHHHHHHHHHHHH_response', this.SelectUserID);
              let data = resp.result;
              this.displayedColumns=[
                'SrNo',
                'ByUser',
                'MajorHeads',
                'TransDate',
                'RevokeDate',
                'Action',
              ];
              if (resp.result && resp.result.length > 0)
              {
                  this.loader.setLoading(false);
                  this.btnAdd = 'Update';
                  this.MHAssignList.data = resp.result;
                  this.showTab_Table = true;

              }
              else
              {
                this.btnAdd = 'Add';
                this.loader.setLoading(false);
               this.MHAssignList.data = [];
               this.showTab_Table = false;
              }
            },
            (res:any) => {
              console.log('errror message___', res.status);
              if (res.status != 200) {
                this.loader.setLoading(false);
                this.MHAssignList.data = [];
                this.snackbar.show('Something Went Wrong ! Please Try Again','danger');
              }
            }
          );
      }

      getBudgetHeadList() {
        this.MHAssignList.data = [];
        this.loader.setLoading(true);
        this.apiMethod.getservice(this.apiService.fetchBudgetHeadMapping + this.SelectUserID + '/' + this.tCode).subscribe((resp:any) => {
          this.displayedColumns=[
            'SrNo',
            'ByUser',
            'BudgetHead',
            'TransDate',
            'RevokeDate',
            'Action',
          ];
              this.MHAssignList.data = [];
              console.log('HHHHHHHHHHHHHHHHHHHH_response', this.SelectUserID);
              let data = resp.result;
              if (resp.result && resp.result.length > 0)              {
                  this.loader.setLoading(false);
                  this.btnAdd = 'Update';
                  this.MHAssignList.data = resp.result;
                  this.showTab_Table = true;

              }
              else
              {
                this.btnAdd = 'Add';
                this.loader.setLoading(false);
               this.MHAssignList.data = [];
               this.showTab_Table = false;
              }
            },
            (res:any) => {
              console.log('errror message___', res.status);
              if (res.status != 200) {
                this.loader.setLoading(false);

                this.MHAssignList.data = [];
                this.snackbar.show('Something Went Wrong ! Please Try Again','danger');
              }
            }
          );
      }


      getDDOCodeList() {
      //  alert();
        this.MHAssignList.data = [];
        this.loader.setLoading(true);
        this.apiMethod.getservice(this.apiService.fetchDdoCodeMapping + this.SelectUserID + '/' + this.tCode).subscribe((resp:any) => {
          this.displayedColumns=[
            'SrNo',
            'ByUser',
            'DdoName',
            'TransDate',
            'RevokeDate',
            'Action',
          ];
              this.MHAssignList.data = [];
              console.log('HHHHHHHHHHHHHHHHHHHH_response', this.SelectUserID);
              let data = resp.result;
              if (resp.result && resp.result.length > 0)
              {
                  this.loader.setLoading(false);
                  this.btnAdd = 'Update';
                  this.MHAssignList.data = resp.result;
                  this.showTab_Table = true;

              }
              else
              {
                this.btnAdd = 'Add';
                this.loader.setLoading(false);
               this.MHAssignList.data = [];
               this.showTab_Table = false;
              }
            },
            (res:any) => {
              console.log('errror message___', res.status);
              if (res.status != 200) {
                this.loader.setLoading(false);
                this.MHAssignList.data = [];
                this.snackbar.show('Something Went Wrong ! Please Try Again','danger');
              }
            }
          );
      }

       // Function : Call Update Action Revoke / Enable Put API >>>------------------->
       UpdateMajorHeadsAuditorMap(value: any) {
      this.loader.setLoading(true);
      if(value.RevokeDate=="-")
      {
        this.UpdateMHeadsModal.action = "N";
      }
      else
      {
        this.UpdateMHeadsModal.action = "Y";
      }

     let dataPost= {
        "treasuryCode":this.tCode,
        "userId":this.SelectUserID,
        "majorHead":value.MajorHeads,
        "action":this.UpdateMHeadsModal.action,
    }

        this.apiMethod.postresultservice(this.apiService.updateMajorMapping,dataPost).subscribe((resp:any) => {

          if (resp.result == true) {

            if(value.MajorHeads=="0000")
            {
              this.snackbar.show('All other MajorHeads Automatically Revoked !', 'success');
            }
            else
            {
              this.snackbar.show('MajorHeads Automatically Revoked !', 'success');
            }
            this.loader.setLoading(false);
            this.fetchMajorHeadList();
            //this.getMHUserAssignList(this.SelectUserID);
          }
        },
          (res:any) => {
            console.log("errror message___", res.status);
            if (res.status != 200) {
              this.loader.setLoading(false);
              this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger');
            }
          }
        );
        this.fetchMajorHeadList();

        //this.getMHUserAssignList(this.SelectUserID);
      }


      UpdateBudgetHeadAuditorMap(value: any) {
        this.loader.setLoading(true);

        if(value.RevokeDate=="-")
        {
          this.UpdateMHeadsModal.action = "N";
        }
        else
        {
          this.UpdateMHeadsModal.action = "Y";
        }

        let dataPost= {
          "treasuryCode":this.tCode,
          "userId":this.SelectUserID,
          "budgetHead":value.BudgetHead,
          "action":this.UpdateMHeadsModal.action,
      }
          this.apiMethod.postresultservice(this.apiService.updateBudgetHeadMapping,dataPost).subscribe((resp:any) => {
            if (resp.result == true) {
              if(value.BudgetHead=="0000")
              {
                this.snackbar.show('All other Budget Head Automatically Revoked !', 'success');
              }
              else
              {
                this.snackbar.show('Budget Head Automatically Revoked !', 'success');
              }
              this.loader.setLoading(false);
              //this.getMHUserAssignList(this.SelectUserID);
            }
          },
            (res:any) => {
              console.log("errror message___", res.status);
              if (res.status != 200) {
                this.loader.setLoading(false);
                this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger');
              }
            }
          );

          this.getBudgetHeadList();
         // this.getMHUserAssignList(this.SelectUserID);
        }

        UpdateDDOCodeAuditorMap(value: any) {
          this.loader.setLoading(true);

          if(value.RevokeDate=="-")
          {
            this.UpdateMHeadsModal.action = "N";
          }
          else
          {
            this.UpdateMHeadsModal.action = "Y";
          }

          let dataPost= {
            "treasuryCode":this.tCode,
            "userId":this.SelectUserID,
            "ddoCode":value.DdoCode,
            "action":this.UpdateMHeadsModal.action,
        }

            this.apiMethod.postresultservice(this.apiService.updateDdoCodeMapping,dataPost).subscribe((resp:any) => {

              if (resp.result == true) {

                if(value.DdoCode=="0000")
                {
                  this.snackbar.show('All other DDOCode Automatically Revoked !', 'success');
                }
                else
                {
                  this.snackbar.show('DDOCode Automatically Revoked !', 'success');
                }
                this.loader.setLoading(false);
               // this.getMHUserAssignList(this.SelectUserID);
              }
            },
              (res:any) => {
                console.log("errror message___", res.status);
                if (res.status != 200) {
                  this.loader.setLoading(false);
                  this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger');
                }
              }
            );
            this.getDDOCodeList();

          //  this.getMHUserAssignList(this.SelectUserID);
          }











    }
