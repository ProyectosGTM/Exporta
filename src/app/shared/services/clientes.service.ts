import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private http: HttpClient) { }

  obtenerClienteTecsa(idCliente: string): Observable<any> {
    return this.http.get<any>(`http://216.238.84.225:3006/api/clientes/${idCliente}`);
  }

  obtenerUsuario(idUsuario: string): Observable<any> {
    return this.http.get<any>(`http://216.238.84.225:3006/api/usuarios/${idUsuario}`);
  }

  obtenerOperaciones(idOp: string) {
    return this.http.get<any>(`http://216.238.84.225:3006/api/operaciones/${idOp}`).pipe(
      catchError(error => {
        console.error('Error al obtener operaciones', error);
        return throwError(error);
      })
    );
  }
  

  obtenerTransacciones(id: number, year: number, page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(
      `http://216.238.84.225:3006/api/transacciones/paginated/${id}?year=${year}&page=${page}&pageSize=${pageSize}`
    );
  }

  obtenerTransaccionesOK(id: number, year: number, page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(
      `http://216.238.84.225:3006/api/transaccionesok/paginated/${id}?year=${year}&page=${page}&pageSize=${pageSize}`
    );
  }

  obtenerTransaccionesExcel(id: number, year: number): Observable<any> {
    return this.http.get<any>(`http://216.238.84.225:3006/api/transacciones/${id}?year=${year}`);
  }

  obtenerTransaccionesExcelOk(id: number, year: number): Observable<any> {
    return this.http.get<any>(`http://216.238.84.225:3006/api/transaccionesok/${id}?year=${year}`);
  }
  
}