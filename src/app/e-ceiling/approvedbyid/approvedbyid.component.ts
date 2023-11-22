import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

const tableData: any[] = [
  {
    bill_type: 'SPF Payment',
    treasury: 'Jaipur(city)',
    ddo_fwd_date: '10/04/2023',
    ecs_reason: '',
    file_name: '',
    token_no: 1873,
    bill_status: 'Bill Passed',
    bill_ecs_date: '',
    tv_no: '',
    tv_date: '',
    dispatched_date: '',
    ecs_status: '',
    amount: '',
  },
  {
    bill_type: 'SPF Payment',
    treasury: 'Jaipur(city)',
    ddo_fwd_date: '10/04/2023',
    ecs_reason: '',
    file_name: '',
    token_no: 1873,
    bill_status: 'Bill Passed',
    bill_ecs_date: '',
    tv_no: '',
    tv_date: '',
    dispatched_date: '',
    ecs_status: '',
    amount: '',
  },
  {
    bill_type: 'SPF Payment',
    treasury: 'Jaipur(city)',
    ddo_fwd_date: '10/04/2023',
    ecs_reason: '',
    file_name: '',
    token_no: 1873,
    bill_status: 'Bill Passed',
    bill_ecs_date: '',
    tv_no: '',
    tv_date: '',
    dispatched_date: '',
    ecs_status: '',
    amount: '',
  },
  {
    bill_type: 'SPF Payment',
    treasury: 'Jaipur(city)',
    ddo_fwd_date: '10/04/2023',
    ecs_reason: '',
    file_name: '',
    token_no: 1873,
    bill_status: 'Bill Passed',
    bill_ecs_date: '',
    tv_no: '',
    tv_date: '',
    dispatched_date: '',
    ecs_status: '',
    amount: '',
  },
  {
    bill_type: 'SPF Payment',
    treasury: 'Jaipur(city)',
    ddo_fwd_date: '10/04/2023',
    ecs_reason: '',
    file_name: '',
    token_no: 1873,
    bill_status: 'Bill Passed',
    bill_ecs_date: '',
    tv_no: '',
    tv_date: '',
    dispatched_date: '',
    ecs_status: '',
    amount: '',
  },
  {
    bill_type: 'SPF Payment',
    treasury: 'Jaipur(city)',
    ddo_fwd_date: '10/04/2023',
    ecs_reason: '',
    file_name: '',
    token_no: 1873,
    bill_status: 'Bill Passed',
    bill_ecs_date: '',
    tv_no: '',
    tv_date: '',
    dispatched_date: '',
    ecs_status: '',
    amount: '',
  },
  {
    bill_type: 'SPF Payment',
    treasury: 'Jaipur(city)',
    ddo_fwd_date: '10/04/2023',
    ecs_reason: '',
    file_name: '',
    token_no: 1873,
    bill_status: 'Bill Passed',
    bill_ecs_date: '',
    tv_no: '',
    tv_date: '',
    dispatched_date: '',
    ecs_status: '',
    amount: '',
  },
  {
    bill_type: 'SPF Payment',
    treasury: 'Jaipur(city)',
    ddo_fwd_date: '10/04/2023',
    ecs_reason: '',
    file_name: '',
    token_no: 1873,
    bill_status: 'Bill Passed',
    bill_ecs_date: '',
    tv_no: '',
    tv_date: '',
    dispatched_date: '',
    ecs_status: '',
    amount: '',
  },
];

@Component({
  selector: 'app-approvedbyid',
  templateUrl: './approvedbyid.component.html',
  styleUrls: ['./approvedbyid.component.scss']
})
export class ApprovedbyidComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('matNoDataRow') matNoDataRow!: any;
  tableDataSource = new MatTableDataSource<any>(tableData);
  filterDataControl = new FormControl([]);
  approveRefIdForm!: FormGroup;
  selection = new SelectionModel<any>(true, []);

  displayedColumns: string[] = ['sr_no','bill_type','treasury','ddo_fwd_date','ecs_reason','file_name','token_no','bill_status','bill_ecs_date','tv_no','tv_date','dispatched_date','ecs_status','amount'];
  filterDataList: any[] = ['42528402', 'Arrear', 'Pending', 'Filter-1', '425284544', 'Filter-2','Reverted','42528402', 'Arrear', 'Pending', 'Filter-1', '425284544', 'Filter-2','Reverted',];

  constructor(private _formBuilder: FormBuilder,private _activRoute:ActivatedRoute,private _route:Router) {}

  ngOnInit(): void {
    this._activRoute.queryParams.subscribe(params => {
    let pedidos = JSON.parse(params['data'])
    console.log(pedidos)
     });
    // this._activRoute.data.subscribe(params => {
    // // let pedidos = JSON.parse(params['data'])
    // console.log(params)
    //  });
    this.approveRefIdForm = this._formBuilder.group({
      transctionType: [''],
      filterChip: [''],
    });
  }

  ngAfterViewInit() {
    this.tableDataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();

    if (this.tableDataSource.paginator) {
      this.tableDataSource.paginator.firstPage();
    }
  }

  onToppingRemoved(event: any) {
    const filters = this.filterDataControl.value as string[];
    this.removeFirst(filters, event);
    this.filterDataControl.setValue(filters);
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tableDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.tableDataSource.data.forEach(row => this.selection.select(row));
  }

  logSelection() {
    this.selection.selected.forEach(s => console.log(s));
    console.log(this.tableDataSource     )
    this._route.navigateByUrl('batchApproval')
  }
}
