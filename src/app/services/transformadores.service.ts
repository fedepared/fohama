import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, tap } from 'rxjs/operators';
import  {Transformadores} from '../models/transformadores';
import { Observable, of} from 'rxjs';
import { TransformadoresEtapas } from '../models/transformadoresEtapas';
import { Transform } from 'stream';
import { TipoEtapa } from '../models/tipoEtapa';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = 'http://localhost:5000/api/transformadores';


@Injectable({
  providedIn: 'root'
})

export class TransformadoresService {

  apiUrl = 'http://localhost:5000/api/transformadores';

  constructor(private http: HttpClient) { }

  getTransformadores(): Observable<Transformadores[]> {
    return this.http.get<Transformadores[]>(this.apiUrl)
      .pipe(
        tap(_ => this.log('fetched Transformadores')),
        catchError(this.handleError('getTransformadores', []))
      );
  }

  getTransformador(id:number):Observable<Transformadores>{
    const url=`${apiUrl}/${id}`;
    return this.http.get<Transformadores>(url).pipe(
      tap(_ => console.log(`fetched Transformador id=${id}`)),
      catchError(this.handleError<Transformadores>(`getTransformador id=${id}`))
    )
  }

  

  getDataExcel():Observable<TransformadoresEtapas[]>{
    return this.http.get<TransformadoresEtapas[]>(`${this.apiUrl}/GetDataExcel`)
      .pipe(data=>(data));
  }

  addTransformador(transformador: any): Observable<Transformadores> {
    return this.http.post<Transformadores>(this.apiUrl, transformador, httpOptions).pipe(
      tap((transformadorRes: Transformadores) => console.log(`Transformador agregado con el id=${transformadorRes.idTransfo}`)),
      catchError(this.handleError<Transformadores>('addTransformador'))
    );
  }

  addTransformadores(transformador: Transformadores[]): Observable<Transformadores[]>{
    return this.http.post<Transformadores[]>(`${this.apiUrl}/PostTransformadoresArr`, transformador, httpOptions).pipe(
      tap((transformadorRes: Transformadores[]) => console.log(`Transformadores ${transformadorRes} agregados`)),
      catchError(this.handleError<Transformadores[]>('addTransformador'))
    );
  }

  getTipoEtapasXTransfo(id:number):Observable<any[]>{
    const url=`${apiUrl}/getEtapasVacias/${id}`;
    return this.http.get<any[]>(url).pipe(
      tap(_ => console.log(`fetched TipoEtapas`)),
      catchError(this.handleError<any[]>(`get TipoEtapas`))
    )
  }

  updateTransformador (id: number, transformador: any): Observable<any> {
    const url = `${apiUrl}/${id}`;
    return this.http.put(url, transformador, httpOptions).pipe(
      tap(_ => console.log(`updated Transformador id=${id}`)),
      catchError(this.handleError<any>('updateTranformador'))
    );
  }

  deleteTransformador (id: number): Observable<Transformadores> {
    const url = `${apiUrl}/${id}`;
    return this.http.delete<Transformadores>(url, httpOptions).pipe(
      tap(_ => console.log(`deleted Transformadores id=${id}`)),
      catchError(this.handleError<Transformadores>('delete Transformadores'))
    );
  }
  
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(message);
  }
}
