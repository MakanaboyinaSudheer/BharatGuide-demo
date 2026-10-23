# BharatGuide Standard Operating Procedure (SOP)

## 1. Purpose
This SOP defines the operational process for managing the BharatGuide demo and preparing for future product expansion. It covers sample guide curation, demo flow management, stakeholder review, and release readiness.

## 2. Scope
This SOP applies to:
- design and product review
- content and guide listing updates
- demo booking flow checks
- future onboarding of guides and operational teams
- validation of feature readiness before launch

## 3. Roles
### Product Owner
- Defines product goals and priority features
- Approves scope and MVP release criteria

### Designer
- Maintains the visual language, UX, and wireframes
- Reviews layout consistency and accessibility

### Developer
- Maintains the Next.js application
- Tests new features, bug fixes, and UI changes

### Operations / Support
- Reviews guide quality and traveler communications
- Manages future onboarding and issue triage

## 4. SOP Workflow

### Step 1: Demo Content Review
- Review all sample guide profiles for realism, consistency, and alignment with target experience categories.
- Ensure each listing includes city, interest, languages, price, and story framing.

### Step 2: UX and Flow Validation
- Check the destination filter and category chips for functional consistency.
- Validate booking modal fields and confirmation flow.
- Ensure copy remains clear and demo-mode labeling is visible.

### Step 3: Release Readiness Check
- Confirm no broken UI states or empty flow conditions persist.
- Verify responsive layouts on mobile and desktop breakpoints.
- Confirm the MVP clearly states it is a demo experience.

### Step 4: Feedback Review
- Gather user feedback on trust, clarity, and product appeal.
- Identify what should move to the full product roadmap.

### Step 5: Product Expansion Planning
- Prioritize verified guides, chat features, payments, and admin tools as next-phase work.
- Confirm technical requirements and operational dependencies.

## 5. Standard Operating Rules
- Do not present demo functionality as a live transactional product.
- All new features should be tested across key user journeys.
- Use clear, location-aware, authentic experience content.
- Ensure messaging is culturally respectful and human-centered.
- Maintain a consistent product tone across all user-facing screens.

## 6. Defect Handling
### Severity 1: Critical
- Booking flow does not work
- Filtered discovery is broken
- Page fails to load or key call-to-action is unusable

Response: stop release, fix immediately, re-test before approval.

### Severity 2: Major
- Minor UI inconsistency or poor mobile layout
- Low-clarity text or weak accessibility

Response: document and include in the next sprint patch.

### Severity 3: Minor
- Copy improvements, visual alignment adjustments, content cleanup

Response: log and schedule non-urgent fix.

## 7. Documentation Requirements
- Keep PRD, design docs, and SOP synchronized with product changes.
- Update copy and UX docs whenever user flows evolve.
- Maintain a changelog for each MVP release milestone.

## 8. Future Scale-Up SOP
When moving beyond the MVP:
1. Add authenticated traveler and guide flows.
2. Introduce guide verification and moderation.
3. Integrate payment, scheduling, and messaging systems.
4. Launch analytics and operational reporting dashboards.
5. Expand into multi-city and multi-language support.

## 9. Approval Checklist
Before a release or handoff, confirm:
- demo copy is accurate
- design remains consistent
- booking flow is working
- key user journeys are verified
- no unsupported claims are presented as live production features
