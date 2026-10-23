"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  cities,
  formatPrice,
  guides,
  initialState,
  languages,
  themes,
} from "../lib/bharatguide";
import type {
  AppState,
  Booking,
  BookingStatus,
  Currency,
  Guide,
  Review,
  Role,
} from "../lib/bharatguide";

type ModalKind = "booking" | "video" | "sos" | "review" | null;
type BookingDraft = {
  date: string;
  time: string;
  theme: string;
  addons: string[];
  guests: number;
  payment: "Razorpay" | "Stripe";
  outcome: "success" | "failure";
};

const storageKey = "bharatguide-prototype-v1";
const addOnPrices: Record<string, number> = {
  "Local tasting": 650,
  "Hotel pickup": 900,
  "Craft workshop": 1200,
};

function newBookingDraft(guide: Guide): BookingDraft {
  return {
    date: new Date(Date.now() + 86_400_000).toISOString().slice(0, 10),
    time: "09:00",
    theme: guide.theme,
    addons: [],
    guests: 2,
    payment: "Razorpay",
    outcome: "success",
  };
}

function Avatar({ guide, small = false }: { guide: Guide; small?: boolean }) {
  return (
    <span
      className={`avatar${small ? " avatar-small" : ""}`}
      style={{ "--avatar-accent": guide.accent } as React.CSSProperties}
      aria-hidden="true"
    >
      {guide.initials}
    </span>
  );
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 3600);
    return () => window.clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className="toast" role="status">
      <span className="toast-check" aria-hidden="true">✓</span>
      {message}
      <button className="toast-dismiss" onClick={onClose} aria-label="Dismiss notification">×</button>
    </div>
  );
}

