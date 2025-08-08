import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpTestingController } from '@angular/common/http/testing';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://mymovieflix-a3c1af20a30e.herokuapp.com/';

@Injectable({
  providedIn: 'root'
})

export class FetchApiDataService {
  //Inject the HttlClient module to the constructor params
  //this wil provide HttpClient to the entire class, making it available via 
  //this.http
  constructor(private http: HttpClient) { }

  //Making the api call for the user registration endpoint

  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
    .post(apiUrl + 'users', userDetails)
    .pipe(catchError(this.handleError));
  }

  public userLogin(userDetails: any): Observable<any> {
    return this.http
    .post(apiUrl + 'login', userDetails)
    .pipe(catchError(this.handleError));
  }

  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
    .get(apiUrl + 'movies', { 
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,   
      }),
    })
      .pipe(map(this.extractResponseData),catchError(this.handleError));
  }

  public getMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
    .get(apiUrl + `movies/${title}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token, 
      }),
    })
        .pipe(map(this.extractResponseData),catchError(this.handleError));
  }

  public getDirector(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
    .get(apiUrl + `director/${title}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    })
    .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  public getGenre(name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
    .get(apiUrl + `genre/${name}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    })
    .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  public getUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    // const username = localStorage.getItem('user');
    console.log('Requesting user data from:', apiUrl + `users/${username}`);
    return this.http
    .get(apiUrl + `users/${username}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
      
    })
    .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  public addFavoriteMovie(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');
    return this.http
    .post(apiUrl + `users/${username}/movies/${movieId}`, null, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    })
    .pipe(map(this.extractResponseData), catchError(this.handleError));
  }
  
  public editUser(username: string, userDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
    .put(apiUrl + `users/${username}`, userDetails, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    })
    .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  public deleteUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
    .delete(apiUrl + `users/${username}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token, 
      }),
    })
    .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  public removeMovieFromFavorite(username: string, movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
    .delete(apiUrl + `users/${username}/movies/${movieId}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
    }),
  })
    .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  private extractResponseData(res: any): any {
    return res || {};
  }

  private handleError(error: HttpErrorResponse) : any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occured:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }


}



 

