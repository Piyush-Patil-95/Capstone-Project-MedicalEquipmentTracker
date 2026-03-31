import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  showNavbar: boolean = true;
  roleName: string = '';
  IsLoggin: boolean = false;

  constructor(public authService: AuthService, private router: Router) {

    this.router.events
  .pipe(
    // Tell TypeScript that if this returns true, 'event' IS NavigationEnd
    filter((event): event is NavigationEnd => event instanceof NavigationEnd)
  )
  .subscribe((event) => { // 'event' is now automatically typed as NavigationEnd
    const hideRoutes = ['/login', '/registration'];
    this.showNavbar = !hideRoutes.some(r => event.urlAfterRedirects.startsWith(r));

    this.IsLoggin = this.authService.getLoginStatus;
    this.roleName = this.authService.getRole;
  });

  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}