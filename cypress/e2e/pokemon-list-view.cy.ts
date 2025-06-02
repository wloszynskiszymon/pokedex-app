describe('Pokedex App', () => {
  const baseUrl = 'http://localhost:4200/';

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it('should display the title', () => {
    cy.intercept('GET', '**/cards*', { fixture: 'pokemon-list.json' }).as(
      'getAllPokemons'
    );
    cy.get('h1').contains('Welcome!');
  });

  it('should display the list of Pokemons', () => {
    cy.intercept('GET', '**/cards*', { fixture: 'pokemon-list.json' }).as(
      'getAllPokemons'
    );
    cy.wait('@getAllPokemons', { timeout: 10000 });
    cy.get('[data-cy=pokemon-item]')
      .should('exist')
      .should('have.length.greaterThan', 0);
  });

  it('should display no results fallback', () => {
    cy.intercept('GET', '**/cards*', { fixture: 'pokemon-empty-list.json' }).as(
      'getEmptyPokemons'
    );
    cy.wait('@getEmptyPokemons', { timeout: 10000 });
    cy.get('[data-cy=pokemon-item]').should('not.exist');
    cy.get('[data-cy=pokemon-no-results]').should('exist');
  });
});
