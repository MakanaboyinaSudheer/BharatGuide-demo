"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";

type Guide = {
  id: number;
  name: string;
  city: string;
  title: string;
  languages: string[];
  rating: string;
  reviews: number;
  price: number;
  category: string;
  photo: string;
  initials: string;
  accent: string;
};

const guides: Guide[] = [
  {
    id: 1,
    name: "Aanya Sharma",
    city: "Jaipur",
    title: "The pink city, beyond the palaces",
    languages: ["English", "Hindi", "French"],
    rating: "4.98",
    reviews: 124,
    price: 1800,
    category: "Heritage",
    photo:
      "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1000&q=85",
    initials: "AS",
    accent: "#b35c42",
  },
  {
    id: 2,
    name: "Kabir Mehta",
    city: "Delhi",
    title: "Old Delhi, one delicious bite at a time",
    languages: ["English", "Hindi"],
    rating: "4.96",
    reviews: 89,
    price: 1500,
    category: "Food & markets",
    photo:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=85",
    initials: "KM",
    accent: "#3a746a",
  },
  {
    id: 3,
    name: "Meera Iyer",
    city: "Varanasi",
    title: "A quieter morning on the ghats",
    languages: ["English", "Hindi", "Tamil"],
    rating: "5.00",
    reviews: 67,
    price: 2100,
    category: "Culture",
    photo:
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1000&q=85",
    initials: "MI",
    accent: "#b7653e",
  },
  {
    id: 4,
    name: "Arjun Rathore",
    city: "Agra",
    title: "The Taj at sunrise, told through its details",
    languages: ["English", "Hindi", "Spanish"],
    rating: "4.94",
    reviews: 103,
    price: 1950,
    category: "Heritage",
    photo:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1000&q=85",
    initials: "AR",
    accent: "#75856a",
  },
  {
    id: 5,
    name: "Zoya Khan",
    city: "Jaipur",
    title: "Block-printing studios & local craft",
    languages: ["English", "Hindi", "Urdu"],
    rating: "4.97",
    reviews: 76,
    price: 1650,
    category: "Art & craft",
    photo:
      "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=1000&q=85",
    initials: "ZK",
    accent: "#9a6c3e",
  },
  {
    id: 6,
    name: "Dev Malhotra",
    city: "Delhi",
    title: "Hidden courtyards of Lutyens' Delhi",
    languages: ["English", "Hindi", "German"],
    rating: "4.91",
    reviews: 58,
    price: 1750,
    category: "Architecture",
    photo:
      "https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=1000&q=85",
    initials: "DM",
    accent: "#667a86",
  },
];

const categories = [
  "All experiences",
  "Heritage",
  "Food & markets",
  "Art & craft",
  "Culture",
];

const cities = ["Everywhere", "Jaipur", "Delhi", "Varanasi", "Agra"];
const rupees = new Intl.NumberFormat("en-IN");

