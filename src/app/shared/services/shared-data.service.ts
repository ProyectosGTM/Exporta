import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private idSource = new BehaviorSubject<string>(this.getIdFromStorage());
  id$ = this.idSource.asObservable()

  private nombreClienteSource = new BehaviorSubject<string>(this.getNombreClienteFromStorage());
  nombreCliente$ = this.nombreClienteSource.asObservable();

  private logotipoSource = new BehaviorSubject<string>(this.getLogotipoFromStorage());
  logotipo$ = this.logotipoSource.asObservable();

  private logotipoReporteSource = new BehaviorSubject<string>(this.getLogotipoReporteFromStorage());
  logotipoReporte$ = this.logotipoReporteSource.asObservable();

  setUsuario(id: string) {
    this.idSource.next(id);
    localStorage.setItem('id', id);
  }

  setNombreCliente(nombre: string) {
    this.nombreClienteSource.next(nombre);
    localStorage.setItem('nombreCliente', nombre);
  }

  setLogotipo(logotipo: string) {
    this.logotipoSource.next(logotipo);
    localStorage.setItem('logotipo', logotipo);
  }

  setLogotipoReporte(logotipoReporte: string) {
    this.logotipoReporteSource.next(logotipoReporte);
    localStorage.setItem('logotipoReporte', logotipoReporte);
  }

  getIdFromStorage(): string {
    return localStorage.getItem('id');
  }

  getNombreClienteFromStorage(): string {
    return localStorage.getItem('nombreCliente');
  }

  getLogotipoFromStorage(): string {
    return localStorage.getItem('logotipo');
  }

  getLogotipoReporteFromStorage(): string {
    return localStorage.getItem('logotipoReporte');
  }
}
