import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonAttacksComponent } from './pokemon-attacks.component';

describe('PokemonAttacksComponent', () => {
  let component: PokemonAttacksComponent;
  let fixture: ComponentFixture<PokemonAttacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonAttacksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonAttacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
