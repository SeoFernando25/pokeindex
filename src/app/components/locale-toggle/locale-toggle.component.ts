import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-locale-toggle',
  templateUrl: './locale-toggle.component.html',
  styleUrls: ['./locale-toggle.component.scss']
})
export class LocaleToggleComponent implements OnInit {
  availableLanguages: string[] = ["en"];
  currentLanguage = "en";

  constructor(public translate: TranslateService) {

  }
  ngOnInit(): void {
    const browserLang = localStorage.getItem('lang');
    if (browserLang && this.translate.getLangs().includes(browserLang)) {
      this.currentLanguage = browserLang;
    }

  }

  /**
   * Gets the index of the current language and changes it to the next one provided by translate.getLangs()
   */
  changeLanguage() {
    const index = this.translate.getLangs().indexOf(this.currentLanguage);
    const nextIndex = index + 1 < this.translate.getLangs().length ? index + 1 : 0;
    this.currentLanguage = this.translate.getLangs()[nextIndex];
    localStorage.setItem('lang', this.currentLanguage);
    this.translate.use(this.currentLanguage);
  }


}
