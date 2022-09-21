import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Pokedex, Pokemon, PokemonSpecies } from 'pokenode-ts';
import { PokedexService } from 'src/app/services/pokedex.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-pokecard',
  templateUrl: './pokecard.component.html',
  styleUrls: ['./pokecard.component.scss']
})
export class PokecardComponent implements OnInit {

  @Input() pokemonName: string = "";
  displayNumber: number | null = null;

  pokemon: Pokemon | null = null;
  species: PokemonSpecies | null = null;
  cardColor = "#f5f5f5";

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

    switch (this.species?.color.name || "") {
      case "black":
        return "#2b1e21";
      case "brown":
        return "#322327";
      case "white":
        return "#f5f5f5";
      case "":
        return "#f5f5f5";
      default:
        return this.species?.color.name || "#f5f5f5";
    }
  }


}
