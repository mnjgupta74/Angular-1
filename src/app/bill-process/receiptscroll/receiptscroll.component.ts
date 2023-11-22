import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiMethods } from '../../utils/ApiMethods';
import { ApiService } from '../../utils/utility.service';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { LoaderService } from 'src/app/services/loaderservice';
import { Helper } from 'src/app/utils/Helper';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { AESEncDecService } from 'src/app/utils/AesEncDec';

@Component({
  selector: 'app-receiptscroll',
  templateUrl: './receiptscroll.component.html',
  styleUrls: ['./receiptscroll.component.scss'],
})
export class ReceiptscrollComponent implements OnInit {
  constructor(
    private AesEncDec: AESEncDecService,
    public dialog: MatDialog,
    private router: Router,
    private ApiMethods: ApiMethods,
    public loader: LoaderService,
    private _liveAnnouncer: LiveAnnouncer,
    private ApiService: ApiService,
    private snackbar: SnackbarService,
    public finyear_: Helper,
    private Tcode: Helper,
    private toyear_: Helper,
    private usercode_: Helper,
    private Fyear_: Helper,
    private asgnId: Helper,
    private fy_: Helper
  ) {}

  file_store: any;
  file_list: Array<string> = [];
  processing = false;
  fileData = null;
  error: any;
  fileresponse: any;
  EncData: any;
  DecData: any;
  txtFGroup: any;

  ngOnInit(): void {
    this.txtFGroup = new FormGroup({
      display: new FormControl('', Validators.required),
      file: new FormControl('', Validators.required),
    });
  }

  handleFileInputChange(l: any): void {
    this.file_store = l;
    // fileName = document.querySelector('#chooseFile').value;
    //     extension = fileName.slice((Math.max(0, fileName.lastIndexOf(".")) || Infinity) + 1);
    // fileName = document.querySelector('#chooseFile').value;
    //     extension = fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2);
    console.log(this.file_store.length);
    if (l.length) {
      console.log(l[0].type);
      const file = l[0];
      if (file.type == 'text/plain') {
        console.log(file);
        this.readFile(file);
        const count = l.length > 1 ? `(+${l.length - 1} files)` : '';
        this.txtFGroup.controls['display'].patchValue(`${file.name}${count}`);
      } else {
        this.file_store = [];
        this.txtFGroup.reset();
        // this.txtFGroup.controls['display'].patchValue('');
        this.file_list = [];
        this.snackbar.show('File Not Valid !!', 'alert');
      }
    } else {
      this.txtFGroup.reset();
    }
  }
  handleSubmit(): void {
    var fd = new FormData();
    this.file_list = [];
    var fd = new FormData();
    this.file_list = [];
    this.file_list.push(this.file_store[0].name);
    this.submitFile('1122', this.EncData);
    // for (let i = 0; i < this.file_store.length; i++) {
    //   fd.append('files', this.file_store[i], this.file_store[i].name);
    //   this.file_list.push(this.file_store[i].name);
    // }

    // do submit ajax
  }
  private readFile(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (evt: any) => {
      // this.fileData = reader.result;
      this.fileData = evt.target.result;
      this.processing = false;
      var base64rslt = (evt.target.result as string).split(',')[1];
      console.log('base64rslt', base64rslt);
      if (base64rslt != '') {
        console.log('base64rslt', base64rslt);
        //const key = '1234567890123456';
        //var FinalEP = this.set(key, base64rslt);
        //var FinalDP = this.get(key, FinalEP);
        this.EncData = this.AesEncDec.EncryptData(base64rslt);
        this.DecData = this.AesEncDec.DecryptData(this.EncData);
        console.log('FinalEP', this.EncData);
        console.log('FinalDP', this.DecData);
        // this.submitFile('1122', this.EncData);
      } else {
        this.file_store = [];
        this.txtFGroup.reset();
        this.file_list = [];
        this.snackbar.show('File is NULL', 'alert');
      }
    };
    reader.onerror = (evt) => {
      this.error = 'Error while reading the file, please try again';
      this.txtFGroup.reset();
      this.processing = false;
    };
  }
  submitFile(userid: string, filedata: string) {
    let data = {
      userId: userid,
      fileData: filedata,
    };

    this.loader.setLoading(true);
    this.ApiMethods.postresultservice(
      this.ApiService.ReceiptScrollResp,
      data
    ).subscribe(
      (resp: any) => {
        console.log('iyuiioo', resp);
        if (resp.result == true) {
          console.log(resp);
          //console.log("Show_Label_NewToken")
          this.snackbar.show('File Submitted Successfully !', 'success');
          this.loader.setLoading(false);
          this.fileresponse = resp.result;
          this.loader.setLoading(false);
          this.txtFGroup.reset();
        } else {
          var respError = JSON.stringify(resp.result);
          Object.entries(respError).map((item) => {});
          this.snackbar.show(respError, 'alert');
          this.loader.setLoading(false);
          this.txtFGroup.reset();
          this.file_list = [];
        }
      },
      (res: any) => {
        console.log('errror message___', res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          this.txtFGroup.reset();
          this.file_list = [];
          this.snackbar.show(
            'Something Went Wrong ! Please Try Again',
            'danger'
          );
        }
      }
    );
  }

  // set(keys: string, value: any) {
  //   var key = CryptoJS.enc.Utf8.parse(keys);
  //   var iv = CryptoJS.enc.Utf8.parse(keys);
  //   var encrypted = CryptoJS.AES.encrypt(
  //     CryptoJS.enc.Utf8.parse(value.toString()),
  //     key,
  //     {
  //       keySize: 128 / 8,
  //       iv: iv,
  //       mode: CryptoJS.mode.CBC,
  //       padding: CryptoJS.pad.Pkcs7,
  //     }
  //   );

  //   return encrypted.toString();
  // }

  // //The get method is use for decrypt the value.
  // get(keys: string, value: any) {
  //   var key = CryptoJS.enc.Utf8.parse(keys);
  //   var iv = CryptoJS.enc.Utf8.parse(keys);
  //   var decrypted = CryptoJS.AES.decrypt(value, key, {
  //     keySize: 128 / 8,
  //     iv: iv,
  //     mode: CryptoJS.mode.CBC,
  //     padding: CryptoJS.pad.Pkcs7,
  //   });

  //   return decrypted.toString(CryptoJS.enc.Utf8);
  // }
}
