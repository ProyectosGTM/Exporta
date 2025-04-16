import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
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
  pageSize = 10;
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
  servicePageSizeOptions = [50, 100, 200];
  servicePageSize = 50;
  serviceCurrentPage = 0;
  serviceTotalRecords = 0;
  serviceTotalPages: any;
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

  constructor(
    private http: HttpClient,
    private cliente: ClienteService,
    private sharedDataService: SharedDataService,
    private location: Location,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }

  public logoLocal: any;
  ngOnInit(): void {
    this.location.replaceState('');
    this.sharedDataService.afiliadoLogoLocal$.subscribe(LogotipoAfiliadoLocal => {
      this.logoLocal = LogotipoAfiliadoLocal;
    });
    
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
      
      this.idRol = idRol;

    });

    this.sharedDataService.nombreUsuario$.subscribe(nombre => {
      

      this.nombreUsuario = nombre;
    });

    this.sharedDataService.afiliadoNombre$.subscribe(nombre => {
      this.afiliadoNombre = nombre;
      
    });

    this.sharedDataService.afiliadoNombreCorto$.subscribe(nombreCorto => {
      this.afiliadoNombreCorto = nombreCorto;
      
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
    setTimeout(() => {
      document.getElementById("transaccionesTitle")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
    // console.log(`📌 Cambio de registros por página a: ${this.servicePageSize}`);

    this.serviceCurrentPage = 0; 

    this.loadTransactions(); 
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
    setTimeout(() => {
      document.getElementById("transaccionesTitle")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
    // console.log("➡️ Botón SIGUIENTE presionado");
    // console.log(`📌 Página actual antes: ${this.serviceCurrentPage + 1}`);

    if (this.serviceCurrentPage < this.datos - 1) {  
      this.serviceCurrentPage++;
      // console.log(`✅ Nueva página: ${this.serviceCurrentPage + 1}`);
      this.loadTransactions();
    }
  }

  onServicePreviousPage(): void {
    setTimeout(() => {
      document.getElementById("transaccionesTitle")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
    // console.log("⬅️ Botón ANTERIOR presionado");
    // console.log(`📌 Página actual antes: ${this.serviceCurrentPage + 1}`);

    if (this.serviceCurrentPage > 0) {
      this.serviceCurrentPage--;
      // console.log(`✅ Nueva página: ${this.serviceCurrentPage + 1}`);
      this.loadTransactions();
    }
  }

  loadTransactions(): void {
    this.isLoadingGrid = true;

    // console.log(`🔄 Cargando datos para página: ${this.serviceCurrentPage + 1} con ${this.servicePageSize} registros por página`);

    this.cliente.obtenerTransacciones(this.selectedId, this.selectedYear, this.serviceCurrentPage + 1, this.servicePageSize)
      .subscribe((response: any) => {
        this.isLoadingGrid = false;

        this.serviceTransactions = response.data;
        this.filteredServiceTransactions = [...this.serviceTransactions]; 
        this.serviceTotalRecords = response.totalRecords;
        this.datos = response.totalPages;

        // console.log(`📌 Página actual en la tabla: ${this.serviceCurrentPage + 1}`);
        // console.log(`📌 Total de páginas: ${this.datos}`);

        
        this.cdRef.detectChanges();
      }, error => {
        this.isLoadingGrid = false;
        // console.error("❌ Error obteniendo transacciones:", error);
      });
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
    if (!this.serviceStartDate && !this.serviceEndDate) {
      this.filteredServiceTransactions = [...this.serviceTransactions];
      return;
    }

    const start = this.serviceStartDate ? new Date(this.serviceStartDate) : null;
    const end = this.serviceEndDate ? new Date(this.serviceEndDate) : null;

    if (end) {
      end.setHours(23, 59, 59, 999);
    }

    this.filteredServiceTransactions = this.serviceTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.DATE);

      const startDateOnly = start ? new Date(start.getFullYear(), start.getMonth(), start.getDate()) : null;
      const endDateOnly = end ? new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999) : null;
      const transactionDateOnly = new Date(transactionDate.getFullYear(), transactionDate.getMonth(), transactionDate.getDate());

      let matchesStartDate = startDateOnly ? transactionDateOnly >= startDateOnly : true;
      let matchesEndDate = endDateOnly ? transactionDateOnly <= endDateOnly : true;

      return matchesStartDate && matchesEndDate;
    });

    this.serviceTotalRecords = this.filteredServiceTransactions.length;
    this.updateServiceTotalPages();
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
            reject('No se pudo convertir la imagen a base64');
          };
          reader.readAsDataURL(blob);
        },
        error: (error) => {
          
          reject('No se pudo obtener la imagen desde la URL');
        }
      });
    });
  }
  public imagePDF: any;

  async exportToPDF(): Promise<void> {
    this.isLoadingPDF = true;
  
    // 👇 Esta línea permite que Angular renderice el cambio antes de seguir
    await new Promise(resolve => setTimeout(resolve, 0));
  
    if (!this.infoExcel || this.infoExcel.length === 0) {
      console.warn("⚠️ No hay datos en infoExcel para exportar.");
      this.isLoadingPDF = false;
      return;
    }
  
    // Asignación condicional del logotipo
    let imgWidth = 15;
    if (this.logoLocal === '../../../../assets/images/logoOlivares.png') {
      this.imagePDF = this.logoLocal;
      this.isLoadingPDF = true;
      imgWidth = 30;
    } else {
      this.isLoadingPDF = true;
      this.imagePDF = '../../../../assets/images/logoKonnecta.png';
      imgWidth = 15;
    }
  
    try {
      const doc = new jsPDF('landscape');
  
      // Imagen
      const imgX = 15, imgY = 12, imgHeight = 14;
      doc.addImage(this.imagePDF, imgX, imgY, imgWidth, imgHeight);

      // Línea separadora
      const lineX = imgX + imgWidth + 5;
      const lineY1 = imgY;
      const lineY2 = imgY + imgHeight;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(lineX, lineY1, lineX, lineY2);

      // Información del cliente
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
  
      // Tabla
      (doc as any).autoTable({
        head: [['#', 'DATE', 'TIME', 'OUT IP', 'IN IP', 'GEO OUT', 'GEO IN', 'CARRIER', 'PRODUCT', 'AMOUNT', 'PHONE', 'TRN', 'STATUS', 'T TIME']],
        body: this.infoExcel.map((transaction: any, index: number) => [
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

      // Agregar UTAE
      const formattedUnidadesTAE = parseFloat(this.unidadesTAE).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      doc.setFillColor(31, 78, 120);
      doc.rect(19, finalY + 0, tableWidth, 10, 'F');

      doc.setTextColor(255, 255, 255);
      doc.text('UTAE:', 190, finalY + 6);
      doc.text(formattedUnidadesTAE, 202, finalY + 6);

      // Guardar el PDF
      doc.save(`Transacciones - ${this.selectedInvoice}.pdf`);
    } catch (error) {
        console.error("❌ Error generando el PDF:", error);
        // alert("Hubo un error al generar el PDF.");
    } finally {
        this.isLoadingPDF = false;
    }
  }

  public infoExcel
  obtenerTotalTransacciones(id: any, fechaFactura: any, factura: string): Promise<void> {
    return new Promise((resolve, reject) => {
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
        }

        this.cliente.obtenerTransaccionesExcel(id, year).subscribe((response: any) => {
            if (response && response.length > 0) {
                this.infoExcel = response; // Aseguramos que infoExcel almacena los datos
                // console.log(" Datos de transacciones cargados en infoExcel:", this.infoExcel.length);
            } else {
                console.warn(" No se obtuvieron datos de transacciones.");
                this.infoExcel = [];
            }

            this.cdRef.detectChanges(); // Forzamos la actualización en Angular
            setTimeout(() => {
                this.showServiceTable = true;
                // console.log(" showServiceTable actualizado");
            }, 500);
            resolve();
        }, error => {
            console.error(" Error obteniendo transacciones:", error);
            reject(error);
        });
    });
  }


  public datos: any
  showInfo(id: any, fechaFactura: any, factura: string): void {
    // consol.log("📌 Seleccionando nueva transacción:", factura);
    this.showFuction = true; 
    this.servicePageSize = 50;
    this.isLoadingGrid = true;
    const year = new Date(fechaFactura).getFullYear();
    this.serviceTransactions = [];
    this.filteredServiceTransactions = [];
    this.serviceCurrentPage = 0; 
    this.selectedId = id;
    this.selectedYear = year;
    this.selectedInvoice = factura;

    const selectedOperacion = this.informacion.find(op => op.Id === id);
    if (selectedOperacion) {
      this.unidadesTAE = selectedOperacion.CantidadTotal;
    }

    this.obtenerTotalTransacciones(id, fechaFactura, factura);
    this.cliente.obtenerTransacciones(id, year, 1, 50).subscribe((response: any) => {
      this.isLoadingGrid = false;

      this.datos = response.totalPages;
      this.serviceTransactions = response.data;
      this.filteredServiceTransactions = [...this.serviceTransactions]; 
      this.serviceTotalPages = response.totalPages;
      this.serviceTotalRecords = response.totalRecords;
      this.totalRecords = response.totalRecords;

      // console.log("📌 Nueva Transacción Seleccionada:", factura);
      // console.log("📌 Total de Páginas:", this.datos);
      // console.log("📌 Página Reiniciada a 1");

      this.cdRef.detectChanges();
      this.updateServiceTotalPages();
      this.filterServiceTransactions();
      setTimeout(() => {
        this.showServiceTable = true;
        // console.log("✅ showServiceTable actualizado");
      }, 500);
    });
  }


  public showFuction: boolean = true;
  obtenerTransaccionesOK(id: number, year: number, page: number = 1, pageSize: number = 50): void {
    // console.log("📌 Obteniendo Transacciones Exitosas...");

    this.showFuction = false; 
    this.isLoadingGrid = true;
    this.servicePageSize = 50; 
    this.serviceCurrentPage = 0;
    this.serviceTransactions = [];
    this.filteredServiceTransactions = [];
    this.serviceCurrentPage = page - 1;
    this.servicePageSize = pageSize;

    this.obtenerTransaccionesOKExcel(id, year);
    this.cliente.obtenerTransaccionesOK(id, year, page, pageSize).subscribe((response: any) => {
      this.isLoadingGrid = false;
      this.serviceTransactions = response.data;
      this.filteredServiceTransactions = [...this.serviceTransactions]; 
      this.serviceTotalRecords = response.totalRecords;
      this.serviceTotalPages = response.totalPages;
      // console.log(`📌 Transacciones OK - Página ${this.serviceCurrentPage + 1} de ${this.serviceTotalPages}`);
      this.cdRef.detectChanges();
    });
  }

  obtenerTransaccionesOKExcel(id: number, year: number, page: number = 1, pageSize: number = 50): void {
    // console.log("📌 Obteniendo Transacciones Exitosas...");

    this.showFuction = false; 
    this.isLoadingGrid = true;
    this.servicePageSize = 50; 
    this.serviceCurrentPage = 0;
    this.serviceTransactions = [];
    this.filteredServiceTransactions = [];
    this.serviceCurrentPage = page - 1;
    this.servicePageSize = pageSize;

    this.cliente.obtenerTransaccionesExcelOk(id, year).subscribe((response: any) => {
      if (response && response.length > 0) {
        this.infoExcel = response; // Aseguramos que infoExcel almacena los datos
        console.log(" Datos de transacciones cargados en infoExcel:", this.infoExcel.length);
    } else {
        console.warn(" No se obtuvieron datos de transacciones.");
        this.infoExcel = [];
    }

    this.cdRef.detectChanges(); // Forzamos la actualización en Angular
    setTimeout(() => {
        this.showServiceTable = true;
        console.log("✅ showServiceTable actualizado");
    }, 500);
    });
  }


  onServiceOKNextPage(): void {
    // console.log("➡️ Botón SIGUIENTE en Transacciones OK presionado");

    if (this.serviceCurrentPage + 1 < this.serviceTotalPages) {
      this.serviceCurrentPage++;
      this.obtenerTransaccionesOK(this.selectedId, this.selectedYear, this.serviceCurrentPage + 1, this.servicePageSize);
      setTimeout(() => {
        document.getElementById("transaccionesTitle")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    } else {
      // console.log("🚫 Ya estás en la última página.");
    }
  }

  onServiceOKPreviousPage(): void {
    // console.log("⬅️ Botón ANTERIOR en Transacciones OK presionado");

    if (this.serviceCurrentPage > 0) {
      this.serviceCurrentPage--;
      this.obtenerTransaccionesOK(this.selectedId, this.selectedYear, this.serviceCurrentPage + 1, this.servicePageSize);
      setTimeout(() => {
        document.getElementById("transaccionesTitle")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    } else {
      // console.log("🚫 Ya estás en la primera página.");
    }
  }

  onServiceOKPageSizeChange(): void {
    setTimeout(() => {
      document.getElementById("transaccionesTitle")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
    // console.log(`📌 Cambio de registros por página a: ${this.servicePageSize}`);

    this.serviceCurrentPage = 0; 
    this.obtenerTransaccionesOK(this.selectedId, this.selectedYear, 1, this.servicePageSize);
  }
}