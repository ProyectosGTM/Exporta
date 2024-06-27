import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

import { AuthenticationService } from '../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../core/services/authfake.service';
import { environment } from '../../../environments/environment';

import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from '../../core/services/language.service';
import { TranslateService } from '@ngx-translate/core';

import { Title } from '@angular/platform-browser';
import { ClienteService } from 'src/app/shared/services/clientes.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})

/**
 * Topbar component
 */
export class TopbarComponent implements OnInit {

  element;
  configData;
  cookieValue;
  flagvalue: any;
  countryName: any;
  valueset;

  public imagenPerfil:string;
  public nombre: string;
  public apellidoPaterno: string;

  constructor(@Inject(DOCUMENT) private document: any,
    private router: Router,
    private authService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService,
    public languageService: LanguageService,
    public translate: TranslateService,
    private titleService: Title,
    private user:AuthenticationService,
    private cliente: ClienteService,
    private sharedDataService: SharedDataService,
    public _cookiesService: CookieService) {
  }

  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'Spanish', flag: 'assets/images/flags/spain.jpg', lang: 'es' },
    { text: 'German', flag: 'assets/images/flags/germany.jpg', lang: 'de' },
    { text: 'Italian', flag: 'assets/images/flags/italy.jpg', lang: 'it' },
    { text: 'Russian', flag: 'assets/images/flags/russia.jpg', lang: 'ru' },
  ];

  openMobileMenu: boolean;

  @Output() settingsButtonClicked = new EventEmitter();
  @Output() mobileMenuButtonClicked = new EventEmitter();
  nombreCliente: string;
logotipoReporte: string;

  ngOnInit(): void {
    this.nombreCliente = this.sharedDataService.getNombreClienteFromStorage(); // Obtener valor inicial de localStorage
    this.logotipoReporte = this.sharedDataService.getLogotipoReporteFromStorage(); // Obtener valor inicial de localStorage
    this.sharedDataService.nombreCliente$.subscribe(
      nombre => {
        this.nombreCliente = nombre;
      }
    );
    this.sharedDataService.logotipoReporte$.subscribe(
      logotipo => {
        this.logotipoReporte = logotipo;
      }
    );

    this.openMobileMenu = false;
    this.element = document.documentElement;

    this.configData = {
      suppressScrollX: true,
      wheelSpeed: 0.3
    };

    this.cookieValue = this._cookiesService.get('lang');
    const val = this.listLang.filter(x => x.lang === this.cookieValue);
    this.countryName = val.map(element => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) { this.valueset = 'assets/images/flags/us.jpg'; }
    } else {
      this.flagvalue = val.map(element => element.flag);
    }
  }

  /**
   * Language set
   * @param text 
   * @param lang 
   * @param flag 
   */
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
  }
  
  private setUserProfile(user: any) {
    this.imagenPerfil = user.imagenPerfil;
    this.nombre = user.nombre;

    switch (user.idCliente) {
        case 3:
            // this.obtenerClienteEntorno();
            this.nombre = 'Entorno';
            this.titleService.setTitle('Entorno');
            this.setFavicon('assets/images/logoKonnecta.png');
            break;
        case 2:
            // this.obtenerClienteTecsa();
            this.nombre = 'Tecsa';
            this.titleService.setTitle('Tecsa');
            this.setFavicon('assets/images/tecsalogo.ico');
            break;
        default:
            // Valores por defecto si idCliente no es 1 ni 2
            this.nombre = 'Cliente Desconocido';
            this.imagenPerfil = 'assets/images/profile/default.jpg';
            this.titleService.setTitle('Cliente Desconocido');
            this.setFavicon('assets/images/icons/default-favicon.ico');
            break;
    }
  }

  // obtenerClienteTecsa(){
  //   this.cliente.obtenerClienteTecsa().subscribe(
  //     (res: any) => {
  //       this.imagenPerfil = res.LogotipoReporte;
  //     }
  //   );
  // }

  obtenerClienteEntorno(){
    this.cliente.obtenerClienteEntorno().subscribe(
      (res: any) => {
        this.imagenPerfil = res.LogotipoReporte;
      }
    );
  }

  private setFavicon(url: string) {
    let link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = url;
    document.getElementsByTagName('head')[0].appendChild(link);
  }  

  /**
   * Toggles the right sidebar
   */
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Logout the user
   */
  logout() {
    this.router.navigate(['/account/login']);

    setTimeout(()=>{
      window.location.reload();
    },700)
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }
}