export default function BharatGuideApp() {
  const [state, setState] = useState<AppState>(initialState);
  const [ready, setReady] = useState(false);
  const [city, setCity] = useState("Everywhere");
  const [language, setLanguage] = useState("Any language");
  const [theme, setTheme] = useState("All themes");
  const [query, setQuery] = useState("");
  const [currencyMenu, setCurrencyMenu] = useState(false);
  const [modal, setModal] = useState<ModalKind>(null);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingDraft, setBookingDraft] = useState<BookingDraft | null>(null);
  const [bookingError, setBookingError] = useState("");
  const [toast, setToast] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [sosSent, setSosSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [codeVerified, setCodeVerified] = useState(false);
  const [locationSharing, setLocationSharing] = useState(false);
  const [profileName, setProfileName] = useState("Aanya Sharma");
  const [profileCity, setProfileCity] = useState("Jaipur");
  const [profileTheme, setProfileTheme] = useState("Mughal architecture");
  const [profileLanguage, setProfileLanguage] = useState("English");
  const [profileRate, setProfileRate] = useState("1800");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<AppState>;
          setState({
            ...initialState,
            ...parsed,
            verification: { ...initialState.verification, ...parsed.verification },
            bookings: Array.isArray(parsed.bookings) ? parsed.bookings : [],
            customGuides: Array.isArray(parsed.customGuides) ? parsed.customGuides : [],
            reviews: Array.isArray(parsed.reviews) ? parsed.reviews : [],
            emergencyLogs: Array.isArray(parsed.emergencyLogs) ? parsed.emergencyLogs : [],
          });
        }
      } catch {
        setToast("Saved prototype data could not be read. Starting a fresh session.");
      } finally {
        setReady(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      window.setTimeout(() => setToast("Your browser storage is full. Some changes may not be saved."), 0);
    }
  }, [ready, state]);

  useEffect(() => {
    if (!modal) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setModal(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modal]);

  const allGuides = useMemo(() => [...state.customGuides, ...guides], [state.customGuides]);
  const visibleGuides = useMemo(() => allGuides.filter((guide) => {
    const matchesCity = city === "Everywhere" || guide.city === city;
    const matchesLanguage = language === "Any language" || guide.languages.includes(language);
    const matchesTheme = theme === "All themes" || guide.theme.toLowerCase() === theme.toLowerCase();
    const searchTerm = query.trim().toLowerCase();
    const matchesQuery = !searchTerm || `${guide.name} ${guide.city} ${guide.title} ${guide.theme}`.toLowerCase().includes(searchTerm);
    return matchesCity && matchesLanguage && matchesTheme && matchesQuery;
  }), [allGuides, city, language, theme, query]);

  const reviewsFor = (guideId: string) => state.reviews.filter((review) => review.guideId === guideId);
  const guideForBooking = (booking: Booking) => allGuides.find((guide) => guide.id === booking.guideId) ?? guides[0];
  const totalPrice = bookingDraft && selectedGuide
    ? selectedGuide.price * bookingDraft.guests +
      bookingDraft.addons.reduce((total, addon) => total + (addOnPrices[addon] ?? 0), 0)
    : 0;

  function notify(message: string) {
    setToast(message);
  }

  function authenticate(role: Role) {
    setState((current) => ({ ...current, role, authenticated: true }));
    notify(role === "guide" ? "Welcome to your guide studio." : "You’re signed in as Alex Morgan.");
  }

  function openBooking(guide: Guide) {
    setSelectedGuide(guide);
    setBookingDraft(newBookingDraft(guide));
    setBookingStep(1);
    setBookingError("");
    setModal("booking");
    if (!state.authenticated) {
      setState((current) => ({ ...current, authenticated: true, role: "tourist" }));
      notify("Signed in as Alex Morgan for this prototype.");
    }
  }

  function completeBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedGuide || !bookingDraft) return;
    if (bookingDraft.outcome === "failure") {
      setBookingError("Payment didn’t go through. Your card was not charged. Try again or choose another demo gateway.");
      return;
    }
    const booking: Booking = {
      id: `BG-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      guideId: selectedGuide.id,
      guideName: selectedGuide.name,
      city: selectedGuide.city,
      traveler: state.touristName,
      date: bookingDraft.date,
      time: bookingDraft.time,
      theme: bookingDraft.theme,
      addons: bookingDraft.addons,
      guests: bookingDraft.guests,
      total: totalPrice,
      status: "requested",
      createdAt: new Date().toISOString(),
    };
    setState((current) => ({ ...current, bookings: [booking, ...current.bookings] }));
    setBookingStep(4);
    setBookingError("");
    notify(`Request sent to ${selectedGuide.name}. Reference ${booking.id}.`);
  }

  function updateBookingStatus(id: string, status: BookingStatus) {
    setState((current) => ({
      ...current,
      bookings: current.bookings.map((booking) => booking.id === id ? { ...booking, status } : booking),
    }));
    const messages: Record<BookingStatus, string> = {
      requested: "Booking request sent.",
      accepted: "Request accepted. The traveler has been notified.",
      declined: "Request declined. The traveler has been notified.",
      ongoing: "Tour started. Your live sharing controls are ready.",
      completed: "Tour marked complete. Great work!",
    };
    notify(messages[status]);
  }

  function sendEmergency() {
    const log = {
      id: `SOS-${Date.now().toString(36).toUpperCase()}`,
      message: "Safety alert sent to the Delhi tourist police demo desk and Alex’s emergency contact.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setState((current) => ({ ...current, emergencyLogs: [log, ...current.emergencyLogs] }));
    setSosSent(true);
    notify("Safety alert dispatched in prototype mode.");
  }

  function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedGuide || !reviewText.trim()) return;
    const review: Review = {
      id: `R-${Date.now()}`,
      guideId: selectedGuide.id,
      author: state.touristName,
      rating: reviewRating,
      comment: reviewText.trim(),
      date: new Date().toLocaleDateString("en", { month: "short", year: "numeric" }),
    };
    setState((current) => ({ ...current, reviews: [review, ...current.reviews] }));
    setReviewText("");
    setReviewRating(5);
    setModal(null);
    notify(`Thanks for sharing your experience with ${selectedGuide.name}.`);
  }

  function saveGuideProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const customGuide: Guide = {
      id: "your-profile",
      name: profileName.trim() || "Your guide profile",
      city: profileCity,
      title: `Local stories and ${profileTheme.toLowerCase()}`,
      languages: [profileLanguage, "Hindi"],
      rating: 5,
      reviews: 0,
      price: Math.max(300, Number(profileRate) || 1800),
      theme: profileTheme,
      photo: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1000&q=85",
      initials: (profileName.trim() || "BG").split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase(),
      accent: "#cf633e",
      certified: state.verification.idDocument.length > 0,
      policeCleared: state.verification.policeClearance.length > 0,
      introduction: "A locally led experience made with care. Add a personal introduction as your profile grows.",
      custom: true,
    };
    setState((current) => ({ ...current, guideName: customGuide.name, customGuides: [customGuide, ...current.customGuides.filter((guide) => guide.id !== customGuide.id)] }));
    notify("Guide profile saved on this device.");
  }

  function saveDocument(kind: "idDocument" | "policeClearance", file?: File) {
    if (!file) return;
    setState((current) => ({
      ...current,
      verification: { ...current.verification, [kind]: file.name },
      customGuides: current.customGuides.map((guide) => guide.id === "your-profile"
        ? { ...guide, certified: kind === "idDocument" || guide.certified, policeCleared: kind === "policeClearance" || guide.policeCleared }
        : guide),
    }));
    notify(`${file.name} added to your verification checklist.`);
  }

  function openVideo(guide: Guide) {
    setSelectedGuide(guide);
    setModal("video");
  }

  function openReview(guide: Guide) {
    setSelectedGuide(guide);
    setModal("review");
  }

  const currentGuide = allGuides.find((guide) => guide.name === state.guideName) ?? guides[0];
  const guideBookings = state.bookings.filter((booking) => booking.guideName === state.guideName);
  const totalEarnings = guideBookings.filter((booking) => booking.status === "completed")
    .reduce((sum, booking) => sum + booking.total, 0);
  const activeTour = state.bookings.find((booking) => booking.status === "accepted" || booking.status === "ongoing");
  const currencyOptions: Currency[] = ["INR", "USD", "EUR", "GBP"];
  const marketplaceResults = () => document.getElementById("guide-results")?.scrollIntoView({ behavior: "smooth" });

  return (
    <main className="app-shell">
      <div className="preview-bar">
        <span className="live-dot" /> A little preview of what’s possible
        <span className="preview-divider">·</span> Real India, thoughtfully experienced
      </div>

      <header className="site-header">
        <a className="brand" href="#home" aria-label="BharatGuide home">
          <span className="brand-mark">b.</span><span>bharat<span>guide</span></span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#explore">Explore</a>
          <a href="#our-promise">Our promise</a>
          {state.authenticated && <a href={state.role === "guide" ? "#guide-studio" : "#my-trips"}>{state.role === "guide" ? "Guide studio" : "My trips"}</a>}
        </nav>
        <div className="header-actions">
          <div className="currency-wrap">
            <button className="currency-button" aria-expanded={currencyMenu} onClick={() => setCurrencyMenu(!currencyMenu)}>
              {state.currency} <span aria-hidden="true">⌄</span>
            </button>
            {currencyMenu && <div className="currency-menu" role="menu">
              {currencyOptions.map((option) => <button key={option} role="menuitem" onClick={() => {
                setState((current) => ({ ...current, currency: option }));
                setCurrencyMenu(false);
              }}>{option}{option === state.currency ? "  ✓" : ""}</button>)}
            </div>}
          </div>
          {state.authenticated ? (
            <button className="profile-button" onClick={() => {
              if (state.role === "guide") {
                setState((current) => ({ ...current, role: "tourist" }));
                notify("Switched to your traveler view.");
              } else authenticate("guide");
            }} aria-label={`Signed in as ${state.role}. Switch account view`}>
              <span className="profile-mini">{state.role === "guide" ? "A" : "A"}</span>
              <span className="profile-label">{state.role === "guide" ? "Guide studio" : "Alex Morgan"}</span>
              <span aria-hidden="true">⌄</span>
            </button>
          ) : (
            <button className="button button-dark button-small" onClick={() => authenticate("tourist")}>Sign in</button>
          )}
        </div>
      </header>

      {state.authenticated && state.role === "guide" ? (
        <GuideDashboard
          state={state}
          currentGuide={currentGuide}
          guideReviews={reviewsFor(currentGuide.id)}
          guideBookings={guideBookings}
          totalEarnings={totalEarnings}
          profileName={profileName}
          profileCity={profileCity}
          profileTheme={profileTheme}
          profileLanguage={profileLanguage}
          profileRate={profileRate}
          onAvailability={(available) => {
            setState((current) => ({ ...current, available }));
            notify(available ? "You’re visible to travelers." : "You’re taking a break from requests.");
          }}
          onBookingStatus={updateBookingStatus}
          onProfileName={setProfileName}
          onProfileCity={setProfileCity}
          onProfileTheme={setProfileTheme}
          onProfileLanguage={setProfileLanguage}
          onProfileRate={setProfileRate}
          onProfileSave={saveGuideProfile}
          onDocument={saveDocument}
        />
      ) : (
        <>
          <section className="hero" id="home">
            <div className="hero-copy">
              <p className="eyebrow"><span /> INDIA, IN GOOD COMPANY</p>
              <h1>The best way to<br />find <em>your</em> India.</h1>
              <p className="hero-description">Skip the guidebook. Meet the people who call this place home, and see India through their eyes.</p>
              <a className="hero-link" href="#explore">Find your kind of day <span aria-hidden="true">↓</span></a>
              <div className="hero-social-proof">
                <div className="avatar-stack" aria-hidden="true"><i>A</i><i>K</i><i>M</i><i>+</i></div>
                <span>Good people. Great stories. Always local.</span>
              </div>
            </div>
            <div className="hero-art">
              <div className="hero-photo" role="img" aria-label="The Taj Mahal at sunrise" />
              <div className="hero-caption"><span className="caption-star">✳</span><span><b>More than a landmark.</b><br />A story worth hearing.</span></div>
              <span className="photo-place"><i /> AGRA, UTTAR PRADESH</span>
              <div className="hero-seal" aria-hidden="true"><span>MADE OF</span><b>many<br />Indias</b><span>ONE GOOD DAY</span></div>
            </div>
          </section>

          <section className="promise-strip" aria-label="BharatGuide values">
            <span>✳ &nbsp; Real local people</span><i /><span>✳ &nbsp; Small groups, big stories</span><i /><span>✳ &nbsp; Your kind of India</span><i /><span>✳ &nbsp; Thoughtfully put together</span>
          </section>

          <section className="discover-section content-width" id="explore">
            <div className="section-heading">
              <div>
                <p className="eyebrow"><span /> GOOD DAYS, GUIDED BY LOCALS</p>
                <h2>Find your <em>somewhere.</em></h2>
                <p className="section-description">A food trail, a hidden lane, a story you didn’t know you needed. Start wherever you are.</p>
              </div>
              <button className="guide-join" onClick={() => authenticate("guide")}>I’m a local guide <span aria-hidden="true">↗</span></button>
            </div>

            <div className="search-panel" role="search">
              <label className="search-field search-where"><span className="field-icon">⌖</span><span><small>WHERE TO?</small><select value={city} onChange={(event) => setCity(event.target.value)} aria-label="Filter guides by city">{cities.map((item) => <option key={item}>{item}</option>)}</select></span></label>
              <label className="search-field"><span className="field-icon">◉</span><span><small>SPEAK MY LANGUAGE</small><select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label="Filter guides by language">{languages.map((item) => <option key={item}>{item}</option>)}</select></span></label>
              <label className="search-field"><span className="field-icon">✳</span><span><small>MY KIND OF DAY</small><select value={theme} onChange={(event) => setTheme(event.target.value)} aria-label="Filter by experience theme">{themes.map((item) => <option key={item}>{item}</option>)}</select></span></label>
              <button className="search-submit" onClick={marketplaceResults} aria-label="Search guides"><span>⌕</span><b>Find a guide</b></button>
            </div>

            <div className="results-toolbar" id="guide-results">
              <div><h3>People worth meeting</h3><span className="result-count">{visibleGuides.length} thoughtful local {visibleGuides.length === 1 ? "guide" : "guides"}</span></div>
              <label className="quick-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a name or story" aria-label="Search guides by name or story" /></label>
            </div>

            {visibleGuides.length > 0 ? (
              <div className="guide-grid">
                {visibleGuides.map((guide) => <GuideCard key={guide.id} guide={guide} currency={state.currency} reviews={reviewsFor(guide.id)} available={guide.name !== state.guideName || state.available} onBook={openBooking} onVideo={openVideo} onReview={openReview} />)}
              </div>
            ) : (
              <div className="empty-state"><span>⌕</span><h3>No guides found just yet</h3><p>Try a different city, language or theme. Your next great day might be one filter away.</p><button className="button button-outline" onClick={() => { setCity("Everywhere"); setLanguage("Any language"); setTheme("All themes"); setQuery(""); }}>Clear filters</button></div>
            )}
          </section>

          <section className="how-section" id="our-promise">
            <div className="how-inner content-width">
              <div className="how-copy"><p className="eyebrow"><span /> A MORE HUMAN WAY TO EXPLORE</p><h2>Arrive curious.<br /><em>Leave connected.</em></h2><p>We believe the best travel memories start with a hello. Every experience is hosted by a local who knows the place by heart.</p><a href="#explore" className="hero-link">Meet the people behind the place <span>↗</span></a></div>
              <div className="how-steps">
                <div className="how-step"><span>01</span><div><b>Find your kind of day</b><p>Browse thoughtful experiences, shaped by the people who live them.</p></div></div>
                <div className="how-step"><span>02</span><div><b>Say hello to your local</b><p>Choose a guide who speaks your language and shares your curiosity.</p></div></div>
                <div className="how-step"><span>03</span><div><b>Make the story yours</b><p>Go at your pace, ask every question and find your own India.</p></div></div>
              </div>
            </div>
          </section>

          {state.authenticated && <section className="trips-section content-width" id="my-trips">
            <div className="section-heading compact-heading"><div><p className="eyebrow"><span /> YOUR TRAVEL PLANS</p><h2>Your <em>little itinerary.</em></h2></div><button className="button button-outline button-small" onClick={() => authenticate("guide")}>Switch to guide view</button></div>
            {state.bookings.length ? <div className="trip-list">{state.bookings.map((booking) => <BookingCard key={booking.id} booking={booking} guide={guideForBooking(booking)} currency={state.currency} onStart={() => updateBookingStatus(booking.id, "ongoing")} onComplete={() => updateBookingStatus(booking.id, "completed")} onReview={() => openReview(guideForBooking(booking))} />)}</div> : <div className="empty-trips"><span>✳</span><div><b>Your next story is waiting.</b><p>Once you request a day with a local, you’ll find all the details right here.</p></div><a href="#explore">Explore experiences ↗</a></div>}
          </section>}

          {activeTour && <section className="tour-map content-width" aria-labelledby="map-heading">
            <div className="map-heading"><div><p className="eyebrow"><span /> A LITTLE PEACE OF MIND</p><h2 id="map-heading">Today, you’re <em>in good hands.</em></h2><p>Your tour with {activeTour.guideName} is {activeTour.status === "ongoing" ? "underway" : "confirmed"}.</p></div><button className={`share-toggle${locationSharing ? " is-sharing" : ""}`} onClick={() => { setLocationSharing(!locationSharing); notify(locationSharing ? "Live location sharing paused." : "Live location sharing started for this tour."); }}><span className="share-dot" /> {locationSharing ? "Sharing live location" : "Share my location"}</button></div>
            <div className="map-card">
              <div className="map-art" role="img" aria-label={`Illustrated tour route in ${activeTour.city}`}>
                <svg viewBox="0 0 800 310" preserveAspectRatio="none" aria-hidden="true"><path className="map-river" d="M-20 248 C120 190 185 288 322 211 S535 172 810 33" /><path className="map-road" d="M22 70 L188 136 L302 78 L418 169 L565 112 L774 235 M92 283 L199 184 L341 220 L473 81 L646 157 L741 40 M37 152 L184 105 L289 169 L411 119 L554 224 L787 165" /><path className="map-route" d="M221 201 C278 172 316 184 350 147 S425 136 467 108 S534 103 589 128" /><circle className="map-stop" cx="221" cy="201" r="8" /><circle className="map-stop" cx="350" cy="147" r="8" /><circle className="map-stop" cx="467" cy="108" r="8" /><circle className="map-you" cx="589" cy="128" r="11" /></svg>
                <span className="map-label map-label-one">Meeting point</span><span className="map-label map-label-two">Old city lanes</span><span className="map-label map-label-three">Local market</span><span className="map-label map-label-four">You’re here</span>
              </div>
              <div className="map-details"><div className="map-guide"><Avatar guide={guideForBooking(activeTour)} small /><span><b>{activeTour.guideName}</b><small>{activeTour.city} · {activeTour.time}</small></span></div><div className="map-coordinate"><span>◎</span><span><b>Live location</b><small>{locationSharing ? "Shared with your guide · 28.6139° N, 77.2090° E" : "Only shared if you turn it on"}</small></span></div><div className="map-route-info"><b>3 stops</b><small>Curated for your day</small></div></div>
            </div>
          </section>}
        </>
      )}

      <footer className="site-footer"><a className="brand footer-brand" href="#home"><span className="brand-mark">b.</span><span>bharat<span>guide</span></span></a><span>Made with care, for the curious.</span><span>Prototype · Your India, your way.</span></footer>

      <button className="sos-fab" onClick={() => { setSosSent(false); setModal("sos"); }} aria-label="Open safety and emergency support"><span aria-hidden="true">✳</span><span>Safety</span></button>

      {modal && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(null); }}>
        {modal === "booking" && selectedGuide && bookingDraft && (
          <section className="dialog booking-dialog" role="dialog" aria-modal="true" aria-labelledby="booking-title">
            <button className="modal-close" onClick={() => setModal(null)} aria-label="Close booking">×</button>
            {bookingStep < 4 ? <>
              <div className="dialog-topline"><span>YOUR DAY, YOUR WAY</span><span>STEP {bookingStep} OF 3</span></div>
              <div className="progress-track"><span style={{ width: `${bookingStep * 33.333}%` }} /></div>
              {bookingStep === 1 && <form onSubmit={(event) => { event.preventDefault(); setBookingStep(2); }}>
                <p className="eyebrow"><span /> A DAY WITH {selectedGuide.name.toUpperCase()}</p><h2 id="booking-title">When shall we <em>meet?</em></h2><p className="dialog-description">Choose a date and a comfortable start time. Your guide will confirm availability.</p>
                <div className="form-grid"><label className="form-field"><span>Date</span><input required type="date" min={new Date().toISOString().slice(0, 10)} value={bookingDraft.date} onChange={(event) => setBookingDraft({ ...bookingDraft, date: event.target.value })} /></label><label className="form-field"><span>Start time</span><select value={bookingDraft.time} onChange={(event) => setBookingDraft({ ...bookingDraft, time: event.target.value })}>{["07:00", "08:00", "09:00", "10:00", "14:00", "16:00"].map((time) => <option key={time} value={time}>{time}</option>)}</select></label><label className="form-field"><span>Travelers</span><select value={bookingDraft.guests} onChange={(event) => setBookingDraft({ ...bookingDraft, guests: Number(event.target.value) })}>{[1, 2, 3, 4, 5, 6].map((count) => <option key={count} value={count}>{count} {count === 1 ? "guest" : "guests"}</option>)}</select></label></div>
                <div className="dialog-actions"><button type="button" className="button button-outline" onClick={() => setModal(null)}>Maybe later</button><button className="button button-saffron">Choose your experience <span>→</span></button></div>
              </form>}
              {bookingStep === 2 && <form onSubmit={(event) => { event.preventDefault(); setBookingStep(3); }}>
                <p className="eyebrow"><span /> MAKE IT YOURS</p><h2 id="booking-title">What sounds <em>lovely?</em></h2><p className="dialog-description">Your guide will tailor this day to you. Add a little something extra if you like.</p>
                <label className="form-field theme-field"><span>Experience theme</span><select value={bookingDraft.theme} onChange={(event) => setBookingDraft({ ...bookingDraft, theme: event.target.value })}>{themes.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
                <div className="addon-list"><span className="addon-heading">LITTLE EXTRAS <small>OPTIONAL</small></span>{Object.entries(addOnPrices).map(([addon, price]) => <label className="addon-row" key={addon}><input type="checkbox" checked={bookingDraft.addons.includes(addon)} onChange={(event) => setBookingDraft({ ...bookingDraft, addons: event.target.checked ? [...bookingDraft.addons, addon] : bookingDraft.addons.filter((item) => item !== addon) })} /><span><b>{addon}</b><small>{addon === "Local tasting" ? "A few delicious bites along the way" : addon === "Hotel pickup" ? "Meet you right at your door" : "Meet a maker and try your hand at a craft"}</small></span><strong>{formatPrice(price, state.currency)}</strong></label>)}</div>
                <div className="dialog-actions"><button type="button" className="button button-outline" onClick={() => setBookingStep(1)}>← Back</button><button className="button button-saffron">Review your day <span>→</span></button></div>
              </form>}
              {bookingStep === 3 && <form onSubmit={completeBooking}>
                <p className="eyebrow"><span /> CLEAR AS DAY</p><h2 id="booking-title">A fair price. <em>That’s it.</em></h2><p className="dialog-description">No hidden fees. Your payment is simulated for this prototype; no real charge will be made.</p>
                <div className="price-card"><div><span>{selectedGuide.name} · {bookingDraft.guests} {bookingDraft.guests === 1 ? "guest" : "guests"}</span><b>{formatPrice(selectedGuide.price * bookingDraft.guests, state.currency)}</b></div>{bookingDraft.addons.map((addon) => <div key={addon}><span>{addon}</span><b>{formatPrice(addOnPrices[addon], state.currency)}</b></div>)}<div className="price-fee"><span>Service & booking fees</span><b>{formatPrice(0, state.currency)}</b></div><div className="price-total"><span>Total · {state.currency}</span><b>{formatPrice(totalPrice, state.currency)}</b></div></div>
                <div className="payment-options"><label className={bookingDraft.payment === "Razorpay" ? "payment-option selected" : "payment-option"}><input type="radio" name="payment" checked={bookingDraft.payment === "Razorpay"} onChange={() => setBookingDraft({ ...bookingDraft, payment: "Razorpay" })} /><span className="payment-logo razorpay-logo">R</span><span><b>Razorpay</b><small>Cards, UPI & more</small></span></label><label className={bookingDraft.payment === "Stripe" ? "payment-option selected" : "payment-option"}><input type="radio" name="payment" checked={bookingDraft.payment === "Stripe"} onChange={() => setBookingDraft({ ...bookingDraft, payment: "Stripe" })} /><span className="payment-logo stripe-logo">S</span><span><b>Stripe</b><small>Secure card payment</small></span></label></div>
                <label className="demo-outcome"><input type="checkbox" checked={bookingDraft.outcome === "failure"} onChange={(event) => { setBookingError(""); setBookingDraft({ ...bookingDraft, outcome: event.target.checked ? "failure" : "success" }); }} /><span>Simulate a declined payment</span></label>
                {bookingError && <p className="inline-error" role="alert">{bookingError}</p>}
                <div className="dialog-actions"><button type="button" className="button button-outline" onClick={() => { setBookingStep(2); setBookingError(""); }}>← Back</button><button className="button button-saffron">Pay {formatPrice(totalPrice, state.currency)} securely <span>→</span></button></div>
                <p className="payment-footnote">⌑ &nbsp; Demo checkout · No real payment details collected</p>
              </form>}
            </> : <div className="confirmation-view"><div className="success-emblem">✓</div><p className="eyebrow"><span /> IT’S A DATE</p><h2 id="booking-title">Your story is <em>in motion.</em></h2><p>{selectedGuide.name} will review your request. We’ve saved your booking details in this browser.</p><div className="reference-card"><span>YOUR BOOKING REFERENCE</span><b>{state.bookings[0]?.id ?? "BG-SAVED"}</b><small>{bookingDraft.date} · {bookingDraft.time} · {selectedGuide.city}</small></div><button className="button button-dark full-button" onClick={() => { setModal(null); document.getElementById("my-trips")?.scrollIntoView({ behavior: "smooth" }); }}>See my itinerary <span>→</span></button></div>}
          </section>
        )}

        {modal === "video" && selectedGuide && <section className="dialog video-dialog" role="dialog" aria-modal="true" aria-labelledby="video-title"><button className="modal-close modal-close-light" onClick={() => setModal(null)} aria-label="Close introduction">×</button><div className="video-art" style={{ backgroundImage: `linear-gradient(180deg, #17392a22, #142b25ba), url("${selectedGuide.photo}")` }}><div className="video-play" aria-hidden="true">▶</div><span className="video-mock-label">VIDEO INTRO · PREVIEW</span></div><div className="video-copy"><Avatar guide={selectedGuide} /><div><p className="eyebrow"><span /> A HELLO FROM {selectedGuide.city.toUpperCase()}</p><h2 id="video-title">Meet {selectedGuide.name}.</h2><p>{selectedGuide.introduction}</p><button className="button button-saffron" onClick={() => openBooking(selectedGuide)}>Plan a day together <span>→</span></button></div></div></section>}

        {modal === "review" && selectedGuide && <section className="dialog review-dialog" role="dialog" aria-modal="true" aria-labelledby="review-title"><button className="modal-close" onClick={() => setModal(null)} aria-label="Close review">×</button><p className="eyebrow"><span /> SHARE A LITTLE LOVE</p><h2 id="review-title">How was your day <em>with {selectedGuide.name.split(" ")[0]}?</em></h2><form onSubmit={submitReview}><fieldset className="rating-picker"><legend>Your rating</legend>{[1, 2, 3, 4, 5].map((rating) => <button type="button" key={rating} aria-label={`${rating} star${rating === 1 ? "" : "s"}`} aria-pressed={reviewRating === rating} onClick={() => setReviewRating(rating)}>{rating <= reviewRating ? "★" : "☆"}</button>)}</fieldset><label className="form-field"><span>Your note</span><textarea required minLength={8} maxLength={400} value={reviewText} onChange={(event) => setReviewText(event.target.value)} placeholder="What made this day memorable?" rows={4} /></label><div className="dialog-actions"><button type="button" className="button button-outline" onClick={() => setModal(null)}>Cancel</button><button className="button button-saffron">Post review <span>→</span></button></div></form></section>}

        {modal === "sos" && <section className="dialog sos-dialog" role="dialog" aria-modal="true" aria-labelledby="sos-title"><button className="modal-close" onClick={() => setModal(null)} aria-label="Close safety support">×</button><div className="sos-heading"><span className="sos-emblem">✳</span><div><p className="eyebrow"><span /> BHARATGUIDE SAFETY SUPPORT</p><h2 id="sos-title">You’re not <em>on your own.</em></h2></div></div><p className="dialog-description">This is a prototype safety flow. It does not contact emergency services or share real GPS data.</p>{sosSent ? <div className="dispatch-card" role="status"><span>✓</span><div><b>Demo alert dispatched</b><p>Tourist police demo desk · Emergency contact Alex Morgan · Location simulation 28.6139° N, 77.2090° E</p></div></div> : <button className="sos-send" onClick={sendEmergency}><span>✳</span><b>Send a safety alert</b><small>Simulate a connection to local tourist police</small></button>}<div className="emergency-facts"><div><span>POLICE HELPLINE</span><b>112 <small>· simulated</small></b></div><div><span>YOUR DEMO LOCATION</span><b>28.6139° N, 77.2090° E</b></div></div><div className="verify-panel"><div className="verify-title"><span className="qr-mock" aria-hidden="true">▦</span><span><b>Tour start check-in</b><small>Mock QR / code verification with your guide</small></span></div><div className="verify-controls"><input value={verificationCode} onChange={(event) => { setVerificationCode(event.target.value); setCodeVerified(false); }} placeholder="Enter guide’s demo code" aria-label="Enter tour verification code" /><button className="button button-dark button-small" onClick={() => { const valid = verificationCode.trim().toUpperCase() === "BG-4821"; setCodeVerified(valid); if (valid) notify("Tour start verified. Have a lovely day."); else notify("That code didn’t match. Try BG-4821."); }}>Verify</button></div>{codeVerified && <p className="verified-note">✓ Tour start verified · Safe travels!</p>}<small>Demo code: BG-4821. No camera or scanner access is used.</small></div>{state.emergencyLogs.length > 0 && <div className="sos-history"><b>Recent activity</b>{state.emergencyLogs.slice(0, 2).map((log) => <p key={log.id}><span>{log.time}</span>{log.message}</p>)}</div>}</section>}
      </div>}
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </main>
  );
}

