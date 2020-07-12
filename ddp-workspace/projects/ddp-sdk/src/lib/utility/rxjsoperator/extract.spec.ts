import { Observable, of, Subject } from 'rxjs';
import { extract } from './extract';


describe('Custom extract operator', () => {

    beforeAll(() => { });

    it('basic pluck', () => {
        const state = of({ hello: 'aloha' });
        state.pipe(extract('hello')).subscribe(val => expect(val).toBe('aloha'));
    });

    it('check distinct works', () => {
        interface Greeting {
            hello: string;
        }
        const state = new Subject<Greeting>();
        let count = 0;
        state.pipe(extract('hello')).subscribe(() => {
            ++count;
        });
        state.next({ hello: 'aloha' });
        state.next({ hello: 'aloha' });
        state.next({ hello: 'hola' });
        state.next({ hello: 'hola' });
        expect(count).toBe(2);
    });

    it('check distinct off works', () => {
        interface Greeting {
            hello: string;
        }
        const state = new Subject<Greeting>();
        let count = 0;
        state.pipe(extract('hello', { onlyDistinct: false })).subscribe(() => {
            ++count;
        });
        state.next({ hello: 'aloha' });
        state.next({ hello: 'aloha' });
        state.next({ hello: 'hola' });
        state.next({ hello: 'hola' });
        expect(count).toBe(4);
    });

    it('check distinct on works with objects', () => {
        interface Greeting {
            hello: string;
            goodbye: string;
        }
        const state = new Subject<Greeting>();
        let count = 0;
        const greeting$: Observable<string> = state.pipe(extract('hello', { onlyDistinct: true }));
        greeting$.subscribe(() => {
            ++count;
        });
        state.next({ hello: 'aloha', goodbye: 'aloha' });
        state.next({ hello: 'aloha', goodbye: 'aloha' });
        state.next({ hello: 'hola', goodbye: 'adios' });
        state.next({ hello: 'hola', goodbye: 'adios' });
        expect(count).toBe(2);
    });

    it('check distinct off works with objects', () => {
        interface Greeting {
            hello: string;
            goodbye: string;
        }
        const state = new Subject<Greeting>();
        let count = 0;
        state.pipe(extract('hello', { onlyDistinct: false })).subscribe(() => {
            ++count;
        });
        state.next({ hello: 'aloha', goodbye: 'aloha' });
        state.next({ hello: 'aloha', goodbye: 'aloha' });
        state.next({ hello: 'hola', goodbye: 'adios' });
        state.next({ hello: 'hola', goodbye: 'adios' });
        expect(count).toBe(4);
    });

    it('check using projection function works', () => {
        interface Greeting {
            hello: string;
            goodbye: string;
        }
        const state: Observable<Greeting> = of({ hello: 'aloha', goodbye: 'aloha' });
        state.pipe(extract(greeting => greeting['goodbye'] + 's', { onlyDistinct: false })).subscribe(val => {
            expect(val).toBe('alohas');
        });
    });

    it('check using projection function works', () => {
        interface State {
            readOnly: boolean;
            temporarilyDisabled: boolean;
            name: string;
        }
        const state: Observable<State> = of({ readOnly: false, temporarilyDisabled: true, name: 'rapunzel' });
        const disabled$: Observable<boolean> = state.pipe(
            extract(stat => stat.readOnly && stat.temporarilyDisabled, { onlyDistinct: false }));
        disabled$.subscribe(val => expect(val).toBe(false));
    });
});
