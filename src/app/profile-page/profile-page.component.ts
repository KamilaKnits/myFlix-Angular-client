import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';

/**
 * This component is responsible for displaying the user's profile page. 
 * The user can update their personal details and view their favorite movies
 * and make changes to their lists.
 */
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

  /**
     * Fetches all movies from the database
     */

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

  /**
   * Fetches user data from API after being authenticated
   * @returns user data such as favorite movies, birthdate
   */

  loadUserData(): void {
    this.isLoading = true;
    const username = localStorage.getItem('user');
    console.log('Raw localStorage user value: ', localStorage.getItem('user'));

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
              duration: 2000
            });
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

  /**
   * Updates user profile, edit form appears for the user to make changes
   * 
   */

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

  /**
 * Checks to see if the movie is in the favorite list
 * @param movieId - the id of movie
 * @returns {boolean} returns true or false if the movie is favorited
 */

  isFavorite(movieId: string): boolean {
    return this.favoriteMovieIds.includes(movieId);
  }

  /**
   * Checks to see if the movie is in the favorite list and then 
   * adds or removes the movie
   * @param movieId - the id of movie
   */

  toggleFavorite(movieId: string): void {
    if (this.isFavorite(movieId)) {
      this.removeFavoriteMovie(movieId);
    } else {
      this.addFavoriteMovie(movieId);
    }
  }

  /**
   * Adds movie to the favorite list
   * @param movieId - the id ofthe movie
   */

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

  /**
     * Removes movie from favorite list
     * @param movieId - the id of movie to remove
     * @returns -removes movie from favorite list 
     */

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

  /**
    * Opens dialog to show more information about the movie; description
    * @param movie 
    */

  openSynopsisDialog(movie: any): void {
    this.dialog.open(MovieDetailsComponent, {
      width: '500px',
      data: movie,
    });
    console.log('Opening description dialog with:', movie)
  }

  /**
     * Opens dialog to show more information about the genre
     * @param genre 
     */

  openGenreDialog(genre: any): void {
    this.dialog.open(GenreComponent, {
      width: '500px',
      data: genre,
    });
    console.log('Opening genre dialog with: ', genre);
  }

  /**
   * opens dialog to show more information about the director
   * @param movie 
   */

  openDirectorDialog(movie: any): void {
    this.dialog.open(DirectorComponent, {
      width: '500px',
      data: movie.Director,
    });
    console.log('Director data:', movie.Director);
  }

  /**
   * Deletes users account
   * @returns message if account was deleted successfully
   */

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
    this.snackBar.open('Logged out successfully!', 'OK', { duration: 2000 });
    this.router.navigate(['welcome']);
  }

}