function GuideCard({ guide, currency, reviews, available, onBook, onVideo, onReview }: {
  guide: Guide;
  currency: Currency;
  reviews: Review[];
  available: boolean;
  onBook: (guide: Guide) => void;
  onVideo: (guide: Guide) => void;
  onReview: (guide: Guide) => void;
}) {
  return <article className="guide-card">
    <div className="guide-photo" style={{ backgroundImage: `linear-gradient(180deg, transparent 55%, #172c25aa 100%), url("${guide.photo}")` }} role="img" aria-label={`${guide.city}, hosted by ${guide.name}`}>
      <span className="photo-city">{guide.city.toUpperCase()}</span>
      <button className="video-chip" onClick={() => onVideo(guide)} aria-label={`Watch ${guide.name}'s introduction`}><span>▶</span> Meet {guide.name.split(" ")[0]}</button>
      <span className="photo-count">✦ &nbsp;Local favorite</span>
    </div>
    <div className="guide-content">
      <div className="guide-title-line"><div><h3>{guide.title}</h3><p>{guide.city} · {guide.languages.slice(0, 2).join(", ")}</p></div><span className="rating">★ {averageRating(guide, reviews).toFixed(2)}</span></div>
      <div className="guide-credentials"><span className={`verified-badge${guide.certified ? "" : " badge-pending"}`}>{guide.certified ? "✓ Ministry verified" : "◷ ID review pending"}</span><span className={`clearance-badge${guide.policeCleared ? "" : " badge-pending"}`}><i />{guide.policeCleared ? "Police cleared" : "Clearance pending"}</span></div>
      <div className="guide-profile-line"><Avatar guide={guide} small /><span><b>{guide.name}</b><small>{guide.certified ? "Certified local guide" : "Profile in review"}</small></span><span className="review-total">{guide.reviews + reviews.length} reviews</span></div>
      {reviews.length > 0 && <div className="latest-review"><span>“{reviews[0].comment}”</span><small>— {reviews[0].author}, {reviews[0].date}</small></div>}
      <div className="card-bottom"><div><b>{formatPrice(guide.price, currency)}</b><span> / person</span></div><div className="card-buttons"><button className="review-button" onClick={() => onReview(guide)} aria-label={`Write a review for ${guide.name}`}>Review</button><button className="book-button" disabled={!available} onClick={() => onBook(guide)}>{available ? <>Plan a day <span>→</span></> : "Taking a break"}</button></div></div>
    </div>
  </article>;
}

