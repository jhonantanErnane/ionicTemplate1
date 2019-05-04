import { Component, OnInit, OnDestroy, NgZone, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController, IonInput } from '@ionic/angular';

declare var google: any;

@Component({
  selector: 'app-page-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {

  latitude: number;
  longitude: number;
  searchControl: FormControl;
  zoom: number;
  showMap: boolean;
  @ViewChild('txtHome') searchElementRef: IonInput;

  constructor(
    private navCtrl: NavController,
    private ngZone: NgZone) {
    this.zoom = 4;
    this.latitude = 39.8282;
    this.longitude = -98.5795;

    // create search FormControl
    this.searchControl = new FormControl();

    // set current position
    this.setCurrentPosition();

  }

  async ionViewDidEnter() {
    this.showMap = true;
    // create search FormControl
    this.searchControl = new FormControl();
    const a = await this.searchElementRef.getInputElement();
    console.log(a);

    // const nativeHomeInputBox = document.getElementById('txtHome').getElementsByTagName('input')[0];
    const autocomplete = new google.maps.places.Autocomplete(a, {
      types: ['geocode'],
      componentRestrictions: { country: 'BR' },
      radius: 500
    });
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        // get the place result
        const place = autocomplete.getPlace();
        console.log(place);

        // verify result
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }

        // set latitude, longitude and zoom
        this.latitude = place.geometry.location.lat();
        this.longitude = place.geometry.location.lng();
        this.zoom = 12;
      });
    });
  }

  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }


}
