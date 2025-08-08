import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';

@Component({
  selector: 'app-profile-page',
  standalone: false,
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent implements OnInit {
  user: any = {};
  updateUser: any = {};
  movies: any[] = [];
  favoriteMovies: any[] = [];
  favoriteMovieIds: string[] = [];
  birthday: string = '';

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router) { }

  ngOnInit(): void {
    this.loadUserData();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((response: any) => {
      this.movies = response;
      console.log(this.movies);
      
    },
      (error) => {
        console.error('Error fetching movies:', error);
        this.snackBar.open('Failed to load movies.', 'OK', { duration: 2000 });
      }
    );
  }

  isLoading: boolean = true;
  showEditForm: boolean = false;

  loadUserData(): void {
    this.isLoading = true;
    const username= localStorage.getItem('user');
    console.log('Raw localStorage user value: ',localStorage.getItem('user'));
  
    if (!username) {
      console.warn('No username found in localStorage');
      this.router.navigate(['welcome']);
      return;
    }

    this.fetchApiData.getUser(username).subscribe(
      (userData) => {
        this.user = userData;
        this.birthday = new Date(this.user.Birthday).toLocaleDateString();
        this.favoriteMovieIds = userData.FavoriteMovies || [];
        
        this.fetchApiData.getAllMovies().subscribe(
          (allMovies) => {
            this.movies = allMovies;
            this.favoriteMovies = allMovies.filter((movie: any) =>
            this.favoriteMovieIds.includes(movie._id)
          );
            this.isLoading = false;
          },
        (error) => {
          console.error('Failed to fetch movies: ', error)
          this.snackBar.open('Failed to load movies', 'OK', {
            duration: 2000});
            this.isLoading = false;
        });

        localStorage.setItem('user', (userData.Username));
      },
      (error) => {
        console.error('Failed to load user data:', error);
        console.log('Error status: ', error.status);
        console.log('Error message: ', error.error);
        this.snackBar.open('Failed to load user data', 'OK', { duration: 2000 });
        this.isLoading = false;
      }
    );
  }

  updateProfile(): void {
    this.fetchApiData.editUser(this.user.Username, this.user).subscribe(
      (result) => {
        this.snackBar.open('Profile updated successfully!', 'OK', {
          duration: 2000
        });
        this.showEditForm = false;
        this.loadUserData();

        localStorage.setItem('user', result.Username);
        this.loadUserData();
      },
      (error) => {
        console.error('Error updating user details:', error);
        this.snackBar.open('Failed to update user data.', 'OK', { duration: 2000 });
      }
  );
  }

  isFavorite(movieId: string): boolean {
    return this.favoriteMovieIds.includes(movieId);
  }

  toggleFavorite(movieId: string): void {
    if (this.isFavorite(movieId)) {
      this.removeFavoriteMovie(movieId);
    } else {
      this.addFavoriteMovie(movieId);
    }
  }

  addFavoriteMovie(movieId: string): void {
    this.fetchApiData.addFavoriteMovie(movieId).subscribe(
      (response) => {
        
        if (!this.favoriteMovieIds.includes(movieId)) {
          this.favoriteMovieIds.push(movieId);
        }
        console.log('Movie added to Favorites: ', movieId);
        this.snackBar.open('Movie added to Favorites!', 'OK', { duration: 2000 });
      },
      (error) => {
        console.error('Failed to add movie to favorites:', error);
        this.snackBar.open('Failed to add to Favorites!', 'OK', { duration: 2000 });
      }
    )
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
        this.favoriteMovies = this.favoriteMovies.filter(movie => movie._id !== movieId);
      },
      (error) => {
        console.error('Error removing movie:', error);
        this.snackBar.open('Could not remove movie.', 'OK', { duration: 2000 });
      }
    );
  }

  openSynopsisDialog(movie: any): void {
    this.dialog.open(MovieDetailsComponent, {
      width: '500px',
      data: movie,
    });
    console.log('Opening description dialog with:', movie)
  }

  openGenreDialog(genre: any): void { 
    this.dialog.open(GenreComponent, {
      width: '500px',
      data: genre,
    });
    console.log('Opening genre dialog with: ', genre);
  }

  openDirectorDialog(movie: any): void {
        this.dialog.open(DirectorComponent, {
          width: '500px',
          data: movie.Director,
        });
        console.log('Director data:', movie.Director);
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







