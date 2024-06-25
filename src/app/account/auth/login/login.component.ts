import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators,FormBuilder, FormGroup } from '@angular/forms';

import { catchError, finalize, Observable, Subject, throwError } from 'rxjs';
import { AuthenticationService } from '../../../core/services/auth.service';
import { Credentials } from '../../../entities/Credentials';
import { User } from '../../../entities/User';
import { ActivatedRoute, Router } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';

import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login component
 */
export class LoginComponent implements OnInit {

  loginForm: UntypedFormGroup;
  public credentials: Credentials;
  public textLogin: string = 'Iniciar Sesión';
  public idUsuario;
  submitted = false;
  error = '';
  returnUrl: string;
  public loading: boolean = false
  public passwordType: string = "password"


  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private router: Router,
    private auth: AuthenticationService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.initForm();
    document.body.setAttribute('class', 'authentication-bg');

    

    // reset login status
    // this.authenticationService.logout();
    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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

  initForm() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      // email: ['admin@themesbrand.com', [Validators.required, Validators.email]],
      // password: ['123456', [Validators.required]],
    });
  }

  ngOnDestroy() { 
    document.body.classList.remove('authentication-bg')
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  // onSubmit() {
  //   this.submitted = true;

  //   // stop here if form is invalid
  //   if (this.loginForm.invalid) {
  //     return;
  //   } else {
  //     if (environment.defaultauth === 'firebase') {
  //       this.auth.login(this.f.email.value, this.f.password.value).then((res: any) => {
  //         document.body.removeAttribute('class');
  //         this.router.navigate(['/']);
  //       })
  //         .catch(error => {
  //           this.error = error ? error : '';
  //         });
  //     } else {
  //       // this.authFackservice.login(this.f.email.value, this.f.password.value)
  //       //   .pipe(first())
  //       //   .subscribe(
  //       //     data => {
  //       //       this.router.navigate(['/']);
  //       //     },
  //       //     error => {
  //       //       this.error = error ? error : '';
  //       //     });
  //     }
  //   }
  // }
  onSubmit() {
    this.loading = true;
    this.textLogin = 'Cargando...';
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Para un desplazamiento suave
    });
    // this.loading = true;
    this.credentials = this.loginForm.value;
    
    this.auth.authenticate(this.credentials).pipe(
      catchError((error) => {
        this.loading = false;
        this.textLogin = 'Iniciar Sesión';
        Swal.fire({
          title: "Ops!",
          text: `Usuarios y/o constraseña incorrectos.`,
          icon: "error"
        });
        return throwError(() => "")
      })
      ).subscribe((result: User) => {
      this.auth.setData(result);
      this.router.navigate(['']);
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
    // this.auth.authenticate(this.credentials).subscribe(
    //   (result: User) => {
    //     this.auth.setData(result);
    //     this.router.navigate(['']);
    //   },
    //   err=>{
    //     console.log(err);
    //     // this.toastr.error('Usuario o contraseña incorrectos')
    //   })
  }

// onSubmit(){
//   const data = {
//     "id": '7',
//     "nombre": "luis enrique",
//     "email": "luisnm1@gmail.com",
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTAxOTY5MjEsImV4cCI6MTcxMDIwMDUyMX0.73QOGXDkxbXS7oSjWxSMyt-LKg0xalqC_o3jVGGQD2U",
//     "permisos": [
//         {
//             "IdPermiso": 3
//         },
//         {
//             "IdPermiso": 4
//         },
//         {
//             "IdPermiso": 5
//         },
//         {
//             "IdPermiso": 8
//         },
//         {
//             "IdPermiso": 6
//         },
//         {
//             "IdPermiso": 7
//         }
//     ]
// };
//   this.auth.setData(data);
//   this.router.navigate(['']);
// }
}
