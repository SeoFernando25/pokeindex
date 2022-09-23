import { Injectable } from '@angular/core';
import { MainClient } from "pokenode-ts";
import { getStringScores } from '../lib/stringComp';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class PokedexService {
  public readonly client = new MainClient();
  public pokemonIdentifiers: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);


  constructor(public snackbar: MatSnackBar) {
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
    let storagePokemon = localStorage.getItem('pokemonNames');
    if (storagePokemon) {
      let loadedPokemon = JSON.parse(storagePokemon) as string[];
      this.pokemonIdentifiers.next(loadedPokemon);
      this.snackbar.open("Loaded pokemon from local storage", "Dismiss", { duration: 3000 });
      return;
    }

    // If not, load them from the API
    this.snackbar.open("Loading pokemon from server", "Dismiss", { duration: 3000 });
    try {
      let pokemonResponse = await this.client.pokemon.listPokemons(0, Number.MAX_SAFE_INTEGER);
      let pokemonList: string[] = pokemonResponse.results.map((pokemon) => pokemon.name);
      // The pokemons with largest identifier are about 20 characters long (24 bytes)
      // given that we have about 1200 pokemons, we only have to transfer ~24kb initially

      // Save pokemon names to localStorage
      this.pokemonIdentifiers.next(pokemonList);
      localStorage.setItem('pokemonNames', JSON.stringify(pokemonList));
    } catch (err) {
      this.snackbar.open("Something went wrong! Please refresh the page or check the console for extra information", "Dismiss", { duration: 3000 });
      console.error(err);
    }
    this.snackbar.open("Loaded pokemon from server", "Dismiss", { duration: 3000 });
  }

}
