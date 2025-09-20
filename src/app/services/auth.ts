import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { TokenPayload } from '../models/usuario.models';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl:string = 'https://lootstack-api.onrender.com/api';
  private tokenKey:string = 'lootstack_token';

  private platformId = inject(PLATFORM_ID);

  constructor(private http:HttpClient, private router: Router){}

  public login(credentials: {login:string; senha_hash:string}): Observable<{token:string}> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => this.saveToken(response.token))
    );
  }

  public saveToken(token: string):void {
    if(isPlatformBrowser(this.platformId)){
      localStorage.setItem(this.tokenKey, token);
    }
  }

  public getToken(): string | null {
    if(isPlatformBrowser(this.platformId)){
      return localStorage.getItem(this.tokenKey);
    }

    return null;
  }

  public getDecoddedToken(): TokenPayload | null {
    const token = this.getToken();
    if(token) {
      try {
        return jwtDecode(token)
      } catch(error) {
        return null;
      }
    }
    return null;
  }

  public isTokenExpired():boolean {
    const decoded = this.getDecoddedToken();
    if(!decoded) return true;
    if(!decoded.exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  }

  public isLoggedIn(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }

  public isAdmin(): boolean {
    const user = this.getDecoddedToken();
    return user ? user.perfil === 'ADMINISTRADOR' : false;
  }

  public logout():void {
    if(isPlatformBrowser(this.platformId)){
      localStorage.removeItem(this.tokenKey);
    }
    this.router.navigate(['/login']);
  }
}
