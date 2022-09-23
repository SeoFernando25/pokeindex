import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { getStringScores } from '../lib/stringComp';
import { PokedexService } from './pokedex.service';

@Injectable({
  providedIn: 'root'
})
export class PokeSearchService implements OnDestroy {
  public searchResults: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  public searching: boolean = false;
  public searchValue: BehaviorSubject<string>;

  pokemonIdentifierSub: Subscription;
  nameFilterSub: Subscription;
  ready = false;

  constructor(public pokedex: PokedexService) {
    this.searchValue = new BehaviorSubject<string>(localStorage.getItem("search") || "");
    this.pokemonIdentifierSub = this.pokedex.pokemonIdentifiers.subscribe((identifiers) => {
      this.ready = true;
      let cachedSearch = localStorage.getItem("search");
      if (cachedSearch) { // Initialize filteredPokemons
        this.nameFilterPokemon(cachedSearch);
      } else {
        this.searchResults.next(identifiers);

      }
    });

    this.nameFilterSub = this.searchValue.subscribe((val) => {
      this.nameFilterPokemon(val);
    });
  }
  ngOnDestroy(): void {
    this.pokemonIdentifierSub.unsubscribe();
    this.nameFilterSub.unsubscribe();
  }


  private nameFilterPokemon(name: string) {
    if (!this.ready) {
      console.log("Waiting for pokedex to be ready");
      return;
    }

    this.searching = true;
    this.implNameFilterPokemons(name);
    this.searching = false;
  }

  private implNameFilterPokemons(name: string) {
    console.log("Searching for " + name);
    let allPokemons = this.pokedex.pokemonIdentifiers.getValue();
    localStorage.setItem("search", name);
    if (name.length === 0) {
      this.searchResults.next(allPokemons);
      return;
    }

    // If the search is a number, return n-th pokemon
    if (!isNaN(Number(name))) {
      let index = Number(name) - 1;
      if (index < 0 || index >= allPokemons.length) {
        this.searchResults.next([]);
        return;
      }
      this.searchResults.next([allPokemons[index]]);
      return;
    }

    // If search string is quoted, search for contains match
    if (name.startsWith('"') && name.endsWith('"')) {
      name = name.slice(1, name.length - 1);
      this.searchResults.next(
        allPokemons.filter((pokemon) =>
          this.pokedex.identifierToReadableName(pokemon)
            .toLowerCase().includes(name.toLowerCase())));
      return;
    }


    let scores = getStringScores(name, allPokemons);

    let sortedScores = scores.map((score, index) => [score, index]).sort((a, b) => b[0] - a[0]);
    let res = sortedScores.map((score, _) => allPokemons[score[1]]);
    // Only show pokemons with a score of 0.5 or higher
    let result = [];
    for (let i = 0; i < res.length; i++) {
      if (sortedScores[i][0] >= 0.5) {
        result.push(res[i]);
      } else {
        break;
      }
    }

    this.searchResults.next(result);
  }
}
