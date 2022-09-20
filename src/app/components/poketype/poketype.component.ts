import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

// Assets taken from 
// https://github.com/duiker101/pokemon-type-svg-icons
@Component({
  selector: 'app-poketype',
  templateUrl: './poketype.component.html',
  styleUrls: ['./poketype.component.scss']
})
export class PoketypeComponent implements OnInit {
  @Input() pokemonType: string = "";

  constructor() {

  }

  ngOnInit(): void {
  }

}
