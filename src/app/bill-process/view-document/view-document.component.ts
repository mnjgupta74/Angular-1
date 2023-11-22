import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/utils/utility.service';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { LoaderService } from 'src/app/services/loaderservice';
import { SnackbarService } from 'src/app/utils/snackbar.service';

@Component({
  selector: 'app-view-document',
  templateUrl: './view-document.component.html',
  styleUrls: ['./view-document.component.scss']
})
export class ViewDocumentComponent implements OnInit {
  docs: any = [];
  getfilesArray: any = [];
  downloadLink: any;
  fileName: any;
  base64data: any;
  base64dataArray: any = [];
  isVisible: boolean = false;
  doc_Type: any = [];
  biirefNo: any;
  billNumber: any;
  @Input() billNo: number = 0
  @Input() DocFlag: boolean = false
  Doc_Close: any
  message_data: boolean = false;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private dialogRef: MatDialog, private ApiService: ApiService, private ApiMethods: ApiMethods, public loader: LoaderService
    , private snackbar: SnackbarService) {

  }
  ngOnChanges(changes: any) {
    if (changes.hasOwnProperty('billNo')) {
      this.getBase64ImgDocumentId(changes.billNo.currentValue);
    }
    if (changes.hasOwnProperty('DocFlag')) {
      console.log("docsss__flkg", changes.DocFlag.currentValue);
      this.Doc_Close = changes.DocFlag.currentValue
    }
  }
  ngOnInit(): void {
    //this.getBase64ImgDocumentId(this.biirefNo);
  }

  getfiles() {
    let data = {
      "type": "Sanction",
      "sourceId": 2,
      "docs": this.docs
    };
    this.loader.setLoading(true);

    this.ApiMethods.postresultservice(this.ApiService.getfiles, data).subscribe((resp:any)  => {

      console.log("Base64ImgArray__res", resp);
      var response = resp.data
      if (Object.keys(response).length > 0) {
        let documentArray = resp.data.document;
        for (let item of documentArray) {
          this.base64dataArray.push(item.content);

        }
        this.loader.setLoading(false);

        this.message_data = false

        console.log("Base64Content__res", this.base64dataArray);

        if (this.base64dataArray[0] != undefined && this.base64dataArray[0] != null) {
          this.preview(this.base64dataArray[0]);
        }
      }
      else {
        this.message_data = true
        this.loader.setLoading(false);

      }
    },
      (res: any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          this.message_data = true
        }
      })

  }


  getBase64ImgDocumentId(biirefNo: any) {
    let billNumber = biirefNo;
    this.billNumber = biirefNo;
    console.log("XXXXXXXXXXX_biirefNo", billNumber);
    this.loader.setLoading(true);

    this.ApiMethods.getservice(this.ApiService.Base64Img + billNumber).subscribe((resp:any)  => {
      console.log("Base64Img__res", resp);
      var response = resp.result
      if (Object.keys(response).length > 0) {
        this.docs = response;
        for (let item of response) {
          this.doc_Type.push(item);

        }
        this.loader.setLoading(false);

        this.message_data = false

        console.log("base64__result_documentID_", this.doc_Type);
        this.getfiles();



      }


      else {
        this.message_data = true
        this.loader.setLoading(false);

      }
    },
      (res: any) => {
        console.log("errror message___", res.status);

        if (res.status != 200) {
          this.loader.setLoading(false);
          this.message_data = true
        }
      })

  }



  preview(base: any) {
    this.isVisible = true;
    console.log("base64Pdf", base);
    this.base64data = "data:application/pdf;base64," + base;
    console.log("base64", this.base64data);
    this.base64data = 'data:application/pdf;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(base) as any).changingThisBreaksApplicationSecurity;
    if (top?.document.getElementById('ifrm')) {
      top.document.getElementById('ifrm')?.setAttribute("src", this.base64data);
    }

  }
  redirectToBack() {

    document.getElementById('ifrm')?.setAttribute("src", "");
    this.isVisible = false;
    //setAttribute('target', '_blank');
    // this.isVisible=false;
    this.dialogRef.closeAll();
  }
}