function BookingCard({ booking, guide, currency, onStart, onComplete, onReview }: {
  booking: Booking;
  guide: Guide;
  currency: Currency;
  onStart: () => void;
  onComplete: () => void;
  onReview: () => void;
}) {
  const statusLabels: Record<BookingStatus, string> = {
    requested: "Waiting for your guide",
    accepted: "Confirmed",
    declined: "Request declined",
    ongoing: "Enjoy your day",
    completed: "Completed",
  };
  return <article className="trip-card"><Avatar guide={guide} /><div className="trip-main"><div className="trip-top"><h3>{booking.city} with {booking.guideName}</h3><span className={`trip-status status-${booking.status}`}><i />{statusLabels[booking.status]}</span></div><p>{booking.date} · {booking.time} · {booking.guests} {booking.guests === 1 ? "guest" : "guests"}</p><small>{booking.theme}{booking.addons.length ? ` · ${booking.addons.join(", ")}` : ""} · Ref {booking.id}</small></div><div className="trip-end"><b>{formatPrice(booking.total, currency)}</b>{booking.status === "accepted" && <button className="button button-saffron button-small" onClick={onStart}>Start tour</button>}{booking.status === "ongoing" && <button className="button button-dark button-small" onClick={onComplete}>Complete tour</button>}{booking.status === "completed" && <button className="review-button" onClick={onReview}>Leave a review</button>}</div></article>;
}

