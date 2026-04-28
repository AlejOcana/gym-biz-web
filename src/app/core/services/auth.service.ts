import { Injectable, signal } from '@angular/core';

export interface AdminUser {
  username: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isAuthenticated = signal(false);
  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  private demoUser: AdminUser = {
    username: 'admin',
    password: 'admin123'
  };

  login(username: string, password: string): boolean {
    if (username === this.demoUser.username && password === this.demoUser.password) {
      this._isAuthenticated.set(true);
      localStorage.setItem('admin-auth', 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    this._isAuthenticated.set(false);
    localStorage.removeItem('admin-auth');
  }

  checkAuth(): void {
    const stored = localStorage.getItem('admin-auth');
    if (stored === 'true') {
      this._isAuthenticated.set(true);
    }
  }

  fillDemoCredentials(): { username: string; password: string } {
    return { username: this.demoUser.username, password: this.demoUser.password };
  }
}