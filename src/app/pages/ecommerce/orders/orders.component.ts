import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { HttpClient } from '@angular/common/http';
import { fadeInRightAnimation } from 'src/app/core/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/app/core/animations/fade-in-up.animation';
import { scaleInAnimation } from 'src/app/core/animations/scale-in.animation';
import { ClienteService } from 'src/app/shared/services/clientes.service';

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
  transactions: Transaction[] = [ /* ... datos proporcionados ... */ ];
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

  serviceTransactions: Transaction[] = [];
  filteredServiceTransactions: Transaction[] = [];
  servicePageSizeOptions = [10, 50, 100, 200];
  servicePageSize = 10;
  serviceCurrentPage = 0;
  serviceTotalRecords = 0;
  serviceTotalPages = 0;

  showServiceTable: boolean = false;

  constructor(private http: HttpClient, private cliente: ClienteService) { }

  ngOnInit(): void {
    this.obtenerUsuarios();
    this.filteredTransactions = this.transactions;
    this.totalRecords = this.transactions.length;
    this.updateTotalPages();
  }

  updateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
  }

  updateServiceTotalPages(): void {
    this.serviceTotalPages = Math.ceil(this.serviceTotalRecords / this.servicePageSize);
  }

  performSearch(): void {
    this.filterTransactions();
  }

  onPageSizeChange(): void {
    this.currentPage = 0;
    this.updateTotalPages();
    this.filterTransactions();
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

  onServicePreviousPage(): void {
    if (this.serviceCurrentPage > 0) {
      this.serviceCurrentPage--;
      this.filterServiceTransactions();
    }
  }

  get startIndex(): number {
    return this.currentPage * this.pageSize;
  }

  get endIndex(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.totalRecords);
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

  filterServiceTransactions(): void {
    const start = this.serviceStartIndex;
    const end = this.serviceEndIndex;
    this.filteredServiceTransactions = this.serviceTransactions.slice(start, end);
  }

  exportToExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredTransactions);
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
    XLSX.writeFile(workbook, 'Transacciones.xlsx');
  }

  private getBase64ImageFromURL(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http.get(url, { responseType: 'blob' }).subscribe(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    });
  }

  async exportToPDF(): Promise<void> {
    const doc = new jsPDF('landscape');
    const imgUrl = '../../../../assets/images/tecsaRerporte.png';
    const imgData = await this.getBase64ImageFromURL(imgUrl);

    const imgX = 15;
    const imgY = 14;
    const imgWidth = 15;
    const imgHeight = 12;

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
    doc.text('CLIENT : TECSA/INGFRAC', textX, textYStart + textLineHeight);
    doc.text('NAME : INGFRAC DISEÑO Y CONSTRUCCIÓN SA DE CV', textX, textYStart + 2 * textLineHeight);
    doc.text('SEND TO : STARCCLOUD CONNECT LLC', textX, textYStart + 3 * textLineHeight);
    doc.text('TYPE : MX PIPE', 200, 23);

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = currentDate.toLocaleTimeString('es-ES');
    const dateTimeText = `${formattedDate}, ${formattedTime}`;
    
    doc.text(dateTimeText, 200, 28);

    (doc as any).autoTable({
      head: [['#', 'DATE', 'TIME', 'OUT IP', 'IN IP', 'GEO OUT', 'GEO IN', 'CARRIER', 'PROD', 'AMOUNT', 'PHONE', 'TRN', 'ST', 'T TIME']],
      body: this.filteredTransactions.map((transaction, index) => [
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

    doc.setFontSize(10);
    doc.text('Tecsa', 14, doc.internal.pageSize.height - 10);

    doc.save('Transacciones.pdf');
  }

  selectedId: number | null = null;
  selectedYear: number | null = null;
  showInfo(id: any, fechaFactura: any): void {
    const year = new Date(fechaFactura).getFullYear();
    console.log(id, year);
    this.cliente.obtenerTransacciones(id, year).subscribe((response: Transaction[]) => {
      this.selectedId = id;
      this.selectedYear = year;
      this.serviceTransactions = response;
      this.serviceTotalRecords = this.serviceTransactions.length;
      this.updateServiceTotalPages();
      this.filterServiceTransactions();
      this.showServiceTable = true;
    });
  }

  public informacion: any;
  obtenerUsuarios(){    
    this.cliente.obtenerUsuario().subscribe((response: any) => {
      this.informacion = response.CatAfiliados[0].Operaciones;
    });
  }
}
