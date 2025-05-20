import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { catchError, switchMap, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthenticationService } from '../../../core/services/auth.service';
import { Credentials } from '../../../entities/Credentials';
import { User } from '../../../entities/User';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { fadeInRightAnimation } from 'src/app/core/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/app/core/animations/fade-in-up.animation';
import { scaleInAnimation } from 'src/app/core/animations/scale-in.animation';
import * as AOS from 'aos';
import { ClienteService } from 'src/app/shared/services/clientes.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fadeInRightAnimation, fadeInUpAnimation, scaleInAnimation]
})
export class LoginComponent implements OnInit {
  showPassword = false;

togglePassword() {
  this.showPassword = !this.showPassword;
}

  loginForm: UntypedFormGroup;
  public credentials: Credentials;
  public textLogin: string = 'Iniciar Sesión';
  submitted = false;
  error = '';
  returnUrl: string;
  public loading: boolean = false;
  public passwordType: string = "password";

  year: number = new Date().getFullYear();

  constructor(
    private router: Router,
    private auth: AuthenticationService,
    private cliente: ClienteService,
    private fb: UntypedFormBuilder,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private sharedDataService: SharedDataService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    AOS.init();
    window.addEventListener('load', AOS.refresh);
    this.initForm();
    document.body.setAttribute('class', 'authentication-bg');

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  initForm() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnDestroy() { 
    document.body.classList.remove('authentication-bg');
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.loading = true;
    this.textLogin = 'Cargando...';
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  
    this.credentials = this.loginForm.value;
  
    this.auth.authenticate(this.credentials).pipe(
      catchError((error) => {
        this.loading = false;
        this.textLogin = 'Iniciar Sesión';
        Swal.fire({
          title: "Ops!",
          text: `Usuarios y/o contraseña incorrectos.`,
          icon: "error"
        });
        return throwError(() => "");
      }),
      switchMap((result: User) => {
        this.auth.setData(result);
        const nombreUsuario = result.nombre;
        const apellidoUsuario = result.apellidoPaterno;
  
        return this.obtenerCliente(result.idCliente).pipe(
          switchMap(cliente => {
            this.sharedDataService.setNombreCliente(cliente.ApellidoPaterno);
            this.sharedDataService.setLogotipo(cliente.Logotipo);
            this.sharedDataService.setLogotipoReporte(cliente.LogotipoReporte);
            return this.obtenerUsuario(result.id).pipe(
              switchMap(usuario => {
                this.sharedDataService.setUsuario(usuario.Id);
                if (usuario && usuario.afiliados && usuario.afiliados.length > 0) {
                  const afiliado = usuario.afiliados[0];
                  this.sharedDataService.setAfiliadoNombre(afiliado.Nombre);
                  this.sharedDataService.setAfiliadoNombreCorto(afiliado.NombreCorto);
                  this.sharedDataService.setAfiliadoLogo(afiliado.LogotipoAfiliadoLocal);
            
                  console.log('Nombre almacenado:', afiliado.Nombre); 
                  console.log('Nombre Corto almacenado:', afiliado.NombreCorto);
                }
                return this.obtenerOperaciones(result.idCliente); 
              }),
              map(operaciones => {
                console.log('Operaciones obtenidas:', operaciones); 
                this.sharedDataService.setEnviadoNombre(operaciones.EnviadoNombre);
                this.sharedDataService.setTipoOperacionNombre(operaciones.TipoOperacionNombre);
                return {
                  result,
                  nombreUsuario,
                  apellidoUsuario,
                  operaciones
                };
              })
            );
          })
        );
      })
    ).subscribe(
      (data: any) => {
        this.router.navigate(['/ecommerce/orders']);
        Swal.fire({
          title: "¡Bienvenido!",
          text: `¡Hola ${data.nombreUsuario}!`,
          icon: "success"
        });
  
        this.toastr.success(`¡Hola ${data.nombreUsuario} ${data.apellidoUsuario}!`, 'Bienvenido');
  
        this.loading = false;
        this.textLogin = 'Iniciar Sesión';
        console.log('Operaciones obtenidas en suscripción:', JSON.stringify(data.operaciones, null, 2));
      },
      (error) => {
        console.error('Error al autenticar', error);
        this.loading = false;
        this.textLogin = 'Iniciar Sesión';
      }
    );
  }

  obtenerUsuario(userId: any) {
    return this.cliente.obtenerUsuario(userId).pipe(
      catchError(error => {
        console.error('Error al obtener el usuario', error);
        return throwError(error);
      })
    );
  }

  obtenerCliente(clientId: any) {
    return this.cliente.obtenerClienteTecsa(clientId).pipe(
      catchError(error => {
        console.error('Error al obtener el cliente', error);
        return throwError(error);
      })
    );
  }

  obtenerOperaciones(idOp: string) {
    return this.cliente.obtenerOperaciones(idOp).pipe(
      catchError(error => {
        console.error('Error al obtener operaciones', error);
        return throwError(error);
      })
    );
  }

  cambiarContraseñas(){
    this.router.navigateByUrl('/account/reset-password')
  }

  type = 'password';
  myFunctionPasswordCurrent() {
    this.type = this.type === "password" ? "text" : "password";
  }
}
