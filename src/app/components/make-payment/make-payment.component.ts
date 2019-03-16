import { Component, OnInit, HostListener } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { SettingsService } from '../../services/settings.service';
import { Client } from '../../models/Client';
import { AngularFireAuth } from 'angularfire2/auth';
import { PaymentService } from '../../services/payment.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.css']
})
export class MakePaymentComponent implements OnInit {

  handler: any;
  amount: number;
  plan: string;

  constructor(private paymentSvc: PaymentService) { }

  ngOnInit() {
    this.plan = localStorage.getItem("plan");

    this.handler = StripeCheckout.configure({
      key: environment.stripeKey,
      //image: '/your/awesome/logo.jpg',
      locale: 'auto',
      billingAddress: true,
      token: token => {
        //this.paymentSvc.processPayment(token, this.amount)
        this.paymentSvc.processPayment(token, this.amount)
      }
    });
  }

  handlePayment(event) {
    this.amount = parseInt(event.value);
    if(this.amount === 500) {
      this.plan = "Basic Plan";
      localStorage.setItem("plan", this.plan);
      var d = document.getElementById("basicPlan");
      d.className += "active";
    }
    else if(this.amount === 1000) {
      this.plan = "Standard Plan";
      localStorage.setItem("plan", this.plan);
      var d = document.getElementById("standardPlan");
      d.className += "active";
    }
    else {
      this.plan = "Premium Plan";
      localStorage.setItem("plan", this.plan);
      var d = document.getElementById("premiumPlan");
      d.className += "active";
    }

    this.handler.open({
      name: 'FireStarter',
      excerpt: 'Deposit Funds to Account',
      amount: parseInt(event.value)
    });
  }

  @HostListener('window:popstate')
    onPopstate() {
      this.handler.close()
    }

}
