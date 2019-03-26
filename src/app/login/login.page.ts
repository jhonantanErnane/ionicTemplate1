import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfigButton } from '../modules/header/models/ion-buttons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup;
  configButton: ConfigButton;

  constructor() {
    this.configButton = {
      button: [{
        ionBack: {
          text: ''
        }
      }],
      slot: 'start'
    };

    this.form = new FormGroup({
      user: new FormControl(null, Validators.required),
      pass: new FormControl(null, [Validators.required, Validators.minLength(3)])
    });
  }

  ngOnInit() {
  }



}
