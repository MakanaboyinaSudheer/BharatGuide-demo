# BharatGuide Design Document

## 1. Overview
BharatGuide is a travel discovery and booking experience designed for travelers seeking culturally authentic experiences in India. It is positioned as a local-first matching platform that brings together travelers and guides in a transparent, emotionally resonant product experience.

## 2. Product Architecture Summary
The current demo is implemented as a Next.js web application with a single-page experience focused on discovery and booking request flows. The architecture supports future expansion into a larger ecosystem with authenticated users, a service layer, analytics, and real platform integrations.

### Current Demo Stack
- Frontend: Next.js + React
- Styling: Tailwind CSS
- Content model: static guide data in frontend
- Booking flow: in-browser modal and confirmation state

### Proposed Production Stack
- Frontend: Next.js web app and React Native/Flutter mobile app
- API layer: Node.js + Express
- Transactional DB: PostgreSQL
- Document DB: MongoDB
- Mapping: Google Maps Platform
- Payments: Razorpay or Stripe
- Messaging: Twilio or Firebase

## 3. Design System
### Brand colors
- Saffron: warm, energetic, cultural accent
- Green: grounded, natural, heritage-inspired
- Warm paper background: premium and welcoming
- Deep ink: strong readable text

### Type styles
- Serif headings for editorial sophistication
- Sans-serif body text for clarity and usability

### Components
- Hero banner
- Filter chips
- Guide cards
- Booking form modal
- Confirmation state
- Trust strip
- Footer with brand lockup

## 4. User Experience Principles
1. Local-first: The product should emphasize people and stories, not just destinations.
2. Trust-first: Every action should feel safe, clear, and easy to understand.
3. Discoverability: Users should be able to narrow preferences quickly.
4. Emotional motivation: Travel decisions are emotional; the design should spark curiosity and confidence.
5. Mobile responsiveness: The product should function smoothly across screen sizes.

## 5. Information Architecture
### Primary navigation
- Explore
- How it works

### Core journey
- Hero and positioning
- Discover local experiences
- Select guide
- Request booking
- Confirm request

### Content categories
- Heritage
- Food & markets
- Art & craft
- Culture
- Architecture

## 6. Interaction Design
### Discover flow
The user sees a curated list of local guides with filtering controls for destination and category.

### Booking flow
The user opens a modal, fills basic information, chooses a date and group size, and submits a booking request. The interface confirms the request in a way that feels polished but clearly labeled as a demo or preview.

## 7. Accessibility Considerations
- Sufficient color contrast against the warm neutral palette
- Keyboard-focus states for interactive elements
- Clear form labels and validation cues
- Readable type sizing and spacing
- Responsive layout support for small screens

## 8. Future Design Expansion
- Add authenticated traveler and guide dashboards
- Add maps and route previews
- Add message threads between traveler and guide
- Add review and rating interactions
- Add payment and scheduling optimization screens

## 9. Risks and Constraints
- Demo-only content can create mismatch between expectation and production behavior
- Complex travel workflows may require stronger trust and moderation systems
- Local guide onboarding must be careful to avoid poor-quality listings

## 10. Recommendation
Continue building on the warm editorial visual language and local storytelling narrative. The product is strongest when it represents India as immersive and personal rather than transactional only.
