import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private idSource = new BehaviorSubject<string>(this.getIdFromStorage());
  id$ = this.idSource.asObservable();

  private nombreClienteSource = new BehaviorSubject<string>(this.getNombreClienteFromStorage());
  nombreCliente$ = this.nombreClienteSource.asObservable();

  private logotipoSource = new BehaviorSubject<string>(this.getLogotipoFromStorage());
  logotipo$ = this.logotipoSource.asObservable();

  private logotipoReporteSource = new BehaviorSubject<string>(this.getLogotipoReporteFromStorage());
  logotipoReporte$ = this.logotipoReporteSource.asObservable();

  private afiliadoNombreSource = new BehaviorSubject<string>(this.getAfiliadoNombreFromStorage());
  afiliadoNombre$ = this.afiliadoNombreSource.asObservable();

  private enviadoNombreSource = new BehaviorSubject<string>(this.getEnviadoNombreFromStorage());
  enviadoNombre$ = this.enviadoNombreSource.asObservable();

  private afiliadoNombreCortoSource = new BehaviorSubject<string>(this.getAfiliadoNombreCortoFromStorage());
  afiliadoNombreCorto$ = this.afiliadoNombreCortoSource.asObservable();

  private tipoOperacionNombreSource = new BehaviorSubject<string>(this.getTipoOperacionNombreFromStorage());
  tipoOperacionNombre$ = this.tipoOperacionNombreSource.asObservable();

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

  setAfiliadoNombre(afiliadoNombre: string) {
    this.afiliadoNombreSource.next(afiliadoNombre);
    localStorage.setItem('afiliadoNombre', afiliadoNombre);
  }

  setEnviadoNombre(enviadoNombre: string) {
    this.enviadoNombreSource.next(enviadoNombre);
    localStorage.setItem('enviadoNombre', enviadoNombre);
  }

  setAfiliadoNombreCorto(afiliadoNombreCorto: string) {
    this.afiliadoNombreCortoSource.next(afiliadoNombreCorto);
    localStorage.setItem('afiliadoNombreCorto', afiliadoNombreCorto);
  }

  setTipoOperacionNombre(tipoOperacionNombre: string) {
    this.tipoOperacionNombreSource.next(tipoOperacionNombre);
    localStorage.setItem('tipoOperacionNombre', tipoOperacionNombre);
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

  getAfiliadoNombreFromStorage(): string {
    return localStorage.getItem('afiliadoNombre');
  }

  getEnviadoNombreFromStorage(): string {
    return localStorage.getItem('enviadoNombre');
  }

  getAfiliadoNombreCortoFromStorage(): string {
    return localStorage.getItem('afiliadoNombreCorto');
  }

  getTipoOperacionNombreFromStorage(): string {
    return localStorage.getItem('tipoOperacionNombre');
  }
}
