import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    test: Date = new Date();
    focus;
    focus1;
    username = "blabla";
    password = "";

    constructor(private router: Router) { }

    login() {
        //if (this.username == 'vlad-iulian.scutaru@student.unitbv.ro' && this.password == 'student1') {
        this.router.navigate(['student']);
        //}
    }

}
