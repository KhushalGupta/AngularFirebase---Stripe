import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/Client';

import { Subscription } from 'rxjs/Subscription';
import { switchMap, tap, map, filter } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { Observable } from 'rxjs';

interface UserData {
  $key: string;
  userId: string;
  email: string;
  membership: {
    membership: string;
    subscription: {
      trial_start: number;
      trial_end: number;
    }
  };
}

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit, OnDestroy {
  clients: Client[] = [];
  totalOwed: number = 0;

  currentUserId!: string;
  userMembership: any;
  trialStatusMessage: string | null = null;

  private dataSubscription: Subscription;
  private currentUserData: UserData | null = null;

  constructor(public clientService: ClientService) {}

  ngOnInit() {
    this.fetchData();
    this.showInitialPopup();
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  private fetchData(): void {
    const superUserEmail = localStorage.getItem('SuperUserEmail');

    this.dataSubscription = this.clientService.getUsers().pipe(
      map(users => users.find((item: any) => item.email === superUserEmail) as UserData | undefined),
      filter((user): user is UserData => !!user),
      tap(user => {
        this.currentUserData = user;
        this.currentUserId = user.$key;
      }),
      switchMap(user => {
        const membership$ = this.clientService.getUser(user.userId).pipe(
          map(userData => userData.membership)
        );
        const clients$ = this.clientService.getClients(user.$key);

        return forkJoin([membership$, clients$]);
      })
    ).subscribe(([membership, clients]) => {
      this.userMembership = membership;
      this.clients = clients;
      this.calculateTotalOwed();

      this.trialStatusMessage = this.getTrialStatusMessage();

      this.toggleAddClientButton();

    }, error => {
      console.error('Error loading client data:', error);
    });
  }

  private showInitialPopup(): void {
    const count = localStorage.getItem("count");
    if (parseInt(count || '0') === 0 || count === null) {
        this.togglePopup(true);
    }
  }

  private togglePopup(show: boolean): void {
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("overlay");

    if (popup && overlay) {
      if (show) {
        popup.classList.remove("display");
        overlay.classList.remove("display");
      } else {
        popup.classList.add("display");
        overlay.classList.add("display");
      }
    }
  }

  private calculateTotalOwed(): void {
    this.totalOwed = this.clients.reduce((sum, client) => sum + (client.balance || 0), 0);
  }

  getTrialStatusMessage(): string | null {
    const userData = this.currentUserData;
    if (!userData || !this.userMembership || !this.userMembership.subscription) {
      return null;
    }

    const membershipPlan = this.userMembership.membership;
    const trialEndTimestamp = this.userMembership.subscription.trial_end;
    const trialEndDate = new Date(trialEndTimestamp * 1000);
    const timeRemainingMs = trialEndDate.getTime() - new Date().getTime();
    const diffDays = Math.ceil(timeRemainingMs / (1000 * 3600 * 24));

    if (timeRemainingMs <= 0) {
      return "Your trial period has ended";
    }

    if (diffDays > 1) {
      return `Your trial period will end in ${diffDays} days`;
    } else {
      return `Your trial period will end in ${diffDays} day`;
    }
  }

  private toggleAddClientButton(): void {
      const addClientButton = document.getElementById("addClient");
      if (!addClientButton) return;

      const plan = this.userMembership?.membership;
      const timeRemainingMs = this.userMembership?.subscription ?
                              new Date(this.userMembership.subscription.trial_end * 1000).getTime() - new Date().getTime() :
                              -1;

      const clientCount = this.clients.length;

      let isRestricted = false;

      if (timeRemainingMs <= 0) {
        if (plan === "Basic Plan" && clientCount >= 1) {
            isRestricted = true;
        } else if (plan === "Standard Plan" && clientCount >= 4) {
            isRestricted = true;
        } else if (plan === "Premiuim Plan" && clientCount >= 5) {
            isRestricted = true;
        }
      }

      if (this.userMembership && !isRestricted) {
          addClientButton.style.display = "";
      } else {
          addClientButton.style.display = "none";
      }
  }

  close(): boolean {
    localStorage.setItem("count", "1");
    this.togglePopup(false);
    return false;
  }
}