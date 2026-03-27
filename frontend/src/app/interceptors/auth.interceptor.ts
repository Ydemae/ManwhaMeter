import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from '../services/auth/auth.service';
import { catchError, switchMap, throwError } from "rxjs";

const PUBLIC_ROUTES = [
    '/auth/refresh',
    '/auth/login',
    '/user/create',
    '/registerInvite/isUsed',
    '/user/username_exists'
];

function isPublicRoute(url: string): boolean {
    return PUBLIC_ROUTES.some(route => url.includes(route));
}

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {

    //Skip public routes
    if (isPublicRoute(req.url)) {
        return next(req);
    }

    const authService = inject(AuthService)
    const accessToken = authService.getAccessToken();


    if (accessToken != null) {
    const newReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
    });

    return next(newReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                return authService.refreshAccessToken().pipe(
                    switchMap((newToken) => {
                    const retryReq = req.clone({
                        headers: req.headers.set('Authorization', `Bearer ${newToken}`),
                    });
                    return next(retryReq);
                    }),
                    catchError(() => {
                    authService.forcedLogout();
                    return throwError(() => error);
                    })
                );
            }
            else if (error.status === 403){
                authService.unauthorizedRedrect();
            }
            return throwError(() => error);
        })
        );
    } else {
        authService.forcedLogout();
        return throwError(() => new Error('No access token'));
    }
}