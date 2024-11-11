import { Injectable } from '@angular/core';
import {STORAGE_KEY} from 'src/app/crew-trip/core/constants/config';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  set(key: string, value: any) {
    if (value) {
      if(key === STORAGE_KEY.ACCESS_TOKEN){
        localStorage.setItem(key, value);
      }else{
        localStorage.setItem(key, JSON.stringify(value));
      }
    } else {
      localStorage.setItem(key, value);
    }
  }

  get(key: string) {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }

    return item;
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }

  clearAll() {
    localStorage.clear();
  }

}
