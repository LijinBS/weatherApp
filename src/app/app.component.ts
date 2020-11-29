import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'WeatherApp';
  currentTime: string
  timeInterval: any
  constructor() {
    this.currentTime = null
    this.timeInterval = null
  }

  ngOnInit() {
    localStorage.setItem('result', JSON.stringify({}))
    this.timeInterval = setInterval(()=> {
      this.currentTime = moment().format('MMMM Do YYYY, h:mm:ss A')
    }, 1000)
  }

  ngOnDestroy() {
    clearInterval(this.timeInterval)
  }
}
