import { Component, OnInit, Input, ViewChild, OnChanges, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { LoaderService } from '../../services/loaderservice';
import { ApiService } from 'src/app/utils/utility.service';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { MatDialogRef } from '@angular/material/dialog';
import { IGetObjectionDataList, ISaveObjection } from 'src/app/utils/Master';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { log } from 'console';
import { debounceTime, of, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-objectiondialog',
  templateUrl: './objection-dialog.component.html',
  styleUrls: ['./objection-dialog.component.scss']
})
export class ObjectiondialogComponent implements OnInit, OnChanges {
  http: any;
  UserType: any;

  @Input() ObjBillDetails: any
  @Input() IconFlag: boolean = false
  Icon_Close: any



  constructor(private router: Router, private ApiMethods: ApiMethods, private snackbar: SnackbarService, public loader: LoaderService, private ApiService: ApiService, @Optional() private dialogRef: MatDialogRef<ObjectiondialogComponent>) {

  }
  ngOnChanges(changes: any) {
    if (changes.hasOwnProperty('ObjBillDetails')) {
      console.log("chnages_kya_hai", changes.ObjBillDetails.currentValue);
      this.BillType = changes.ObjBillDetails.currentValue.Objbilltype
      this.BillCode = changes.ObjBillDetails.currentValue.Objbillcode
      this.userType = changes.ObjBillDetails.currentValue.userType
      this.userId = changes.ObjBillDetails.currentValue.userId
      this.pageType = changes.ObjBillDetails.currentValue.pageType
      this.routeFrom = changes.ObjBillDetails.currentValue.routeFrom
    }
    if (changes.hasOwnProperty('IconFlag')) {
      console.log("IconFlag__flkg", changes.IconFlag.currentValue);
      this.Icon_Close = changes.IconFlag.currentValue
    }
  }

  BillCode: any;
  BillType: any;
  routeFrom: any = ''
  userId: any;
  userType: any;
  pageType: any;
  Ischecked: boolean = false;
  responseData: any;
  data: any = [];
  data0: any = [];
  data1: any = [];
  data2: Array<any> = [];
  Commentlist: any[] = []
  Common_objlist: any[] = []
  list: any = [];
  objectionname: any;
  billtypedata: any;
  IsDisable: boolean = false;
  panelOpenState = false;
  // show : boolean = false;
  // shows : boolean = false;
  SN: number = 0;
  SNO: number = 0;
  newValue: string = '';
  ObjectForm: any;
  // newValue:any;

  AllObjectionData: any[] = []

  searchSystemObj = new FormControl();
  searchCommanObj = new FormControl();
  searchBillTypeObj = new FormControl();

  myInput = new FormControl();
  commentval = new FormControl();

  isCommonObjectionShow: boolean = false;

  isBillTypeObjectionShow: boolean = false;


