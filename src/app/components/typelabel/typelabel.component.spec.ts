import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypelabelComponent } from './typelabel.component';

describe('TypelabelComponent', () => {
  let component: TypelabelComponent;
  let fixture: ComponentFixture<TypelabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypelabelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypelabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
