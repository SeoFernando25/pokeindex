import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Types } from 'pokenode-ts';
import { PokedexService } from 'src/app/services/pokedex.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  typeFilter: Set<string> = new Set();


  localFilteredPokemon: string[] = [];
  pokemonTypesList: string[] = [];

  constructor(public pokedex: PokedexService, public route: Router, public translate: TranslateService) {
    // Check if route has a query parameter -> search/:query
    let routeParts = this.route.url.split("/");
    // Check if last part is a not "search" and not empty
    if (routeParts[routeParts.length - 1] !== "search" && routeParts[routeParts.length - 1] !== "") {
      let routerSearchQuery = routeParts[routeParts.length - 1];
      routerSearchQuery = decodeURIComponent(routerSearchQuery);
      // Convert url to readable name using decodeURIComponent
      console.log("Searching for " + routerSearchQuery);
      this.pokedex.nameFilterPokemon(routerSearchQuery);
    }

    let types = Object.values(Types);
    // Filter only strings and convert to lowercase
    this.pokemonTypesList = types.filter((type) => typeof type === "string").map((type) => (type as string).toLowerCase());
    this.pokedex.filteredPokemon.subscribe((pokemons) => {
      this.localFilteredPokemon = pokemons;
      this.doFilter();
    });
  }

  randomPokemon() {
    console.log("Searching for random pokemon");
    let randomPokemon = this.pokedex.pokemonIdentifiers[Math.floor(Math.random() * this.pokedex.pokemonIdentifiers.length)];
    this.pokedex.nameFilterPokemon(randomPokemon);
    this.pokedex.previousSearch = randomPokemon;
    this.pokedex.nextSearchTask = randomPokemon;
    localStorage.setItem("search", randomPokemon);
    this.route.navigate(['/search', randomPokemon]);
  }

  onToggleTypeFilter(event: any, type: string) {
    let state = event.target.checked;
    if (!state) {
      this.typeFilter.add(type);
    } else {
      this.typeFilter.delete(type);
    }
    this.doFilter();
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
    let res = this.pokedex.filteredPokemon.getValue();
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
    let prevQuoted = this.pokedex.previousSearch.startsWith('"') && this.pokedex.previousSearch.endsWith('"');

    let nameToSuggest = this.pokedex.identifierToReadableName(this.localFilteredPokemon[0]);
    let inputBoxName = this.pokedex.previousSearch;

    // Check if: search is not quoted, search is not empty, search is not equal to the first pokemon in the list
    return this.pokedex.previousSearch.length !== 0 && !prevQuoted && nameToSuggest.toLowerCase() !== inputBoxName.toLowerCase();
  }

}
