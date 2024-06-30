import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseUIModule } from 'firebaseui-angular';
import { AuthentificationService } from '../../services/authentification.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FirebaseUIModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private router: Router, private auth: AuthentificationService) { }

  ngOnInit() {
    // If the user is already connected, forward to the menu page
    this.auth.getUserId().pipe(first()).subscribe(user => {
      console.log("user UID", user);
      if (user) {
        return this.router.navigate(["week"]);
      }
    });

  }

  successCallback(d: any) {
    console.log("user connected", d);
    return this.router.navigate(["week"]);
  }
  errorCallback(d: any) {
    console.log("user connection error", d);
  }
  uiShownCallback() {
    console.log("user connection ui shown");
  }

}