  GetObjectionListModal: IGetObjectionDataList = {
    type: 1,  // For All Objection
    billNo: 0,
    userId: 0,
    userType: 0
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  GetObjectionList2Modal: IGetObjectionDataList = {
    type: 2,   // For All Other Objection
    billNo: 0,
    userId: 0,
    userType: 0

  }
  SaveOjection: ISaveObjection = {
    userid: 0,
    // type: 1,
    otherList: '',
    objectionlist: '',
    userType: 0,
    treasuryRefNo: 0,
    // pageType: ''
  }
  ngOnInit(): void {


    console.log("DIALOGPAGE BILL_CoDE", this.BillCode);
    console.log("DIALOGPAGE Page_Type", this.userType);
    console.log("DIALOGPAGE USER_ID", this.userId);
    console.log("DIALOGPAGE Bill_Type", this.BillType);
    console.log("DIALOGPAGE Page_Type", this.pageType);
    this.getCommonMaster();
    this.getSystemObjMaster();
    this.getBillTypeData();

     this.getObjectionData();
    this.getObjectionData2();


    this.ObjectForm = new FormGroup({
      commentval: new FormControl(''),


    })

  }


  getCommonMaster() {
    let url = this.ApiService.ObjectionDetail + 0;                // Calling API for Comman Objection List
    this.ApiMethods.getservice(url).subscribe((resp:any) => {
      console.log("common_mast_list", resp.result);

      this.data = resp.result;
      if (this.data.length > 0) {
        this.isCommonObjectionShow = true;
      }
      this.objectionname = resp.result[0].objectionname;
      this.SN = resp.result.length;
      console.log("CommonMaster", this.data);
    })
  }


  // Searching For Comman Objection List --------------
  $searchCommanObj = this.searchCommanObj.valueChanges.pipe(
    startWith(null),
    debounceTime(200),
    switchMap((res: any) => {
      if (!res) return of(this.data);
      let fff = res.toLowerCase();
      console.log(fff);
      return of(
        this.data.filter(
          (x: any) => x.objectionname.toLowerCase().indexOf(fff) >= 0
          //majorheadname
        )
      );
    })
  );




  getSystemObjMaster() {
    let url = this.ApiService.ObjectionDetail + 50;               // Calling API for System Objection List
    this.ApiMethods.getservice(url).subscribe((resp:any) => {
      this.data0 = resp.result;
      this.objectionname = resp.result[0].objectionname;
      this.SN = resp.result.length;
      console.log("SystemObjMaster", this.data0);
    })
  }



  // Searching For System Objection List --------------
  $searchSystemObj = this.searchSystemObj.valueChanges.pipe(
    startWith(null),
    debounceTime(200),
    switchMap((res: any) => {

      if (!res) return of(this.data0);
      let fff = res.toLowerCase();
      console.log(fff);
      return of(
        this.data0.filter(
          (x: any) => x.objectionname.toLowerCase().indexOf(fff) >= 0
          //majorheadname
        )
      );
    })
  );




  getBillTypeData() {
    let url = this.ApiService.ObjectionDetail + this.BillType;   // Calling API for BillType Objection List
    this.ApiMethods.getservice(url).subscribe((resp:any) => {
      this.data1 = resp.result
      if (this.data1.length > 0) {
        this.isBillTypeObjectionShow = true;
      }
      console.log("XXX_TTTTTTTTTTTTTT", this.BillCode);
      console.log("BillTypeData__res", this.data1);
    })
  }


  // Searching For BillType Objection List --------------
  $searchBillTypeObj = this.searchBillTypeObj.valueChanges.pipe(
    startWith(null),
    debounceTime(200),
    switchMap((res: any) => {
      if (!res) return of(this.data1);
      let fff = res.toLowerCase();
      console.log(fff);
      return of(
        this.data1.filter(
          (x: any) => x.objectionname.toLowerCase().indexOf(fff) >= 0
          //majorheadname
        )
      );
    })
  );



  getObjectionData() {
    this.GetObjectionListModal.billNo = this.BillCode;
    this.GetObjectionListModal.userType = this.userType;
    this.GetObjectionListModal.userId = this.userId;
    this.GetObjectionListModal.type = 1
    //  this.GetObjectionListModal.
    console.log("api value1", this.BillCode, this.GetObjectionListModal)
    this.ApiMethods.postresultservice(this.ApiService.BillObjectionData, this.GetObjectionListModal).subscribe((resp:any) => {
      console.log("rssss_fdata", resp.result);

      this.data2 = resp.result;
      resp.result.map((x: any) => {
        this.AllObjectionData.push({ objectiontypecode: x.objectiontypecode, objectionname: x.objectiontypecode + '-' + x.ObjectionName })
      })


      console.log("objection__res", this.data2);
      console.log("all__objectdata", this.AllObjectionData);

    });
  }

  getObjectionData2() {

    this.GetObjectionList2Modal.billNo = this.BillCode;
    this.GetObjectionList2Modal.userType = this.userType;
    this.GetObjectionList2Modal.userId = this.userId;
    this.GetObjectionList2Modal.type = 2;
    //  this.GetObjectionListModal.
    console.log("api value For @nd list", this.BillCode, this.GetObjectionList2Modal, this.BillType)
    this.ApiMethods.postresultservice(this.ApiService.BillObjectionData, this.GetObjectionList2Modal).subscribe((resp:any) => {
      this.list = resp.result;
      // console.log("obj code----billcaode", this.BillCode);
      this.Commentlist = this.list;
      // this.data1 = this
      console.log("getobjectdata2", this.Commentlist);

    });
  }

  addValue() {
    let cmt = this.ObjectForm.controls['commentval'].value;
    console.log(cmt)
    if (cmt) {
      console.log("show__commm___t", cmt);
      this.Commentlist.push({ objectionname: cmt })
      this.ObjectForm.reset()
    }
  }



  //muliple selection common objection list data
  getCommonobj(event: any, row: any) {
    console.log("comman_Data2__", this.data2);
    console.log("all_again__objectdata", this.AllObjectionData);


    if (event.checked) {
      this.data2.push({ objectiontypecode: row.objectiontypecode, objectionname: row.objectionname })
      this.AllObjectionData.push({ objectiontypecode: row.objectiontypecode, objectionname: row.objectionname })

    } else {
      const index = this.data2.map(e => e.objectiontypecode).indexOf(row.objectiontypecode);
      this.data2.splice(index, 1);
      const ALLindex = this.AllObjectionData.map(e => e.objectiontypecode).indexOf(row.objectiontypecode);
      this.AllObjectionData.splice(ALLindex, 1);
    }
    console.log("data_revv", this.data2)

    console.log("ZZZZZZ_YYYYYY_XXXXXXX", this.AllObjectionData)
  }


  setchecked = (obj: any): boolean => {
    let data = this.data2.filter((x: any) => x.objectiontypecode === obj);
    if (data.length === 0) {
      return this.Ischecked = false
    }
    else {
      return this.Ischecked = true
    }

  }
  isdisabled = (code: number): boolean => {
    return code >= 5000 || code == 0 ? true : false;
  }

  setchecked1 = (obj1: any): boolean => {
    let data1 = this.data2.filter((x: any) => x.objectiontypecode === obj1);

    if (data1.length === 0) {
      return this.Ischecked = false
    }
    else {
      return this.Ischecked = true
    }
  }

  //  add(value:any){
  //        this.data.unshift({ SN : this.SN++ , Objectiontypecode : this.SN++ , objectionname : value })
  //        console.log(this.data);

  //  }



  //  addValue(){
  //   const inputField = document.getElementById('myInputField') as HTMLInputElement;
  //   inputField.value = this.newValue;
  //  }
  // add(newValue:any){
  //   const inputField = document.getElementById('myInputField') as HTMLInputElement;
  //   inputField.value = this.newValue;
  //   console.log(newValue)
  // }



  remove() {
    this.newValue = '';
    // this.data.filter(x=> x.);
    // this.data.splice(index, 1);

  }

  removeRow(Comment: any) {
    const index = this.Commentlist.indexOf(Comment);
    if (index !== -1) {
      this.Commentlist.splice(index, 1);
      console.log("final CMTList", this.Commentlist);

    }
  }
  onsubmit() {
   
    console.log("data___2", this.data2);
    console.log("comment__list", this.Commentlist);
    const newArray = this.Commentlist.map((obj) => {
      // modify the key-value pairs of the current object
      return {
        objectionname: obj.objectionname
      };
    });

    // this.data2.map((item, index) => {
    //   console.log("item__val__obj2", item);

    //   // var objexist = this.demoArray.map((e:any) => e.objectiontypecode).indexOf(item.objectiontypecode);

    //   // console.log("alredyyy__exsist__",objexist);

    //   this.demoArray.push(item.objectiontypecode)
    // })
    let demoArray: any = []
    this.AllObjectionData.map((item, index) => {
      console.log("item__val__obj2", item);

      demoArray.push(item.objectiontypecode)
    })
    let otherList:any=[]
    newArray.map((item, index) => {
      otherList.push(item.objectionname)
    });

    this.SaveOjection.userType = this.userType;
    // this.SaveOjection.pageType = this.pageType;
    this.SaveOjection.treasuryRefNo = Number(this.BillCode);
    //before Api calling data........
    console.log("onSubmit_commentFINAL LIST 1ND", this.Common_objlist);

    console.log("onSubmit_commentFINAL LIST 2ND", otherList);

    // const objectionlist = this.demoArray.concat(this.Common_objlist);
    const objectionlist = demoArray

    console.log("merge FINAL LIST 1ST", objectionlist);
    this.SaveOjection.objectionlist = objectionlist
    this.SaveOjection.otherList = otherList
    this.SaveOjection.userid = this.userId
    //API Calling....

    console.log("UUUUUUUUUUUUUUUU_otherList.length", otherList.length);
    if (objectionlist.length == 0 && otherList.length == 0 ) {
      this.snackbar.show('Select Or Put atleast One Objection !', 'alert');
    }
    // else if (this.otherList.length == 0) {
    //   this.snackbar.show('Comment list cannot be blank', 'danger');
    // }

    else {
      console.log("modebeforsend___", this.SaveOjection);

      this.loader.setLoading(true);

      this.ApiMethods.postresultservice(this.ApiService.Savewithobjection, this.SaveOjection).subscribe((resp:any) => {

        console.log("objectio_save_Res", resp.result);
        let response = resp.result

        if (response) {
          this.snackbar.show('Objection has been Put Successfully !', 'success');
          this.loader.setLoading(false);

          this.SaveOjection.objectionlist = '';
          this.SaveOjection.otherList = ''
          this.SaveOjection.treasuryRefNo = 0
          if (this.routeFrom) {
            this.router.navigate(['OnLineBillList']);
          }
          // Back From Objection Dialogbox and refresh AccountOfficer / TreasuryOfficer List page-------------------begiN-------
          this.dialogRef.close(1);
          // --------------------------------------------------------------------------------------enD-------
        }
        else {
          this.loader.setLoading(false);
        }
      },
        (res:any) => {
          console.log("errror message___", res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
            this.snackbar.show('Something Went Wrong! Please Try Again', 'danger');
          }
        })
    }

  }

}

