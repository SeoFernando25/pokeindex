import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  title = 'PokeIndex';

  constructor(public translate: TranslateService, private contexts: ChildrenOutletContexts) {
    // Initial Locale setup
    translate.setDefaultLang('en');
    translate.addLangs(['en', 'fr']);

    // Check if "lang" is in localStorage
    const browserLang = localStorage.getItem('lang');
    if (browserLang) {
      translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
    } else {
      translate.use('en');
      localStorage.setItem('lang', 'en');
    }
  }

  getState(outlet: RouterOutlet) {
    return outlet.activatedRouteData['state'];
  }
}
