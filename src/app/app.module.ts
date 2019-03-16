import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FlashMessagesModule } from 'angular2-flash-messages';
// AngularFire Imports
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';



// Service Imports
import { ClientService } from './services/client.service';
import { AuthService } from './services/auth.service';
import { SettingsService } from './services/settings.service';
import { AuthGuard } from './guards/auth.guard';
import { RegisterGuard } from './guards/register.guard';
import { environment } from './../environments/environment';
import { PaymentService } from './services/payment.service';

import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClientsComponent } from './components/clients/clients.component';
import { EditClientComponent } from './components/edit-client/edit-client.component';
import { AddClientComponent } from './components/add-client/add-client.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ClientDetailsComponent } from './components/client-details/client-details.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { MakePaymentComponent } from './components/make-payment/make-payment.component';
import { PaymentComponent } from './components/payment/payment.component';

const appRoutes: Routes = [
	{path:'', component:DashboardComponent, canActivate:[AuthGuard]},
	{path:'register', component:RegisterComponent, canActivate:[RegisterGuard]},
  {path:'login', component:LoginComponent},
  {path:'add-client', component:AddClientComponent, canActivate:[AuthGuard]},
  {path:'client/:id', component:ClientDetailsComponent, canActivate:[AuthGuard]},
	{path:'edit-client/:id', component:EditClientComponent, canActivate:[AuthGuard]},
  {path:'settings', component:SettingsComponent, canActivate:[AuthGuard]},
  {path:'payment', component:MakePaymentComponent},
  {path:'**', component:PageNotFoundComponent},
];

// export const firebaseConfig = {
// 		apiKey: "AIzaSyBaaegvQxYMUmeBRdkq6Cmp4vYnL6X4udE",
// 	    authDomain: "clientpanel-fdc7c.firebaseapp.com",
// 	    databaseURL: "https://clientpanel-fdc7c.firebaseio.com",
// 	    storageBucket: "clientpanel-fdc7c.appspot.com",
// 	    messagingSenderId: "252586174365"
// }

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    NavbarComponent,
    LoginComponent,
    DashboardComponent,
    ClientsComponent,
    EditClientComponent,
    AddClientComponent,
    SidebarComponent,
    SettingsComponent,
    ClientDetailsComponent,
    PageNotFoundComponent,
    MakePaymentComponent,
    PaymentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    FlashMessagesModule,
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ],
  providers: [
	  AngularFireAuth,
	  AngularFireDatabase,
	  ClientService,
    AuthService,
    AuthGuard,
    RegisterGuard,
    SettingsService,
    PaymentService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

//https://angufire-f479a.firebaseapp.com/
