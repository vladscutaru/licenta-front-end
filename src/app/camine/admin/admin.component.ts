import { Component, OnInit } from '@angular/core';
import { SelectMultipleControlValueAccessor } from '@angular/forms';
import { ApiCallBackendService } from 'app/api-call-backend.service';
import { Cerere, PENDING_STATUS, DENIED_STATUS } from '../student/cerere.model';
import { PENDING } from '@angular/forms/src/model';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  numbers = [];
  idCamin = 3;
  camin: any;
  toateCamerele: any[];
  camerePeEtaje: any[][];
  numarEtaje = [];

  cereri: Cerere[];
  camere = [];
  cameraSelectata: any;
  studenti: any[];

  deleteRowCerere(cerere: Cerere): void {
    let cerereToDeny: Cerere = { ...cerere };
    cerereToDeny.status = DENIED_STATUS;

    this.dataService.updateCerere(cerere.id, cerereToDeny)
      .subscribe(
        () => {
          const index = this.cereri.indexOf(cerere);
          this.cereri.splice(index, 1);
        },
        (error) => console.log(error)
      );
  }

  deleteRowStudent(student: any): void {
    let studentToUpdate: any = { ...student };
    studentToUpdate.camin = null;
    studentToUpdate.etaj = null;
    studentToUpdate.camera = null;
    studentToUpdate.cazat = false;

    let caminToUpdate = { ...student.camin };
    caminToUpdate.locuriOcupate--;

    let cameraToUpdate: any;
    this.dataService.getSingleCamera(student.camera)
      .subscribe(
        (data) => {
          cameraToUpdate = data;
          cameraToUpdate.locuriOcupate--;
          this.dataService.updateCamera(cameraToUpdate.id, cameraToUpdate)
            .subscribe(
              () => {
                const cameraModificata = this.camerePeEtaje[student.etaj].find(
                  (camera) => student.camera === camera.numarCamera
                );
                const index = this.camerePeEtaje[student.etaj].indexOf(cameraModificata);
                this.camerePeEtaje[student.etaj][index].locuriOcupate--;
              },
              (error) => console.log(error)
            );
        },
        (error) => console.log(error)
      );


    // send to backend update requests with ToUpdate objects
    this.dataService.updateStudent(student.idStudent, studentToUpdate)
      .subscribe(
        () => {
          const index = this.studenti.indexOf(student);
          this.studenti.splice(index, 1);
        },
        (error) => console.log(error)
      );

    this.dataService.updateCamin(caminToUpdate.idCamin, caminToUpdate)
      .subscribe(
        () => {
          this.camin.locuriOcupate--;
        },
        (error) => console.log(error)
      );
  }

  constructor(
    private dataService: ApiCallBackendService
  ) { }

  ngOnInit(): void {
    this.dataService.getSingleCamin(this.idCamin).subscribe((data: any[]) => {
      this.camin = data;
    },
      error => () => {
        console.log("Eroare!" + error);
      }
    );

    this.dataService.getAllCameraByNumarCamin(this.idCamin)
      .subscribe(
        (data: any[]) => {
          this.toateCamerele = data;
          this.camerePeEtaje = [];
          for (let camera of this.toateCamerele) {
            if (!this.camerePeEtaje[camera.etaj]) {
              this.camerePeEtaje[camera.etaj] = [];
            }
            this.camerePeEtaje[camera.etaj].push(camera);
          }
        },
        error => () => {
          console.log("Eroare!" + error);
        }
      );

    this.dataService.getAllStudentsByCamin(this.idCamin)
      .subscribe(
        (data: any[]) => {
          this.studenti = data;
        },
        (error) => console.log(error)
      );

    this.dataService.getCereriByIdCamin(this.idCamin)
      .subscribe(
        (data: Cerere[]) => {
          this.cereri = data.filter((cerere) => cerere.status === PENDING_STATUS);
        },
        (error) => console.log(error)
      );
  }

  public studentiDinCamera(camera: any): any[] {
    return [...this.studenti.filter((student) => student.camera === camera.numarCamera)]
  }
}
