import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { SettingsService } from '../../services/settings.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Client } from '../../models/Client';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent implements OnInit {
	// fieldArray1 = ['https://app.clickfunnels.com/affiliates',
	// 'https://app.clickfunnels.com/affiliate_management',
	// 'https://app.clickfunnels.com/affiliate_commissions',
	// 'https://app.clickfunnels.com/affiliate_payments',
	// 'https://app.clickfunnels.com/affiliate_leaderboards',
	// 'https://app.clickfunnels.com/commission_plans',
	// 'https://app.clickfunnels.com/affiliate_types',
	// 'https://app.clickfunnels.com/affiliate_branding'];

	fieldArray1: Array<any>=[];

	id:string;
	client:Client = {
		firstName:'',
		lastName:'',
		email:'',
		password:'',
		phone:'',
		fieldArray: []
	}

	disableBalanceOnEdit:boolean = true;

	newAttribute: any = {};

	users:any[];
	cusId: string;

  constructor(
  	public flashMessagesService:FlashMessagesService,
  	public clientService:ClientService,
  	public settingsService:SettingsService,
  	public router:Router,
  	public route:ActivatedRoute
  	) { }

  ngOnInit() {

  	this.disableBalanceOnEdit = this.settingsService.getSettings().disableBalanceOnEdit;
  	// Get ID 
		this.id=this.route.snapshot.params['id'];
		
		// Get Client
		this.clientService.getUsers().subscribe(users => {
			this.users = users;
			this.users.forEach((item) => {
				if(item.email === localStorage.SuperUserEmail) {
					this.cusId = item.$key;
					this.clientService.getClient(this.cusId, this.id).subscribe(client => {
						client.password = window.atob(client["password"]);

						this.client = client;
						this.fieldArray1 = this.client.fieldArray;
						console.log(this.client);
					});
				}
			})
			//console.log(this.users);
		});
  	// // Get Client
  	// this.clientService.getClient(this.id).subscribe(client => {
		// 	client.password = window.atob(client["password"]);
		// 	// var passLength = client.password.length;
		// 	// client.password = '';
		// 	// for(var i=0; i<passLength; i++) {
		// 	// 	client.password = client.password + '';
		// 	// }
  	// 	this.client = client;
  	// 	console.log(this.client);
  	// });
  }

  onSubmit({value, valid}:{value:Client, valid:boolean}){
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
  		this.router.navigate(['client/'+this.id]);
  	}else{
  		//Update client
  		this.clientService.updateClient(this.cusId, this.id, value);
  		this.flashMessagesService.show('Client updated', { cssClass: 'alert-success', timeout: 4000 });
  		this.router.navigate(['/client/'+this.id]);
  	}
  }

  addFieldValue() {
	this.fieldArray1.push(this.newAttribute);
	this.client.fieldArray = this.fieldArray1;
	this.newAttribute = {};
  }

  deleteFieldValue(index) {
    this.client.fieldArray.splice(index, 1);
	}
	
	selectIngredient(select) {
		// var option = select.options[select.selectedIndex];
		// var ul = select.parentNode.getElementsByTagName('ul')[0];

		this.client.fieldArray.push(select.value);
		
			 
		// var choices = ul.getElementsByTagName('input');
		// for (var i = 0; i < choices.length; i++)
		// 	if (choices[i].value == option.value)
		// 		return;
			 
		// var li = document.createElement('li');
		// var input = document.createElement('input');
		// var text = document.createTextNode(option.firstChild.data);
			 
		// input.type = 'hidden';
		// input.name = 'ingredients[]';
		// input.value = option.value;
	
		// li.appendChild(input);
		// li.appendChild(text);
		// li.setAttribute('(click)', 'removeFieldValue($event.target);');
		// li.setAttribute(option.attributes[0].name, option.attributes[0].value);          

			
		// ul.appendChild(li);
}

removeFieldValue(field) {
	// var index = this.client.fieldArray.indexOf(field.innerText);
	// this.client.fieldArray.splice(field, 1);
	// field.parentNode.removeChild(field);
	var index = this.client.fieldArray.indexOf(field.innerText);
	this.client.fieldArray.splice(index, 1);
}

}
