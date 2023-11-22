import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-pd-ac-creation',
  templateUrl: './pd-ac-creation.component.html',
  styleUrls: ['./pd-ac-creation.component.scss']
})
export class PdAcCreationComponent implements OnInit {
  creationForm:any;
  creationList:any;
  pdInformationForm:any;
  displayedColumns:any[]=[];

  constructor(private _liveAnnouncer: LiveAnnouncer,) { }

  ngOnInit(): void {
    this.displayedColumns=[
      'SrNo',
      'pdac',
      'pdacname',
      'treasury',
      'budgetHead',
      'DDoCode',
      'BearingFlag'
     ];

     this.creationForm = new FormGroup({
      accountType: new FormControl('', Validators.required),

     });

     this.pdInformationForm = new FormGroup({
      pdaccno: new FormControl('', [Validators.pattern(/^[0-9]\d*$/)]),
      pdaccname: new FormControl('',Validators.required ),
      budgetHead: new FormControl('',Validators.required ),
      bearingFlag: new FormControl('',Validators.required ),
      deptSanctionNo: new FormControl('',Validators.required ),
      deptSanctionDate: new FormControl('',Validators.required ),
      controllingOfficeName1: new FormControl('',Validators.required ),
      controllingOfficeName2: new FormControl('',Validators.required ),
      treasurySanctionNo: new FormControl('',Validators.required ),
      treasurySanctionDate: new FormControl('',Validators.required ),
      holderStatus: new FormControl('',Validators.required ),
      DDOCode: new FormControl('',Validators.required ),
      openingBalance: new FormControl('',Validators.required ),
     })



  }


  applyFilter(filterValue: string) {
    this.creationList.filter = filterValue.trim().toLowerCase();

    if (this.creationList.paginator) {
      this.creationList.paginator.firstPage();
    }
  }


  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce('Sorted ${sortState.direction}ending');
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  Reset(){
    window.location.reload();
  }

}
