import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

import { ClientService } from '../../services/client.service';

import { Client } from '../../models/Client';

import { switchMap, tap, filter } from 'rxjs/operators';
import { EMPTY } from 'rxjs/observable/empty';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css']
})
export class ClientDetailsComponent implements OnInit {
  clientId!: string;
  client!: Client;
  hasBalance: boolean = false;
  showBalanceUpdateInput: boolean = false;

  private superUserId: string;

  constructor(
    public flashMessagesService: FlashMessagesService,
    public clientService: ClientService,
    public router: Router,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.clientId = this.route.snapshot.params['id'];

    const superUserEmail = localStorage.getItem('SuperUserEmail');

    this.clientService.getUsers().pipe(
      tap(users => {
        const currentUser = users.find(user => user.email === superUserEmail);
        if (currentUser) {
          this.superUserId = currentUser.$key;
        }
      }),
      filter(() => !!this.superUserId),
      switchMap(() => {
        if (this.superUserId && this.clientId) {
          return this.clientService.getClient(this.superUserId, this.clientId);
        }
        return EMPTY;
      })
    ).subscribe(client => {
      this.client = client;
      this.hasBalance = client.balance > 0;
      console.log(this.client);
    }, error => {
      console.error('Error loading client details:', error);
      this.flashMessagesService.show('Failed to load client details.', { cssClass: 'alert-danger', timeout: 4000 });
      this.router.navigate(['/']);
    });
  }

  updateBalance() {
    if (!this.client || !this.clientId) {
        this.flashMessagesService.show('Cannot update. Client data is missing.', { cssClass: 'alert-danger', timeout: 4000 });
        return;
    }

    this.clientService.updateClient(this.superUserId, this.clientId, this.client);
    this.flashMessagesService.show('Balance Updated', { cssClass: 'alert-success', timeout: 4000 });
    this.showBalanceUpdateInput = false;
    this.router.navigate(['/client/' + this.clientId]);
  }

  onDeleteClick() {
    if (!this.superUserId || !this.clientId) {
        this.flashMessagesService.show('Cannot delete. User or Client ID is missing.', { cssClass: 'alert-danger', timeout: 4000 });
        return;
    }

    if (confirm("Are you sure to delete?")) {
        this.clientService.deleteClient(this.superUserId, this.clientId);
        this.flashMessagesService.show('Client Deleted', { cssClass: 'alert-success', timeout: 4000 });
        this.router.navigate(['/']);
    }
  }
}