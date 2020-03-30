
import {MediaMatcher} from '@angular/cdk/layout';
import {Router} from '@angular/router';
import {OnInit,ChangeDetectorRef, Component, OnDestroy} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';


mobileQuery: MediaQueryList;
private _mobileQueryListener: () => void;
constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,private router: Router) {
  this.mobileQuery = media.matchMedia('(max-width: 600px)');
  this._mobileQueryListener = () => changeDetectorRef.detectChanges();
  this.mobileQuery.addListener(this._mobileQueryListener);
}

ngOnInit() {
}

ngOnDestroy(): void {
  this.mobileQuery.removeListener(this._mobileQueryListener);
}
logout() {
  localStorage.removeItem('token');
  this.router.navigate(['login']);
}
}