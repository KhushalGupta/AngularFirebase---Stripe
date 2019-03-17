import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/Client';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

  	clients:Client[];
  	//clients:any[];
	totalOwed:number;
	
	users:any[];
	user:any;
	userId:string;

    constructor(public clientService:ClientService/*, public db: AngularFireDatabase */) { 
    	/*db.list('/clients')
    	     .valueChanges().subscribe(clients => { 
    	      this.clients = clients;
    	console.log(this.clients);
    	      });*/

      
    }

    ngOnInit() {
    	// this.clientService.getClients().subscribe(clients => {
    	// this.clients = clients;
    	// //console.log(this.clients);
			// });
			
			this.clientService.getUsers().subscribe(users => {
				this.users = users;
				this.users.forEach((item) => {
					if(item.email === localStorage.SuperUserEmail) {
						this.userId = item.userId;
						this.clientService.getUser(this.userId).subscribe(user => {
							this.user = user.membership;
							//console.log(this.user.membership);
						});
						this.clientService.getClients(item.$key).subscribe(clients => {
							 	this.clients = clients;
								console.log(clients);
						});
					}
				})
				//console.log(this.users);
				});
			
		if(parseInt(localStorage.getItem("count")) === 1 || localStorage.getItem("count") === null) {
			document.getElementById("popup").className +="display";
			document.getElementById("overlay").className +="display";
		}
	}
	
	check() {
		//console.log(this.user.membership);
		if(typeof this.user !== 'undefined') {
			var date = new Date(this.user.subscription.trial_start * 1000);
		localStorage.setItem("date", date.toDateString());

			if(localStorage.getItem("count") === null || localStorage.getItem("date") !== new Date().toDateString()) {
				document.getElementById("popup").classList.remove("display");
				document.getElementById("overlay").classList.remove("display");
			}
		var plan = this.user.membership;
		var trialEnd = new Date(this.user.subscription.trial_end * 1000);
		

		var restriction = trialEnd.getTime()-date.getTime();
		var diffDays = Math.ceil(restriction / (1000 * 3600 * 24)); 
		if(plan === "Basic Plan" && (restriction === 0 || restriction < 0)) {
			if(this.clients.length === 1) {
				document.getElementById("addClient").style.display = "none";
			}
			else {
				return "Your trial period has ended";
			}
		}

		else if(plan === "Standard Plan" && (restriction === 0 || restriction < 0)) {
			if(this.clients.length >= 4 && this.clients.length <= 5) {
				document.getElementById("addClient").style.display = "none";
			}
			else {
				return "Your trial period has ended";
			}
		}

		else if(plan === "Premiuim Plan" && (restriction === 0 || restriction < 0)) {
			if(this.clients.length >= 5  && this.clients.length <= 10) {
				document.getElementById("addClient").style.display = "none";
			}
			else {
				return "Your trial period has ended";
			}
		}

		else {
			document.getElementById("addClient").style.display = "";
			if(diffDays > 1) {
				return "Your trial period  will end in " + diffDays + " days";
			}
			else {
				return "Your trial period  will end in " + diffDays + " day";
			}
			
		}
		}
		else {
			document.getElementById("addClient").style.display = "none";
		}
	}

	close() {
		localStorage.setItem("count", "1");
		document.getElementById("popup").className +="display";
		document.getElementById("overlay").className +="display";
		return false;
	}
}
