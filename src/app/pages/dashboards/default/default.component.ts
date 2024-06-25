import { AuthenticationService } from 'src/app/core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { transactions, lineColumAreaChart, revenueColumnChart, customerRadialBarChart, orderRadialBarChart, growthColumnChart} from './data';

import { ChartType } from './dashboard.model';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})

export class DefaultComponent implements OnInit {

  lineColumAreaChart: ChartType;
  revenueColumnChart: ChartType;
  orderRadialBarChart: ChartType;
  customerRadialBarChart: ChartType;
  growthColumnChart: ChartType;
  transactions;
  nombre: string;
  breadCrumbItems: Array<{}>;

  constructor(private titleService: Title, private userService: AuthenticationService) { }

  ngOnInit() {
    /**
     * Fetches the data
     */

    const user = this.userService.getUser(); // Obtener datos del usuario
    this.nombre = user.nombre;

    if (user.idCliente === 2) {
      this.titleService.setTitle('Tecsa'); // Cambiar el título de la pestaña a "Tecsa"
    } else {
      this.titleService.setTitle(this.nombre); // Cambiar el título de la pestaña al nombre del usuario
    }

    if (user.idCliente === 1) {
      this.titleService.setTitle('Konecta'); // Cambiar el título de la pestaña a "Tecsa"
    } else {
      this.titleService.setTitle(this.nombre); // Cambiar el título de la pestaña al nombre del usuario
    }
    this.fetchData();
    this.breadCrumbItems = [{ label: 'Minible' }, { label: 'Dashboard', active: true }];
  }
  

  /**
   * Fetches the data
   */
  private fetchData() {
    
    this.lineColumAreaChart = lineColumAreaChart;
    this.revenueColumnChart = revenueColumnChart;
    this.orderRadialBarChart = orderRadialBarChart;
    this.customerRadialBarChart = customerRadialBarChart;
    this.growthColumnChart = growthColumnChart;
    
    this.transactions = transactions;
  }

}
