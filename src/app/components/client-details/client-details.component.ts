import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Client } from '../../models/Client';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css']
})
export class ClientDetailsComponent implements OnInit {
	id:string;
	client:Client;
	hasBalance:boolean = false;
	showBalanceUpdateInput:boolean = false;

	users:any[];
	cusId: string;

  constructor(
  	public flashMessagesService:FlashMessagesService,
  	public clientService:ClientService,
  	public router:Router,
  	public route:ActivatedRoute
  	) { }

  ngOnInit() {
	
	// Get ID 
	this.id=this.route.snapshot.params['id'];
	
	// Get Client
	this.clientService.getUsers().subscribe(users => {
		this.users = users;
		this.users.forEach((item) => {
			if(item.email === localStorage.SuperUserEmail) {
				this.cusId = item.$key;
				this.clientService.getClient(this.cusId, this.id).subscribe(client => {
					if(client.balance > 0){
						this.hasBalance = true;
					}
					this.client = client;
					console.log(this.client);
				});
			}
		})
		//console.log(this.users);
	});

  	
  	// this.clientService.getClient(this.cusId, this.id).subscribe(client => {
  	// 	if(client.balance > 0){
  	// 		this.hasBalance = true;
  	// 	}
  	// 	this.client = client;
  	// 	console.log(this.client);
  	// });
  }

//   updateBalance(id:string){
//   		this.clientService.updateClient(this.id,this.client);
//   		this.flashMessagesService.show('Balance Updated', { cssClass: 'alert-success', timeout: 4000 });
//   		this.router.navigate(['/client/'+this.id]);
//   }

  onDeleteClick(){
  	if (confirm("Are you sure to delete?")) {
  		this.clientService.deleteClient(this.cusId, this.id);
  		this.flashMessagesService.show('Client Deleted', { cssClass: 'alert-success', timeout: 4000 });
  		this.router.navigate(['/']);
  	}
  }

}
