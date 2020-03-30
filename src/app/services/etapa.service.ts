import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, tap, map } from "rxjs/operators";
import { Etapa } from "../models/etapa";
import { Observable, of } from "rxjs";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

const apiUrl = "http://localhost:5000/api/Etapa";

@Injectable({
  providedIn: "root"
})
export class EtapaService {
  apiUrl = "http://localhost:5000/api/Etapa";
  

  constructor(private http: HttpClient) {}

  getEtapas(): Observable<Etapa[]> {
    return this.http.get<Etapa[]>(this.apiUrl).pipe(
      tap(_ => this.log("fetched Etapa")),
      catchError(this.handleError("getEtapas", []))
    );
  }

  getEtapasPorIdTransfo(id:number): Observable<Etapa[]> {
    const url = `${apiUrl}/${id}/resultadoTransfo`; 
    return this.http.get<Etapa[]>(url).pipe(
      tap(_ => this.log("fetched Etapa")),
      catchError(this.handleError("getEtapas", []))
    );
  }

  getEtapa(id: number): Observable<Etapa> {
    const url = `${apiUrl}/${id}`;
    return this.http.get<Etapa>(url).pipe(
      tap(_ => console.log(`fetched Etapa id=${id}`)),
      catchError(this.handleError<Etapa>(`getEtapa id=${id}`))
    );
  }


  addEtapa(etapa: any): Observable<Etapa> {
    return this.http
      .post<Etapa>(this.apiUrl, etapa, httpOptions)
      .pipe(
        tap((etapaRes: any) =>
          console.log(
            `Etapa agregado ${etapaRes.idEtapa}`
          )
        ),
        catchError(this.handleError<Etapa>("addEtapa"))
      );
  }

  updateEtapa(id: number, etapa: any): Observable<any> {
    const url = `${apiUrl}/${id}`;
    return this.http.put(url, etapa, httpOptions).pipe(
      tap(_ => console.log(`updated etapa id=${id}`)),
      catchError(this.handleError<any>("updateEtapa"))
    );
  }

  deleteEtapa(id: number): Observable<Etapa> {
    const url = `${apiUrl}/${id}`;
    return this.http.delete<Etapa>(url, httpOptions).pipe(
      tap(_ => console.log(`deleted Etapa id=${id}`)),
      catchError(this.handleError<Etapa>("delete Etapa"))
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
