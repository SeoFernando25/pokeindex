import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoketypeComponent } from './poketype.component';

describe('PoketypeComponent', () => {
  let component: PoketypeComponent;
  let fixture: ComponentFixture<PoketypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoketypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoketypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
