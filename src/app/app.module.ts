// Base
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Components
import { TitlebarComponent } from './components/titlebar/titlebar.component';

// Pages
import { IndexComponent } from './pages/index/index.component';
import { FallbackComponent } from './pages/fallback/fallback.component';

// Material UI
import { MaterialModule } from './external/material.module';

// Translation
// https://ramya-bala221190.medium.com/using-ngx-translate-to-switch-the-language-of-a-form-in-your-angular-application-d3e2ebd469d7
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LocaleToggleComponent } from './components/locale-toggle/locale-toggle.component';
import { SearchComponent } from './pages/search/search.component';
import { PokecardComponent } from './components/pokecard/pokecard.component';
import { EntryComponent } from './pages/entry/entry.component';
import { TypelabelComponent } from './components/typelabel/typelabel.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    TitlebarComponent,
    IndexComponent,
    FallbackComponent,
    LocaleToggleComponent,
    SearchComponent,
    PokecardComponent,
    EntryComponent,
    TypelabelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
