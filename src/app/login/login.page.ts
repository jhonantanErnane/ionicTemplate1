import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup;

  constructor() {
    this.form = new FormGroup({
      user: new FormControl(null, Validators.required),
      pass: new FormControl(null, [Validators.required, Validators.minLength(3)])
    });
  }

  ngOnInit() {
  }



}
