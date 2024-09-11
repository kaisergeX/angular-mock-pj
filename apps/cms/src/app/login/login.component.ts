import { Component, inject, type OnInit } from '@angular/core';
import { StorageService } from '~/services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  storage = inject(StorageService);

  ngOnInit(): void {
    this.storage.set('username', 'admin');
    console.log(this.storage.getAll());
    this.storage.clear();
  }
}
