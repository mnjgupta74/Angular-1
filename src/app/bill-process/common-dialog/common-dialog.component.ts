import {  ElementRef, Inject, ViewChild,  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TokenReceiptList } from 'src/app/utils/Master';
import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl} from '@angular/forms';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { LoaderService } from 'src/app/services/loaderservice';
import { IGetTreasuryOfficerListRemark } from 'src/app/utils/Master';
import { Helper } from 'src/app/utils/Helper';
import jsPDF from 'jspdf';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
 

  @Component({
    selector: 'app-common-dialog',
    templateUrl: './common-dialog.component.html',
    styleUrls: ['./common-dialog.component.scss']
  })

  export class CommonDialogComponent implements OnInit {
    

    // <!-- Show New Token Generate Print Detail --------------------------------------------begiN--->
    @ViewChild('Content',{static:false}) el!:ElementRef
    TokenReceipt:any;
     DDOcode:any;
     Bill:any;
     tokenReceiptForm: any;
     treasuryName:any;
    userinfo:any={};
    treasuryCode:any;
    base64chequeImage:any;
  
     tokenreciptModel: TokenReceiptList = {
      treasuryCode: this.Tcode.Treasury_Code,
      finYearFrom: this.finyear_.year.toString(),
      tokenNo: 0
    }
  // <!-- Show New Token Generate Print Detail --------------------------------------------enD--->



    //<!-- Show Error Code Detail for Component:-"BillEntry"--------------------------------------------begiN--->
    message: string = "";
    _errorCode = this.UId;
    errorlist: any[] = []
    //<!-- Show Error Code Detail for Component:-"BillEntry"--------------------------------------------enD--->



    //<!-- Code for Remark Popup Window for Component:-"TreasuryOfficerList"---------------------------begiN--->
    reasonBillCode: any;
    id: any;
    billcode:any;
    popup:boolean=false;
    remarkstatus: any;
    popupRemark: any;
    TreasOfficeFormRemark: any;

    
 
    GetTreasOfficeListRemarkModal: IGetTreasuryOfficerListRemark = {
      billcode: 0,
      userId: this.UId.UserId,
      remark: ""
      }
  
    //<!-- Code for Remark Popup Window for Component:-"TreasuryOfficerList"---------------------------emD--->


 
// <!-- Code for Open Popup Window for Component:-"BillEncashment"---------------------------begiN--->
    EncashfetchedBillCode: any; 
    BillEncashmentViewBillForm: any;
// <!-- Code for Open Popup Window for Component:-"BillEncashment"---------------------------enD--->



  // <!-- Show Cheque Print Preview --------------------------------------------begiN--->
    ChequePrintPreviewForm: any;
    ChequePrintToken: any; 
    ChequePrintType: any; 
    ChequePrintTreasuryCode: any; 
    ChequePrintRunningChequeNo: any; 
    ChequePrintBtnType: any; 
  // <!-- Show Cheque Print Preview --------------------------------------------enD--->



    // <!-- Dynamic PD Passbook Format Details --------------------------------------------begiN--->
  dynamicColumns:any=[
    
    'SrNo'
  ]
  PayloadColumns:any=['SrNo','payloaddata'];
  rejectedReasonColumns:any=['SrNo','rjected_reason']

 getpayloaddata:MatTableDataSource<any> = new MatTableDataSource();
  getrejectedReason:MatTableDataSource<any> = new MatTableDataSource();
  objectionColumns:any=['SrNo','ObjectionName','AuditorName','AccountantName','ToName','ObjectionDate']
  datasource:MatTableDataSource<any> = new MatTableDataSource();
  alldata:any
  payload:any={}
  urlKey:any
  Method:any
  resultData:any;


  @ViewChild(MatPaginator) set MatPaginator(paginator: MatPaginator) {
    this.datasource.paginator = paginator;
  }
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.datasource.sort = sort;
  }
   // <!-- Dynamic PD Passbook Format Details --------------------------------------------enD--->
 

    constructor(private ApiService: ApiService,private ApiMethods: ApiMethods, private UId: Helper, public loader: LoaderService,private snackbar: SnackbarService,
                @Inject(MAT_DIALOG_DATA)private data: any, private dialogRef: MatDialogRef<CommonDialogComponent>,public finyear_: Helper, private Tcode: Helper) 
          {
          this.dialogRef.disableClose = true;
          this.reasonBillCode = data.reasonBillCode;
          //alert(this.reasonBillCode)
          this.id = data.id;
          this.message = data.message;
          this.errorlist = data.error_info;
          this.resultData = data.result_info,
          this.base64chequeImage = data.base64chequeImage,
          this.datasource.data=data.objectionlist;
 

          // <!-- Code for Open Popup Window for Component:-"BillEncashment"---------------------------begiN--->
          this.EncashfetchedBillCode = data.EncashfetchedBillCode;
          if(data.EncashfetchedBillCode > 0)
          {
            console.log("XXXXXXXXXXXXX-BillEncashToken___",  this.EncashfetchedBillCode);
            this.GetViewBillDetail();
          }
        // <!-- Code for Open Popup Window for Component:-"BillEncashment"---------------------------enD--->
         



      // <!-- Show Cheque Print Preview --------------------------------------------begiN--->
      this.ChequePrintToken = data.ChequePrintToken;
      this.ChequePrintRunningChequeNo = data.ChequePrintRunningChequeNo;
      this.ChequePrintBtnType = data.ChequePrintBtnType;
      if(data.ChequePrintToken > 0)
      {
        console.log("ZZZZZZZZZZZZZZZ-ChequePrintToken__",  this.ChequePrintToken);
        console.log("QQQQQQQQQQQQQQ-ChequePrintBtnType",  this.ChequePrintBtnType);
        this.ChequePrintTokenDetail();
      }
      // <!-- Code for Open Popup Window for Component:-"BillEncashment"---------------------------enD--->


        
   // <!-- Dynamic PD Passbook Format Details --------------------------------------------begiN--->
      
   this.alldata =data
   
   if(data.id == 5){
    this.payload=data.payloadData;
    this.urlKey =data.URLKey;
    this.Method= data.Method;
    this.callInitialApi();
   }
 // <!-- Dynamic PD Passbook Format Details --------------------------------------------begiN--->
  // <!-- Dynamic Payload --------------------------------------------begiN--->
      
  if(data.id=="payload"){
    this.viewpayload(data.elementId);
     // <!-- Dynamic Payloads --------------------------------------------end--->
     }    
    
    
      // <!-- rejectedReason Payload --------------------------------------------begiN--->
          
      else if(data.id=="rejectedReason"){
        this.viewrejectedReason(data.elementId);
         // <!-- rejectedReason Payloads --------------------------------------------end--->
         } 

    }

 

    
    ngOnInit(): void {


      //<!-- Code for Remark Popup Window for Component:-"TreasuryOfficerList"---------------------------begiN--->
      this.TreasOfficeFormRemark = new FormGroup({
        Remark: new FormControl({ value: '', disabled: false }),
      });



      // <!-- Code for Open Popup Window for Component:-"BillEncashment"---------------------------begiN--->
      this.BillEncashmentViewBillForm = new FormGroup({
      tokennoViewBill: new FormControl({ value: "", disabled: true }),
      Billnoid: new FormControl({ value: "", disabled: true }),
      ddodetail: new FormControl({ value: "", disabled: true }),
      ddobilldetail: new FormControl({ value: "", disabled: true }),
      budgethead: new FormControl({ value: "", disabled: true }),
      officeid: new FormControl({ value: "", disabled: true }),
      ddocode: new FormControl({ value: "", disabled: true }),
      billtypecode: new FormControl({ value: "", disabled: true }),
      divisioncode: new FormControl({ value: "", disabled: true }),
      paymode: new FormControl({ value: "", disabled: true }),
      grossamount: new FormControl({ value: "", disabled: true }),
      netamount: new FormControl({ value: "", disabled: true }),

    });



    // <!-- Show New Token Generate Print Detail --------------------------------------------begiN--->
    this.tokenReceiptForm = new FormGroup({
      DdoCode: new FormControl(''),
      RefNo: new FormControl(''),
      BillType: new FormControl(''),
      MajorHead: new FormControl(''),
      NetAmt: new FormControl(''),
      GrossAmt: new FormControl(''),
      TokenNo: new FormControl(''),
      Receipt: new FormControl(''),

    });
    // <!-- Show New Token Generate Print Detail --------------------------------------------enD--->



    // <!-- Show Cheque Print Preview --------------------------------------------begiN--->
    this.ChequePrintPreviewForm = new FormGroup({
      TokenNo: new FormControl({ value: "", disabled: true }),
      officename: new FormControl({ value: "", disabled: true }),
      DDOBillNo: new FormControl({ value: "", disabled: true }),
      DDOCode: new FormControl({ value: "", disabled: true }),
      MajorHead: new FormControl({ value: "", disabled: true }),
      ChequePrint: new FormControl({ value: "", disabled: true }),
      RunningCheque: new FormControl({ value: "", disabled: true }),
      CashAmt: new FormControl({ value: "", disabled: true }),
      PayType: new FormControl({ value: "", disabled: true }),
      ChequeDate: new FormControl({ value: "", disabled: true }),
      EmployeeId: new FormControl({ value: "", disabled: true }),
      DDOBillDate: new FormControl({ value: "", disabled: true }),
  
     
    });
    // <!-- Show Cheque Print Preview --------------------------------------------enD--->


    }


    // <!-- Code for Remark Popup Window for Component:-"TreasuryOfficerList"---------------------------begiN--->
    PutTORemark_Action(popupRemark: any) {
      this.loader.setLoading(true);
  
      this.GetTreasOfficeListRemarkModal.billcode = this.reasonBillCode;
      this.GetTreasOfficeListRemarkModal.remark = this.TreasOfficeFormRemark.controls['Remark'].value;
  
      console.log("ReasonBillcode_Result", this.reasonBillCode);
  
      console.log("Before_Calling_API_TreasuryOfficerListRemark_Result", this.GetTreasOfficeListRemarkModal);
  
      //api call of Treasury Officer List remark
      this.ApiMethods.postresultservice(this.ApiService.TreasuryOfficerListRemark, this.GetTreasOfficeListRemarkModal).subscribe((resp:any) => {
        console.log("After_Calling_API_TreasuryOfficerListRemark_Result", resp);
  
        this.remarkstatus = resp.result;
        if (this.remarkstatus == true) {
          //this.loader.setLoading(false);
          this.snackbar.show('Remarks Added Successfully!', 'success');
          // Back From Objection Dialogbox and refresh TreasuryOfficer List page-------------------begiN-------
          this.dialogRef.close(2);
          // --------------------------------------------------------------------------------------enD-------
          this.remarkstatus = '';
        }
  
       
        if (resp.result.length > 0) {
          this.loader.setLoading(false);
          document.getElementById("myelem")?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        else {
          //this.toastrService.info('No Data Found !', 'Info!');
          this.loader.setLoading(false);
        }
      },
        (res:any) => {
          console.log("errror message___", res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
            this.snackbar.show('Something Went Wrong! Please Try Again', 'danger');
  
          }
        }
      );
  
    }

    PutTORemark_Reset() {
      this.remarkstatus = '';
    }
   // <!---Code for Remark Popup Window for Component:-"TreasuryOfficerList"-----------------------------enD--->
 




    // <!-- Code for Open Popup Window for Component:-"BillEncashment"---------------------------begiN--->
  GetViewBillDetail() {
    // this.loader.setLoading(true);
    console.log("Before_Calling_API_View_Bill_Result", this.EncashfetchedBillCode);
    this.ApiMethods.getservice(this.ApiService.BillEncashmentViewBil + this.EncashfetchedBillCode).subscribe((resp:any) => {
      console.log("View_Bill_Result__", resp.result);
       this.BillEncashmentViewBillForm.patchValue({
        tokennoViewBill: resp.result[0].tokenno,
        Billnoid: resp.result[0].Billnoid,
        ddodetail: resp.result[0].ddodetail,
        ddobilldetail: resp.result[0].ddobilldetail,
        budgethead: resp.result[0].budgethead,
        officeid: resp.result[0].officeid,
        ddocode: resp.result[0].ddocode,
        billtypecode: resp.result[0].billtype,
        divisioncode: resp.result[0].divisioncode,
        paymode: resp.result[0].paymode,
        grossamount: resp.result[0].grossamount,
        netamount: resp.result[0].netamount,
      })
      //this.showtrantab = true
      this.loader.setLoading(false);
      document.getElementById("myelem")?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    },
      (res:any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          document.getElementById("myelem")?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        else {
          this.snackbar.show('No Bill List Found !', 'alert');
          this.loader.setLoading(false);
        }
      }
    )
  }
 
    // <!---Code for Remark Popup Window for Component:-"BillEncashment"-----------------------------enD--->
 




     // <!-- Show New Token Generate Print Detail --------------------------------------------begiN--->

    getdepartment() {
      //let treasuryCode=sessionStorage.getItem("treasCode");
      this.treasuryCode=this.userinfo.treasCode;
      console.log("treasuryCode", this.treasuryCode);
         this.ApiMethods.getservice(this.ApiService.getdepartment + this.treasuryCode).subscribe((resp:any) => {
          console.log("Getdepartment__res", resp);
          var response = resp.result
          if (resp.message=="Success") {   
             this.treasuryName = response.TreasuryName;             
             }
            })
          }


    OnShowData(Token: any,tCode:any,fYear:any) {
            let NEWTOKEN = Token;
            this.snackbar.show('TOKEN NUMBER : ' + tCode + '-' + fYear + "- " + Token.toString() + '\n' + "Generated Successfully", 'success')
            console.log("token value", NEWTOKEN)
            this.tokenreciptModel.tokenNo = NEWTOKEN;
            console.log("before api model", this.tokenreciptModel)
            this.ApiMethods.postresultservice(this.ApiService.TokenReceipt, this.tokenreciptModel).subscribe((resp:any) => {
              console.log("Dsat", resp)
              let data = resp.result[0];
             //this.grossAmount=data.GrossAmt
             this.DDOcode=data.DdoCode;
             this.Bill=data.BillType;
              console.log("data___", data)
              if (Object.keys(data).length > 0) {
                this.tokenReceiptForm.patchValue({
                 // DdoCode: data.DdoCode,
                  RefNo: data.Cde_Refno,
                  BillType: data.BillType,
                  MajorHead: data.MajorHead,
                  NetAmt: data.CashAmt,
                  GrossAmt: data.GrossAmt,
                  TokenNo: data.TokenNo,
                  Receipt: data.TokenDate.toString().substring(0, 10)
                })
                }
              })
     }
   
   
     ExporttoPdf(){
      var doc = new jsPDF('p', 'pt', 'a2');
      doc.html(this.el.nativeElement, {
       callback: function(doc) {
         doc.text("https://rajkosh.rajasthan.gov.in/", 30, 330);
         doc.save('Token_Print.pdf');
       }
     })
    }
// <!-- Show New Token Generate Print Detail --------------------------------------------enD--->



     // <!-- Show Cheque Print Preview --------------------------------------------begiN--->
     ChequePrintTokenDetail() {
      
      this.ChequePrintType = 7,
     // this.ChequePrintToken = 312      //For Testing 
     
        this.ChequePrintTreasuryCode = this.Tcode.Treasury_Code
       //this.ChequePrintTreasuryCode = 1900      //For Testing 
      
      let data ={
        "type":this.ChequePrintType,
        "tokenNo": this.ChequePrintToken,
        "treasurycode":this.ChequePrintTreasuryCode,
      }


       this.loader.setLoading(true);
       console.log("Before_Calling_API_ChequePrintPreview_Result", data);
       this.ApiMethods.postresultservice(this.ApiService.ChequePrintPreviewDetail, data).subscribe((resp:any) => {
       console.log("ChequePrintPreview_Result__", resp.result);
        
       this.ChequePrintPreviewForm.patchValue({
          TokenNo: resp.result[0].TokenNo,
          EmployeeId: resp.result[0].EmployeeId,
          officename: resp.result[0].officename,
          DDOBillNo: resp.result[0].DDOBillNo,
          DDOCode: resp.result[0].DDOCode,
          MajorHead: resp.result[0].MajorHead,
          ChequePrint: resp.result[0].ChequePrint,
          //RunningCheque: this.ChequePrintRunningChequeNo, 
          CashAmt: resp.result[0].CashAmt,
          PayType: resp.result[0].PayType,
          ChequeDate: resp.result[0].ChequeDate,
          //EmployeeId: resp.result[0].EmployeeId,  
          DDOBillDate: resp.result[0].DDOBillDate 
      })

      //console.log("ChequePrintPreviewFormResult__", this.ChequePrintPreviewForm);

      //this.showtrantab = true
      this.loader.setLoading(false);
      document.getElementById("myelem")?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    },
      (res:any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          document.getElementById("myelem")?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        else {
          this.snackbar.show('No Bill List Found !', 'alert');
          this.loader.setLoading(false);
        }
      }
    )
  }

  PageChequePrint(){
    window.print();
  }

    // <!-- Show Cheque Print Preview --------------------------------------------enD--->




   // <!-- Dynamic PD Passbook Format Details --------------------------------------------begiN--->

         // post and GET Api Call 
  
         callInitialApi() {

          if( this.Method == 'POST'){
            this.loader.setLoading(true);
            this.ApiMethods.postresultservice(`${this.urlKey}`,this.payload ).subscribe(
                (user: any) => {
                  this.datasource.data = user.result;
                  setTimeout(()=>{
                    if (this.datasource.data.length <= 0) {
                      
                      // this.snackbar.show('No Data Found !', 'alert');
                      this.loader.setLoading(false);
                    
                    } else {
                      if (this.datasource.data.length > 0) {
                        let keys= Object.keys(this.datasource.data[0])
                        keys.forEach((e=>{
                          this.dynamicColumns.push(e)
                        }))
                      
                      } else {
      
                        this.datasource.data = [];
      
                      }         
                  
                          this.loader.setLoading(false);
                   
                    }
                  },1000)
              
                },
                (res:any) => {
                  if (res.status != 200) {
                    this.loader.setLoading(false);
                    this.snackbar.show(
                      'Something Went Wrong! Please Try Again',
                      'danger'
                    ); /// API Error Message
                  }
                }
              );
          }else if( this.Method == 'GET'){
           
            this.ApiMethods.getservice(`${this.urlKey}`).subscribe((data:any) => {
             
              if (data.result.length <= 0) {
               
              }else{
                
                this.datasource.data = data.result;
                let keys= Object.keys(this.datasource.data[0])
                keys.forEach((e=>{
       
                  this.dynamicColumns.push(e)
          
                }))
              }
             
            }, (res:any) => {
              if (res.status != 200) {
                this.loader.setLoading(false);
                this.snackbar.show(
                  'Something Went Wrong! Please Try Again',
                  'danger'
                ); /// API Error Message
              }
            });
          }
         
          }
      
          applyFilter(filterValue: string) {
            this.datasource.filter = filterValue.trim().toLowerCase();
            if (this.datasource.paginator) {
              this.datasource.paginator.firstPage();
            }
          }
      
          calculate(field:string){
            let total = 0
            if(field =='GrossAmt'){
              this.datasource.data.forEach(element => {
                total= total + element.GrossAmt 
              });
              return total;
            }else if(field == 'Amount'){
              this.datasource.data.forEach(element => {
                total= total + element.Amount 
              });
              return total;
            }
            return ''
          }
       
      
         TitleCase(str:string){
         let string= str.replace(/([A-Z])/g, ' $1').trim()
         const splitArr = string.split(' ') 
         const capitalizedArr = splitArr.map(word => word[0].toUpperCase() + word.substring(1))
         const result = capitalizedArr.join(' ');
         return result
         }

 // <!-- Dynamic PD Passbook Format Details --------------------------------------------enD--->


  // <!-- Dynamic PFMS Bill   Details Report--------------------------------------------begiN--->

  getPFMSBillDetailReport(cdeRefno:any){
    this.objectionColumns=['SrNo','cdeRefNo','transDate'];
       this.ApiMethods.getservice(this.ApiService.getcdeRefNo + cdeRefno).subscribe((resp:any) => {
        console.log("Getdepartment__res", resp);
           this.datasource.data = resp.result;
          })
  }
  // <!-- Dynamic PFMS Bill   Details Report --------------------------------------------enD--->

// <!-- Dynamic Payload Report --------------------------------------------start--->

viewpayload(element: any) {
  console.log(element.Id);
  this.ApiMethods.postresultservice(this.ApiService.PFMSreconciliationpayload + "/" + element, {}).subscribe((resp: any) => {
    console.log("After_Calling_API_paymentReconciliationreportmodelmodel_Result", resp);
    if (resp.result.length > 0) {
      let arr = resp.result;
      let exceldata: any = [];
      let final: any = []

        arr.forEach((element: any) => {
          let strdata = JSON.stringify(element.payload)
          let data_ = JSON.parse(strdata)
          let str = JSON.stringify(element.payload).substring(0, 50);
          console.log("str__", str)
          let obj: any = {
            ...element,
            "payloaddata": data_,
            "payload": str,
           
          }
          let excelobj: any = {
            ...element,
            "payload": data_,
          }
          final.push(obj)
          exceldata.push(excelobj)
        });
         console.log("finaldata_", final);
      this.getpayloaddata.data= final
       // this.exportcompletedata = exceldata;
         this.loader.setLoading(false);
    //  this.paymentReconciliationreportform.disable();
    }
    else {
      this.snackbar.show('No Data Found !', 'alert')
      this.loader.setLoading(false);
     // this.showReconciliationTable = false;
    }
  },
    (res: any) => {
      console.log("errror message___", res.status);
      if (res.status != 200) {
        this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger')
        this.loader.setLoading(false);
      }
    }
  );

};
// <!-- Dynamic payloads Report --------------------------------------------enD--->


viewrejectedReason(data:any){
  console.log("rejectedreason_",data);
  if(data !=='null' ){
    let final: any = []
    let strdata = JSON.stringify(data)
    let data_ = JSON.parse(strdata)
    let str = JSON.stringify(data).substring(0, 50);
    console.log("str__", str)
    let obj: any = {
     // ...element,
     "rjected_reason": data_,
     "rjected": str,
     
    }
    final.push(obj)
    console.log("final_",final);
    
    this.getrejectedReason.data= final
  }
  // this.getrejectedReason.data=[]
 }

  }
