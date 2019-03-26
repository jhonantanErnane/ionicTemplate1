import { Component, OnInit, Input } from '@angular/core';
import { ConfigButton } from './models/ion-buttons';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() title: string;
  @Input() configButton: ConfigButton;

  constructor(private router: Router, private location: Location) {
  }

  ngOnInit() {
  }

  navigate(route: string) {
    if (route) {
      this.router.navigate([`${route}`]);
    } else {
      this.location.back();
    }
  }

}
