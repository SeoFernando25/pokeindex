import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'PokeIndex';

  constructor(public translate: TranslateService) {
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
}
