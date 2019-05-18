import { Component, OnInit } from '@angular/core';
import { ApiCallBackendService } from 'app/api-call-backend.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {

  idStudent = 11;
  student: any[];

  caminSelectat: any;
  cameraSelectata: any;
  camine = [];
  camere = [];

  constructor(
    private dataService: ApiCallBackendService
  ) { }

  ngOnInit(): void {
    this.dataService.getSingleStudent(this.idStudent).subscribe((data: any[]) => {
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
  }

  public selectCamin() {

    this.dataService.getAllCameraByNumarCamin(this.caminSelectat.numarCamin)
      .subscribe((data: any[]) => {
        this.camere = data;
      });
  }

  public selectCamera() {
    console.log(this.cameraSelectata, "CAMERA SELECTATA");
  }

  // submit()
  // {
  //   interface cereri {
  // bar: string;
  // baz: boolean;
  // idk: number;

  //   public addCerere<T>(cereri:any): Observable<T> {
  //     return this.http.post<T>(this.actionUrl+"cereri", cereri);
  //   }
  // }

  step = -1;
  setStep(index: number) { this.step = index; }
  nextStep() { this.step++; }
  prevStep() { this.step--; }
}
