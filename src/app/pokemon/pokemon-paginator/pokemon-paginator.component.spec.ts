import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonPaginatorComponent } from './pokemon-paginator.component';

describe('PokemonPaginatorComponent', () => {
  let component: PokemonPaginatorComponent;
  let fixture: ComponentFixture<PokemonPaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonPaginatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
