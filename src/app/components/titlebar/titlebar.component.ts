import { ApplicationRef, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getStringScores } from 'src/app/lib/stringComp';
import { PokedexService } from 'src/app/services/pokedex.service';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.scss']
})
export class TitlebarComponent implements OnInit {
  public lastStrSize = 0;
  public searchValue: string = "";



  constructor(public pokedex: PokedexService, public router: Router) {
  }

  ngOnInit(): void {
    // Check if there is a hash in the url
    this.searchValue = localStorage.getItem("search") || "";
  }

  public onFocus() {
    // If not on /search, redirect to /search
    if (this.router.url !== "/search") {
      console.log("Redirecting to /search");
      this.router.navigate(["/search"]);
    }
  }

  public onInput(event: any) {
    this.pokedex.nameFilterPokemons(event.target.value as string);
  }
}
