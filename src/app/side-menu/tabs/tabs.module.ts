import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/main/tabs/schedule',
    pathMatch: 'full'
  },
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'schedule',
        loadChildren: './pages/schedule/schedule.module#SchedulePageModule'
      },
      {
        path: 'speakers',
        loadChildren: './pages/speakers/speakers.module#SpeakersPageModule'
      },
      {
        path: 'map',
        loadChildren: './pages/map/map.module#MapPageModule'
      },
      {
        path: 'about',
        loadChildren: './pages/about/about.module#AboutPageModule'
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TabsPage]
})
export class TabsPageModule { }
