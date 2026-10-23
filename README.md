# BharatGuide Prototype

A responsive two-sided marketplace prototype for discovering locally led experiences across India. Built with Next.js, React, TypeScript and Tailwind CSS, with custom responsive styling.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to GitHub Pages

The `main` branch is deployed automatically to [GitHub Pages](https://makanaboyinasudheer.github.io/BharatGuide-demo/) using GitHub Actions. The build exports a static site to `out/`; the repository base path is applied automatically during the Pages build.

## Demo features

- Search and filter sample guides by city, language, theme or free-text query; switch displayed prices between INR, USD, EUR and GBP.
- Run a multi-step booking flow with add-ons, an itemized price, simulated Razorpay/Stripe outcomes and a generated booking reference.
- Switch between traveler and guide views to manage requests, availability, profile details and verification document placeholders.
- Add persistent reviews, track booking status, start and complete a tour, and view a route/location-sharing mockup.
- Explore the safety modal, simulated emergency activity and tour-code verification flow.
- Persist bookings, profile details, reviews, role and demo activity in browser local storage.
- Use the responsive layouts and keyboard-accessible dialogs across desktop and mobile.

All marketplace data is sample content and saved only in the current browser. Authentication, payments, police contact, GPS, maps, QR verification and document uploads are simulations; no external service is contacted, no real payment is taken and uploaded document contents are not stored or transmitted. Guide imagery is loaded from Unsplash.
