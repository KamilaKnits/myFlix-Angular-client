import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';


@Component({
  selector: 'app-director',
  standalone: false,
  templateUrl: './director.component.html',
  styleUrl: './director.component.scss'
})
export class DirectorComponent implements OnInit {
  directedMovies: any[] = [];
  director: any;

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<DirectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.director = this.data;
    console.log('inside dialog:', this.director);
    this.getDirectedMovies();
  }

  getDirectedMovies(): void {
    this.fetchApiData.getAllMovies().subscribe(
      (movies: any[]) => {
        this.directedMovies = movies.filter(
          movie => movie.Director.Name === this.director.Name);
          console.log('Directed Movies: ', this.directedMovies);
          console.log('Looking for movies by:', this.director.Name);
          console.log('Filtered moves:', this.directedMovies);
        }, (error) => {
          console.error('Error fetching movies:', error)
        }
    );
  }


  closeDialog(): void {
    this.dialogRef.close();
  }
}
