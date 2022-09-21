import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-poketype-checkbox',
  templateUrl: './poketype-checkbox.component.html',
  styleUrls: ['./poketype-checkbox.component.scss']
})
export class PoketypeCheckboxComponent {
  @Input() pokemonType: string = "";
  @Input() isChecked: boolean = false;

  constructor(public translate: TranslateService) { }
}