function averageRating(guide: Guide, reviews: Review[]) {
  if (!reviews.length) return guide.rating;
  return (guide.rating * guide.reviews + reviews.reduce((sum, review) => sum + review.rating, 0)) /
    (guide.reviews + reviews.length);
}

function GuideDashboard({
  state,
  currentGuide,
  guideReviews,
  guideBookings,
  totalEarnings,
  profileName,
  profileCity,
  profileTheme,
  profileLanguage,
  profileRate,
  onAvailability,
  onBookingStatus,
  onProfileName,
  onProfileCity,
  onProfileTheme,
  onProfileLanguage,
  onProfileRate,
  onProfileSave,
  onDocument,
}: {
  state: AppState;
  currentGuide: Guide;
  guideReviews: Review[];
  guideBookings: Booking[];
  totalEarnings: number;
  profileName: string;
  profileCity: string;
  profileTheme: string;
  profileLanguage: string;
  profileRate: string;
  onAvailability: (available: boolean) => void;
  onBookingStatus: (id: string, status: BookingStatus) => void;
  onProfileName: (value: string) => void;
  onProfileCity: (value: string) => void;
  onProfileTheme: (value: string) => void;
  onProfileLanguage: (value: string) => void;
  onProfileRate: (value: string) => void;
  onProfileSave: (event: FormEvent<HTMLFormElement>) => void;
  onDocument: (kind: "idDocument" | "policeClearance", file?: File) => void;
}) {
  const requests = guideBookings.filter((booking) => booking.status === "requested");
  const completed = guideBookings.filter((booking) => booking.status === "completed").length;
  return <section className="dashboard content-width" id="guide-studio">
    <div className="dashboard-welcome"><div><p className="eyebrow"><span /> YOUR LOCAL GUIDE STUDIO</p><h1>Good morning, <em>{currentGuide.name.split(" ")[0]}.</em></h1><p>Your next great connection could be just around the corner.</p></div><div className="availability-control"><span className={`availability-dot${state.available ? " available" : ""}`} /><span><b>{state.available ? "You’re available" : "You’re offline"}</b><small>{state.available ? "Visible to travelers right now" : "New requests are paused"}</small></span><button role="switch" aria-checked={state.available} aria-label="Toggle guide availability" className={`switch${state.available ? " switch-on" : ""}`} onClick={() => onAvailability(!state.available)}><i /></button></div></div>
    <div className="analytics-grid"><article><span>YOUR EARNINGS</span><b>{formatPrice(totalEarnings, state.currency)}</b><small>From completed tours</small><i>↗</i></article><article><span>COMPLETED TOURS</span><b>{completed}</b><small>More stories, more smiles</small><i>✳</i></article><article><span>GUEST RATING</span><b>{averageRating(currentGuide, guideReviews).toFixed(2)} <em>★</em></b><small>From {currentGuide.reviews + guideReviews.length} thoughtful reviews</small><i>♡</i></article><article><span>NEW REQUESTS</span><b>{requests.length}</b><small>{requests.length ? "Ready for your reply" : "You’re all caught up"}</small><i>✉</i></article></div>
    <div className="dashboard-columns">
      <div className="dashboard-main"><div className="dashboard-section-heading"><div><p className="eyebrow"><span /> YOUR INBOX</p><h2>Booking <em>requests.</em></h2></div><span className="inbox-count">{requests.length} new</span></div>
        {requests.length ? (
          <div className="request-list">
            {requests.map((booking) => (
              <article className="request-card" key={booking.id}>
                <div className="request-person">
                  <span className="traveler-avatar">{booking.traveler.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span>
                  <div><b>{booking.traveler}</b><small>Traveler · just now · Ref {booking.id}</small></div>
                  <span className="request-total">{formatPrice(booking.total, state.currency)}</span>
                </div>
                <div className="request-details">
                  <span>▦ &nbsp;{booking.date} at {booking.time}</span>
                  <span>⌖ &nbsp;{booking.city} · {booking.guests} guests</span>
                  <span>✳ &nbsp;{booking.theme}</span>
                  {booking.addons.length > 0 && <span>＋ &nbsp;{booking.addons.join(", ")}</span>}
                </div>
                <div className="request-actions">
                  <button className="button button-outline" onClick={() => onBookingStatus(booking.id, "declined")}>Not this time</button>
                  <button className="button button-saffron" onClick={() => onBookingStatus(booking.id, "accepted")}>Accept request <span>→</span></button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="inbox-empty"><span>✳</span><b>A little quiet, for now.</b><p>New traveler requests will find their way here. Keep your availability on to be discovered.</p></div>
        )}
        <div className="document-card"><div className="dashboard-section-heading"><div><p className="eyebrow"><span /> TRUST, BUILT TOGETHER</p><h2>Your <em>verification.</em></h2></div><span className="review-pending">Prototype checklist</span></div><p className="document-intro">Add documents to simulate your profile verification. Files stay on this device; nothing is sent to a server.</p><div className="document-rows"><DocumentUpload title="Government ID" fileName={state.verification.idDocument} onFile={(file) => onDocument("idDocument", file)} /><DocumentUpload title="Police clearance" fileName={state.verification.policeClearance} onFile={(file) => onDocument("policeClearance", file)} /></div></div>
      </div>
      <aside className="profile-editor"><div className="dashboard-section-heading"><div><p className="eyebrow"><span /> YOUR LOCAL STORY</p><h2>Guide <em>profile.</em></h2></div></div><p>Help curious travelers picture a day with you.</p><form onSubmit={onProfileSave}><label className="form-field"><span>Your name</span><input required value={profileName} onChange={(event) => onProfileName(event.target.value)} /></label><label className="form-field"><span>Your home city</span><select value={profileCity} onChange={(event) => onProfileCity(event.target.value)}>{cities.slice(1).map((city) => <option key={city}>{city}</option>)}</select></label><label className="form-field"><span>Your specialty</span><select value={profileTheme} onChange={(event) => onProfileTheme(event.target.value)}>{themes.slice(1).map((theme) => <option key={theme}>{theme}</option>)}</select></label><label className="form-field"><span>Language</span><select value={profileLanguage} onChange={(event) => onProfileLanguage(event.target.value)}>{languages.slice(1).map((language) => <option key={language}>{language}</option>)}</select></label><label className="form-field"><span>Rate per guest (INR)</span><input type="number" min="300" step="100" value={profileRate} onChange={(event) => onProfileRate(event.target.value)} /></label><button className="button button-dark full-button">Save my profile <span>→</span></button></form><div className="profile-preview-note"><span>✳</span><p>Your custom profile is added to the marketplace on this browser. Verified badges reflect your document checklist.</p></div></aside>
    </div>
    {guideBookings.length > 0 && <div className="guide-booking-history"><div className="dashboard-section-heading"><div><p className="eyebrow"><span /> A FEW GOOD PLANS</p><h2>Recent <em>requests.</em></h2></div></div>{guideBookings.map((booking) => <article key={booking.id} className="history-row"><span className={`trip-status status-${booking.status}`}><i />{booking.status}</span><b>{booking.traveler}</b><span>{booking.date} · {booking.city}</span><strong>{formatPrice(booking.total, state.currency)}</strong></article>)}</div>}
  </section>;
}

function DocumentUpload({ title, fileName, onFile }: { title: string; fileName: string; onFile: (file?: File) => void }) {
  const inputId = `upload-${title.toLowerCase().replace(/\s/g, "-")}`;
  return <div className="document-row"><span className={`document-icon${fileName ? " document-added" : ""}`}>{fileName ? "✓" : "▤"}</span><span className="document-copy"><b>{title}</b><small>{fileName ? `${fileName} · review pending` : "PDF, JPG or PNG · up to 10 MB"}</small></span><label className="upload-label" htmlFor={inputId}>{fileName ? "Replace" : "Add file"}<input id={inputId} type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(event) => onFile(event.currentTarget.files?.[0])} /></label></div>;
}
