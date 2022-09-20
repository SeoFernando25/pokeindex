import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoketypeCheckboxComponent } from './poketype-checkbox.component';

describe('PoketypeCheckboxComponent', () => {
  let component: PoketypeCheckboxComponent;
  let fixture: ComponentFixture<PoketypeCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoketypeCheckboxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoketypeCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
