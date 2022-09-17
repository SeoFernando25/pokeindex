import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocaleToggleComponent } from './locale-toggle.component';

describe('LocaleToggleComponent', () => {
  let component: LocaleToggleComponent;
  let fixture: ComponentFixture<LocaleToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocaleToggleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocaleToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
