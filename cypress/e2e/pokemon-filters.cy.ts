describe('Pokemon filters', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/cards*', { fixture: 'pokemon-list.json' }).as(
      'getAllPokemons'
    );
    cy.intercept('GET', '**/supertypes*', {
      fixture: 'supertypes.json',
    }).as('getSupertypes');
    cy.intercept('GET', '**/types*', {
      fixture: 'types.json',
    }).as('getTypes');
    cy.intercept('GET', '**/subtypes*', {
      fixture: 'subtypes.json',
    }).as('getSubtypes');
    cy.visit('http://localhost:4200/');
  });

  it('should filter Pokemons by "Colorless" type', () => {
    cy.wait('@getAllPokemons', { timeout: 5000 });
    cy.wait('@getTypes', { timeout: 5000 });

    const pokemonType = 'Colorless';

    cy.intercept('GET', `**/cards*`, {
      fixture: 'filter-type-colorless.json',
      delayMs: 500,
    }).as('getFilteredPokemons');

    cy.get('[data-cy=filter-type]').should('not.be.disabled').click();
    cy.get(`[data-cy=filter-type-option-${pokemonType}]`).click();

    cy.wait('@getFilteredPokemons', { timeout: 5000 });

    cy.url().should('include', `types=${pokemonType}`);

    cy.get('[data-cy=pokemon-item]').should('have.length.greaterThan', 0);
    cy.get('[data-cy=pokemon-item]').should('contain', pokemonType);
  });

  it('should filter Pokemons by "Energy" supertype', () => {
    cy.wait('@getAllPokemons', { timeout: 5000 });
    cy.wait('@getSupertypes', { timeout: 5000 });

    const pokemonSupertype = 'Energy';

    cy.intercept('GET', `**/cards*`, {
      fixture: 'filter-supertype-energy.json',
    }).as('getFilteredPokemons');

    cy.get('[data-cy=filter-supertype]').should('not.be.disabled').click();
    cy.get(`[data-cy=filter-supertype-option-${pokemonSupertype}]`).click();

    cy.wait('@getFilteredPokemons', { timeout: 5000 });

    cy.url().should('include', `supertype=${pokemonSupertype}`);

    cy.get('[data-cy=pokemon-item]').should('have.length.greaterThan', 0);
    cy.get('[data-cy=pokemon-item]').should('contain', pokemonSupertype);
  });

  it('should filter Pokemons by "BREAK" subtype', () => {
    cy.wait('@getAllPokemons', { timeout: 5000 });
    cy.wait('@getSubtypes', { timeout: 5000 });

    const pokemonSubtype = 'BREAK';

    cy.intercept('GET', `**/cards*`, {
      fixture: 'filter-subtype-break.json',
    }).as('getFilteredPokemons');

    cy.get('[data-cy=filter-reset]').should('be.disabled');

    cy.get('[data-cy=filter-subtype]').should('not.be.disabled').click();
    cy.get(`[data-cy=filter-subtype-option-${pokemonSubtype}]`).click();

    cy.wait('@getFilteredPokemons', { timeout: 5000 });

    cy.url().should('include', `subtypes=${pokemonSubtype}`);

    cy.get('[data-cy=pokemon-item]').should('have.length.greaterThan', 0);
    cy.get('[data-cy=pokemon-item]').should('contain', pokemonSubtype);
  });

  it('should select a type and then reset', () => {
    cy.wait('@getAllPokemons', { timeout: 5000 });
    cy.wait('@getTypes', { timeout: 5000 });

    const pokemonType = 'Colorless';

    cy.intercept('GET', `**/cards*`, {
      fixture: 'filter-type-colorless.json',
    }).as('getFilteredPokemons');

    cy.get('[data-cy=filter-type]').should('not.be.disabled').click();
    cy.get(`[data-cy=filter-type-option-${pokemonType}]`).click();

    cy.wait('@getFilteredPokemons', { timeout: 5000 });
    cy.get('[data-cy=pokemon-item]').should('have.length.greaterThan', 0);
    cy.get('[data-cy=pokemon-item]').should('contain', pokemonType);
    cy.get('[data-cy=filter-reset]').should('not.be.disabled').click();
  });

  it('should filter all and set values in url', () => {
    cy.wait('@getAllPokemons', { timeout: 5000 });
    cy.wait('@getTypes', { timeout: 5000 });
    cy.wait('@getSubtypes', { timeout: 5000 });
    cy.wait('@getSupertypes', { timeout: 5000 });

    const pokemonType = 'Colorless';
    const pokemonSubtype = 'BREAK';
    const pokemonSupertype = 'Energy';

    cy.intercept('GET', `**/cards*`, {
      fixture: 'filter-type-colorless.json',
    }).as('getFilteredPokemons-type');

    // type filter
    cy.get('[data-cy=filter-type]').should('not.be.disabled').click();
    cy.get(`[data-cy=filter-type-option-${pokemonType}]`).click();
    cy.wait('@getFilteredPokemons-type', { timeout: 5000 });

    cy.intercept('GET', `**/cards*`, {
      fixture: 'filter-energy-colorless.json',
    }).as('getFilteredPokemons-type-colorless');

    // supertype filter
    cy.get('[data-cy=filter-supertype]').should('not.be.disabled').click();
    cy.get(`[data-cy=filter-supertype-option-${pokemonSupertype}]`).click();
    cy.wait('@getFilteredPokemons-type-colorless', { timeout: 5000 });

    cy.intercept('GET', `**/cards*`, {
      fixture: 'filter-energy-colorless-break.json',
    }).as('getFilteredPokemons-type-colorless-break');

    // subtype filter
    cy.get('[data-cy=filter-subtype]').should('not.be.disabled').click();
    cy.get(`[data-cy=filter-subtype-option-${pokemonSubtype}]`).click();
    cy.wait('@getFilteredPokemons-type-colorless-break', { timeout: 5000 });

    // url check
    cy.url().should('include', `types=${pokemonType}`);
    cy.url().should('include', `subtypes=${pokemonSubtype}`);
    cy.url().should('include', `supertype=${pokemonSupertype}`);

    cy.get('[data-cy=pokemon-no-results]').should('exist');
  });
});
