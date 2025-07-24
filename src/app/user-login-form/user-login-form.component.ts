import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-login-form',
  standalone: false,
  templateUrl: './user-login-form.component.html',
  styleUrl: './user-login-form.component.scss'
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '', Email: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar) {}

    ngOnInit(): void {
    }

    loginUser(): void {
      this.fetchApiData.userLogin(this.userData).subscribe(
        (response) => {
          localStorage.setItem("user", JSON.stringify(response.user));
          localStorage.setItem("token", response.token)
        this.dialogRef.close();
        this.snackBar.open('Logged in successfully!', 'OK', {
          duration: 2000
        });
      }, (error) => {
        console.error(error);
        this.snackBar.open(error.error?.message ||'Login in Failed.', 'OK', {
          duration: 2000
        });
      });
    }
}
