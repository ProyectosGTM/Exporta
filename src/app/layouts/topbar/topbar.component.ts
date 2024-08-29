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
export class TopbarComponent implements OnInit {

  element;
  configData;
  cookieValue;
  flagvalue: any;
  countryName: any;
  valueset;

  public imagenPerfil: string;
  public nombre: string;
  public apellidoPaterno: string;
  public afiliadoNombre: string; // Añadir esta línea

  constructor(@Inject(DOCUMENT) private document: any,
    private router: Router,
    private authService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService,
    public languageService: LanguageService,
    public translate: TranslateService,
    private titleService: Title,
    private user: AuthenticationService,
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
  idUsuario: string;

  ngOnInit(): void {
    this.nombreCliente = this.sharedDataService.getNombreClienteFromStorage();
    this.logotipoReporte = this.sharedDataService.getLogotipoReporteFromStorage();
    this.idUsuario = this.sharedDataService.getIdFromStorage();
    this.afiliadoNombre = this.sharedDataService.getAfiliadoNombreFromStorage(); // Añadir esta línea

    this.updatePageTitle();
    this.updateFavicon();

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
    this.sharedDataService.id$.subscribe(
      id => {
        this.idUsuario = id;
        this.obtenerUsuario(id); // Llamar al servicio cuando se recibe el ID
      }
    );
    this.sharedDataService.afiliadoNombre$.subscribe(
      afiliadoNombre => {
        this.afiliadoNombre = afiliadoNombre;
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

  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
  }

  obtenerUsuario(userId: string) {
    this.cliente.obtenerUsuario(userId).subscribe(
      (res: any) => {
        // console.log('Información del usuario:', res);
        // Puedes hacer algo con la información del usuario aquí
      }
    );
  }

  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  updatePageTitle() {
    this.titleService.setTitle(`Konecta - ${this.nombreCliente}`);
  }

  updateFavicon() {
    const link: HTMLLinkElement = this.document.querySelector("link[rel*='icon']") || this.document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = this.logotipoReporte;
    this.document.getElementsByTagName('head')[0].appendChild(link);
  }

  logout() {
    this.router.navigate(['/account/login']);
    this.authService.logout();
  }

  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        this.document.msExitFullscreen();
      }
    }
  }
}
