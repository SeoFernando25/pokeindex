import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PokedexService } from 'src/app/services/pokedex.service';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.scss']
})
export class TitlebarComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchRef: ElementRef | null = null;
  public lastStrSize = 0;
  public searchValue: string = "";

  routerSubscription: Subscription | undefined;


  constructor(public pokedex: PokedexService, public router: Router, public translate: TranslateService) {
  }

  ngOnInit(): void {
    // Check if there is a hash in the url
    this.searchValue = localStorage.getItem("search") || "";
    // On press "/" focus on search bar
    document.addEventListener("keydown", (event) => {
      if (event.key === "/" && this.searchRef) {
        // window.scrollTo(0, 0); (This does not work on webKit)
        this.searchRef.nativeElement.scrollTop = 100;
        this.searchRef.nativeElement.focus();
        this.searchValue = "";

        // Remove the last character from the search bar
        // HACK: For some reason, even after returning false, the mat-input still consumes the "/" character
        setTimeout(() => {
          if (this.searchRef) {
            this.searchRef.nativeElement.value = this.searchRef.nativeElement.value.slice(0, -1);
            this.searchRef.nativeElement.select();
          }
        }, 0);
      }
    });
  }

  ngAfterViewInit(): void {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Reload the search bar text in case any changes were made
        this.searchValue = localStorage.getItem("search") || this.pokedex.previousSearch;
        this.searchValue = this.pokedex.identifierToReadableName(this.searchValue);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  public onFocus() {
    // If not on /search, redirect to /search
    if (this.router.url !== "/search") {
      this.router.navigate(["/search"]);
    }
  }

  public onInput(event: any) {
    this.pokedex.nameFilterPokemon(event.target.value as string);
  }

  public onSubmit() {
    console.log("Submitted");
    let pokemonsResult = this.pokedex.filteredPokemon.getValue();
    // If there are no results, do nothing
    if (pokemonsResult.length === 0) {
      return;
    }
    // If there is more than one result, redirect to it
    this.router.navigate(["/pokemon", pokemonsResult[0]]);
  }
}
