import { Component, OnInit } from '@angular/core';
import { SelectMultipleControlValueAccessor } from '@angular/forms';
import { ApiCallBackendService } from 'app/api-call-backend.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  numbers = [];
  idCamin = 3;
  camin: any[];
  toateCamerele: any[];
  camerePeEtaje: any[][];
  numarEtaje = [];

  camere: any[];
  camereEtaje: any[][];

  studenti: any[];

  deleteRow(studenti) {
    const index = this.studenti.indexOf(studenti);
    this.studenti.splice(index, 1);
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

    this.dataService.getAllCameraByNumarCamin(this.idCamin).subscribe((data: any[]) => {
    this.toateCamerele = data;
      this.camerePeEtaje = [];
      for (let camera of this.toateCamerele) {
        if (!this.camerePeEtaje[camera.etaj]) {
          this.camerePeEtaje[camera.etaj] = [];
        }
        this.camerePeEtaje[camera.etaj].push(camera);
      }
      console.log(this.toateCamerele);
      console.log(this.camerePeEtaje);
    },
      error => () => {
        console.log("Eroare!" + error);
      }
    );

    //  this.dataService.getAllStudentsByCamin(this.idCamin).subscribe((data: any[]) => 
    //  {this.toateCamerele = data;
    //   this.camerePeEtaje=[];
    //   for(let camera of this.toateCamerele){
    //     if(!this.camerePeEtaje[camera.etaj]){
    //       this.camerePeEtaje[camera.etaj]=[];
    //     }
    //     this.camerePeEtaje[camera.etaj].push(camera);
    //   }
    //   console.log(this.toateCamerele);
    //   console.log(this.camerePeEtaje);
    //  },
    //  error => () => {
    //     console.log("Eroare!" + error);
    //  }
    //  );

  }

}
