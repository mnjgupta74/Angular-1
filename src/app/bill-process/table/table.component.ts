import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BehaviorSubject } from 'rxjs';
// import { saveAs } from '.angula'
export const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(
      ':enter',
      [
        style({opacity: 0, transform: 'translateY(-15px)'}),
        stagger(
          '20ms',
          animate(
            '200ms ease-out',
            style({opacity: 1, transform: 'translateY(0px)'})
          )
        )
      ],
      {optional: true}
    )
  ])
]);



@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [listAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit,OnChanges  {
  @Input() pdfButton= false
  @Input() sticky= false
  @Input() checkList= true
  @Input() filterField= false
  @Input() datasource:MatTableDataSource<any> = new MatTableDataSource();
  @Input() columns!:any[]
  @Input() Total!:any[]
  @Input() id!:any
  @Input()  detectChange :BehaviorSubject<any>= new BehaviorSubject(true);
  @Output() ParentComponet:EventEmitter<any> = new EventEmitter()
  @Output() childButtonEvent = new EventEmitter();
  selectedList:any
  // @ViewChild(MatPaginator) set MatPaginator(paginator: MatPaginator) {
  //   this.datasource.paginator = paginator;
  // }
  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.datasource.sort = sort;
  }
  selection = new SelectionModel<any>(true, []);
  dynamicColumns:any=[
    'SrNo',
   
  ]
  constructor( private cdr: ChangeDetectorRef) {
    // if(!this.sticky){
      // this.datasource.paginator = this.paginator;
    // }
   }

  ngOnInit(): void {
 
    this.columns.forEach((i:any)=>{
      this.dynamicColumns.push(i)
    })
    if(this.checkList){
      this.dynamicColumns.push('checkList')
      this.masterToggle()
    
      this.detectChange.subscribe((ToRange) => {
        console.log(ToRange);
       
      });
      this.logSelection()
        // Subscribe on selection change
      this.selection.changed.subscribe((item)=>{
        console.log(item);
        let uniqueArray:any[]=[]
      
        this.datasource.filteredData.forEach(ele1 => {
          this.selection.selected.forEach(ele2 => ele1 === ele2 && uniqueArray.push(ele1));
        });
        console.log(uniqueArray);
        // this.selectedBills =uniqueArray.length
        this.selectedList = uniqueArray
        this.sendData( this.selectedList )
      })
      this.sendData(this.datasource.data)
    }
     if(!this.sticky){
    setTimeout(() => this.datasource.paginator = this.paginator);
   this.cdr.detectChanges()
  }
  }
  ngOnChanges() {
    /**********THIS FUNCTION WILL TRIGGER WHEN PARENT COMPONENT UPDATES 'someInput'**************/
    //Write your code here
     console.log(this.datasource);
    } 
  TitleCase(str:string){
    let string= str.replace(/([A-Z])/g, ' $1').trim()
    const splitArr = string.split(' ') 
    const capitalizedArr = splitArr.map(word => word[0].toUpperCase() + word.substring(1))
    const result = capitalizedArr.join(' ');
    return result
    }

    calculate(field:string){
      let total = 0
     let calc = this.Total?.includes(field)
    if(calc){
    this.datasource.filteredData.forEach(element => {
    total= total + element[field] 
     });
  return total;
}
      return ''
    }

 

    exportToPdf() {
      let str: string = '';
      let table = document.createElement('table');
      table.setAttribute('id', 'testpdTable');
      let heasRow = '';
      this.dynamicColumns.forEach((value: any) => {
        heasRow = heasRow + `<th scope="col" >${value}</th>`;
      });
      heasRow = `<tr>${heasRow} <tr> `;
      let tableData = this.datasource.data
        .map((value1, index) => {
          str = str + `<td >${index + 1}</td>`;
          this.dynamicColumns.map((value: any) => {
            if (value !== 'SrNo') {
              str = str + `<td >${value1[value]}</td>`;
            }
          });
  
          let str1 = `<tr>${str} <tr> `;
          str = '';
          return str1;
        })
        .join('');
      const footer: any = document.querySelector('#footer');
  
      let myfoot = document.createElement('tr');
      myfoot.setAttribute('class', 'thead-dark');
      myfoot.innerHTML = footer.innerHTML;
      table.innerHTML =
        `<thead><tr>${heasRow} <tr></thead> ` +
        `<tbody>${tableData}</tbody>` +
        `<tfoot class="thead-dark bold-font bodytext-color ps-3" >${footer.innerHTML} </tfoot>`;
      console.log();
      var doc = new jsPDF('l', 'mm', 'a4');
      doc.text('E-ceiling Report', 130, 10);
      doc.setFontSize(11);
      doc.setTextColor(100);
      autoTable(doc, { html: table, showFoot: 'lastPage' });
       doc.text("https://rajkosh.rajasthan.gov.in",10, 200);
       doc.save("E-ceilingReport.pdf");
      // doc.output('dataurlnewwindow');
    }
  
      /** Whether the number of selected elements matches the total number of rows. */
   isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.datasource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.datasource.data.forEach(row => this.selection.select(row));
        // this.logSelection();
  }

  logSelection() {
    let params:any[]=[]
    this.selection.selected.forEach(s =>{ params.push(s)});
    console.log(this.datasource     )
    // this._route.navigateByUrl('approvedByID',{data:this.selection.selected})
    // console.log(params)
   
    let final =this.findCommonElements3(params, this.datasource.filteredData)
    console.log(final);
    let uniqueArray:any[] = [];
      
    // Finding the common elements in both arrays
    this.datasource.filteredData.forEach(ele1 => {
      params.forEach(ele2 => ele1 === ele2 && uniqueArray.push(ele1));
    });
    this.selectedList = uniqueArray
    // console.log(uniqueArray);
    if(this.ParentComponet){
      this.sendData(uniqueArray)
    }
 
    // this._route.navigate(['/approvedByID'], { queryParams: {data:JSON.stringify(params)}});
    // this._route.navigateByUrl('/approvedByID');;
   
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = filterValue.trim().toLowerCase();
    if(!this.sticky){
      if (this.datasource.paginator) {
        this.datasource.paginator.firstPage();
      }
    }
    if(this.checkList){
      this.logSelection()
    }
   
  }
  findCommonElements3(arr1:any, arr2:any) {
    return arr1.some((item:any) => arr2.includes(item))
}

sendData(data:any){
  this.ParentComponet.emit(data)//emit is a function and you can pass the value
}
}



