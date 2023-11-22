export interface CheckedList {
  extraCheese: string;
  mushroom: string;
  pepperoni: string;
}
export interface Gap {
  // id:number
  // years: string;
  // months: string;
  // days: string;
  date: string;
  enddate: string;
  dateRange:string;
  fromDate: string;
  toDate:string;
}
export interface Count {
  sum: number;
}
export interface City {
  value: string;
  viewValue: string;
}

export interface Document {
  file: string;
}
export interface DocumentId {
  id: number;
}
export interface Progress {
  ind: number;
}

export interface PeriodicElement {
  name: string;
  title: number;
  sex: string;
  symbol: string;
  imagePath: string;
  relation: string;
  main: string;
  alternate: string;
}


export interface DocumentIdList {
  documentName: string;
  size: string;
  id: number;
}

export interface QualifyingService {
  fromDate: string;
  toDate:string;
}