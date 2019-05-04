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
  Marker
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
  @Input() address = '';
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
    if (changes.address.currentValue !== '') {
      this.selectSearchResult(changes.address.currentValue);
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
          myLocation: true,
        },
      };
      this.map = GoogleMaps.create(this.element.nativeElement, options);

      this.map.one(GoogleMapsEvent.MAP_READY).then(() => {

        if (this.showAnimation) {
          this.map.animateCamera({ target: this.myLocation.latLng, zoom: 18, duration: 1500 });
        } else {
          this.map.animateCamera({ target: this.myLocation.latLng, zoom: 18, duration: 100 });
        }

        this.selectSearchResult('');

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
        this.address = '';
      });
  }


  private selectSearchResult(address: string) {
    // console.log(address);
    const req: GeocoderRequest = {};
    if (address === '') {
      req.position = {
        lat: this.myLocation.latLng.lat,
        lng: this.myLocation.latLng.lng
      };
    } else {
      req.address = address;
    }
    Geocoder.geocode(req).then((results: GeocoderResult[]) => {
      if (results[0]) {
        if (address === '') {
          this.currentLocationEvent.next(results[0].extra.lines[0]);
        } else {
          if (this.marker) {
            this.marker.setPosition(results[0].position);
            this.marker.setTitle(JSON.stringify(results[0].position));
            this.marker.showInfoWindow();
            this.address = '';
          } else {
            this.marker = this.map.addMarkerSync({
              position: results[0].position,
              title: JSON.stringify(results[0].position),
              draggable: true
            });
          }
          this.map.animateCamera({ target: this.marker.getPosition(), zoom: 18, duration: 1500 });
          this.marker.on(GoogleMapsEvent.MARKER_DRAG_END)
            .pipe(takeUntil(this.uns))
            .subscribe(markerDragged => this.OnDragMarker(markerDragged));
          // this.map.moveCamera({target: marker.getPosition});
          this.address = '';
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.uns.next();
    this.uns.complete();
  }
}
