import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashbaord',
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.scss']
})
export class DashbaordComponent {
  // showModal = false;

  constructor(private router: Router) {}

  scrollTo(section: string) {
  document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
}

goDashboard() {
  this.router.navigate(['/dashboard']);
}

goRegister() {
  this.router.navigate(['/registration']);
}

goLogin() {
  this.router.navigate(['/login']);
}
}
