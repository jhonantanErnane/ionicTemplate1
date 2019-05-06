import { Component, ViewChild, ElementRef, OnDestroy, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  LocationService,
  MyLocation,
  MarkerOptions,
  Geocoder,
  GeocoderRequest,
  GeocoderResult,
  Marker,
  GoogleMapsAnimation
} from '@ionic-native/google-maps';
import { Platform } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('map') element: ElementRef;
  @Input() showAnimation = true;
  // @Input() address = '';
  @Input() latLong = { lat: 0, lng: 0 };
  @Output() fullAddressEvent = new EventEmitter<string>();
  @Output() currentLocationEvent = new EventEmitter<string>();

  marker: Marker;
  map: GoogleMap;
  uns = new Subject<any>();
  myLocation: MyLocation;

  constructor(private plt: Platform) {
  }

  ngOnInit(): void {
    this.plt.ready().then(() => {
      this.loadMap();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes ', changes.latLong.currentValue);

    if (changes.latLong.currentValue &&
      (JSON.parse(changes.latLong.currentValue)).lat &&
      (JSON.parse(changes.latLong.currentValue)).lng) {

      this.setMarker(JSON.parse(changes.latLong.currentValue));
    }

  }

  loadMap() {

    LocationService.getMyLocation().then((response: MyLocation) => {
      this.myLocation = response;
      const options: GoogleMapOptions = {
        camera: {
          target: {
            lat: this.myLocation.latLng.lat,
            lng: this.myLocation.latLng.lng
          },
          zoom: 10,
          tilt: 30,
          duration: 1000
        },
        controls: {
          myLocationButton: true,
          myLocation: true
        },
        disableDoubleClickZoom: true
      };
      this.map = GoogleMaps.create(this.element.nativeElement, options);

      this.map.one(GoogleMapsEvent.MAP_READY).then(() => {

        if (this.showAnimation) {
          this.map.animateCamera({ target: this.myLocation.latLng, zoom: 18, duration: 1500 });
        } else {
          this.map.animateCamera({ target: this.myLocation.latLng, zoom: 18, duration: 100 });
        }

        this.marker = this.map.addMarkerSync({
          position: this.myLocation.latLng,
          title: JSON.stringify(this.myLocation.latLng),
          draggable: true
        });

        this.marker.on(GoogleMapsEvent.MARKER_DRAG_END)
          .pipe(takeUntil(this.uns))
          .subscribe(markerDragged => this.OnDragMarker(markerDragged));

        this.currentLocationEvent.next(this.myLocation.latLng.toString());
        // this.selectSearchResult('');

      });

    });

  }

  private OnDragMarker(markerDragged: any) {
    const lat = markerDragged[0].lat;
    const lng = markerDragged[0].lng;
    const options: GeocoderRequest = {
      position: {
        lat: lat,
        lng: lng
      }
    };

    Geocoder.geocode(options)
      .then((results: GeocoderResult[]) => {
        // console.log(results);

        if (results && results[0] && results[0].extra && results[0].extra.lines[0]) {
          this.fullAddressEvent.next(results[0].extra.lines[0]);
        }

        this.marker.setPosition(results[0].position);
        this.marker.setTitle(JSON.stringify(results[0].position));
        this.marker.showInfoWindow();
      });
  }

  setMarker(latLong: { lat: number, lng: number }) {
    console.log('setMarker');

    if (this.marker) {
      this.marker.setPosition(latLong);
      this.marker.setTitle(JSON.stringify(latLong));
      this.marker.showInfoWindow();
    } else {
      this.marker = this.map.addMarkerSync({
        position: latLong,
        title: JSON.stringify(latLong),
        draggable: true
      });
    }
    this.map.animateCamera({ target: this.marker.getPosition(), zoom: 18, duration: 1500 });
  }


  private selectSearchResult(latLong: { lat: number, lng: number }) {
    // console.log(address);
    const req: GeocoderRequest = {};
    // if (address === '') {
    req.position = {
      lat: this.myLocation.latLng.lat,
      lng: this.myLocation.latLng.lng
    };
    // } else {
    //   req.address = address;
    // }
    Geocoder.geocode(req).then((results: GeocoderResult[]) => {
      if (results[0]) {
        console.log(results[0].position);

        this.currentLocationEvent.next(results[0].extra.lines[0]);
      }
    });
  }

  ngOnDestroy(): void {
    this.uns.next();
    this.uns.complete();
  }
}
