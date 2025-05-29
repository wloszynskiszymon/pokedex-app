import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonEditFormComponent } from './pokemon-edit-form.component';

describe('PokemonEditFormComponent', () => {
  let component: PokemonEditFormComponent;
  let fixture: ComponentFixture<PokemonEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonEditFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
