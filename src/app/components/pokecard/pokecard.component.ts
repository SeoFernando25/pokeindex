import { Component, Input, OnInit } from '@angular/core';
import { Pokemon, PokemonSpecies } from 'pokenode-ts';
import { PokedexService } from 'src/app/services/pokedex.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-pokecard',
  templateUrl: './pokecard.component.html',
  styleUrls: ['./pokecard.component.scss']
})
export class PokecardComponent implements OnInit {

  @Input() pokemonName: string = "";
  protected displayNumber: number | null = null;

  pokemon: Pokemon | null = null;
  species: PokemonSpecies | null = null;
  cardColor = "blue";

  constructor(public pokedex: PokedexService, public router: Router) {
  }

  ngOnInit(): void {
    this.pokedex.client.pokemon.getPokemonByName(this.pokemonName).then((pokemon) => {
      this.pokemon = pokemon;
      this.pokedex.client.pokemon.getPokemonSpeciesByName(this.pokemon.species.name).then((species) => {
        this.species = species;
        this.cardColor = this.pokemonColorToCSSColor();
      });
      this.getPokemonCardNumber().then((number) => {
        this.displayNumber = number;
      });
    });


  }

  onClick() {
    this.router.navigate(['/pokemon/', this.pokemonName]);
  }

  async getPokemonCardNumber(): Promise<number> {
    if (!this.pokemon) {
      return 0;
    }

    // If name != species.name, then it's a variant
    if (this.pokemon.name !== this.pokemon.species.name) {
      this.species = await this.pokedex.client.pokemon.getPokemonSpeciesByName(this.pokemon.species.name);
      return this.species.pokedex_numbers[0].entry_number;
    }

    return this.pokemon.id;
  }

  pokemonColorToCSSColor(): string {
    return this.species?.color.name || "white";
  }


}
