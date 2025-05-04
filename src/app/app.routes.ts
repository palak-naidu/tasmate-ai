import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GetStartedComponent } from './components/get-started/get-started.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { AboutUsComponent } from './components/about-us/about-us.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'get-started', component: GetStartedComponent },
  { path: 'contact', component: ContactUsComponent },
  { path: 'about', component: AboutUsComponent },
  { path: '**', redirectTo: '' },
];
