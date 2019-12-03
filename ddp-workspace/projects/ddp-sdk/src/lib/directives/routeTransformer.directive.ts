import { Directive, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
    selector: '[routeTransformer]'
})
/**
 * When applied, this directive will convert a "regular" anchor tag into one that behaves like
 * it is using the routerlink Angular directive. Without applying this directive, clicking on the
 * anchor tag will force a reload of the application, even if the path is relative. This directive
 * will capture the click and follow the given href using the Angular router.
 */
export class RouteTransformerDirective {
    constructor(private router: Router) { }

    @HostListener('click', ['$event'])
    public onClick(event): void {
        if (event.target.tagName === 'A') {
            const targetUrl: string = event.target.getAttribute('href');
            if (targetUrl && targetUrl[0] === '/') {
                this.router.navigate([targetUrl]);
                event.preventDefault();
            }
        }
        return;
    }
}
