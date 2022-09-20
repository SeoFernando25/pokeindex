import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { stat } from 'fs';
import { Types } from 'pokenode-ts';
import { PokedexService } from 'src/app/services/pokedex.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  typeFilter: Set<string> = new Set();


  localFilteredPokemons: string[] = [];
  pokemonTypesList: string[] = [];

  constructor(public pokedex: PokedexService, public route: Router) {
    // Check if route has a query parameter -> search/:query
    let routeParts = this.route.url.split("/");
    // Check if last part is a not "search" and not empty
    if (routeParts[routeParts.length - 1] !== "search" && routeParts[routeParts.length - 1] !== "") {
      let routerSearchQuery = routeParts[routeParts.length - 1];
      routerSearchQuery = decodeURIComponent(routerSearchQuery);
      // Convert url to readable name using uridecode
      console.log("Searching for " + routerSearchQuery);
      this.pokedex.nameFilterPokemons(routerSearchQuery);
    }

    let types = Object.values(Types);
    // Filter only strings and convert to lowercase
    this.pokemonTypesList = types.filter((type) => typeof type === "string").map((type) => (type as string).toLowerCase());
    this.pokedex.filteredPokemons.subscribe((pokemons) => {
      this.localFilteredPokemons = pokemons;
      this.doFilter();
    });
  }

  randomPokemon() {
    console.log("Searching for random pokemon");
    let randomPokemon = this.pokedex.pokemonIdentifiers[Math.floor(Math.random() * this.pokedex.pokemonIdentifiers.length)];
    this.pokedex.nameFilterPokemons(randomPokemon);
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
    let res = this.pokedex.filteredPokemons.getValue();
    // Filter by type
    for (let type of this.typeFilter) {
      for (let pokemon of res) {
        if ((await this.getPokemonTypesByName(pokemon)).includes(type)) {
          res = res.filter((p) => p !== pokemon);
        }
      }
    }
    this.localFilteredPokemons = res;
    this.isSearching = false;
    if (this.searchReloadFlag) {
      this.searchReloadFlag = false;
      this.doFilter();
    }
  }

  isPrevQueryQuoted() {
    return this.pokedex.previousSearch.startsWith('"') && this.pokedex.previousSearch.endsWith('"');
  }

}
