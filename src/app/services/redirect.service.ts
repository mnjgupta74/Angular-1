import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class RedirectService {
  constructor(
    @Inject(DOCUMENT)
    private document: Document
  ) {}

  public postRedirect(params: any) {

    const form = this.document.createElement("form");
    console.log('....params',params);
    form.method = "POST";
    form.target = "_top";
    form.action = "https://122.187.9.65:9006/esign/2.1/signdoc/";
    // form.action = "https://esign.rajasthan.gov.in/esign/2.1/signdoc/";
    form.enctype="multipart/form-data";
    const input = this.document.createElement("input");
      input.type = "hidden";
      input.name = "msg";
      input.value = params;
      console.log("input",input.name);
      form.append(input);



    this.document.body.appendChild(form);
    form.submit();
  }
}
