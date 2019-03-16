import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SettingsService } from '../../services/settings.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

	isLoggedIn:boolean;
	loggedInUser:string;
	showRegister:boolean;

  constructor(
  		public flashMessagesService:FlashMessagesService,
  	  	public authService:AuthService,
  	  	public settingsService:SettingsService,
  	  	public router:Router
  	) { }

  ngOnInit() {
  	this.authService.getAuth().subscribe(auth => {
  		if(auth){
  			this.isLoggedIn = true;
  			this.loggedInUser = auth.email;
  		}else{
  			this.isLoggedIn = false;
  		}
  		this.showRegister = this.settingsService.getSettings().allowRegistration;
  	});
  }

  onLogoutClick(){
  	this.authService.logout();
  	this.flashMessagesService.show('You are loggrd out', { cssClass: 'alert-success', timeout: 4000 });
	this.router.navigate(['/login']);
	localStorage.clear(); 
  }

}
