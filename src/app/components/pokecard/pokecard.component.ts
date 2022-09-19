import { Component, Input, OnInit } from '@angular/core';
import { Pokedex } from 'pokenode-ts';
import { PokedexService } from 'src/app/services/pokedex.service';

@Component({
  selector: 'app-pokecard',
  templateUrl: './pokecard.component.html',
  styleUrls: ['./pokecard.component.scss']
})
export class PokecardComponent implements OnInit {
  public name = 'Unknown';
  @Input() pokemonName: string = "";

  constructor(public pokedex: PokedexService) { }

  ngOnInit(): void {
  }

}
