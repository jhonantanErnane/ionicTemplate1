import { Component, OnInit, OnDestroy, NgZone, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController, IonInput, IonSearchbar } from '@ionic/angular';
import { MapComponent } from 'src/app/modules/map/map.component';

declare var google: any;

@Component({
  selector: 'app-page-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {

  searchControl: FormControl;
  zoom: number;
  showMap: boolean;
  @ViewChild('txtHome') searchElementRef: IonSearchbar;
  @ViewChild('map') map: MapComponent;
  form: FormGroup;
  latLng: { lat: number; lng: number };
  private myLatLng: { lat: number; lng: number };
  placeholder = 'Enter the address';

  constructor(
    private navCtrl: NavController,
    private ngZone: NgZone) {
    this.zoom = 4;

    this.form = new FormGroup({
      endereco: new FormControl('', [Validators.required, Validators.minLength(2)]),
      comentario: new FormControl('', [Validators.required, Validators.minLength(2)])
    });

  }

  async ionViewDidEnter() {
    this.showMap = true;
    // create search FormControl
    this.searchControl = new FormControl();
    const inputHtmlRef = await this.searchElementRef.getInputElement();
    // console.log(inputHtmlRef);

    // const nativeHomeInputBox = document.getElementById('txtHome').getElementsByTagName('input')[0];
    const autocomplete = new google.maps.places.Autocomplete(inputHtmlRef, {
      types: ['address'],
      componentRestrictions: { country: 'BR' }
    });
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        // get the place result
        const place = autocomplete.getPlace();
        // console.log(place);

        // verify result
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }

        // set latitude, longitude
        this.latLng = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        this.form.get('endereco').setValue(place.formatted_address);
        console.log(this.latLng);
      });
    });
  }

  onClearSearch(event) {
    if (event) {
      event.stopPropagation();
    }
    this.map.setMarker(this.myLatLng);
    this.placeholder = 'Your location';
  }

  onBlurSearch() {
    if (this.form.get('endereco').value || this.form.get('endereco').value === '') {
      this.map.setMarker(this.myLatLng);
      this.form.get('endereco').setValue('Your location');
    }
  }

  onFullAddressEvent(fullAddress: string) {
    // console.log(fullAddress);
    this.form.get('endereco').setValue(fullAddress);
    // this.endereco = fullAddress;
  }

  // onCurrentLocationEvent(latLong: { lat: number, lng: number }) {
  onCurrentLocationEvent(latLong: string) {
    this.form.get('endereco').setValue('Your location');
    // console.log(latLong);

    this.myLatLng = JSON.parse(latLong);
  }

  // private setCurrentPosition() {
  //   if ('geolocation' in navigator) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       this.latitude = position.coords.latitude;
  //       this.longitude = position.coords.longitude;
  //       this.zoom = 12;
  //     });
  //   }
  // }


}
