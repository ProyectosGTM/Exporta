import { Injectable } from '@angular/core';
import { User } from '../../entities/User';
import { Credentials } from '../../entities/Credentials';
import { getFirebaseBackend } from '../../authUtils';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, retry, Subject, throwError } from 'rxjs';
import { BaseServicesService } from './base.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService extends BaseServicesService {
  private authenticationChanged = new Subject<boolean>();
  private user = new User();

  constructor(private http: HttpClient,
    private router: Router,) {
    super();
  }

  public isAuthenticated(): boolean {
    return !(
      sessionStorage.getItem('token') === undefined ||
      sessionStorage.getItem('token') === null ||
      sessionStorage.getItem('token') === 'null' ||
      sessionStorage.getItem('token') === 'undefined' ||
      sessionStorage.getItem('token') === ''
    );
  }

  public isAuthenticationChanged(): any {
    return this.authenticationChanged.asObservable();
  }

  clearUserData() {
    this.user = null;
    sessionStorage.clear();

    // Emitir cambio en la autenticación
    this.authenticationChanged.next(false);
  }

  public getToken(): any {
    if (
      sessionStorage.getItem("token") === undefined ||
      sessionStorage.getItem("token") === null ||
      sessionStorage.getItem("token") === "null" ||
      sessionStorage.getItem("token") === "undefined" ||
      sessionStorage.getItem("token") === ""
    ) {
      return "";
    }

    return JSON.parse(sessionStorage.getItem("token"));
  }

  public setData(data: User): void {
    this.setStorageToken(data.token);
    this.setStorageUser(data);
    this.setStoragePermissions(data.permisos);
  }

  public failToken(): void {
    this.cleanSession();
  }

  public logout(): void {
    this.cleanSession();
    this.router.navigate(['/login']);
  }

  private setStorageToken(value: any): void {
    let _value = JSON.stringify(value);
    sessionStorage.setItem("token", _value);
    this.authenticationChanged.next(this.isAuthenticated());
  }

  private setStorageUser(value: any): void {
    let _value = JSON.stringify(value);
    sessionStorage.setItem("user", _value);
    this.authenticationChanged.next(this.isAuthenticated());
  }

  public setStorageCoordinate(coordinates): void {
    let coords = JSON.stringify(coordinates);
    sessionStorage.setItem("coordinates", coords);
  }

  updateUsuario(id: string, form: any): Observable<any> {
    return this.http.put<any>(
      `${environment.API_SECURITY}/api/controlusuarios/${id}`,
      form
    );
  }

  getUsuarioControl(id: string): Observable<any> {
    return this.http.get<any>(
      `${environment.API_SECURITY}/api/controlusuarios/${id}`
    );
  }
  private setStoragePermissions(permissions: Array<string>): void {
    let _value = JSON.stringify(permissions);
    sessionStorage.setItem("permissions", _value);
    //this.permissionsService.loadPermissions(permissions);
    this.authenticationChanged.next(this.isAuthenticated());
  }

  public cleanSession() {
    sessionStorage.clear();
  }

  public getUser(): User {
    //console.log(JSON.parse(sessionStorage.getItem('user')));
    return JSON.parse(sessionStorage.getItem("user"));
  }

  public getCoordinates() {
    return JSON.parse(sessionStorage.getItem("coordinates"));
  }

  public getPermissions(): string[] {
    return JSON.parse(sessionStorage.getItem("permissions"));
  }

  public authenticate(body: Credentials): Observable<User> {
    return this.http.post<User>(environment.API_SECURITY + "/api/login",
        body
      )
      .pipe(catchError(this.handleError));
  }

  // public logOut() {
  //   return this.http.post<User>(environment.API_SECURITY + `/api/bitacora/logout`, { logout: true });
  // }


  //----------------------------------------------------------------
  /**
   * Returns the current user
   */
//   public currentUser(): User {
//     return getFirebaseBackend().getAuthenticatedUser();
//   }

//   /**
//    * Performs the auth
//    * @param email email of user
//    * @param password password of user
//    */
//   login(email: string, password: string) {
//     return getFirebaseBackend()
//       .loginUser(email, password)
//       .then((response: any) => {
//         const user = response;
//         return user;
//       });
//   }

//   /**
//    * Performs the register
//    * @param email email
//    * @param password password
//    */
//   register(email: string, password: string) {
//     return getFirebaseBackend()
//       .registerUser(email, password)
//       .then((response: any) => {
//         const user = response;
//         return user;
//       });
//   }

//   /**
//    * Reset password
//    * @param email email
//    */
//   resetPassword(email: string) {
//     return getFirebaseBackend()
//       .forgetPassword(email)
//       .then((response: any) => {
//         const message = response.data;
//         return message;
//       });
//   }

//   /**
//    * Logout the user
//    */
// public logout(): void {
//   this.bitacoraService.logOut().subscribe(()=>{
//     this.cleanSession();
//     this.router.navigate(['login']);
//   })
// }
}
