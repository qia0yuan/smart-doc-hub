import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Card } from 'primeng/card';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Card],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.appInit();
  }

  appInit() {
    this.userService.setThemeBackground();
  }
}
