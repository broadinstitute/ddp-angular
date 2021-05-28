import { TestBed } from '@angular/core/testing';
import { SessionStorageService } from './sessionStorage.service';

describe('SessionStorageService', () => {
    let service: SessionStorageService;
    let sessionStorageMock: Storage;

    const sessionItem = 'sessionResult';
    beforeEach(() => {
        sessionStorageMock = {
            getItem: jasmine.createSpy('getItem').and.returnValue(sessionItem),
            setItem: jasmine.createSpy('setItem'),
            removeItem: jasmine.createSpy('removeItem'),
            clear: jasmine.createSpy('clear'),
        } as unknown as Storage;
        const windowRefMock = { nativeWindow: { sessionStorage: sessionStorageMock } };

        TestBed.configureTestingModule({
            providers: [SessionStorageService]
        });
        service = new SessionStorageService(windowRefMock);
    });

    it('should create service', () => {
        expect(service).toBeTruthy();
    });

    it('should get the item from the storage', () => {
        const key = 'some_key';
        const result = service.get(key);
        expect(sessionStorageMock.getItem).toHaveBeenCalledWith(key);
        expect(result).toBe(sessionItem);
    });

    it('should set the item in the storage', () => {
        const key = 'some_key';
        const value = 'some_value';
        service.set(key, value);
        expect(sessionStorageMock.setItem).toHaveBeenCalledWith(key, value);
    });

    it('should remove the item from the storage', () => {
        const key = 'some_key';
        service.remove(key);
        expect(sessionStorageMock.removeItem).toHaveBeenCalledWith(key);
    });

    it('should clear the storage', () => {
        service.clear();
        expect(sessionStorageMock.clear).toHaveBeenCalled();
    });
});
