import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { last, Subscription } from 'rxjs';
import { PokeSearchService } from 'src/app/services/poke-search.service';
import { PokedexService } from 'src/app/services/pokedex.service';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.scss']
})
export class TitlebarComponent implements OnInit, OnDestroy {

  @ViewChild('searchInput') searchRef: ElementRef | null = null;
  public lastStrSize = 0;

  searchBarValue: string = "";
  routerSubscription: Subscription | undefined;


  constructor(public pokeSearch: PokeSearchService, public pokedex: PokedexService, public router: Router, public translate: TranslateService) {
    this.searchBarValue = localStorage.getItem("search") || this.pokeSearch.searchValue.getValue();
  }


  searchValueSubscription: Subscription | undefined;
  ngOnInit(): void {
    // this.searchValue = this.pokedex.identifierToReadableName(this.searchValue);
    // On press "/" focus on search bar
    document.addEventListener("keydown", this.searchBarKeyListenerBinded);
    document.addEventListener("scroll", this.scrollListenerBinded);
    this.searchValueSubscription = this.pokeSearch.searchValue.subscribe((results) => {
      // If searchBarValue is different from searchValue, update it
      if (this.searchBarValue !== results) {
        this.searchBarValue = results;
      }
    });
  }

  searchBarKeyListenerBinded = this.searchBarKeyListener.bind(this);
  searchBarKeyListener(event: any) {
    if (event.key === "/" && this.searchRef) {
      // window.scrollTo(0, 0); (This does not work on webKit)
      this.searchRef.nativeElement.scrollTop = 100;
      this.searchRef.nativeElement.focus();
    }
  }

  // Scroll variables
  lastScroll = 0;
  showNavBar = true;
  scrollListenerBinded = this.scrollListener.bind(this);
  scrollListener(event: any) {
    let scrollDiff = this.lastScroll - window.scrollY;
    this.lastScroll = window.scrollY;

    if (window.scrollY === 0 || scrollDiff > 0) {
      this.showNavBar = true;
    } else {
      this.showNavBar = false;
    }
  }



  ngOnDestroy(): void {
    document.removeEventListener("keydown", this.searchBarKeyListenerBinded);
    document.removeEventListener("scroll", this.scrollListenerBinded);
    if (this.searchValueSubscription) {
      this.searchValueSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }



  onKeyPress(event: KeyboardEvent) {
    let inp = event.key;

    // Only allow alphanumeric characters and spaces
    if (/[a-zA-Z0-9 \"]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  public onFocus() {
    // Scroll to top
    window.scrollTo(0, 0);
    window.scrollY = 0;
    if (!this.router.url.startsWith("/search")) {
      console.log("Redirecting to search"); // And add location hash
      this.router.navigate(["/search"]);
    }
  }

  public onInput(event: any) {
    this.onFocus();
    this.pokeSearch.searchValue.next(event.target.value as string);
  }

  public onSubmit() {
    console.log("Submitted");
    let pokemonsResult = this.pokeSearch.searchResults.getValue();
    // If there are no results, do nothing
    if (pokemonsResult.length === 0) {
      return;
    }
    // If there is more than one result, redirect to it
    this.router.navigate(["/pokemon", pokemonsResult[0]]);
  }
}
