import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { HttpClient } from '@angular/common/http';
import { fadeInRightAnimation } from 'src/app/core/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/app/core/animations/fade-in-up.animation';
import { scaleInAnimation } from 'src/app/core/animations/scale-in.animation';
import { ClienteService } from 'src/app/shared/services/clientes.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { Location } from '@angular/common';
import CustomStore from 'devextreme/data/custom_store';

interface Transaction {
  DATE: string;
  TIME: string;
  OUT_IP: string;
  IN_IP: string;
  GEO_OUT: string;
  GEO_IN: string;
  CARRIER: string;
  PROD: string;
  AMOUNT: number;
  PHONE: string;
  TRN: number;
  ST: string;
  T_TIME: number;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  animations: [fadeInRightAnimation, fadeInUpAnimation, scaleInAnimation]
})
export class OrdersComponent implements OnInit {
  public nombre: string;
  public nombreCorto: string;
  public nombreUsuario: string;
  public idRol: number;
  public validarTotal: boolean;
  serviceTransactionsOK: any[] = [];
  showServiceTableOK: boolean = false;
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  pageSizeOptions = [10, 50, 100, 200];
  pageSize = 60;
  currentPage = 0;
  totalRecords = 0;
  totalPages = 0;
  searchTerm: string = '';
  startDate: string = '';
  endDate: string = '';
  showTotalRecordsMessage: boolean = false;

  selectedId: any;
  selectedYear: number;
  selectedInvoice: string;

  serviceTransactions: Transaction[] = [];
  filteredServiceTransactions: Transaction[] = [];
  servicePageSizeOptions = [10, 50, 100, 200];
  servicePageSize = 10;
  serviceCurrentPage = 0;
  serviceTotalRecords = 0;
  serviceTotalPages = 0;
  serviceSearchTerm: string = '';
  serviceStartDate: string = '';
  serviceEndDate: string = '';

  showServiceTable: boolean = false;
  informacion: any[] = [];
  informacionDos: any;
  filteredInformacion: any[] = [];
  informacionPageSizeOptions = [10, 50, 100, 200];
  informacionPageSize = 10;
  informacionCurrentPage = 0;
  informacionTotalRecords = 0;
  informacionTotalPages = 0;
  informacionSearchTerm: string = '';
  informacionStartDate: string = '';
  informacionEndDate: string = '';
  unidadesTAE: string;
  isLoading: boolean = false;
  isLoadingGrid: boolean = false;
  isLoadingPDF: boolean = false;

  clienteNombre: string;
  logotipo: string;
  idUsuario: string;
  logotipoReporte: string;
  afiliadoNombre: string;
  enviadoNombre: string;
  afiliadoNombreCorto: string;
  tipoOperacionNombre: string;

  public mensajeAgrupar: string = "Arrastre un encabezado de columna aquí para agrupar por esa columna";
	public showFilterRow: boolean;
	public showHeaderFilter: boolean;

  constructor(
    private http: HttpClient, 
    private cliente: ClienteService, 
    private sharedDataService: SharedDataService,
    private location: Location
  ) {
    this.showFilterRow = true;
    this.showHeaderFilter = true;
   }

  ngOnInit(): void {
    this.location.replaceState('');
    this.sharedDataService.nombreCliente$.subscribe(nombre => {
      this.clienteNombre = nombre;
    });
    this.sharedDataService.logotipo$.subscribe(logotipo => {
      this.logotipo = logotipo;
    });
    this.sharedDataService.logotipoReporte$.subscribe(logotipoReporte => {
      this.logotipoReporte = logotipoReporte;
    });
    this.sharedDataService.enviadoNombre$.subscribe(enviadoNombre => {
      this.enviadoNombre = enviadoNombre;

    });
    this.sharedDataService.tipoOperacionNombre$.subscribe(tipoOperacionNombre => {
      this.tipoOperacionNombre = tipoOperacionNombre;

    });

    this.sharedDataService.idRol$.subscribe(idRol => {
      // console.log('IdRol recibido:', idRol);
      this.idRol = idRol;

    });

    this.sharedDataService.nombreUsuario$.subscribe(nombre => {
      // console.log('Nombre recibido:', nombre);

      this.nombreUsuario = nombre;
    });

    this.sharedDataService.afiliadoNombre$.subscribe(nombre => {
      this.afiliadoNombre = nombre;
      // console.log('Nombre recuperado:', nombre);
    });

    this.sharedDataService.afiliadoNombreCorto$.subscribe(nombreCorto => {
      this.afiliadoNombreCorto = nombreCorto;
      // console.log('Nombre Corto recuperado:', nombreCorto);
    });
    this.obtenerUsuarios();
  }
  

