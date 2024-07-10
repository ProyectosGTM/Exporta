import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { catchError, throwError } from 'rxjs';
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
      })
    ).subscribe((result: User) => {
      setTimeout(() => {
        this.obtenerCliente(result.idCliente);
        this.obtenerUsuario(result.id);
      }, 1000);
      this.auth.setData(result);
      this.router.navigate(['/ecommerce/orders']);
      Swal.fire({
        title: "¡Bienvenido!",
        text: `¡Hola ${result.nombre}!`,
        icon: "success"
      });

      const nombreUsuario = result.nombre;
      const apellidoUsuario = result.apellidoPaterno;

      this.toastr.success(`¡Hola ${nombreUsuario} ${apellidoUsuario}!`, 'Bienvenido');

      this.loading = false;
      this.textLogin = 'Iniciar Sesión';
    });
  }

  obtenerUsuario(userId: any) {
    this.cliente.obtenerUsuario(userId).subscribe(
      (res: any) => {
        const userId = res.Id;
        this.sharedDataService.setUsuario(userId);
      }
    );
  }

  obtenerCliente(clientId: any) {
    this.cliente.obtenerClienteTecsa(clientId).subscribe(
      (res: any) => {
        const nombreCliente = res.ApellidoPaterno;
        const logotipo = res.Logotipo;
        const logotipoReporte = res.LogotipoReporte;
        this.sharedDataService.setNombreCliente(nombreCliente);
        this.sharedDataService.setLogotipo(logotipo);
        this.sharedDataService.setLogotipoReporte(logotipoReporte);
      }
    );
  }

  cambiarContraseñas(){
    this.router.navigateByUrl('/account/reset-password')
  }

  type = 'password'
  myFunctionPasswordCurrent() {
    if (this.type === "password") {
      this.type = "text";
    } else {
      this.type = "password";
    }
  }
}
