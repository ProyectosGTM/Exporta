import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})

/**
 * Footer component
 */
export class FooterComponent implements OnInit {

  // set the current year
  year: number = new Date().getFullYear();
  nombreCliente: string;

  constructor(private sharedDataService: SharedDataService) {}

  ngOnInit() {
    this.nombreCliente = this.sharedDataService.getNombreClienteFromStorage(); // Obtener valor inicial de localStorage
    this.sharedDataService.nombreCliente$.subscribe(
      nombre => {
        this.nombreCliente = nombre;
      }
    );
  }
}
