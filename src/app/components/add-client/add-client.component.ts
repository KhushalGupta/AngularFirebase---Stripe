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

	users:any[];
	id: string;

  constructor(
  	public flashMessagesService:FlashMessagesService,
  	public clientService:ClientService,
  	public settingsService:SettingsService,
		public router:Router,
  	) { }

  ngOnInit() {
		this.disableBalanceOnAdd = this.settingsService.getSettings().disableBalanceOnAdd;
		
		this.clientService.getUsers()
      .pipe(take(1))
      .subscribe(users => {
			this.users = users;
			this.users.forEach((item) => {
				if(item.email === localStorage.SuperUserEmail) {
					this.id = item.$key;
				}
			})
			});
  }

  onSubmit({value, valid}:{value:Client, valid:boolean}){
	value.SuperUserEmail = localStorage.getItem('SuperUserEmail');
	value.SuperUserPassword = window.btoa(localStorage.getItem('SuperUserPassword'));
	
	value.password = window.btoa(value["password"]);

	const keys = Object.keys(value);
	for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        if(key.startsWith("field"))
        	delete value[key];
	}

	value.fieldArray = this.client.fieldArray;
	
  	if(!valid){
  		this.flashMessagesService.show('Please fill in all field', { cssClass: 'alert-danger', timeout: 4000 });
  		this.router.navigate(['add-client']);
  	}else{
  		//Add new client
  		this.clientService.newClient(value, this.id);
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
}
