import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Pokedex, Types } from 'pokenode-ts';
import { Subscription } from 'rxjs';
import { PokeSearchService } from 'src/app/services/poke-search.service';
import { PokedexService } from 'src/app/services/pokedex.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {

  typeFilter: Set<string> = new Set();


  localFilteredPokemon: string[] = [];

  // Pokemon shown increment
  defaultMaxShow = 20;
  showMoreTresh = 0.95;
  maxShow = 20;
  pokemonShownIncrement = 20;

  pokemonTypesList: string[] = [];

  constructor(
    public pokeSearch: PokeSearchService,
    public pokedex: PokedexService,
    public router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService,
    public snackbar: MatSnackBar
  ) {

    let types = Object.values(Types);
    // Filter only strings and convert to lowercase
    this.pokemonTypesList = types.filter((type) => typeof type === "string").map((type) => (type as string).toLowerCase());

  }



  private routeSub: Subscription | null = null;
  private pokeResultsSub: Subscription | null = null;
  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      let q = params['query'] // Get main route query
      if (q) {
        this.pokeSearch.searchValue.next(q);
      }
    });


    this.pokeResultsSub = this.pokeSearch.searchResults.subscribe((pokemons) => {
      this.maxShow = this.defaultMaxShow; // Reset max pokemon shown on search
      this.localFilteredPokemon = pokemons;
      this.doFilter();
    });
    document.addEventListener('scroll', () => this.onSearchScroll());
  }

  ngOnDestroy(): void {
    document.removeEventListener('scroll', () => this.onSearchScroll());
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.pokeResultsSub) {
      this.pokeResultsSub.unsubscribe();
    }
  }

  randomPokemon() {
    this.snackbar.open("Searching for a random pokemon...", "Dismiss", { duration: 1500 });
    let allPokemons = this.pokedex.pokemonIdentifiers.getValue();
    let randomPokemon = allPokemons[Math.floor(Math.random() * allPokemons.length)];
    this.pokeSearch.searchValue.next(randomPokemon);
    localStorage.setItem("search", randomPokemon);
  }

  onToggleTypeFilter(event: any, type: string) {
    let state = event.target.checked;
    if (!state) {
      this.typeFilter.add(type);
    } else {
      this.typeFilter.delete(type);
    }
    // this.doFilter(); TODO: Fix filters
  }

  async getPokemonTypesByName(pokemon: string): Promise<string[]> {
    let poke = await this.pokedex.client.pokemon.getPokemonByName(pokemon);
    return poke.types.map((type) => type.type.name);
  }

  isSearching = false;
  searchReloadFlag = false;
  async doFilter() {
    if (this.isSearching) {
      this.searchReloadFlag = true;
      return;
    }

    this.isSearching = true;
    // Initial name filter
    let res = this.pokeSearch.searchResults.getValue();
    // Filter by type
    for (let type of this.typeFilter) {
      for (let pokemon of res) {
        if ((await this.getPokemonTypesByName(pokemon)).includes(type)) {
          res = res.filter((p) => p !== pokemon);
        }
      }
    }
    this.localFilteredPokemon = res;
    this.isSearching = false;
    if (this.searchReloadFlag) {
      this.searchReloadFlag = false;
      this.doFilter();
    }
  }

  canShowSuggest() {
    let searchQ = this.pokeSearch.searchValue.getValue();
    let prevQuoted = searchQ.startsWith('"') && searchQ.endsWith('"');

    let nameToSuggest = this.pokedex.identifierToReadableName(this.localFilteredPokemon[0]);
    let suggestionEquals = nameToSuggest.toLowerCase() === searchQ.toLowerCase();

    // Check if: search is not quoted, search is not empty, search is not equal to the first pokemon in the list
    return searchQ.length !== 0 && !prevQuoted && !suggestionEquals;
  }

  onSearchScroll() {
    // Check if page is bellow tresh% of the page
    let scrollPercent = (document.documentElement.scrollTop + window.innerHeight) / document.documentElement.scrollHeight;
    if (scrollPercent > this.showMoreTresh) {
      // Load more pokemon
      this.maxShow += this.pokemonShownIncrement;
      this.doFilter();
    }
  }

  onSuggestionsClick() {
    this.pokeSearch.searchValue.next('"' + this.pokedex.identifierToReadableName(this.localFilteredPokemon[0]) + '"');
  }
}
