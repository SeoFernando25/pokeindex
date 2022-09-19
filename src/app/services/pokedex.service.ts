import { Injectable } from '@angular/core';
import { MainClient } from "pokenode-ts";
import { getStringScores } from '../lib/stringComp';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PokedexService {
  public readonly client = new MainClient();
  public pokemonIdentifiers: string[] = [];

  public filteredPokemons: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  public previousSearch: string = "";
  public nextSearchTask: string | null = null;
  public searching: boolean = false;
  private lastStrSize = 0;

  constructor() {
    this.initPokemonNames();
  }

  /**
   * Returns the pokemon identified by the given name
   * @param name 
   * @returns the pokemon name with spaces replaced with dashes and all lowercase 
   */
  public readableNameToIdentifier(name: string) {
    return name.toLowerCase().split(' ').join('-');
  }

  /**
   * Returns a readable name from a pokemon identifier
   * @param name
   * @returns the pokemon's readable name
    */
  public identifierToReadableName(identifier: string) {
    // replace dashes with spaces and capitalize each word
    return identifier.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  public async initPokemonNames() {
    // Check if 'pokemonNames' is in local storage
    try {
      this.pokemonIdentifiers = JSON.parse(localStorage.getItem('pokemonNames') || "}{");
      this.filteredPokemons.next(this.pokemonIdentifiers);
      console.log("Pokemon names loaded from local storage");
      this.nameFilterPokemons(localStorage.getItem("search") || "Charizard"); // Initialize filteredPokemons
      return;
    } catch (error) {
      console.log("Error loading pokemon names from local storage");
    }

    // If not, load them from the API
    let pokemons = await this.client.pokemon.listPokemons(0, Number.MAX_SAFE_INTEGER);
    // The pokemons with largest identifier are about 20 characters long (24 bytes)
    // given that we have about 1200 pokemons, we only have to transfer ~24kb initially


    // Save readable pokemon names to localStorage
    this.pokemonIdentifiers = pokemons.results.map((pokemon) => pokemon.name);
    localStorage.setItem('pokemonNames', JSON.stringify(this.pokemonIdentifiers));
    console.log("Pokemon names saved to local storage");
    this.filteredPokemons.next(this.pokemonIdentifiers);
    this.nameFilterPokemons(localStorage.getItem("search") || "Charizard"); // Initialize filteredPokemons
  }

  public nameFilterPokemons(name: string) {
    if (this.searching) {
      console.log("Already searching");
      this.nextSearchTask = name;
    } else {
      console.log("Starting search");
      this.searching = true;
      this.implNameFilterPokemons(name).then(() => {
        this.searching = false;
        if (this.nextSearchTask !== null) {
          this.implNameFilterPokemons(this.nextSearchTask);
          this.nextSearchTask = null;
        } else {
          console.log("No more tasks");
        }
      });
    }
  }

  public async implNameFilterPokemons(name: string) {
    localStorage.setItem("search", name);
    if (name.length === 0) {
      return;
    }

    this.lastStrSize = name.length;


    localStorage.setItem("search", name);

    let pokemons = this.pokemonIdentifiers;
    let scores = await getStringScores(name, pokemons);
    let sortedScores = scores.map((score, index) => [score, index]).sort((a, b) => b[0] - a[0]);
    let res = sortedScores.map((score, _) => pokemons[score[1]]);
    // Only show pokemons with a score of 0.5 or higher
    let result = [];
    for (let i = 0; i < res.length; i++) {
      if (sortedScores[i][0] >= 0.25) {
        result.push(res[i]);
      } else {
        break;
      }
    }
    this.filteredPokemons.next(result);
    // console.log(sortedScores);
  }
}
