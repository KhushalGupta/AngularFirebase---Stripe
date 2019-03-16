import { Injectable } from '@angular/core';
import { Settings } from '../models/settings';

@Injectable()
export class SettingsService {
	settings:Settings = {
		allowRegistration : true,
		disableBalanceOnAdd : false,
		disableBalanceOnEdit : false,
	}

  constructor() {
  	if(localStorage.getItem('settings') != null){
  		this.settings =  JSON.parse(localStorage.getItem('settings'));
  	}
   }

  getSettings(){
  	return this.settings;
  }

  changeSettings(settings:Settings){
  	localStorage.setItem('settings', JSON.stringify(settings));
  }
}
