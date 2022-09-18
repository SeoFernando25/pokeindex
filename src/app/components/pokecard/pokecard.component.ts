import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pokecard',
  templateUrl: './pokecard.component.html',
  styleUrls: ['./pokecard.component.scss']
})
export class PokecardComponent implements OnInit {
  public name = 'Unknown';

  constructor() { }

  ngOnInit(): void {
  }

}
