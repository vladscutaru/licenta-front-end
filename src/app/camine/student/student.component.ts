import { Component, OnInit } from '@angular/core';
import { ApiCallBackendService } from 'app/api-call-backend.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {

  idStudent=11;
  student:any[];

  camine = ['3', '4', '5', '6', '7', '8', '9', '10'];
  camere = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
      
  constructor(
    private dataService: ApiCallBackendService
    ) {}

  ngOnInit():void
  {
    this.dataService.getSingleStudent(this.idStudent).subscribe((data: any[]) => 
    {this.student = data;
    },
    error => () => {
       console.log("Eroare!" + error);
    }
   );
    
   
  }

  // submit()
  // {
  //   creez structura cerere
  //   public addCerere<T>(cereri:any): Observable<T> {
  //     return this.http.post<T>(this.actionUrl+"cereri", cereri);
  //   }
  // }

  step = -1;
  setStep(index: number){this.step = index;}
  nextStep(){this.step++;}
  prevStep(){this.step--;}  
}
