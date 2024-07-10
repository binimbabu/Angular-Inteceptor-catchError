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

