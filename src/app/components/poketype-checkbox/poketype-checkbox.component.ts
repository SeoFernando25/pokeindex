import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-poketype-checkbox',
  templateUrl: './poketype-checkbox.component.html',
  styleUrls: ['./poketype-checkbox.component.scss']
})
export class PoketypeCheckboxComponent implements AfterViewInit {
  @Input() pokemonType: string = "";
  @Input() isChecked: boolean = false;
  @ViewChild('label') label!: ElementRef<SVGElement>;


  constructor() { }


  ngAfterViewInit() {
    if (this.isChecked) {
      this.label.nativeElement.classList.add('checked');
    }
  }

  onClick() {
    this.isChecked = !this.isChecked;
    this.label.nativeElement.classList.toggle('checked');
  }

}
