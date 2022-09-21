import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

// Assets taken from 
// https://github.com/duiker101/pokemon-type-svg-icons
@Component({
  selector: 'app-poketype',
  templateUrl: './poketype.component.html',
  styleUrls: ['./poketype.component.scss']
})
export class PoketypeComponent implements OnInit {
  @Input() pokemonType: string = "";

  constructor(public translate: TranslateService) {

  }

  ngOnInit(): void {
  }

}
