# BharatGuide MVP

A responsive Next.js demo for discovering locally led experiences in India and sending a sample booking request.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to GitHub Pages

The `main` branch is deployed automatically to [GitHub Pages](https://makanaboyinasudheer.github.io/BharatGuide-demo/) using GitHub Actions. The build exports a static site to `out/`; the repository base path is applied automatically during the Pages build.

## Demo features

- Browse sample local guides and filter by city or experience type.
- Open a guide's booking form, choose a date and group size, and see a request confirmation.
- Responsive layouts for desktop and mobile screens.

The guide profiles and booking confirmation are demo-only. This MVP does not connect to a database, authentication, maps, messaging, payments, or a live booking service. Guide imagery is loaded from Unsplash.
