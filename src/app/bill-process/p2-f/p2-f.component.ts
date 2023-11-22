import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { LoaderService } from 'src/app/services/loaderservice';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { Helper } from 'src/app/utils/Helper';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { ApiService } from 'src/app/utils/utility.service';
import { CommonDialogComponent } from '../common-dialog/common-dialog.component';
import { Numeric, Required, maxLength } from 'src/app/utils/Validators/ValBarrel';
import { DatePipe } from '@angular/common';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-p2-f',
  templateUrl: './p2-f.component.html',
  styleUrls: ['./p2-f.component.scss']
})
export class P2FComponent implements OnInit {
  P2FForm:any;
  ChooseOption: any = '';
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = [];
  seletedTreasuryCode:any;
  base64ImgString:any;
  voucherData = new MatTableDataSource();
  base64Image:any;
  searchDatevalue:any;
  fileExt:any;

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.voucherData.sort = sort;
  }

  @ViewChild(MatPaginator) set MatPaginator(paginator: MatPaginator) {
    this.voucherData.paginator = paginator;
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) Sort!: MatSort;

  displayedColumns: string[] = ['SrNo', 'treasuryRefNo','tokenno','scrolldate','image','Action'];

  constructor( private datePipe: DatePipe, private formBuilder: FormBuilder,private router: Router, private ApiMethods: ApiMethods, public loader: LoaderService, private ApiService: ApiService, private snackbar: SnackbarService, private _liveAnnouncer: LiveAnnouncer, private Helper:Helper,public dialog: MatDialog) { }

  ngOnInit(): void {

    this.P2FForm =  this.formBuilder.group({
      TreasuryControl: new FormControl('',[Validators.required]),
      finYear: new FormControl('',[Validators.required]),
      tokenNumber: new FormControl('',[Validators.minLength(1),Validators.maxLength(6),Validators.required,Validators.pattern(/^[0-9]\d*$/)]),
      scrollDate: new FormControl('',[Validators.required]),
      treasuryCode: new FormControl('',[Validators.required]),
      chequeNumber: new FormControl('',[Validators.required]),
      file: new FormControl('',[Validators.required,this.fileExtensionValidator(['jpg', 'png','jpeg']), this.fileSizeValidator(90)]),
      //file: [''],
      //searchDate: new FormControl(''),
  });

 // this.getVoucherScroll();

 // this.P2FForm.controls['TreasuryControl'].disable();
  this.P2FForm.controls['treasuryCode'].disable();
  this.P2FForm.controls['finYear'].disable();
  this.P2FForm.controls['chequeNumber'].disable();

  this.getTreasuryList();
  }


  getTreasuryList() {
    this.loader.setLoading(true);
     //this.ApiMethods.getservice(this.ApiService.autoProcessStatus + this.GetAutoProcessStatusModal.treasuryCode + "/" + this.GetAutoProcessStatusModal.tblName).subscribe(resp => {
       this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe((resp:any) => {

       console.log("Auditor__res", resp);
       let data = resp.result
       if (resp.result && resp.result.length > 0) {
         this.TreasuryListarr = resp.result
         //console.log("Show_Treasury_AuditorList", this.TreasuryListarr);
         this.Treasuryoptions = this.P2FForm.controls['TreasuryControl'].valueChanges.pipe(
           startWith(''),
           map((value: any) => {
             return typeof value === 'string' ? value : value.treasuryCode
           }),
           map((treasury: any) => {

             return treasury ? this._filterTreas(treasury, data) : data.slice()
           })
         );
         const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.Helper.Treasury_Code)[0];
       //  this.displayTreasFn(treasury);
       this.seletedTreasuryCode=treasury.TreasuryCode
         this.P2FForm.patchValue({
           TreasuryControl: treasury,
           treasuryCode:this.seletedTreasuryCode,
           finYear:this.Helper.forwardYear,

         })

       }
     })
     this.loader.setLoading(false);

    }

    _filterTreas(value: string, data: any) {
      return data.filter((option: any) => {
        return option.TreasuryName.toLowerCase().includes(value.toLowerCase())

      });
    }

    searchVoucherScroll(){
     let scrollDate= this.searchDatevalue;

     console.log("searchDate",this.searchDatevalue);
     if(scrollDate!=undefined && scrollDate!=null){
      this.getVoucherScroll(scrollDate);
     }else{
      this.snackbar.show('Please Select Date !', 'alert');
     }

    }

    onDateSelected(selectDate:any){
     // console.log("selectDate==>>",selectDate.value);

      this.getVoucherScroll(selectDate.value);

    }







     getVoucherScroll(filterDate:any){
      const submitScrollDate:any= this.datePipe.transform(filterDate, 'yyyy-MM-dd');
      this.loader.setLoading(true);
      const formData = {
        "bank": "SBI",
        "scrollDate": submitScrollDate,
        "flag": "A"
    }
   // const formData ={bank: "SBI", scrollDate: "2023-08-01", flag: "A"}
       this.ApiMethods.postresultservice(this.ApiService.getVoucherScroll, formData).subscribe((resp:any) => {
        this.loader.setLoading(false);
        if(resp.result){
          this.voucherData.data= resp.result;
          console.log("result==>>",this.voucherData.data);

        }else{
         this.snackbar.show('Something Went Wrong. Please Try Again !', 'danger');
        }

       },
       (res:any) => {
             console.log("errror message___", res.status);
             if (res.status != 200) {
               this.snackbar.show('Something Went Wrong. Please Try Again !', 'danger');

             }
           });

     }

    chequeValidateToken(){

      this.loader.setLoading(true);
      const formData = {
        "finYear":this.P2FForm.getRawValue().finYear,
        "treasuryCode":this.P2FForm.getRawValue().TreasuryControl.TreasuryCode,
        "tokenNO":this.P2FForm.getRawValue().tokenNumber,
        "chequeNo":this.P2FForm.getRawValue().chequeNumber,
       }
       this.ApiMethods.postresultservice(this.ApiService.chequeValidateToken, formData).subscribe((resp:any) => {
        this.loader.setLoading(false);
        if (resp.result) {
          if(resp.result.v_Status=="2"){
            this.snackbar.show('This Cheque No is Not valid with Token No. '+this.P2FForm.getRawValue().TreasuryControl.TreasuryCode+ "-" + this.P2FForm.getRawValue().finYear + "-"+this.P2FForm.getRawValue().tokenNumber, 'alert' );
          }
           else if( resp.result.v_Status=="1"){
            this.snackbar.show('This Token No is Not Valid for Upload Cheque Token Image !', 'alert');
          }

          else if( resp.result.v_Status=="9"){
            this.snackbar.show('Please Try Again !', 'alert');
          }


          else if( resp.result.v_Status=="0"){
            this.P2FFormSubmit();
          }



        }

       },
       (res:any) => {
             console.log("errror message___", res.status);
             if (res.status != 200) {
               this.loader.setLoading(false);
               this.snackbar.show('Something Went Wrong. Please Try Again !', 'danger');

             }
           });

    }

  P2FFormSubmit(){

    const submitScrollDate:any= this.datePipe.transform(this.P2FForm.getRawValue().scrollDate, 'yyyy-MM-dd');
    const formData ={
      "bank":"SBI",
      "scrollDate":submitScrollDate,
      "treasuryRefNO": this.P2FForm.getRawValue().chequeNumber,
      "tokenNo": this.P2FForm.getRawValue().tokenNumber,
      "imagfile": this.base64ImgString,
    }
    this.loader.setLoading(true);
    this.ApiMethods.postresultservice(this.ApiService.p2fSubmit, formData).subscribe((resp:any) => {
      this.loader.setLoading(false);
      console.log("After_API_Save_Result__", resp);

      if (resp.result.toUpperCase()=="N") {
        this.snackbar.show('Record Inserted Successfully !', 'success');
        this.getVoucherScroll(submitScrollDate);

      }
      else if(resp.result.toUpperCase()=="Y"){
        this.snackbar.show('Cheque Token File Already Exists !', 'alert');
        this.getVoucherScroll(submitScrollDate);

      }

      else{
        this.snackbar.show('Something Went Wrong. Please Try Again !', 'danger');
      }
    },
    (res:any) => {
          console.log("errror message___", res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
            this.snackbar.show('Something Went Wrong. Please Try Again !', 'danger');

          }
        });



      this.P2FForm.disable();

  }


  getTreasuryCode(row :any){
    this.P2FForm.patchValue({
      treasuryCode: row.TreasuryCode,
    });

    this.P2FForm.get("tokenNumber").reset();
    this.P2FForm.get("scrollDate").reset();
    this.P2FForm.get("file").reset();
    this.P2FForm.get("chequeNumber").reset();
    this.voucherData.data=[];

  }

  convertToBase64(file: File): void {

    console.log("fileExt",this.fileExt);
    const reader = new FileReader();

    reader.onloadend = () => {
      // The result is the Base64-encoded image
      const base64String = reader.result as string;
      let base64StringReplacefileExt= base64String.replace("data:image/"+this.fileExt+";base64,", "");
      const base64StringReplace= base64StringReplacefileExt.replace("data:image/jpeg;base64,", "");

      //strreplace()
   console.log("base64String",base64StringReplace);
    this.base64ImgString=base64StringReplace;

    };

    reader.readAsDataURL(file);
  }


  displayTreasFn(selectedoption: any) {

   return selectedoption ? selectedoption.TreasuryName : undefined;

  }

  Reset(){
    window.location.reload();
  }

  onFileChange(file:any){
    const uploadfile = file.target.files[0];

    let filenameStr= file.target.files[0].name;
    let uploadfilenameNumber =this.getFileNameWithoutExtension(filenameStr);
    let isuploadfilenameNumber= parseInt(uploadfilenameNumber);
    if(isNaN(isuploadfilenameNumber)){
      this.P2FForm.get("file").reset();
      this.P2FForm.get("chequeNumber").reset();
      this.snackbar.show('Name should be in format of (Valid 6 Digit Cheque No) Allow !', 'alert');
      return;
    }

    this.fileExt= filenameStr.split('.').pop().toLowerCase();
    this.convertToBase64(uploadfile);
    let allowedExtensions=['jpg', 'png','jpeg'];
    if (!allowedExtensions.includes(this.fileExt)) {
      this.P2FForm.get("file").reset();
      this.P2FForm.get("chequeNumber").reset();
      this.snackbar.show('File Extension Only jpg, png, jpeg Allow !', 'alert');
      return;
    }

    let fileSize= file.target.files[0].size / 1024;
    console.log("fileSize==>>",fileSize);
    if (fileSize > 90) {
      this.P2FForm.get("file").reset();
      this.P2FForm.get("chequeNumber").reset();
      this.snackbar.show('Image Size Allowed Maximum 90 kb !', 'alert');
      return;

    }

    this.P2FForm.patchValue({
      chequeNumber: uploadfilenameNumber,
    })




  }

  private getFileNameWithoutExtension(fileName: string): string {
    // Get the last index of the dot (to identify the extension)
    const dotIndex = fileName.lastIndexOf('.');
    // Extract the file name without the extension
    const  fileNameWithoutExtension = dotIndex === -1 ? fileName : fileName.slice(0, dotIndex);
    return fileNameWithoutExtension;
  }

  openImportDialog(){

    this.dialog.open(CommonDialogComponent,
      {
        panelClass: 'dialog-w-50', autoFocus: false        ,
        height: "auto",
        width: "50%",
        data: {
          message: "Important Instructions",
          result_info: "importantInstructions",
          id: 'importantInstructions',
        }
      }
    );

  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let newValue = input.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    input.value = newValue; // Update the input field's value
  }

  fileExtensionValidator(allowedExtensions: string[]): any {
    return (control: any): { [key: string]: any } | null => {
      if (control.value) {
        const fileExt = control.value.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(fileExt)) {
          return { invalidExtension: true };
        }
      }
      return null;
    };
  }

  fileSizeValidator(maxSize: number): any {
    return (control: any): { [key: string]: any } | null => {
      if (control.value) {
        const fileSize = control.value.size / 90; // Size in KB
        if (fileSize > maxSize) {
          return { invalidSize: true };
        }
      }
      return null;
    };
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
      this.voucherData.filter = filterValue.trim().toLowerCase();

      if (this.voucherData.paginator) {
        this.voucherData.paginator.firstPage();
      }
    }

    onclickImage(element:any){
      this.loader.setLoading(true);
      const formData = {
        "tokenNo":element.tokenno,
        "treasuryRefNO":element.treasuryRefNo,
       }
       this.ApiMethods.postresultservice(this.ApiService.getVoucherImage, formData).subscribe((resp:any) => {
        this.loader.setLoading(false);
        if (resp.result) {
          console.log(resp.result);
          this.base64Image = 'data:image/png;base64,'+resp.result;

          this.dialog.open(CommonDialogComponent,
            {
              panelClass: 'dialog-w-50', autoFocus: false        ,
              height: "auto",
              width: "50%",
              data: {
                message: "chequeImage",
                base64chequeImage: this.base64Image,
                id: 'chequeImage',
              }
            }
          );

        }

       },
       (res:any) => {
             console.log("errror message___", res.status);
             if (res.status != 200) {
               this.loader.setLoading(false);
               this.snackbar.show('Something Went Wrong. Please Try Again !', 'danger');

             }
           });

    }

   // http://172.22.32.117:9095/rajkosh/3.0/voucher/update/scroll


   voucherUpdateScroll(treasuryRefNO:any,flag:any,scrolldate:any){
      this.loader.setLoading(true);
      const formData = {
        "treasuryRefNO":treasuryRefNO,
        "flag":flag
       }
       this.ApiMethods.postresultservice(this.ApiService.voucherUpdateScroll, formData).subscribe((resp:any) => {
        this.loader.setLoading(false);
        if (resp.result) {
          this.snackbar.show('Record Updated Successfully !', 'success');
         this.getVoucherScroll(scrolldate);
        }else{
          this.snackbar.show('Record Not Updated. Please Try Again !', 'alert');
        }

       },
       (res:any) => {
             console.log("errror message___", res.status);
             if (res.status != 200) {
               this.loader.setLoading(false);
               this.snackbar.show('Something Went Wrong. Please Try Again !', 'alert');

             }
           });

    }





}
