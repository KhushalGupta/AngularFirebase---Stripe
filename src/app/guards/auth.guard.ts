import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import  'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
  	private router:Router,
  	public atAuth:AngularFireAuth
  	){}	

  canActivate(): Observable<boolean>{
  	return this.atAuth.authState.map(auth => {
  		if(!auth){
  			this.router.navigate(['/login']);
  			return false;
  		}else{
  			return true;
  		}
  	});
  }
    
  
}
