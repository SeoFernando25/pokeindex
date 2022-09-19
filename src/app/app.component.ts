import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { Component } from '@angular/core';
import { rotateCubeToLeft, fromLeftEasing, fromRightEasing } from "ngx-router-animations";
import { transition, trigger, useAnimation } from '@angular/animations';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('anyHome', [transition('* => home', useAnimation(fromLeftEasing))]),
    trigger('homeSearch', [transition('home => search', useAnimation(fromRightEasing))]),
    trigger('searchEntry', [transition('search => entry', useAnimation(fromRightEasing))]),
    trigger('entrySearch', [transition('entry => search', useAnimation(fromLeftEasing))]),
  ]
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
