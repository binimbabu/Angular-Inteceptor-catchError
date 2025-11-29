Interceptors are used where we want to put headers to every api calls. Giving headers for each api call is tidious, We want to manipulate the api calls before sending the api call ( http api will hit the network and goes to cloud environment and get the value from the backend) as a solution interceptors can be used. Iwhen we get response and we want to hadle to response with error code, then error codes can be handled by response headers using response interceptors. These interceptors can be used to intercept requests and responses.

Command to create interceptor and skip tests

 ng g interceptor basic –skip-tests

import { Injectable } from '@angular/core';
import {
HttpRequest,
HttpHandler,
HttpEvent,
HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class BasicInterceptor implements HttpInterceptor {

constructor() {}

intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>) {
return next.handle(request);
}
}




Basicinterceptor with interface  HttpInterceptor. HttpInterceptor gives an inbuilt function intercept is generated automatically.  ((request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>) type any is given it can accept request of any type and process and go forward. Because same interceptor will intercept for each http api calls hence of type ‘any’ is used. Http call going via the interceptor by configuring the app.module.ts like the below


providers: [
{provide: HTTP_INTERCEPTORS, useClass: BasicInterceptor, multi: true}
],




This line of code 

(const updatedRequest = request.clone({
setHeaders: {
Authorization : `Bearer Token`
}
})) 

is used to manipulate the http api request and then pass to the network tab.

import { Injectable } from '@angular/core';
import {
HttpRequest,
HttpHandler,
HttpEvent,
HttpInterceptor,
HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class BasicInterceptor implements HttpInterceptor {

constructor() {}


intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
const updatedRequest = request.clone({
setHeaders: {
Authorization : `Bearer Token`
}
})
return next.handle(updatedRequest);
}
}



In the response header in the network tab api call header will have 

Authorization : `Bearer Token`


This intercepts every http requests.



Calling error shown below. (in basicInterceptor)


import { Injectable } from '@angular/core';
import {
HttpRequest,
HttpHandler,
HttpEvent,
HttpInterceptor,
HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class BasicInterceptor implements HttpInterceptor {

constructor() {}


intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
const updatedRequest = request.clone({
setHeaders: {
Authorization : `Bearer Token`
}
})
return next.handle(updatedRequest).pipe(
catchError((err: HttpErrorResponse) =>{
console.log('Catch error', err);
if(err.status === 404) {
return throwError('URL not found');
}
return throwError('Something Went wrong');
})
);
}
}


Creating another interceptor logging

providers: [
{provide: HTTP_INTERCEPTORS, useClass: BasicInterceptor, multi: true},
{provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi:true}
],



first the ‘ BasicInterceptor’ is called then  ‘LoggingInterceptor’ is called. ‘LoggingInterceptor’ is used for consoling the request url.



import { Injectable } from '@angular/core';
import {
HttpRequest,
HttpHandler,
HttpEvent,
HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {

constructor() {}

intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
console.log(request.url, "URL Request");
return next.handle(request);
}
}





 What is an Interceptor in Angular?


An Interceptor in Angular is a class that intercepts HTTP requests and/or responses. You use it to:

Add headers (like authentication tokens)

Log requests or responses

Catch global HTTP errors

Modify requests before sending

Modify responses before they reach your component

It works automatically for all HttpClient requests once configured.

🔧 Real-World Example: Add an Authorization Header
📁 1. Create the Interceptor

ng generate interceptor auth
This generates a class like:

ts

import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // 1️⃣ Add fake token
    const authToken = 'Bearer FAKE_JWT_TOKEN';

    // 2️⃣ Clone the request and add the new header
    const authReq = req.clone({
      headers: req.headers.set('Authorization', authToken)
    });

    console.log('Intercepted request with header:', authReq);

    // 3️⃣ Pass modified request to the next handler
    return next.handle(authReq);
  }
}
🔄 Step-by-Step Explanation
Step	What It Does
HttpRequest	Represents the original HTTP request
clone()	Makes an exact copy of the request (because requests are immutable)
set()	Adds the Authorization header
next.handle()	Sends the modified request onward to the server

🧩 2. Register the Interceptor in app.module.ts
ts

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true // Allows multiple interceptors
    }
  ]
})
export class AppModule {}
📦 3. Making an HTTP Request
user.service.ts
ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get('https://jsonplaceholder.typicode.com/users');
  }
}
app.component.ts
ts

export class AppComponent implements OnInit {
  users: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUsers().subscribe(data => this.users = data);
  }
}
🔍 What Happens Behind the Scenes:
getUsers() makes an HTTP request.

The request is intercepted by AuthInterceptor.

The interceptor adds an Authorization header.

The request is sent to the API with the new header.

The response is received and returned to your component.









In Angular, Interceptors are part of the HttpClient module and allow you to intercept and modify HTTP requests and responses globally before they are handled by the HttpClient or returned to the app.

⭐ What Are Interceptors?

Angular HTTP interceptors are services that implement the HttpInterceptor interface. They can:

Add or modify HTTP request headers (e.g., attach JWT token)

Handle errors globally

Log request/response timing or data

Show/hide loaders

Modify the HTTP response

Retry failed requests

📌 How to Create an Interceptor
Step 1: Generate using Angular CLI
ng generate interceptor auth

Step 2: Implement the interceptor
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = 'sample-auth-token';

    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next.handle(modifiedReq);
  }
}

Step 3: Register in app.module.ts
providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }
]

⚠️ Error Handling in Interceptor
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

intercept(req: HttpRequest<any>, next: HttpHandler) {
  return next.handle(req).pipe(
    catchError(error => {
      console.error('Error occurred:', error);
      return throwError(() => error);
    })
  );
}

⏳ Adding a Loader Example
intercept(req: HttpRequest<any>, next: HttpHandler) {
  this.loaderService.show();
  return next.handle(req).pipe(
    finalize(() => this.loaderService.hide())
  );
}

🔁 Retry Failed Requests Example
import { retry } from 'rxjs/operators';

intercept(req: HttpRequest<any>, next: HttpHandler) {
  return next.handle(req).pipe(
    retry(2)  // retry 2 times if fails
  );
}

🧠 Summary
Term	Meaning
HttpInterceptor	A service that modifies HTTP requests/responses
intercept()	The main method that runs before the HTTP request
clone()	Used to safely edit immutable requests
next.handle()	Sends the modified request forward
