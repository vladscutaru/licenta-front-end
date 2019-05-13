import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent 
{
    test : Date = new Date();
    focus;
    focus1;
    username:string;
    password:string;

    login()
    {
        if(this.username == 'Admin' && this.password == 'admin')
        {
            console.log("Welcome");
        }
    }

}
