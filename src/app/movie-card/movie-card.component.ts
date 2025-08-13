import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';

/**
 * This component is the landing page once the user logs into their account. 
 * Users can view movies, add and remove movies from their favorite list. 
 * Each movie has a dialog for genre, director and description.
 */

@Component({
  selector: 'app-movie-card',
  standalone: false,
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent implements OnInit {
  @Input() 
  favoriteMovieIds: string[] = [];
  movies: any[] = [];
  genreMovies: any[] = [];
  directorMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router,
  
  ) { }

  ngOnInit(): void {
    this.getMovies();
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

  /**
   * Fetches all movies in the genre selected 
   * @param genreName string
   */
  getGenre(genreName: string): void {
    this.fetchApiData.getGenre(genreName).subscribe(
      (response: any) => {
        this.genreMovies = response;
        console.log(this.genreMovies);
      },
      (error) => {
        console.error('Error fetching genre: ', error);
        this.snackBar.open('Failed to load genre,', 'OK', { duration: 2000 });
      }
    );
  }

  /**
   * Fetches movies by director
   * @param directorName 
   */
  getDirector(directorName: string): void {
    this.fetchApiData.getDirector(directorName).subscribe(
      (response: any) => {
        this.directorMovies = response;
        console.log(this.directorMovies)
      },
      (error) => {
        console.error('Error fetching director:', error);
        this.snackBar.open('Failed to fetch director,', 'OK', { duration: 2000 });
      }
    );
  }
  /**
   * opens dialog to show more information about the movie; description
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
   * opens dialog to show more information about the genre
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
 * checks to see if the movie is in the favorite list
 * @param movieId - the id of movie
 * @returns {boolean} returns true or false if the movie is favorited
 */
  isFavorite(movieId: string): boolean {
    return this.favoriteMovieIds.includes(movieId);
  }

  /**
   * checks to see if the movie is in the favorite list and then 
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
   * adds movie to the favorite list
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
   * removes movie from favorite list
   * @param movieId - the id of movie to remove
   * @returns -removes movie from favorite list 
   */

  removeFavoriteMovie(movieId: string): void {
    const username = localStorage.getItem('user');
    if (!username) {
      console.error('No such user');
      this.snackBar.open('User not found...', 'OK', { duration: 2000});
      return;
    }

    this.fetchApiData.removeMovieFromFavorite(username, movieId).subscribe(
      (response) => {
        console.log('Movie removed from Favorites:', movieId);
        this.snackBar.open('Movie removed from Favorites', 'OK', { duration: 2000 });
        
        
        this.favoriteMovieIds = this.favoriteMovieIds.filter(id => id !== movieId);
      },
      (error) => {
        console.error('Error removing movie:', error);
        this.snackBar.open('Could not remove movie.', 'OK', { duration: 2000 });
      }
    );
  }

}
