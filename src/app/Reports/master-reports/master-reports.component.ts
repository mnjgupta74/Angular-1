import { Component, OnInit } from '@angular/core';
//import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loaderservice';
import { Helper } from 'src/app/utils/Helper';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import { Observable, map, startWith } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-master-reports',
  templateUrl: './master-reports.component.html',
  styleUrls: ['./master-reports.component.scss']
})

  export class MasterReportsComponent implements OnInit {
  masterreportGroup: any;
  ChooseOption: any = '';
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []
  REPORTdata: any;
  Reportshow: boolean = false;

  displayColumns = ['SrNo', 'PAyid', 'PayName', 'DisplayName', 'MajorHead', 'BudgetHead', 'PDacno', 'ObjectHead', 'DivisionCode'];
  constructor(private ApiMethods: ApiMethods, public loader: LoaderService, private ApiService: ApiService, private snackbar: SnackbarService, private TCode: Helper, private finyear_: Helper, private toyear_: Helper) {
    this.getTreasuryList();
  }

  ngOnInit(): void {
    this.masterreportGroup = new FormGroup({
      searchReports: new FormControl(''),
      TreasuryControl: new FormControl({ value: this.TCode.Treasury_Code }, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
    })
  }

  onreportReset() {
    window.location.reload();
  }

  // Call Treasury List API >>>------------------->
  getTreasuryList() {
    this.loader.setLoading(true);
    this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe((resp:any) => {
      console.log("Auditor__res", resp);
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.TreasuryListarr = resp.result
        //console.log("Show_Treasury_AuditorList", this.TreasuryListarr);
        this.Treasuryoptions = this.masterreportGroup.controls['TreasuryControl'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            return typeof value === 'string' ? value : value.treasuryCode
          }),
          map((treasury: any) => {
            return treasury ? this._filter(treasury, data) : data.slice()
          })
        );
        const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.TCode.Treasury_Code)[0];
        this.masterreportGroup.patchValue({
          TreasuryControl: treasury
        })

        if (this.TCode.Treasury_Code != "5000") {
          this.masterreportGroup.controls['TreasuryControl'].disable();
        }
      }
    })
    this.loader.setLoading(false);
  }


  _filter(value: string, data: any) {
    return data.filter((option: any) => {
      return option.TreasuryName.toLowerCase().includes(value.toLowerCase())
    });
  }
  displayFn(selectedoption: any) {
    console.log("display_fun_call aaa", selectedoption.TreasuryName);
    return selectedoption ? selectedoption.TreasuryName : undefined;
  };

  GetReportLIst() {
    this.Reportshow = true;
  }

  applyFilter(filterValue: string) {
    this.REPORTdata.filter = filterValue.trim().toLowerCase();
    if (this.REPORTdata.paginator) {
      this.REPORTdata.paginator.firstPage();
    }
  }

  //export to pdf 
  makePdf() {
    var doc = new jsPDF("l", "mm", "a4");
    autoTable(doc, { html: "#Report" });
    doc.text(" Master Report", 130, 10);
    doc.text("https://rajkosh.rajasthan.gov.in", 10, 200);
    doc.save(" Master Report.pdf");
  }
}