  obtenerUsuarios() {
    this.validarTotal = true;
    this.isLoading = true;
    const idUsuario = this.sharedDataService.getIdFromStorage();
    this.cliente.obtenerUsuario(idUsuario).subscribe((response: any) => {
      this.isLoading = false;
      if (!response || !response.afiliados || !response.afiliados[0].operaciones || response.afiliados[0].operaciones.length === 0) {
        this.validarTotal = true;
      } else {
        this.validarTotal = false;
        this.informacion = response.afiliados[0].operaciones;
        this.filteredInformacion = this.informacion.slice(0, this.informacionPageSize);
        this.informacionTotalRecords = this.informacion.length;
        this.updateInformacionTotalPages();
      }
    }, error => {
      this.isLoading = false;
      this.validarTotal = true;
      // console.error('Error al obtener usuario:', error);
    });
  }

  obtenerUsuario(userId: string) {
    this.cliente.obtenerUsuario(userId).subscribe(
      (res: any) => {
        this.nombreCorto = res.Nombre;
        this.nombre = res.afiliados[0].Nombre;
      }
    );
  }

  updateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
  }

  updateInformacionTotalPages(): void {
    this.informacionTotalPages = Math.ceil(this.informacionTotalRecords / this.informacionPageSize);
  }

  updateServiceTotalPages(): void {
    this.serviceTotalPages = Math.ceil(this.serviceTotalRecords / this.servicePageSize);
  }

  performSearch(): void {
    this.filterTransactions();
  }

  performInformacionSearch(): void {
    this.filterInformacion();
  }

  performServiceSearch(): void {
    this.filterServiceTransactions();
  }

  onPageSizeChange(): void {
    this.currentPage = 0;
    this.updateTotalPages();
    this.filterTransactions();
  }

  onInformacionPageSizeChange(): void {
    this.informacionCurrentPage = 0;
    this.updateInformacionTotalPages();
    this.filterInformacion();
  }

  onServicePageSizeChange(): void {
    this.serviceCurrentPage = 0;
    this.updateServiceTotalPages();
    this.filterServiceTransactions();
  }

  onNextPage(): void {
    if ((this.currentPage + 1) * this.pageSize < this.totalRecords) {
      this.currentPage++;
      this.filterTransactions();
    }
  }

  onInformacionNextPage(): void {
    if ((this.informacionCurrentPage + 1) * this.informacionPageSize < this.informacionTotalRecords) {
      this.informacionCurrentPage++;
      this.filterInformacion();
    }
  }

  onServiceNextPage(): void {
    if ((this.serviceCurrentPage + 1) * this.servicePageSize < this.serviceTotalRecords) {
      this.serviceCurrentPage++;
      this.filterServiceTransactions();
    }
  }

  onPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.filterTransactions();
    }
  }

  onInformacionPreviousPage(): void {
    if (this.informacionCurrentPage > 0) {
      this.informacionCurrentPage--;
      this.filterInformacion();
    }
  }

  onServicePreviousPage(): void {
    if (this.serviceCurrentPage > 0) {
      this.serviceCurrentPage--;
      this.filterServiceTransactions();
    }
  }

  formatCustomDate = (date: Date): string => {
    if (!date) return '';
    const day = date.getDate();
    const month = this.months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  private months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];

  get startIndex(): number {
    return this.currentPage * this.pageSize;
  }

  get endIndex(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.totalRecords);
  }

  get informacionStartIndex(): number {
    return this.informacionCurrentPage * this.informacionPageSize;
  }

  get informacionEndIndex(): number {
    return Math.min((this.informacionCurrentPage + 1) * this.informacionPageSize, this.informacionTotalRecords);
  }

  get serviceStartIndex(): number {
    return this.serviceCurrentPage * this.servicePageSize;
  }

  get serviceEndIndex(): number {
    return Math.min((this.serviceCurrentPage + 1) * this.servicePageSize, this.serviceTotalRecords);
  }

  filterByDateRange(): void {
    this.filterTransactions();
  }

  filterInformacionByDateRange(): void {
    this.filterInformacion();
  }

  filterServiceTransactionsByDateRange(): void {
    this.filterServiceTransactions();
  }

  filterTransactions(): void {
    this.filteredTransactions = this.transactions.filter(transaction => {
      const transactionDate = new Date(transaction.DATE);
      const start = this.startDate ? new Date(this.startDate) : null;
      const end = this.endDate ? new Date(this.endDate) : null;

      let matchesDateRange = true;
      if (start && end) {
        matchesDateRange = transactionDate >= start && transactionDate <= end;
      } else if (start) {
        matchesDateRange = transactionDate >= start;
      } else if (end) {
        matchesDateRange = transactionDate <= end;
      }

      let matchesSearchTerm = Object.values(transaction).some(val =>
        val.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      );

      return matchesDateRange && matchesSearchTerm;
    });

    this.totalRecords = this.filteredTransactions.length;
    this.updateTotalPages();
    this.currentPage = 0;
    this.showTotalRecordsMessage = !!this.startDate || !!this.endDate;
  }

  filterInformacion(): void {
    this.filteredInformacion = this.informacion.filter(data => {
      const dataDate = new Date(data.FechaFactura);
      const start = this.informacionStartDate ? new Date(this.informacionStartDate) : null;
      const end = this.informacionEndDate ? new Date(this.informacionEndDate) : null;

      let matchesDateRange = true;
      if (start && end) {
        matchesDateRange = dataDate >= start && dataDate <= end;
      } else if (start) {
        matchesDateRange = dataDate >= start;
      } else if (end) {
        matchesDateRange = dataDate <= end;
      }
      let matchesSearchTerm = Object.values(data).some(val =>
        val.toString().toLowerCase().includes(this.informacionSearchTerm.toLowerCase())
      );
      return matchesDateRange && matchesSearchTerm;
    });
    this.informacionTotalRecords = this.filteredInformacion.length;
    this.updateInformacionTotalPages();
    const startIdx = this.informacionStartIndex;
    const endIdx = this.informacionEndIndex;
    this.filteredInformacion = this.filteredInformacion.slice(startIdx, endIdx);
  }

  filterServiceTransactions(): void {
    const filteredTransactions = this.serviceTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.DATE);
      const start = this.serviceStartDate ? new Date(this.serviceStartDate) : null;
      const end = this.serviceEndDate ? new Date(this.serviceEndDate) : null;
      let matchesDateRange = true;
      if (start && end) {
        matchesDateRange = transactionDate >= start && transactionDate <= end;
      } else if (start) {
        matchesDateRange = transactionDate >= start;
      } else if (end) {
        matchesDateRange = transactionDate <= end;
      }
      let matchesSearchTerm = Object.values(transaction).some(val =>
        val.toString().toLowerCase().includes(this.serviceSearchTerm.toLowerCase())
      );
      return matchesDateRange && matchesSearchTerm;
    });
    this.serviceTotalRecords = filteredTransactions.length;
    this.updateServiceTotalPages();
    const startIdx = this.serviceStartIndex;
    const endIdx = this.serviceEndIndex;
    this.filteredServiceTransactions = filteredTransactions.slice(startIdx, endIdx);
  }

  exportToExcel(): void {
    const allFilteredTransactions = this.serviceTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.DATE);
      const start = this.serviceStartDate ? new Date(this.serviceStartDate) : null;
      const end = this.serviceEndDate ? new Date(this.serviceEndDate) : null;
      let matchesDateRange = true;
      if (start && end) {
        matchesDateRange = transactionDate >= start && transactionDate <= end;
      } else if (start) {
        matchesDateRange = transactionDate >= start;
      } else if (end) {
        matchesDateRange = transactionDate <= end;
      }
      let matchesSearchTerm = Object.values(transaction).some(val =>
        val.toString().toLowerCase().includes(this.serviceSearchTerm.toLowerCase())
      );
      return matchesDateRange && matchesSearchTerm;
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(allFilteredTransactions);
    XLSX.utils.sheet_add_aoa(worksheet, [['Total de registros', allFilteredTransactions.length]], { origin: -1 });
    const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
    const headerCols = [];
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const headerCellRef = XLSX.utils.encode_cell({ r: 0, c: col });
      headerCols.push({ wch: worksheet[headerCellRef].v.toString().length + 5 });
      worksheet[headerCellRef].s = {
        font: { bold: true, color: { rgb: 'd40c0c' } }
      };
    }
    worksheet['!cols'] = headerCols;
    const workbook: XLSX.WorkBook = { Sheets: { 'Data': worksheet }, SheetNames: ['Data'] };
    XLSX.writeFile(workbook, 'ServiceTransactions.xlsx');
  }

  private getBase64ImageFromURL(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http.get(url, { responseType: 'blob' }).subscribe({
        next: (blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.onerror = (error) => {
            // console.error('Error al leer el archivo de imagen:', error);
            reject('No se pudo convertir la imagen a base64');
          };
          reader.readAsDataURL(blob);
        },
        error: (error) => {
          // console.error('Error al obtener la imagen desde la URL:', error);
          reject('No se pudo obtener la imagen desde la URL');
        }
      });
    });
  }

  async exportToPDF(): Promise<void> {
    this.isLoadingPDF = true;
    try {
      const allFilteredTransactions = this.serviceTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.DATE);
        const start = this.serviceStartDate ? new Date(this.serviceStartDate) : null;
        const end = this.serviceEndDate ? new Date(this.serviceEndDate) : null;

        let matchesDateRange = true;
        if (start && end) {
          matchesDateRange = transactionDate >= start && transactionDate <= end;
        } else if (start) {
          matchesDateRange = transactionDate >= start;
        } else if (end) {
          matchesDateRange = transactionDate <= end;
        }

        let matchesSearchTerm = Object.values(transaction).some(val =>
          val.toString().toLowerCase().includes(this.serviceSearchTerm.toLowerCase())
        );

        return matchesDateRange && matchesSearchTerm;
      });

      const doc = new jsPDF('landscape');
      const imgUrl = '../../../../assets/images/logoKonnecta.png';
      const imgData = await this.getBase64ImageFromURL(imgUrl);

      const imgX = 15;
      const imgY = 12;
      const imgWidth = 15;
      const imgHeight = 14;

      doc.addImage(imgData, 'PNG', imgX, imgY, imgWidth, imgHeight);

      const lineX = imgX + imgWidth + 5;
      const lineY1 = imgY;
      const lineY2 = imgY + imgHeight;

      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(lineX, lineY1, lineX, lineY2);

      const textX = lineX + 5;
      const textYStart = 13;
      const textLineHeight = 5;

      doc.setFont('courier', 'bold');
      doc.setFontSize(10);
      doc.text('Konnecta System 7.0', textX, textYStart);
      doc.text(`CLIENT: ${this.clienteNombre}/${this.afiliadoNombreCorto} `, textX, textYStart + textLineHeight);
      doc.text(`NAME: ${this.afiliadoNombre}`, textX, textYStart + 2 * textLineHeight);
      doc.text(`SEND TO: ${this.enviadoNombre}`, textX, textYStart + 3 * textLineHeight);
      doc.text(`TYPE: ${this.tipoOperacionNombre}`, 190, 23);

      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const formattedTime = currentDate.toLocaleTimeString('es-ES');
      const dateTimeText = `${formattedDate}, ${formattedTime}`;

      doc.text(dateTimeText, 190, 28);

      (doc as any).autoTable({
        head: [['#', 'DATE', 'TIME', 'OUT IP', 'IN IP', 'GEO OUT', 'GEO IN', 'CARRIER', 'PRODUCT', 'AMOUNT', 'PHONE', 'TRN', 'STATUS', 'T TIME']],
        body: allFilteredTransactions.map((transaction, index) => [
          index + 1,
          transaction.DATE,
          transaction.TIME,
          transaction.OUT_IP,
          transaction.IN_IP,
          transaction.GEO_OUT,
          transaction.GEO_IN,
          transaction.CARRIER,
          transaction.PROD,
          transaction.AMOUNT,
          transaction.PHONE,
          transaction.TRN,
          transaction.ST,
          transaction.T_TIME,
        ]),
        startY: 30,
        styles: { fontSize: 8, font: 'courier', cellPadding: 1.5, lineHeight: 1 },
        headStyles: { fillColor: [31, 78, 120], textColor: [255, 255, 255], halign: 'center', font: 'courier', fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [255, 255, 255] },
      });

      const finalY = (doc as any).lastAutoTable.finalY || 30;
      const tableWidth = doc.internal.pageSize.width - 40;

      const formattedUnidadesTAE = parseFloat(this.unidadesTAE).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      doc.setFillColor(31, 78, 120);
      doc.rect(19, finalY + 0, tableWidth, 10, 'F');

      doc.setTextColor(255, 255, 255);
      doc.text('UTAE:', 190, finalY + 6);
      doc.text(formattedUnidadesTAE, 202, finalY + 6);

      doc.save(`Transacciones - ${this.selectedInvoice}.pdf`);
    } catch (error) {
      // console.error('Error generando el PDF:', error);
    } finally {
      this.isLoadingPDF = false;
    }
  }


  public cantidadTotalFactura: number;
  public paginaActual: number = 1; 
  public cantidadTotalRegistros: number

  //Este codigo sirve bien

  showInfo(id: any, fechaFactura: any, factura: string): void {
    this.isLoadingGrid = true;
    const year = new Date(fechaFactura).getFullYear();
    this.serviceTransactions = []; 
    this.filteredServiceTransactions = [];
    this.selectedId = id;
    this.selectedYear = year;
    this.selectedInvoice = factura;

    const selectedOperacion = this.informacion.find(op => op.Id === id);
    if (selectedOperacion) {
        this.unidadesTAE = selectedOperacion.CantidadTotal;
        this.cantidadTotalFactura = Math.floor(parseFloat(selectedOperacion.CantidadTotal));

        // 🔹 Nueva propiedad que almacena la suma de CantidadRegistros y CantidadRegistrosError
        this.cantidadTotalRegistros = selectedOperacion.CantidadRegistros + selectedOperacion.CantidadRegistrosError;

        // 🔹 Mostrar información en la consola
        console.log("📌 Cantidad Total de la Factura (entero):", this.cantidadTotalFactura);
        console.log("🔹 Cantidad de Registros:", selectedOperacion.CantidadRegistros);
        console.log("⚠️ Registros con Error:", selectedOperacion.CantidadRegistrosError);
        console.log("🟢 Cantidad Total de Registros (Correctos + Errores):", this.cantidadTotalRegistros);
    }

    // Llamada al servicio asegurando que se extraigan los datos correctos
    this.cliente.obtenerTransacciones(id, year, 1, this.cantidadTotalRegistros).subscribe({
      next: (response: any) => {  
          this.isLoadingGrid = false;
  
          console.log("📥 Respuesta completa de la API:", response);
  
          if (response.data) {
              console.log("📊 Datos dentro de 'data':", response.data);
              this.serviceTransactions = response.data;
              this.filteredServiceTransactions = response.data;
              console.log("✅ Transacciones asignadas:", this.serviceTransactions);
          } else {
              console.warn("⚠️ La API no devolvió un array en 'data', asignando array vacío.");
              this.serviceTransactions = [];
              this.filteredServiceTransactions = [];
          }
  
          this.serviceTotalRecords = this.serviceTransactions.length;
          this.updateServiceTotalPages();
          this.showServiceTable = true;
  
          setTimeout(() => {
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          }, 0);
      },
      error: (error) => {
          this.isLoadingGrid = false;
          console.error("❌ Error obteniendo transacciones:", error);
      }
  });
}

  onPageIndexChanged(e: any) {
    const pageIndex = e.component.pageIndex(); // Obtiene la nueva página seleccionada (basada en 0)
    this.paginaActual = pageIndex + 1; // Ajustamos para que empiece en 1
    console.log(`📢 Página cambiada a: ${this.paginaActual}`);

    e.component.refresh(); // Refresca la tabla y dispara `setupDataSource()`
}


  getIndex(rowIndex: number): number {
    return rowIndex + 1; 
  }

  public dataSource: any; 


  obtenerTransaccionesOK(id: number, year: number): void {
    this.isLoadingGrid = true;
    this.serviceTransactions = [];
    this.filteredServiceTransactions = [];
    this.cliente.obtenerTransaccionesOK(id, year, 1, this.cantidadTotalRegistros).subscribe((response: any) => {
      this.isLoadingGrid = false;
      this.serviceTransactions = response.data;
      this.serviceTotalRecords = this.serviceTransactions.length;
      this.updateServiceTotalPages();
      this.filterServiceTransactions();
      this.showServiceTable = true;
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 0);
    });
  }

  
}