export default function Home() {
  const [city, setCity] = useState("Everywhere");
  const [category, setCategory] = useState("All experiences");
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [guestName, setGuestName] = useState("");

  const visibleGuides = useMemo(
    () =>
      guides.filter(
        (guide) =>
          (city === "Everywhere" || guide.city === city) &&
          (category === "All experiences" || guide.category === category),
      ),
    [city, category],
  );

  function openBooking(guide: Guide) {
    setSelectedGuide(guide);
    setBookingComplete(false);
    setGuestName("");
  }

  function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBookingComplete(true);
  }

  return (
    <main>
      <div className="demo-banner">
        <span className="demo-dot" />
        Preview mode · Sample guides and bookings
        <span className="banner-separator">|</span>
        Your next story starts here
      </div>

      <header className="site-header">
        <a className="wordmark" href="#" aria-label="BharatGuide home">
          <span className="wordmark-icon" aria-hidden="true">b.</span>
          <span>bharat<span className="wordmark-light">guide</span></span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#experiences">Explore</a>
          <a href="#how-it-works">How it works</a>
        </nav>
        <a className="guide-link" href="#experiences">
          Find your guide <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span /> INDIA, IN GOOD COMPANY</p>
          <h1>
            The best way
            <br />
            to find <em>your</em> India.
          </h1>
          <p className="hero-description">
            Skip the guidebook. Meet the people who call this place home, and
            see India through their eyes.
          </p>
          <a className="text-link" href="#experiences">
            Find your kind of day <span aria-hidden="true">↓</span>
          </a>
          <div className="hero-proof">
            <div className="avatar-stack" aria-hidden="true">
              <span className="stack-avatar stack-one">A</span>
              <span className="stack-avatar stack-two">K</span>
              <span className="stack-avatar stack-three">M</span>
              <span className="stack-avatar stack-four">+</span>
            </div>
            <span>Good people. Great stories. Always local.</span>
          </div>
        </div>
        <div className="hero-visual" aria-label="The Taj Mahal at sunrise">
          <div className="hero-image" />
          <div className="image-note">
            <span className="note-icon" aria-hidden="true">✳</span>
            <span><strong>More than a landmark.</strong><br />A story worth hearing.</span>
          </div>
          <span className="image-location"><span /> AGRA, UTTAR PRADESH</span>
        </div>
        <div className="hero-stamp" aria-hidden="true">
          <span>MADE OF</span>
          <strong>many<br />Indias</strong>
          <span>ONE GOOD DAY</span>
        </div>
      </section>

      <section className="trust-strip" aria-label="BharatGuide values">
        <p><span>✳</span> Real local people</p>
        <i />
        <p><span>✳</span> Small groups, big stories</p>
        <i />
        <p><span>✳</span> Your kind of India</p>
        <i />
        <p><span>✳</span> Thoughtfully put together</p>
      </section>

      <section className="experiences section-wrap" id="experiences">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span /> GOOD DAYS, GUIDED BY LOCALS</p>
            <h2>Find your <em>somewhere.</em></h2>
            <p className="section-description">
              A food trail, a hidden lane, a story you didn&apos;t know you needed.
              Start wherever you are.
            </p>
          </div>
          <label className="city-select">
            <span className="select-icon" aria-hidden="true">⌖</span>
            <span className="select-copy"><small>I&apos;M EXPLORING</small>
              <select
                aria-label="Filter guides by city"
                value={city}
                onChange={(event) => setCity(event.target.value)}
              >
                {cities.map((item) => <option key={item}>{item}</option>)}
              </select>
            </span>
            <span className="select-arrow" aria-hidden="true">⌄</span>
          </label>
        </div>

        <div className="experience-toolbar">
          <div className="category-list" aria-label="Filter by experience">
            {categories.map((item) => (
              <button
                className={`category-chip${category === item ? " active" : ""}`}
                key={item}
                type="button"
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <span className="result-count">
            {visibleGuides.length} {visibleGuides.length === 1 ? "local" : "locals"}
          </span>
        </div>

        {visibleGuides.length > 0 ? (
          <div className="guide-grid">
            {visibleGuides.map((guide) => (
              <article className="guide-card" key={guide.id}>
                <div
                  className="guide-photo"
                  style={{ backgroundImage: `url("${guide.photo}")` }}
                  role="img"
                  aria-label={`${guide.city}, India`}
                >
                  <span className="guide-category">{guide.category}</span>
                  <span className="rating"><span aria-hidden="true">★</span> {guide.rating} <small>({guide.reviews})</small></span>
                </div>
                <div className="guide-info">
                  <div className="guide-byline">
                    <span className="guide-avatar" style={{ backgroundColor: guide.accent }}>{guide.initials}</span>
                    <span>{guide.name} <span className="verified" title="Local guide">✳</span></span>
                    <span className="guide-city">{guide.city}</span>
                  </div>
                  <h3>{guide.title}</h3>
                  <p className="guide-languages">{guide.languages.join(" · ")}</p>
                  <div className="guide-card-footer">
                    <p><strong>₹{rupees.format(guide.price)}</strong> <span>/ person</span></p>
                    <button type="button" className="book-button" onClick={() => openBooking(guide)}>
                      Meet {guide.name.split(" ")[0]} <span aria-hidden="true">↗</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span aria-hidden="true">✳</span>
            <h3>No guides in that combination just yet.</h3>
            <p>Try another city or experience to find your local.</p>
            <button type="button" onClick={() => { setCity("Everywhere"); setCategory("All experiences"); }}>
              Show all experiences
            </button>
          </div>
        )}
      </section>

      <section className="how-it-works" id="how-it-works">
        <div className="how-copy">
          <p className="eyebrow"><span /> A LITTLE LESS TOURIST, A LITTLE MORE YOU</p>
          <h2>It starts with<br />a <em>hello.</em></h2>
          <p>Good travel isn&apos;t about ticking off places. It&apos;s about the people who make you feel like you belong there.</p>
        </div>
        <div className="steps">
          <article><span>01</span><div><h3>Find your feeling</h3><p>Tell us where you&apos;re headed and what makes a day feel like yours.</p></div></article>
          <article><span>02</span><div><h3>Meet your local</h3><p>Browse thoughtful experiences led by people who know their city by heart.</p></div></article>
          <article><span>03</span><div><h3>Make a memory</h3><p>Send a booking request and get ready to see a familiar place in a new way.</p></div></article>
        </div>
      </section>

      <footer className="site-footer">
        <a className="wordmark footer-wordmark" href="#" aria-label="BharatGuide home">
          <span className="wordmark-icon" aria-hidden="true">b.</span>
          <span>bharat<span className="wordmark-light">guide</span></span>
        </a>
        <p>See India with someone who calls it home.</p>
        <span className="footer-note">A demo made with care in India <span aria-hidden="true">✳</span></span>
      </footer>

      {selectedGuide && (
        <div className="modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSelectedGuide(null);
        }}>
          <section className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title">
            <button className="modal-close" aria-label="Close booking" type="button" onClick={() => setSelectedGuide(null)}>×</button>
            {bookingComplete ? (
              <div className="confirmation">
                <span className="confirmation-mark" aria-hidden="true">✓</span>
                <p className="eyebrow"><span /> REQUEST SENT</p>
                <h2>You&apos;re one step<br />closer to <em>{selectedGuide.city}.</em></h2>
                <p className="confirmation-copy">
                  Thanks, {guestName}. Your demo request to meet {selectedGuide.name} is in. In a live BharatGuide, your local would confirm the details with you.
                </p>
                <div className="confirmation-reference">DEMO REQUEST <strong>BG-DEMO-042</strong></div>
                <button className="submit-booking" type="button" onClick={() => setSelectedGuide(null)}>Lovely, thanks</button>
              </div>
            ) : (
              <>
                <p className="eyebrow"><span /> YOUR DAY, YOUR WAY</p>
                <h2 id="booking-title">Meet {selectedGuide.name.split(" ")[0]}.</h2>
                <p className="modal-description">{selectedGuide.title} · {selectedGuide.city}</p>
                <div className="modal-price"><strong>₹{rupees.format(selectedGuide.price)}</strong> per person <span>· approx. 3 hours</span></div>
                <form className="booking-form" onSubmit={submitBooking}>
                  <label>
                    Your name
                    <input required autoComplete="name" value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder="What should your guide call you?" />
                  </label>
                  <label>
                    Preferred date
                    <input required type="date" min={new Date().toISOString().split("T")[0]} />
                  </label>
                  <label>
                    Number of guests
                    <select defaultValue="2">
                      <option value="1">Just me</option>
                      <option value="2">2 guests</option>
                      <option value="3">3 guests</option>
                      <option value="4">4 guests</option>
                      <option value="5">5+ guests</option>
                    </select>
                  </label>
                  <button className="submit-booking" type="submit">Send a booking request <span aria-hidden="true">↗</span></button>
                  <p className="demo-disclaimer">This is a demo request. No payment is taken and no real booking is created.</p>
                </form>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
