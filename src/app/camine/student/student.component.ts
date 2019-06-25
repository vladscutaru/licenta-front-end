import { Component, OnInit } from '@angular/core';
import { ApiCallBackendService } from 'app/api-call-backend.service';
import { Cerere, PENDING_STATUS } from './cerere.model';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {

  idStudent = 1;
  student: any;

  camine = [];
  camere = [];
  camereDisponibile = [];
  cereri = [];
  formularCompletat = false;
  caminSelectat: any;
  cameraSelectata: any;

  afisareMesajSucces = false;
  afisareMesajEroare = false;
  sfarsitCerere = false;

  mesajSucces = 'Cererea a fost trimisa cu succes!';
  mesajEroare = 'A parut o eroare :(';


  constructor(
    private dataService: ApiCallBackendService
  ) { }

  ngOnInit(): void {
    this.dataService.getSingleStudent(this.idStudent)
    .subscribe((data: any[]) => {
      this.student = data;
    },
      error => () => {
        console.log("Eroare!" + error);
      }
    );


    this.dataService.getAllCamine()
      .subscribe(
        (data: any[]) => {
          this.camine = data;
        },
        (error) => () => {
          console.log("Eroare!" + error);
        }
      );

    this.dataService.getCereriByIdStudent(this.idStudent)
      .subscribe(
        (data: any[]) => {
          this.cereri = data;

          const isPending = !!this.cereri.find((cerere) => cerere.status === PENDING_STATUS);

          if (isPending) {
            this.afisareMesajSucces = true;
            this.sfarsitCerere = true;
          }
        });
  }

  public selectCamin() {

    this.dataService.getAllCameraByNumarCamin(this.caminSelectat.numarCamin)
      .subscribe(
        (data: any[]) => {
        this.camere = data;
        this.camereDisponibile = this.camere.filter(camera => camera.locuriOcupate < camera.numarLocuri);
      });
  }

  public selectCamera() {
    this.formularCompletat = true;
  }

  public submitDa(): void {
    this.submit(this.student.camin, this.student.camera, this.student.etaj);
  }

  public submitNu(): void {
    if (!this.formularCompletat) {
      return;
    }

    this.submit(this.caminSelectat, this.cameraSelectata.numarCamera, this.cameraSelectata.etaj);
  }

  private submit(camin: any, numarCamera: number, etaj: number): void {

    const cerere: Cerere = {
      idStudent: this.student.idStudent,
      nume: this.student.nume,
      prenume: this.student.prenume,
      facultate: this.student.facultate,
      an: this.student.an,
      oras: this.student.oras,
      judet: this.student.judet,
      telefon: this.student.telefon,
      email: this.student.email,
      orfan: this.student.orfan,
      situatieSocialaPrecara: this.student.situatieSocialaPrecara,
      situatieMedicalaSpeciala: this.student.situatieMedicalaSpeciala,
      arhiva: this.student.arhiva,
      cazat: this.student.cazat,
      camin: camin,
      etaj: etaj,
      camera: numarCamera,
      confirmat: this.student.confirmat,
      status: PENDING_STATUS
    }

    this.dataService.addCerere("", cerere)
      .subscribe(
        (data) => { console.log(data); this.afisareMesajSucces = true; this.sfarsitCerere = true },
        (error) => { console.log(error); this.afisareMesajEroare = true; this.sfarsitCerere = true }
      );
  }

  step = -1;
  setStep(index: number) { this.step = index; }
  nextStep() { this.step++; }
  prevStep() { this.step--; }
}
