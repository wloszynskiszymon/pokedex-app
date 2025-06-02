describe('Pokedex App', () => {
  it('should display the title', () => {
    cy.intercept('GET', '**/cards*', { fixture: 'pokemon-list.json' }).as(
      'getAllPokemons'
    );
    cy.visit('http://localhost:4200/');
    cy.get('h1').contains('Welcome!');
  });

  it('should display the list of Pokemons', () => {
    cy.intercept('GET', '**/cards*', { fixture: 'pokemon-list.json' }).as(
      'getAllPokemons'
    );
    cy.visit('http://localhost:4200/');
    cy.wait('@getAllPokemons', { timeout: 10000 });
    cy.get('[data-cy=pokemon-item]')
      .should('exist')
      .should('have.length.greaterThan', 0);
  });

  it('should display no results fallback', () => {
    cy.intercept('GET', '**/cards*', { fixture: 'pokemon-empty-list.json' }).as(
      'getEmptyPokemons'
    );
    cy.visit('http://localhost:4200/');
    cy.wait('@getEmptyPokemons', { timeout: 10000 });
    cy.get('[data-cy=pokemon-item]').should('not.exist');
    cy.get('[data-cy=pokemon-no-results]').should('exist');
  });
});
