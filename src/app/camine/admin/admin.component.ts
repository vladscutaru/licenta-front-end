import { Component, OnInit } from '@angular/core';
import { ApiCallBackendService } from 'app/api-call-backend.service';
import { Cerere, PENDING_STATUS, DENIED_STATUS, ACCEPTED_STATUS } from '../student/cerere.model';
import { ExcelFileManagerService } from './file-manager';

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
  camereDisponibile = [];
  camerePeEtaje: any[][];
  numarEtaje = [];
  deniedStatus = DENIED_STATUS;

  cereri: Cerere[];
  studenti: any[];

  constructor(
    private dataService: ApiCallBackendService,
    private readonly fileManager: ExcelFileManagerService
  ) { }

  updateRowCerere(cerere: Cerere, status: string): void {
    let cerereToUpdate: Cerere = { ...cerere };
    cerereToUpdate.status = status;

    this.dataService.updateCerere(cerere.id, cerereToUpdate)
      .subscribe(
        () => {
          const index = this.cereri.indexOf(cerere);
          this.cereri.splice(index, 1);
        },
        (error) => console.log(error)
      );
  }

  addStudentFromCerere(cerere: Cerere): void {
    //toate proprietatile din Student se gasesc si in Cerere
    let studentToUpdate: any = { ...cerere };
    studentToUpdate.cazat = true;

    let cameraToUpdate: any;
    this.dataService.getSingleCamera(studentToUpdate.camera)
      .subscribe(
        (data) => {
          cameraToUpdate = data;
          cameraToUpdate.locuriOcupate++;
          this.dataService.updateCamera(cameraToUpdate.id, cameraToUpdate)
            .subscribe(
              () => {
                const cameraModificata = this.camerePeEtaje[studentToUpdate.etaj].find(
                  (camera) => studentToUpdate.camera === camera.numarCamera
                );
                const index = this.camerePeEtaje[cameraToUpdate.etaj].indexOf(cameraModificata);
                this.camerePeEtaje[studentToUpdate.etaj][index].locuriOcupate++;
              },
              (error) => console.log(error)
            );

          studentToUpdate.etaj = cameraToUpdate.etaj;
          this.dataService.updateStudent(studentToUpdate.idStudent, studentToUpdate)
            .subscribe(
              () => {
                this.studenti.push(studentToUpdate);
                this.updateRowCerere(cerere, ACCEPTED_STATUS);
              },
              (error) => console.log(error)
            );
        },
        (error) => console.log(error)
      );

    let caminToUpdate = { ...studentToUpdate.camin };
    caminToUpdate.locuriOcupate++;
    this.dataService.updateCamin(caminToUpdate.idCamin, caminToUpdate)
      .subscribe(
        () => {
          this.camin.locuriOcupate++;
        },
        (error) => console.log(error)
      );
  }

  deleteRowStudent(student: any): void {
    let studentToUpdate: any = { ...student };
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
          this.camereDisponibile = this.toateCamerele.filter(camera => camera.locuriOcupate < camera.numarLocuri);
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
    return [...this.studenti.filter((student) => student.camera === camera.numarCamera && student.cazat)]
  }

  public getNumarStudentiCazatiInCamin(): number {
    return this.studenti.filter((student) => student.cazat).length;
  }

  //Export studenti in Excel
  public exportStudenti(): void {
    const listaStudenti = this.studenti
      .filter((student) => student.cazat)
      .sort((student1, student2) => {
        if (student1.prenume < student2.prenume) { return -1; }
        if (student2.prenume < student1.prenume) { return 1; }
        return 0;
      })
      .sort((s1, s2) => {
        if (s1.nume < s2.nume) { return -1; }
        if (s2.nume < s1.nume) { return 1; }
        return 0;
      })
      .map(
        (student) => this.convertStudentiToExportFormat(student)
      );

    this.fileManager.exportFile([listaStudenti], "raport_studenti");
  }

  private convertStudentiToExportFormat(student: any): any {
    let result = new Object;

    result["Nume"] = student.nume;
    result["Prenume"] = student.prenume;
    result["Cameră"] = student.camera.toString();
    if(student.etaj == 0) {
      result["Etaj"] = "Parter";
    }
    else result["Etaj"] = student.etaj.toString();
    
    result["Facultate"] = student.facultate;
    result["An de studii"] = student.an.toString();
    result["Oraș"] = student.oras;
    result["Județ"] = student.judet;
    result["Număr de telefon"] = student.telefon;
    result["Email"] = student.email;
    result["Orfan"] = student.orfan ? "Da": "Nu";
    result["Situație Socială Precară"] = student.situatieSocialaPrecara ? "Da": "Nu";
    result["Situație Medicală Specială"] = student.situatieMedicalaSpeciala ? "Da": "Nu";
    result["Arhivă"] = student.arhiva;

    return result;
  }

  //Export camere in Excel
  public exportCamere(): void {
    const listaCamere = this.toateCamerele
      .sort((camera1, camera2) => {
        if (camera1.numarCamera < camera2.numarCamera) { return -1; }
        if (camera2.numarCamera < camera1.numarCamera) { return 1; }
        return 0;
      })
      .map(
        (camera) => this.convertCamereToExportFormat(camera)
      );

    this.fileManager.exportFile([listaCamere], "raport_camere");
  }

  private convertCamereToExportFormat(camera: any): any {
    let result = new Object;

    result["Numărul camerei"] = camera.numarCamera;
    result["Etajul"] = camera.etaj;
    result["Numărul total de locuri"] = camera.numarLocuri;
    result["Numărul de locuri ocupate"] = camera.locuriOcupate;
    
    return result;
  }
}
