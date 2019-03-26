import { Component, OnInit } from '@angular/core';
import { ConfigButton } from '../modules/header/models/ion-buttons';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  configButton: ConfigButton;

  constructor() { }

  ngOnInit() {
    this.configButton = {
      button: [{
        ionIcon: {
          name: 'log-in',
          size: 'large',
          route: '/login'
        }
      }],
      slot: 'end',
    };
  }

}
