import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';


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
        console.log('Movie added to Favorites: ', movieId);
        this.snackBar.open('Movie added to Favorites!', 'OK', { duration: 2000 });

        if (!this.favoriteMovieIds.includes(movieId)) {
          this.favoriteMovieIds.push(movieId);
        }
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
