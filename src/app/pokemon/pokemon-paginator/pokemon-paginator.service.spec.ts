import { TestBed } from '@angular/core/testing';

import { PokemonPaginatorService } from './pokemon-paginator.service';

describe('PokemonPaginatorService', () => {
  let service: PokemonPaginatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokemonPaginatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
