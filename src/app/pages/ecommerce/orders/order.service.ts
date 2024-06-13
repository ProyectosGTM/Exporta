import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExcelLoaderService {

  constructor(private http: HttpClient) { }

  loadExcelFile(filePath: string): Observable<any> {
    // La función get del HttpClient obtiene el contenido del archivo como un flujo de datos
    // El parámetro filePath debe ser la ruta relativa al archivo dentro de la carpeta 'assets'
    return this.http.get(filePath, { responseType: 'arraybuffer' });
  }
}