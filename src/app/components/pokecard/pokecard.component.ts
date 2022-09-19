import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Pokedex, Pokemon } from 'pokenode-ts';
import { PokedexService } from 'src/app/services/pokedex.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-pokecard',
  templateUrl: './pokecard.component.html',
  styleUrls: ['./pokecard.component.scss']
})
export class PokecardComponent implements OnInit {

  @Input() pokemonName: string = "";
  pokemon: Pokemon | null = null;


  constructor(public pokedex: PokedexService, public router: Router) {
  }

  ngOnInit(): void {
    this.pokedex.client.pokemon.getPokemonByName(this.pokemonName).then((pokemon) => {
      this.pokemon = pokemon;
    });
  }

  onClick() {
    console.log("Clicked on " + this.pokemonName);
    this.router.navigate(['/pokemon/', this.pokemonName]);
  }


}
