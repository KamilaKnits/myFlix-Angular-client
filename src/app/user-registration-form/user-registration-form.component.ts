import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { C } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-user-registration-form',
  standalone: false,
  templateUrl: './user-registration-form.component.html',
  styleUrl: './user-registration-form.component.scss'
})
export class UserRegistrationFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar) { }

  ngOnInit(): void {

  }

  registerUser(): void {
    console.log('Register button clicked');
    this.fetchApiData.userRegistration(this.userData).subscribe((response) => {
      this.dialogRef.close();
      console.log(response);
      this.snackBar.open('Registered Successfully!', 'OK', {
        duration: 2000
      });
    }, (error) => {
      console.error(error);
      this.snackBar.open(error.error?.message || 'Registration failed.', 'OK', {
        duration: 2000
      });
    });
  }
}
