import { Component, OnDestroy } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.page.html',
  styleUrls: ['./side-menu.page.scss'],
})
export class SideMenuPage implements OnDestroy {

  appPages = [
    {
      title: 'Home',
      url: '/main/home',
      icon: 'home'
    },
    {
      title: 'List',
      url: '/main/list',
      icon: 'list'
    },
    {
      title: 'Tabs',
      url: '/main/tabs',
      icon: 'stats'
    },
    {
      title: 'Logout',
      url: '/',
      icon: 'log-out'
    },
  ];

  selectedPath = '';

  private unsu = new Subject<any>();

  constructor(private router: Router) {
    this.router.events
    .pipe(takeUntil(this.unsu))
    .subscribe((event: RouterEvent) => {
      this.selectedPath = event.url;
    });
  }

  ngOnDestroy(): void {
    this.unsu.next();
    this.unsu.complete();
  }

}
