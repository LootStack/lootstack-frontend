import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Usuario } from '../models/usuario.models';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl:string = 'https://lootstack-api.onrender.com/api';
  private tokenKey:string = 'lootstack_token';

  constructor(private http:HttpClient, private router: Router){}

  public login(credentials: {login:string; senha_hash:string}): Observable<{token:string}> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => this.saveToken(response.token))
    );
  }

  public saveToken(token: string):void {
    localStorage.setItem(this.tokenKey, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public getDecoddedToken(): Usuario | null {
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

  public isLoggedIn(): boolean {
    return !!this.getToken();
  }

  public isAdmin(): boolean {
    const user = this.getDecoddedToken();
    return user ? user.perfil === 'ADMINISTRADOR' : false;
  }

  public logout():void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }
}
