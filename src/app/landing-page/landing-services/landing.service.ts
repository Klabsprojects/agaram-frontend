import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
@Injectable({
    providedIn: 'root'
})

export class landingService {

    // baseUrl = 'http://localhost:5500/api/';
    // fileUrl = 'http://localhost:5500/';
    fileUrl = 'https://agaram.a2zweb.in/backend/';
    baseUrl = 'https://agaram.a2zweb.in/v1/api/';

    constructor(private http: HttpClient) { }

    searchText = new BehaviorSubject<any>(null);
    searchText$ = this.searchText.asObservable();

    searchTextTransfer = new BehaviorSubject<any>(null);
    searchTextTransfer$ = this.searchTextTransfer.asObservable();

    pagginationSend = new BehaviorSubject<any>(null);
    pagginationSend$ = this.pagginationSend.asObservable();

    pagginationRecive = new BehaviorSubject<any>(null);
    pagginationRecive$ = this.pagginationRecive.asObservable();

    CallSearchTransfer(data:any){
        this.searchTextTransfer.next(data);
    }

    callSearch(data: any) {
        this.searchText.next(data);
    }

    handlePaginationSent(data: any) {
        this.pagginationSend.next(data);
    }

    handlePaginationRecive(data: any) {
        this.pagginationRecive.next(data);
    }

    getapicall(url: any) {
        return this.http.get<any>(`${this.baseUrl}${url}`);
    }

    postapicall(url: any, payload: any) {
        return this.http.post(url, payload);
    }
}