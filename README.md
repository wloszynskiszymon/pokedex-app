# PokedexApp

A simple Pokédex App built with Angular and Material UI
![Angular](https://img.shields.io/badge/Angular-19%2B-red?logo=angular) ![Material UI](https://img.shields.io/badge/Material--UI-Design-blue?logo=angular) ![Cypress](https://img.shields.io/badge/Tested%20with-Cypress-6e6e6e?logo=cypress)

---

## ✨ About the Project

**PokedexApp** is a simple web application built with Angular 19 and Material UI, leveraging the [Pokémon TCG public API](https://docs.pokemontcg.io) (without using their SDK).  
The app allows you to browse, filter, and edit (locally) Pokémon cards, view detailed stats, and explore similar Pokémon—all in a friendly UI.

---

## 🚀 Features

- **Pokédex List**  
  Browse a paginated list of Pokémon cards fetched from the Pokémon TCG API.

- **Advanced Filtering**  
  Filter Pokémon by:

  - **Supertype** (e.g., Pokémon, Trainer, Energy)
  - **Subtype** (e.g., Stage 1, BREAK, Basic)
  - **Type** (e.g., Fire, Water, Metal, etc.)

- **Pokémon Details**  
  Click any Pokémon to view detailed stats, including HP, types, subtypes, and more.

- **Similar Pokémon**  
  Instantly see and navigate to similar Pokémon cards from the details view.

- **Edit Pokémon Stats**  
  Edit selected statistics (HP, types, subtypes, supertype) for any Pokémon.  
  Changes are stored in local storage and reflected in the UI.

- **Material UI Design**  
  Clean, modern, and fully responsive interface using Angular Material components.

- **End-to-End Testing**  
  App tested in Cypress.

---

## 🛠️ Tech Stack

- **Angular 19**
- **Angular Material**
- **Cypress**
- **Zod**

---

## 📸 Visualization

> _TODO_

---

## 🧑‍💻 How to Run the App

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd pokedex-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

- Go to /src/environments
- Create 'environment.ts'
- Copy everything from the 'environment.sample.ts' to 'environment.ts'
- Add your api key or leave as undefined

In the end you should have a environment.ts file next to environment.sample.ts file.

### 4. Start the development server

```bash
npm start
```

Open [http://localhost:4200/](http://localhost:4200/) in your browser.

---

## 🧪 Running Tests

### End-to-End (E2E) Tests with Cypress

```bash
npx cypress open
```

---

## 📝 Additional info

This project is part of a recruitment task

---

> Szymon Włoszyński - 2025.
