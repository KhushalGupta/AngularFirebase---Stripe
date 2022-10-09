import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable  } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { Client } from '../models/Client';

@Injectable()
export class ClientService {

	 clients: FirebaseListObservable<Client[]>;
   client: FirebaseObjectObservable<Client>;
   
   users: FirebaseListObservable<any[]>;
   user: FirebaseObjectObservable<any>;

   constructor( public af : AngularFireDatabase ) {
     this.users = this.af.list('/customers') as FirebaseListObservable<any[]>;
   }

   getClients(id:string){
    this.clients = this.af.list('/customers/'+id+'/clients') as FirebaseListObservable<Client[]>;
    return this.clients;
   }

   newClient(client:Client, id:string){
    this.clients = this.af.list('/customers/'+id+'/clients') as FirebaseListObservable<Client[]>;
   	this.clients.push(client);
   }

   getClient(cusId:string, id:string){
  	this.client = this.af.object('/customers/'+cusId+'/clients/'+id) as FirebaseObjectObservable<Client>;	
  	return this.client;
   }

   updateClient(cusId:string, id:string, client:Client){
    this.clients = this.af.list('/customers/'+cusId+'/clients') as FirebaseListObservable<Client[]>;
   	return this.clients.update(id, client);
   }

   deleteClient(cusId:string, id:string){
    this.clients = this.af.list('/customers/'+cusId+'/clients') as FirebaseListObservable<Client[]>;
   	return this.clients.remove(id);
   }

   getUsers(){
      return this.users;
    }

   getUser(id:string){
   this.user = this.af.object('/users/'+id) as FirebaseObjectObservable<any>;	
   return this.user;
   }
}
