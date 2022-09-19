import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pokemon } from 'pokenode-ts';
import { PokedexService } from 'src/app/services/pokedex.service';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent {
  pokemon: Pokemon | null = null;
  pokemonName: string;

  constructor(public pokedex: PokedexService, public router: Router) {
    // Get id string component from url entry/:id
    this.pokemonName = window.location.pathname.split('/')[2];
    this.pokedex.client.pokemon.getPokemonByName(this.pokemonName).then((pokemon: Pokemon) => {
      this.pokemon = pokemon;
      console.log(pokemon);
    }).catch((err: Error) => {
      console.log(err);
      if (err.message.includes('404')) {
        this.router.navigate(['/404']);
      }
    });

  }

}
