import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { SettingsService } from '../../services/settings.service';
import { Client } from '../../models/Client';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css']
})
export class AddClientComponent implements OnInit {

	// fieldArray1 = ['https://app.clickfunnels.com/dashboard',
	// 							'https://app.clickfunnels.com/funnels',
	// 							'https://app.clickfunnels.com/affiliates',
	// 							'https://app.clickfunnels.com/affiliate_management',
	// 							'https://app.clickfunnels.com/affiliate_commissions',
	// 							'https://app.clickfunnels.com/affiliate_payments',
	// 							'https://app.clickfunnels.com/affiliate_leaderboards',
	// 							'https://app.clickfunnels.com/commission_plans',
	// 							'https://app.clickfunnels.com/affiliate_types',
	// 							'https://app.clickfunnels.com/affiliate_branding'];

	fieldArray1: Array<any>= [
															{'name':'https://app.clickfunnels.com/dashboard'},
															{'name':'https://app.clickfunnels.com/funnels'}
															
													]

	client:Client = {
		firstName:'',
		lastName:'',
		email:'',
		password:'',
		phone:'',
		fieldArray: this.fieldArray1
	}
	disableBalanceOnAdd:boolean = true;

	newAttribute: any = {};

  constructor(
  	public flashMessagesService:FlashMessagesService,
  	public clientService:ClientService,
  	public settingsService:SettingsService,
		public router:Router,
		private authService:AngularFireAuth,
  	) { }

  ngOnInit() {
  	this.disableBalanceOnAdd = this.settingsService.getSettings().disableBalanceOnAdd;
  }

  onSubmit({value, valid}:{value:Client, valid:boolean}){
	value.SuperUserEmail = localStorage.getItem('SuperUserEmail');
	value.SuperUserPassword = window.btoa(localStorage.getItem('SuperUserPassword'));
	
	value.password = window.btoa(value["password"]);

	var keys = Object.keys(value);
	for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        if(key.startsWith("field"))
        	delete value[key];
	}

	value.fieldArray = this.client.fieldArray;
	
  	if(!valid){
  		this.flashMessagesService.show('Please fill in all field', { cssClass: 'alert-danger', timeout: 4000 });
  		this.router.navigate(['add-client']);
  	}else{
  		//Add new client
  		this.clientService.newClient(value);
  		this.flashMessagesService.show('New client added', { cssClass: 'alert-success', timeout: 4000 });
  		this.router.navigate(['/']);
  	}
  }

  addFieldValue() {
      this.fieldArray1.push(this.newAttribute);
      this.newAttribute = {};
  }

  deleteFieldValue(index) {
    this.fieldArray1.splice(index, 1);
	}
	
	selectIngredient(select) {
		// var option = select.options[select.selectedIndex];
		// var ul = select.parentNode.getElementsByTagName('ul')[0];

		//this.allowedUrls.push(select.value);
		
			 
// 		var choices = ul.getElementsByTagName('input');
// 		for (var i = 0; i < choices.length; i++)
// 			if (choices[i].value == option.value)
// 				return;
			 
// 		var li = document.createElement('li');
// 		var input = document.createElement('input');
// 		var text = document.createTextNode(option.firstChild.data);
			 
// 		input.type = 'hidden';
// 		input.name = 'ingredients[]';
// 		input.value = option.value;
	
// 		li.appendChild(input);
// 		li.appendChild(text);
// 		li.setAttribute('(click)', 'removeFieldValue($event.target);');
// 		li.setAttribute(option.attributes[0].name, option.attributes[0].value);          

			
// 		ul.appendChild(li);
}

removeFieldValue(field) {
	//var index = this.allowedUrls.indexOf(field.innerText);
	//this.allowedUrls.splice(index, 1);
	//field.parentNode.getElementsByTagName('ul')[0].removeChild(field);	
}

}
