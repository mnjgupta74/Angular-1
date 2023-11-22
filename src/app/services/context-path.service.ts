import { Injectable } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ContextPathService {
  deafultConfig = {
    IsLogin: true,
  };
  private configSubject = new BehaviorSubject(this.deafultConfig);
  
  set config(value) {
    this.configSubject.next(value);
  }

  get config(): any | Observable<any> {
    return this.configSubject.asObservable();
  }

} 
