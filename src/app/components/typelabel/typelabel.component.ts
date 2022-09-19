import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-typelabel',
  templateUrl: './typelabel.component.html',
  styleUrls: ['./typelabel.component.scss']
})
export class TypelabelComponent implements OnInit {
  @Input() typeName: string = "Unknown";
  constructor() {

  }

  ngOnInit(): void {
    console.log(this.typeName.toLowerCase() as string);
  }

  colorFromTypeName() {
    let t = this.typeName.toLowerCase();
    // normal, fire, fighting, water, flying, grass, poison, electric, ground, psychic, rock, ice, bug, dragon, ghost, dark, steel, fairy, ???
    switch (t) {
      case "normal":
        return "bg-gray-300";
      case "fire":
        return "bg-red-500";
      case "fighting":
        return "bg-red-800";
      case "water":
        return "bg-blue-500";
      case "flying":
        return "bg-purple-500";
      case "grass":
        return "bg-green-500";
      case "poison":
        return "bg-purple-800";
      case "electric":
        return "bg-yellow-500";
      case "ground":
        return "bg-yellow-800";
      case "psychic":
        return "bg-pink-500";
      case "rock":
        return "bg-yellow-900";
      case "ice":
        return "bg-blue-200";
      case "bug":
        return "bg-green-800";
      case "dragon":
        return "bg-purple-200";
      case "ghost":
        return "bg-purple-600";
      case "dark":
        return "bg-gray-800";
      case "steel":
        return "bg-gray-500";
      case "fairy":
        return "bg-pink-200";
      case "???":
        return "bg-silver-500";
      default:
        return "bg-gray-300";
    }
  }
}