import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { FlashMessagesService } from 'angular2-flash-messages';
import { ClientService } from '../../services/client.service';
import { SettingsService } from '../../services/settings.service';

import { Client } from '../../models/Client';

import { Subscription } from 'rxjs/Subscription';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css']
})
export class AddClientComponent implements OnInit, OnDestroy {
  clientUrls: { name: string }[] = [
    { 'name': 'https://app.clickfunnels.com/dashboard' },
    { 'name': 'https://app.clickfunnels.com/funnels' }
  ];

  client: Client = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    fieldArray: this.clientUrls
  };

  newUrl: { name: string } = { name: '' };

  disableBalanceOnAdd: boolean = true;

  private currentUserId: string;
  private userSub: Subscription;

  constructor(
    public flashMessagesService: FlashMessagesService,
    public clientService: ClientService,
    public settingsService: SettingsService,
    public router: Router
  ) { }

  ngOnInit() {
    this.disableBalanceOnAdd = this.settingsService.getSettings().disableBalanceOnAdd;
    const superUserEmail = localStorage.getItem('SuperUserEmail');

    this.userSub = this.clientService.getUsers().pipe(
      take(1)
    ).subscribe(users => {
      const currentUser = users.find(user => user.email === superUserEmail);
      if (currentUser) {
        this.currentUserId = currentUser.$key;
      }
    });
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  onSubmit({ value, valid }: { value: Client, valid: boolean }) {
    if (!valid) {
      this.flashMessagesService.show('Please fill in all fields', { cssClass: 'alert-danger', timeout: 4000 });
      return;
    }

    const superUserEmail = localStorage.getItem('SuperUserEmail');
    const superUserPassword = window.btoa(localStorage.getItem('SuperUserPassword'));

    const payload: Client = {
      ...value,
      SuperUserEmail: superUserEmail,
      SuperUserPassword: superUserPassword,
      password: window.btoa(value.password),
      fieldArray: this.client.fieldArray
    };

    const keys = Object.keys(payload);
    for (const key of keys) {
      if (key.startsWith("field")) {
        delete payload[key];
      }
    }

    this.clientService.newClient(payload, this.currentUserId);
    this.flashMessagesService.show('New client added', { cssClass: 'alert-success', timeout: 4000 });
    this.router.navigate(['/']);
  }

  addFieldValue() {
    this.client.fieldArray.push({ ...this.newUrl });
    this.newUrl = { name: '' };
  }

  deleteFieldValue(index: number) {
    this.client.fieldArray.splice(index, 1);
  }
}