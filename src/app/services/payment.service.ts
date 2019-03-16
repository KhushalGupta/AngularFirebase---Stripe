import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';

@Injectable()
export class PaymentService {

  userId: string;
  membership: any;

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe((auth) => {
      if (auth) this.userId = auth.uid
    });

    // this.membership = this.afAuth.authState
    //   .do(user => this.userId = user.uid)
    //   .switchMap(user => {
    //     return this.db.object(`users/${user.uid}/pro-membership`);
    //   });
  }

  // processPayment(token: any, amount: number) {
  //   const payment = { token, amount }
  //   return this.db.list(`/payments/${this.userId}`).push(payment)
  // }

  processPayment(token: any, amount: number) {
    if(amount === 500) {
      this.membership = 'Basic Plan';
    }
    else if(amount === 1000) {
      this.membership = 'Moderate Plan';
    }
    else {
      this.membership = 'Premium Plan';
    }
    return this.db.object(`/users/${this.userId}/membership`)
                  .update({ token: token.id, amount: amount, membership: this.membership});
  }

}
