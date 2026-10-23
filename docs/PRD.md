# BharatGuide Product Requirements Document (PRD)

## 1. Product Summary
BharatGuide is a local-guided travel platform that helps tourists discover authentic, culturally rich experiences in India through trusted local guides. The product connects travelers with guides who offer personalized, geographically relevant, and culturally immersive experiences based on interests, destination, and schedule.

## 2. Problem Statement
Tourists often rely on generic tourism information and broad listings that do not reflect the real local experience. Many travelers want more personalized, meaningful experiences but struggle to find trusted local guides, transparent pricing, and smooth booking experiences.

BharatGuide solves this by enabling:
- discovery of verified local experiences
- filter-based browsing by destination and interest
- guide-led recommendations tailored to traveler intent
- trustworthy booking requests with a clear flow

## 3. Target Users
### Primary Users
- International tourists visiting India
- Domestic travelers seeking authentic local experiences
- Travelers looking for guided cultural, heritage, food, and city-based experiences

### Secondary Users
- Local guides and cultural storytellers
- Travel planners and agencies
- Destination partners and local businesses

## 4. Goals
### Business Goals
- Build a demo-ready marketplace for local guided travel experiences
- Show the product experience and trust flow for travel bookings
- Validate demand for local guide discovery and pre-booking

### User Goals
- Find a guide who matches a destination and interest
- Understand the offering before booking
- Submit a simple booking request with confidence and clarity

## 5. Key Features
### MVP Features
1. Explore by destination and experience type
2. Browse guide cards with profile, rating, languages, and price
3. View guide-specific experience summary
4. Submit a booking request with guest details and date
5. Receive a confirmation message for a demo request

### Future Features
- Verified guide profiles with identity checks
- Multi-language profile support
- Real-time chat and navigation support
- Payment and invoice management
- Ratings, reviews, and booking history
- Admin moderation and guide onboarding flow
- Maps, route planning, and live location support

## 6. User Journey
1. User lands on the BharatGuide home page.
2. User filters guides by city and experience category.
3. User reviews local guide cards and chooses a relevant guide.
4. User opens booking flow and submits a request.
5. User gets a confirmation that the request is recorded.

## 7. Functional Requirements
- The platform must let users browse guides by city and category.
- Each guide card must display a name, city, experience, rating, languages, and price.
- Users must be able to open a booking modal from any guide card.
- The booking flow must collect at least name, date, and guest count.
- The system must show a confirmation state after a successful demo booking request.
- The interface must be responsive and functioning on mobile and desktop screens.

## 8. Non-Functional Requirements
- Fast page response and clear information hierarchy
- Mobile-first responsive UX
- Clean and accessible interface with clear actions
- Maintainable frontend architecture using Next.js
- Clear separation between demo-mode and production-mode functionality

## 9. Product Scope
### In Scope for MVP
- Landing page and hero section
- Guide discovery and filtering
- Booking request flow
- Responsive UI
- Demo content and realistic travel scenarios

### Out of Scope for MVP
- Real payments and checkout
- User authentication
- Database-backed persistence
- Real guide verification
- Live maps and real-time chat
- CMS or admin dashboard

## 10. Success Metrics
- Users can discover a guide within under one minute
- Users can complete a demo booking request without confusion
- Positive perception of trust and local authenticity
- Strong clarity of the core value proposition in the first screen

## 11. Risks and Mitigations
- Risk: unclear trust model for a travel marketplace
  - Mitigation: highlight “local guide” and “demo request” clearly
- Risk: feature complexity above MVP
  - Mitigation: prioritize discovery and booking request flow only
- Risk: users expect real booking processing
  - Mitigation: clearly label demo mode in UI and docs

## 12. Product Recommendation
The MVP should focus on proving the trust and emotional appeal of the BharatGuide concept: local people, meaningful experiences, and easy discovery. Once validated, the product can expand into a full booking platform with payments, verification, communication, and operational logistics.
