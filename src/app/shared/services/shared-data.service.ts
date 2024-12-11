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


  private enviadoNombreSource = new BehaviorSubject<string>(this.getEnviadoNombreFromStorage());
  enviadoNombre$ = this.enviadoNombreSource.asObservable();

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



  setEnviadoNombre(enviadoNombre: string) {
    this.enviadoNombreSource.next(enviadoNombre);
    localStorage.setItem('enviadoNombre', enviadoNombre);
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

  getEnviadoNombreFromStorage(): string {
    return localStorage.getItem('enviadoNombre');
  }

  getTipoOperacionNombreFromStorage(): string {
    return localStorage.getItem('tipoOperacionNombre');
  }

  private idRolSource = new BehaviorSubject<number>(null);
idRol$ = this.idRolSource.asObservable();

private nombreUsuarioSource = new BehaviorSubject<string>(null);
nombreUsuario$ = this.nombreUsuarioSource.asObservable();

setIdRol(idRol: number) {
  this.idRolSource.next(idRol);
  localStorage.setItem('idRol', idRol.toString());
}

setNombreUsuario(nombre: string) {
  this.nombreUsuarioSource.next(nombre);
  localStorage.setItem('nombreUsuario', nombre);
}

getIdRolFromStorage(): any {
  return localStorage.getItem('idRol');
}

getNombreUsuarioFromStorage(): string {
  return localStorage.getItem('nombreUsuario');
}


private afiliadoNombreSource = new BehaviorSubject<string>(this.getAfiliadoNombreFromStorage());
afiliadoNombre$ = this.afiliadoNombreSource.asObservable();

private afiliadoNombreCortoSource = new BehaviorSubject<string>(this.getAfiliadoNombreCortoFromStorage());
afiliadoNombreCorto$ = this.afiliadoNombreCortoSource.asObservable();

setAfiliadoNombre(nombre: string) {
  this.afiliadoNombreSource.next(nombre);
  localStorage.setItem('afiliadoNombre', nombre);
}

setAfiliadoNombreCorto(nombreCorto: string) {
  this.afiliadoNombreCortoSource.next(nombreCorto);
  localStorage.setItem('afiliadoNombreCorto', nombreCorto);
}

getAfiliadoNombreFromStorage(): string {
  return localStorage.getItem('afiliadoNombre') || null;
}

getAfiliadoNombreCortoFromStorage(): string {
  return localStorage.getItem('afiliadoNombreCorto') || null;
}


}
