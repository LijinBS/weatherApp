import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable, Observer } from 'rxjs';
import {apiURL, API_KEY} from "../app/constants"

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getApiData({type, name}) {
    const url = apiURL[type]
    if(type && url) {   
      return new Observable((observer: Observer<any>) => {
        this.http.get(`${url}?q=${name}&appid=${API_KEY}&units=metric`).subscribe((res) => {
          observer.next(res)
        }, (err) => {
          console.log('error', err)
          observer.error(err)
        })
      }) 
    }
  }
}
