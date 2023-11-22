import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dummy-token',
  templateUrl: './dummy-token.component.html',
  styleUrls: ['./dummy-token.component.scss']
})
export class DummyTokenComponent implements OnInit {

MpJwtToken:any;
  constructor( private router: Router,) { }

  ngOnInit(): void {
    this.setToken();

   this.MpJwtToken= sessionStorage.getItem('MpJwtToken');
   console.log("MpJwtToken",this.MpJwtToken);
   this.router.navigate(['']);   


  }

  setToken(){
  sessionStorage.setItem('MpJwtToken','eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwOi8vaWZtc3Rlc3QucmFqYXN0aGFuLmdvdi5pbiIsImF1ZCI6InRhcmdldFNlcnZpY2UiLCJqdGkiOiIxMDdiNjM2Mi0wNWIwLTQ5NjUtOTlkZi01MzE0YjA2NmEyNDQiLCJleHAiOjE2ODI5MjU2ODYsImlhdCI6MTY4MjkyNDQ4Niwic3ViIjoiSUZNU1RFU1QiLCJ1cG4iOiJJRk1TVEVTVCIsInByZWZlcnJlZF91c2VybmFtZSI6IklGTVMgVE9LRU4iLCJzc29JZCI6IlJBV1RFS0FNTEVTSDEwIiwibGV2ZWxWYWx1ZUlkIjpudWxsLCJkaXNwbGF5TmFtZSI6IlNISVYgU0FIQVkgTUVFTkEgICIsInJvbGVJZCI6IjgyIiwibGV2ZWxJZCI6IjEiLCJyb2xlTmFtZSI6IlRPIiwiZW1wbG95ZWVJZCI6bnVsbCwibGV2ZWxOYW1lIjoiT0ZGSUNFIiwibGV2ZWxWYWx1ZUNvZGUiOiIxMTExIiwidXNlcklkIjoiNTk4NjgiLCJhaWQiOiI1ODM1MyIsInRyZWFzQ29kZSI6IjE5MDAiLCJncm91cHMiOltdfQ.PLRFRpkRhS63jX01RrFL0KFifhGWWno-PRK36c_CiPcnA0fJC7UqbJ27PkOK3jV6oGnM2DnoaI9pgJ2DLg9-Ih0hRsct1delNmDkfzujsUGozIgqdAUKdxsizOABP33NLKufLU5wL4kiSWYZEmLVkpoNS9V1t1BxIR89ARE3ZNsWwdffu9qG55cQxg2Fete2J03lPfVNZXN9BSCfLazPm0K3w09_Qq3LSA7Emm66gQOfvS8zPiuX-pd4HGzxSV22zgXciA6nwDw5Je068EVF9b1QStULuLMM2b7zRRlT4HAS_Z3s7F-7Qg72qhqhTBRLbfgGYERNWLmr3REAH4NpdA');
    
  }



}
