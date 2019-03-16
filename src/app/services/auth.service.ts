import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {

  constructor(
  	public atAuth:AngularFireAuth
  	) { }

  login(email:string,password:string){
  	return new Promise((resolve, reject) => {
  		this.atAuth.auth.signInWithEmailAndPassword(email,password)
  			.then(userData => resolve(userData),
  			err => reject(err));
  	});
  }

  //Checl user status
  getAuth(){
  	return this.atAuth.authState.map(auth => auth);
  }

  logout(){
  	this.atAuth.auth.signOut();
  }

  register(email:string,password:string){
  	return new Promise((resolve, reject) => {
  		this.atAuth.auth.createUserWithEmailAndPassword(email,password)
  			.then(userData => resolve(userData),
  			err => reject(err));
  	});
  }

}
