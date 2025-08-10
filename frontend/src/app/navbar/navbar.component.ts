// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

import { Component } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  public userIsConnected! : boolean;
  public isAdmin! : boolean;

  mobileMenuCollapsed : boolean = true;

  constructor(
    private authService : AuthService,
    private router : Router
  ) {
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

    //Close navbar automatically when switching page
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.closeMenu();
      });
  }

  ngAfterViewInit() {
    this.closeMenu();
  }

  disconnectUser() {
    this.authService.logout()
  }

  closeMenu() {
    this.mobileMenuCollapsed = true;
  }

  toggleMenu(){
    this.mobileMenuCollapsed = !this.mobileMenuCollapsed;
  }

}


