import { WindowRef } from './windowRef';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SessionStorageService {
    private sessionStorage: Storage;
    constructor(private windowRef: WindowRef) {
        this.sessionStorage = this.windowRef.nativeWindow.sessionStorage;
    }

    get(key: string): string {
        return this.sessionStorage.getItem(key);
    }

    set(key: string, value: string): void {
        this.sessionStorage.setItem(key, value);
    }

    remove(key: string): void {
        this.sessionStorage.removeItem(key);
    }

    clear(): void {
        this.sessionStorage.clear();
    }
}
