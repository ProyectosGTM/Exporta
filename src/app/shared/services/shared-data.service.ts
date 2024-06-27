import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private nombreClienteSource = new BehaviorSubject<string>(this.getNombreClienteFromStorage());
  nombreCliente$ = this.nombreClienteSource.asObservable();

  private logotipoSource = new BehaviorSubject<string>(this.getLogotipoFromStorage());
  logotipo$ = this.logotipoSource.asObservable();

  private logotipoReporteSource = new BehaviorSubject<string>(this.getLogotipoReporteFromStorage());
  logotipoReporte$ = this.logotipoReporteSource.asObservable();

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

  public getNombreClienteFromStorage(): string {
    return localStorage.getItem('nombreCliente');
  }

  public getLogotipoFromStorage(): string {
    return localStorage.getItem('logotipo');
  }

  public getLogotipoReporteFromStorage(): string {
    return localStorage.getItem('logotipoReporte');
  }
}
