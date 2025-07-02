// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

import { Component } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  public userIsConnected! : boolean;
  public isAdmin! : boolean;

  constructor(private authService : AuthService) {
  }

  ngOnInit(){
    this.authService.isLoggedIn$.subscribe(
      (value) => {
        this.userIsConnected = value
      }
    )

    this.authService.isAdmin$.subscribe(
      (value) => {
        this.isAdmin = value
      }
    )
  }

  disconnectUser() {
    this.authService.logout()
  }

}


