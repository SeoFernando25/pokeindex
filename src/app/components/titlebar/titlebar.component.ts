import { AfterViewChecked, ApplicationRef, ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { getStringScores } from 'src/app/lib/stringComp';
import { PokedexService } from 'src/app/services/pokedex.service';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.scss']
})
export class TitlebarComponent implements OnInit {
  @ViewChild('searchInput') searchRef: ElementRef | null = null;
  public lastStrSize = 0;
  public searchValue: string = "";



  constructor(public pokedex: PokedexService, public router: Router) {
  }

  ngOnInit(): void {
    // Check if there is a hash in the url
    this.searchValue = localStorage.getItem("search") || "";
    // On press "/" focus on search bar
    document.addEventListener("keydown", (event) => {
      if (event.key === "/" && this.searchRef) {
        window.scrollTo(0, 0);
        this.searchRef.nativeElement.focus();
        // Remove the last character from the search bar
        // HACK: For some reason, even after returning false, the mat-input still consumes the "/" character
        setTimeout(() => {
          if (this.searchRef) {
            this.searchRef.nativeElement.value = this.searchRef.nativeElement.value.slice(0, -1);
          }
        }, 0);
      }
    });

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

  public onSubmit() {
    console.log("Submitted");
    let pokemonsResult = this.pokedex.filteredPokemons.getValue();
    // If there are no results, do nothing
    if (pokemonsResult.length === 0) {
      return;
    }
    // If there is more than one result, redirect to it
    this.router.navigate(["/pokemon", pokemonsResult[0]]);
  }
}
