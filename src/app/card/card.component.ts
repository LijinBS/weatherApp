import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { ApiService } from '../api.service';
import { ICityData } from './card.interface';

const pattern = new RegExp('^[a-zA-Z]+');

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit, OnDestroy {
  currentCity: string;
  editView: boolean;
  selectedCity: string;
  errorMessage: string;
  error: boolean;
  cityData: ICityData;
  cityDataFetched: boolean;
  offlineStatus: boolean;
  weatherMap: object;
  subscription: Subscription;
  intervalSub: Subscription;

  constructor(private apiService: ApiService) {
    this.currentCity = 'Select City';
    this.selectedCity = null;
    this.editView = false;
    this.errorMessage = null;
    this.error = false;
    this.cityDataFetched = false;
    this.offlineStatus = false;
    this.cityData = {};
    this.subscription = null;
    this.intervalSub = null;
  }

  ngOnInit(): void {}

  populateData(result) {
    this.cityDataFetched = true;
    this.offlineStatus = false;
    this.editView = false;
    this.currentCity = this.selectedCity;
    const localStorageItem = JSON.parse(localStorage.getItem('result'));
    localStorageItem[this.currentCity] = result;
    localStorage.setItem('result', JSON.stringify(localStorageItem));
    const { weather, main, sys, wind } = result;
    this.cityData.iconSrc = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;
    this.cityData.iconAlt = weather[0].main;
    this.cityData.currentTemperature = main.temp;
    this.cityData.feelsLikeTemp = main.feels_like;
    this.cityData.WeatherDesc = weather[0].description;
    this.cityData.countryCode = sys.country;
    this.cityData.minTemp = main.temp_min;
    this.cityData.maxTemp = main.temp_max;
    this.cityData.weather =
      weather[0].id < 800 ? 'rainy' : weather[0].id == 800 ? 'sunny' : 'cloudy';
    this.cityData.pressure = main.pressure + 'hPa';
    this.cityData.humidity = main.humidity + '%';
    this.cityData.windSpeed = wind.speed + 'm/s';
  }

  fetchIntervalApiData(): void {
    this.intervalSub = interval(30000).subscribe(() => {
      this.fetchApiData(this.currentCity);
    });
  }

  fetchApiData(name) {
    this.subscription = this.apiService
      .getApiData({ type: 'getWeather', name })
      .subscribe(
        (result) => {
          this.populateData(result);
        },
        (error) => {
          if (error.error?.cod === '404' || error.status === 404) {
            this.error = true;
            this.errorMessage = 'Invalid City Name';
          } else {
            this.error = false;
            this.errorMessage = null;
            this.offlineStatus = true;
            const localStorageItem = JSON.parse(localStorage.getItem('result'));
            const backupData = localStorageItem[this.selectedCity];
            if (backupData && Object.keys(backupData)?.length) {
              this.populateData(backupData);
            } else {
              this.cityDataFetched = false;
              this.offlineStatus = true;
              this.editView = false;
            }
          }
        }
      );
  }

  selectCity() {
    this.editView = true;
  }

  saveCity() {
    console.log('saveCity')
    this.checkCityName(this.selectedCity);
    if (!this.error) {
      this.intervalSub?.unsubscribe();
      this.fetchApiData(this.selectedCity);
      this.fetchIntervalApiData();
    }
  }

  checkCityName(city) {
    console.log('checkCity')
    this.error = false;
    this.errorMessage = null;
    if (!city) {
      this.error = true;
      this.errorMessage = 'Please enter a city';
    } else if (!pattern.test(city)) {
      this.error = true;
      this.errorMessage = 'Invalid City Name';
    } else {
      this.error = false;
      this.errorMessage = null;
    }
  }

  cancel() {
    this.editView = false;
  }

  onChangeEvent(event) {
    this.selectedCity = event.target.value;
    this.checkCityName(this.selectedCity);
  }

  ngOnDestroy() {
    this.intervalSub.unsubscribe();
    this.subscription.unsubscribe();
  }
}

// const result = {
//   "coord": {
//     "lon": 80.28,
//     "lat": 13.09
//   },
//   "weather": [
//     {
//       "id": 701,
//       "main": "Mist",
//       "description": "mist",
//       "icon": "50n"
//     }
//   ],
//   "base": "stations",
//   "main": {
//     "temp": 27,
//     "feels_like": 32.62,
//     "temp_min": 27,
//     "temp_max": 27,
//     "pressure": 1012,
//     "humidity": 88
//   },
//   "visibility": 5000,
//   "wind": {
//     "speed": 1,
//     "deg": 0
//   },
//   "clouds": {
//     "all": 75
//   },
//   "dt": 1606654525,
//   "sys": {
//     "type": 1,
//     "id": 9218,
//     "country": "IN",
//     "sunrise": 1606610688,
//     "sunset": 1606651804
//   },
//   "timezone": 19800,
//   "id": 1264527,
//   "name": "Chennai",
//   "cod": 200
// }
