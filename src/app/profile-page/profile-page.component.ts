import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile-page',
  standalone: false,
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent implements OnInit {
  user: any = {};
  updateUser: any = {};
  favoriteMovies: any[] = [];
  birthday: string = '';

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router) { }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const username= localStorage.getItem('user');
    const token = localStorage.getItem('token');

    console.log('username from localStorage: ', username);
    console.log('Using token: ', token);
    
    if (!username) {
      console.warn('No username found in localStorage');
      this.router.navigate(['welcome']);
      return;
    }

    this.fetchApiData.getUser().subscribe(
      (userData) => {
        console.log('User data received:', userData);
        this.user = userData;
        this.birthday = new Date(this.user.Birthday).toLocaleDateString();
        this.favoriteMovies = userData.FavoriteMovies || [];

        localStorage.setItem('user', (userData.Username));
      },
      (error) => {
        console.error('Failed to load user data:', error);
        console.log('Error status: ', error.status);
        console.log('Error message: ', error.error);
        this.snackBar.open('Failed to load user data', 'OK', { duration: 2000 });
      }
    );
  }

  updateProfile(): void {
    this.fetchApiData.editUser(this.user.Username, this.user).subscribe(
      (result) => {
        this.snackBar.open('Profile updated successfully!', 'OK', {
          duration: 2000
        });

        localStorage.setItem('user', result.Username);
        this.loadUserData();
      },
      (error) => {
        console.error('Error updating user details:', error);
        this.snackBar.open('Failed to update user data.', 'OK', { duration: 2000 });
      }
  );
  }

  removeFavoriteMovie(movieId: string): void {
    const username = localStorage.getItem('user');
    if (!username) {
      console.error('No such user');
      return;
    }

    this.fetchApiData.removeMovieFromFavorite(username, movieId).subscribe(
      () => {
        this.snackBar.open('Movie removed from Favorites', 'OK', { duration: 2000 });
        this.favoriteMovies = this.favoriteMovies.filter(id => id !== movieId);
      },
      (error) => {
        console.error('Error removing movie:', error);
        this.snackBar.open('Could not remove movie.', 'OK', { duration: 2000 });
      }
    );
  }


  deleteAccount(): void {
    const username = localStorage.getItem('user');
    if (!username) {
      console.error('No user found');
      return;
    }
    
    this.fetchApiData.deleteUser(username).subscribe(
      (resp: any) => {
        console.log('User deleted:', resp)
        this.snackBar.open('Account deleted', 'OK', { duration: 2000 });
        localStorage.clear();
        this.router.navigate(['welcome']);
      },
      (error) => {
        console.error('Error deleting user:', error);
        this.snackBar.open('Failed to delete account', 'OK', { duration: 2000 });
      }
    );
  }

  logout(): void {
    localStorage.clear();
    this.snackBar.open('Logged out successfully!', 'OK', { duration: 2000});
    this.router.navigate(['welcome']);
  }

}







