import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable  } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { Client } from '../models/Client';

@Injectable()
export class ClientService {

	clients: FirebaseListObservable<any[]>;
   client: FirebaseObjectObservable<any>;
   
   users: FirebaseListObservable<any[]>;
   user: FirebaseObjectObservable<any>;

   constructor( public af : AngularFireDatabase ) {
     this.clients = this.af.list('/clients') as FirebaseListObservable<Client[]>;
     this.users = this.af.list('/customers') as FirebaseListObservable<any[]>;
   }

   getClients(){
   return this.clients;
   }

   newClient(client:Client){
   	this.clients.push(client);
   }

   getClient(id:string){
  	this.client = this.af.object('/clients/'+id) as FirebaseObjectObservable<Client>;	
  	return this.client;
   }

   updateClient(id:string, client:Client){
   	return this.clients.update(id, client);
   }

   deleteClient(id:string){
   	return this.clients.remove(id);
   }

   getUsers(){
      //this.users = this.af.object('/customers') as FirebaseObjectObservable<any[]>;	
      return this.users;
    }

   getUser(id:string){
   this.user = this.af.object('/users/'+id) as FirebaseObjectObservable<any>;	
   return this.user;
   }
}
