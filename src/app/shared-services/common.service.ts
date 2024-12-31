import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })

export class CommonService {
    private dataKey = 'userData'; // Key for localStorage
    private dataSubject = new BehaviorSubject<any | null>(this.getDataFromLocalStorage());

    // Observable for other components to subscribe to
    data$ = this.dataSubject.asObservable();

    constructor() { }

    // Save data to both BehaviorSubject and localStorage
    setData(data: any): void {
        localStorage.setItem(this.dataKey, data);
        data = JSON.parse(data);
        this.dataSubject.next(data);
    }

    // Retrieve data from localStorage during service initialization
    private getDataFromLocalStorage(){
        const storedData = localStorage.getItem(this.dataKey);
        return storedData ? JSON.parse(storedData) : null;
    }

    // Clear data from BehaviorSubject and localStorage
    clearData(): void {
        this.dataSubject.next(null);
        localStorage.removeItem(this.dataKey);
    }
}