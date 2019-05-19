import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cerere } from './camine/student/cerere.model';
@Injectable({
  providedIn: 'root'
})
export class ApiCallBackendService {
  private actionUrl: string;
  constructor(private http: HttpClient) {
    this.actionUrl = "http://localhost:8080/borrower-app-0.0.1-SNAPSHOT/";
  }

  //Operatii Camine
  public getAllCamine<T>(): Observable<T> {
    return this.http.get<T>(this.actionUrl + "camin");
  }

  public getSingleCamin<T>(id: number): Observable<T> {
    return this.http.get<T>(this.actionUrl + "camin/" + id);
  }

  public addCamin<T>(itemName: string, camin: any): Observable<T> {
    return this.http.post<T>(this.actionUrl + "camin", camin);
  }

  public updateCamin(id: number, caminToUpdate: any): Observable<any> {
    return this.http.put(this.actionUrl + "camin/" + id, caminToUpdate, { responseType: 'text' });
  }

  //Operatii cerere
  public addCerere<T>(itemName: string, cereri: any): Observable<T> {
    return this.http.post<T>(this.actionUrl + "cerere", cereri);
  }

  public getCereriByIdStudent<T>(idStudent: number): Observable<T> {
    return this.http.get<T>(this.actionUrl + "cerere/getByIdStudent/" + idStudent);
  }

  public getCereriByIdCamin<T>(idCamin: number): Observable<T> {
    return this.http.get<T>(this.actionUrl + "cerere/getByIdCamin/" + idCamin);
  }

  public updateCerere(id: number, cerereToUpdate: Cerere): Observable<any> {
    return this.http.put(this.actionUrl + "cerere/" + id, cerereToUpdate, { responseType: 'text' });
  }

  //Operatii Camere
  public getAllCamere<T>(): Observable<T> {
    return this.http.get<T>(this.actionUrl + "camera");
  }

  public getSingleCamera<T>(id: number): Observable<T> {
    return this.http.get<T>(this.actionUrl + "camera/" + id);
  }

  public getAllCameraByNumarCamin<T>(id: number): Observable<T> {
    return this.http.get<T>(this.actionUrl + "camera/getByCamin/" + id);
  }

  public addCamera<T>(itemName: string, camera: any): Observable<T> {
    return this.http.post<T>(this.actionUrl + "camera", camera);
  }

  public updateCamera(id: number, cameraToUpdate: any): Observable<any> {
    return this.http.put(this.actionUrl + "camera/" + id, cameraToUpdate, { responseType: 'text' });
  }

  public deleteCamera<T>(id: number): Observable<T> {
    return this.http.delete<T>(this.actionUrl + "camera/" + id);
  }


  //Operatii Studenti
  public getAllStudents<T>(): Observable<T> {
    return this.http.get<T>(this.actionUrl + "student");
  }

  public getSingleStudent<T>(id: number): Observable<T> {
    return this.http.get<T>(this.actionUrl + "student/" + id);
  }

  public getAllStudentsByCamin<T>(id: number): Observable<T> {
    return this.http.get<T>(this.actionUrl + "student/getByCamin/" + id);
  }

  public addStudent<T>(itemName: string, student: any): Observable<T> {
    return this.http.post<T>(this.actionUrl + "student", student);
  }

  public updateStudent(id: number, studentToUpdate: any): Observable<any> {
    return this.http.put(this.actionUrl + "student/" + id, studentToUpdate, { responseType: 'text' });
  }

  public deleteStudent<T>(id: number): Observable<T> {
    return this.http.delete<T>(this.actionUrl + "student/" + id);
  }

  //Operatii Admini
  public getAllAdmins<T>(): Observable<T> {
    return this.http.get<T>(this.actionUrl + "admin");
  }

  public getSingleAdmin<T>(id: number): Observable<T> {
    return this.http.get<T>(this.actionUrl + "admin/" + id);
  }

  //Operatii Utilizatori
  public getAllUtilizatori<T>(): Observable<T> {
    return this.http.get<T>(this.actionUrl + "utilizator");
  }

  public getSingleUtilizator<T>(id: number): Observable<T> {
    return this.http.get<T>(this.actionUrl + "utilizator/" + id);
  }

}
