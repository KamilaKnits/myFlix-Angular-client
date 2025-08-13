import { Component, OnInit } from '@angular/core';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatDialog } from '@angular/material/dialog';

/**
 * This component is the welcome page for the app. The options presented 
 * on the welcome page are to register and create an account or to login. 
 *
 */


@Component({
  selector: 'app-welcome-page',
  standalone: false,
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss'
})

export class WelcomePageComponent implements OnInit {
  constructor(public dialog: MatDialog) {} 
  
  ngOnInit(): void { 
  }

  /**
   * opens dialog for the user to register for the app.
   */

  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px'
    });
  }

  /**
   * Opens dialog for the user to log into their account.
   */

  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '280px'
    });
  }

}
