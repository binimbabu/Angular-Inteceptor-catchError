import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  http: HttpClient = inject(HttpClient);
  constructor(){
    this.http.get(`https://jsonplaceholder.typicode.com/comments`).subscribe((data:any)=>{
      console.log("Data", data);
    }, (err)=>{
      console.log("Error from ts file", err);
    })
  }
}
