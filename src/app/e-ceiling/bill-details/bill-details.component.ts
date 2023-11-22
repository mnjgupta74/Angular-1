import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LoaderService } from 'src/app/services/loaderservice';
import { OtpVerficationComponent } from '../otp-verfication/otp-verfication.component';
import { Route, Router } from '@angular/router';

export type FadeState = 'visible' | 'hidden';
@Component({
  selector: 'app-bill-details',
  templateUrl: './bill-details.component.html',
  styleUrls: ['./bill-details.component.scss'],
  animations: [
    trigger('state', [
      state(
        'visible',
        style({
          opacity: '1'
        })
      ),
      state(
        'hidden',
        style({
          opacity: '0'
        })
      ),
      transition('* => visible', [animate('500ms ease-in')]),
      transition('visible => hidden', [animate('500ms ease-out')])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BillDetailsComponent implements OnInit {
  state!: FadeState;
  private _show!: boolean;
  get show() {
    return this._show;
  }
  @Input()
  set show(value: boolean) {
    if (value) {
      // show the content and set it's state to trigger fade in animation
      this._show = value;
      this.state = 'visible';
    } else {
      // just trigger the fade out animation
      this.state = 'hidden';
    }
  }
  billDetails!:FormGroup;
  
  
data: any[] =[
  {
    "Treasury Name":"Electricity",
    "Office Name":"jaipur",
    "Bill Type":"Fully vouched Contingent Bill",
    "net Amt":10000,
    "Gross Amt":20000,
  },
  {
    "Treasury Name":"Electricity",
    "Office Name":"jaipur",
    "Bill Type":"Fully vouched Contingent Bill",
    "net Amt":10000,
    "Gross Amt":20000,
  },
  {
    "Treasury Name":"Electricity",
    "Office Name":"jaipur",
    "Bill Type":"Fully vouched Contingent Bill",
    "net Amt":10000,
    "Gross Amt":20000,
  },
  {
    "Treasury Name":"Electricity",
    "Office Name":"jaipur",
    "Bill Type":"Fully vouched Contingent Bill",
    "net Amt":10000,
    "Gross Amt":20000,
  },
  {
    "Treasury Name":"Electricity",
    "Office Name":"jaipur",
    "Bill Type":"Fully vouched Contingent Bill",
    "net Amt":10000,
    "Gross Amt":20000,
  },
  {
    "Treasury Name":"Electricity",
    "Office Name":"jaipur",
    "Bill Type":"Fully vouched Contingent Bill",
    "net Amt":10000,
    "Gross Amt":20000,
  },
  {
    "Treasury Name":"Electricity",
    "Office Name":"jaipur",
    "Bill Type":"Fully vouched Contingent Bill",
    "net Amt":10000,
    "Gross Amt":20000,
  },
  {
    "Treasury Name":"Electricity",
    "Office Name":"jaipur",
    "Bill Type":"Fully vouched Contingent Bill",
    "net Amt":10000,
    "Gross Amt":20000,
  },
  {
    "Treasury Name":"Electricity",
    "Office Name":"jaipur",
    "Bill Type":"Fully vouched Contingent Bill",
    "net Amt":10000,
    "Gross Amt":20000,
  },
  {
    "Treasury Name":"Electricity",
    "Office Name":"jaipur",
    "Bill Type":"Fully vouched Contingent Bill",
    "net Amt":10000,
    "Gross Amt":20000,
  },
  {
    "Treasury Name":"Electricity",
    "Office Name":"jaipur",
    "Bill Type":"Fully vouched Contingent Bill",
    "net Amt":10000,
    "Gross Amt":20000,
  },
  {
    "Treasury Name":"Electricity",
    "Office Name":"jaipur",
    "Bill Type":"Fully vouched Contingent Bill",
    "net Amt":10000,
    "Gross Amt":20000,
  },

  ]
 monthData:any[]=[];
 @ViewChild(MatSort) set matSort(sort: MatSort) {
  this.dataSource.sort = sort;
 
 }
 
 
  constructor(
    private fb:FormBuilder,
    public loader: LoaderService,
    public dialog: MatDialog,
    private router: Router,
    
  ) { 
    this.dataSource = new MatTableDataSource();
    // this.dataSource.sort = this.sort;
  }
form!:FormGroup
myDialogRef!: any;
  ngOnInit(): void {
    this.billDetails = this.fb.group({
    referenceNo :[null,Validators.required],
    })
  this.openDialog()


// this.editMode = false;


  }
  


  openDialog() {
    // this.myDialogRef = this.dialog.open(template,{disableClose:true,});
    this.myDialogRef = this.dialog.open(OtpVerficationComponent, {
      panelClass: 'dialog-w-50',
      autoFocus: true,
      disableClose:true,
      height: 'auto',
      width: '40%',
      
    });

    this.myDialogRef.afterClosed().subscribe((result:any) => {
console.log(result);
if(!result){
  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate(['/Dashboard']);
  });
}

});
    this.afterClose()
  }
  afterClose(){
    this.myDialogRef.afterClosed((data:any)=>{
console.log(data);

    })
  }
  animationDone(event: any) {
    // now remove the 
    if (event.fromState === 'visible' && event.toState === 'hidden') {
      // this._show = false;
      this._show = false;
      // this.state=
    }
  }
  displayedColumns = [

//
    "Treasury Name",
    "Office Name",
    "Bill Type",
    "net Amt",
    "Gross Amt",
    
  ];
  dataSource!: MatTableDataSource<any>;
   table:any
  @ViewChild("MatPaginator", { static: false }) paginator!: MatPaginator;
  @ViewChild("sort", { static: false }) sort!: MatSort;


  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  Submit(){
    this.show =!this.show;
    this.dataSource.data = this.data;
  }
}
