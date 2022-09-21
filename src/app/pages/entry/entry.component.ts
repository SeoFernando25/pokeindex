import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Pokemon, PokemonSpecies } from 'pokenode-ts';
import { PokedexService } from 'src/app/services/pokedex.service';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements AfterViewChecked {
  @ViewChild('pokemonViewRef') pokemonViewRef: ElementRef | null = null;
  pokemon: Pokemon | null = null;
  pokemonSpecies: PokemonSpecies | null = null;
  eggGroups: string[] = [];
  pokemonName: string;


  constructor(public pokedex: PokedexService, public router: Router, public translate: TranslateService) {
    this.pokemonName = window.location.pathname.split('/')[2]; // It initially might be an id or a name
    this.pokedex.client.pokemon.getPokemonByName(this.pokemonName).then((pokemon: Pokemon) => {
      this.pokemon = pokemon;
      this.pokemonName = this.pokemon.name; // Update to proper name in case it was an id
      console.log(pokemon);

      this.pokedex.client.pokemon.getPokemonSpeciesByName(this.pokemon.species.name).then((species) => {
        this.pokemonSpecies = species;
        this.eggGroups = species.egg_groups.map((eggGroup) => pokedex.identifierToReadableName((eggGroup.name)));
      });

    }).catch((err: Error) => {
      console.log(err);
      if (err.message.includes('404')) {
        this.router.navigate(['/404']);
      }
    });

    // Scroll to top on load

  }

  initScroll: boolean = false;
  ngAfterViewChecked(): void {
    if (this.pokemonViewRef && !this.initScroll) {
      this.initScroll = true;
      window.scrollTo(0, this.pokemonViewRef.nativeElement.offsetTop);
      // this.pokemonViewRef.nativeElement.scrollTop = 100;
      // this.pokemonViewRef.nativeElement.scrollIntoView();
    }
  }

  getStatStr(statStr: string) {
    if (!this.pokemon) {
      return "?";
    }
    let stat = this.pokemon.stats.find((stat) => stat.stat.name === statStr);
    if (stat) {
      return stat.base_stat;
    }
    return "?";
  }

}
