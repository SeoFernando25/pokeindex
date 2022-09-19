import { Component, OnInit } from '@angular/core';
import { PokedexService } from 'src/app/services/pokedex.service';

import { rotateCubeToLeft } from "ngx-router-animations";
import { transition, trigger, useAnimation } from '@angular/animations';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {

  constructor(public pokedex: PokedexService) { }

  ngOnInit(): void {
  }

}
