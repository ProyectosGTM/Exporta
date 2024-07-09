import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private http: HttpClient) { }
  
	obtenerClienteTecsa(idCliente): Observable<any> {
		return this.http.get<any>(environment.API_SECURITY + '/api/clientes/' + idCliente);
	}

    obtenerUsuario(): Observable<any> {
		return this.http.get<any>(environment.API_SECURITY + '/api/usuarios/' + 12);
	}

	obtenerTransacciones(id: number, year: number): Observable<any> {
		return this.http.get<any>(`${environment.API_SECURITY}/api/transacciones/${id}?year=${year}`);
	}
}