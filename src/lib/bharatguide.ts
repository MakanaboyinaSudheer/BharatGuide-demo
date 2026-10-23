export type Role = "tourist" | "guide";
export type Currency = "INR" | "USD" | "EUR" | "GBP";
export type BookingStatus = "requested" | "accepted" | "declined" | "ongoing" | "completed";

export type Guide = {
  id: string;
  name: string;
  city: string;
  title: string;
  languages: string[];
  rating: number;
  reviews: number;
  price: number;
  theme: string;
  photo: string;
  initials: string;
  accent: string;
  certified: boolean;
  policeCleared: boolean;
  introduction: string;
  custom?: boolean;
};

export type Booking = {
  id: string;
  guideId: string;
  guideName: string;
  city: string;
  traveler: string;
  date: string;
  time: string;
  theme: string;
  addons: string[];
  guests: number;
  total: number;
  status: BookingStatus;
  createdAt: string;
};

export type Review = {
  id: string;
  guideId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
};

export type EmergencyLog = {
  id: string;
  message: string;
  time: string;
};

export type AppState = {
  role: Role;
  authenticated: boolean;
  touristName: string;
  guideName: string;
  currency: Currency;
  bookings: Booking[];
  customGuides: Guide[];
  reviews: Review[];
  available: boolean;
  verification: { idDocument: string; policeClearance: string };
  emergencyLogs: EmergencyLog[];
};

export const guides: Guide[] = [
  {
    id: "aanya",
    name: "Aanya Sharma",
    city: "Jaipur",
    title: "The pink city, beyond the palaces",
    languages: ["English", "Hindi", "French"],
    rating: 4.98,
    reviews: 124,
    price: 1800,
    theme: "Mughal architecture",
    photo: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1000&q=85",
    initials: "AS",
    accent: "#b35c42",
    certified: true,
    policeCleared: true,
    introduction: "I grew up among Jaipur's pink lanes. Let me take you past the postcard views to the small workshops, family kitchens and quiet courtyards that make this city feel like home.",
  },
  {
    id: "kabir",
    name: "Kabir Mehta",
    city: "Delhi",
    title: "Old Delhi, one delicious bite at a time",
    languages: ["English", "Hindi", "German"],
    rating: 4.96,
    reviews: 89,
    price: 1500,
    theme: "Culinary food walk",
    photo: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=85",
    initials: "KM",
    accent: "#3a746a",
    certified: true,
    policeCleared: true,
    introduction: "My Delhi is best understood one bite at a time. Come hungry for old recipes, market stories and the neighborhood stalls I have loved since childhood.",
  },
  {
    id: "meera",
    name: "Meera Iyer",
    city: "Varanasi",
    title: "A quieter morning on the ghats",
    languages: ["English", "Hindi", "French"],
    rating: 5,
    reviews: 67,
    price: 2100,
    theme: "Spiritual dawn tour",
    photo: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1000&q=85",
    initials: "MI",
    accent: "#b7653e",
    certified: true,
    policeCleared: true,
    introduction: "At sunrise, Varanasi tells a gentler story. I will help you meet the river, the rituals and the makers of this remarkable city with curiosity and respect.",
  },
  {
    id: "arjun",
    name: "Arjun Rathore",
    city: "Agra",
    title: "The Taj at sunrise, told through its details",
    languages: ["English", "Hindi", "Spanish"],
    rating: 4.94,
    reviews: 103,
    price: 1950,
    theme: "Mughal architecture",
    photo: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1000&q=85",
    initials: "AR",
    accent: "#75856a",
    certified: true,
    policeCleared: true,
    introduction: "The Taj Mahal is more than a monument. As a local history enthusiast, I love sharing the craftsmanship, gardens and lesser-known stories behind its famous silhouette.",
  },
  {
    id: "zoya",
    name: "Zoya Khan",
    city: "Mumbai",
    title: "A city of many homes, seen on foot",
    languages: ["English", "Hindi", "German"],
    rating: 4.97,
    reviews: 76,
    price: 1650,
    theme: "Culinary food walk",
    photo: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=85",
    initials: "ZK",
    accent: "#9a6c3e",
    certified: true,
    policeCleared: true,
    introduction: "Mumbai is a hundred neighborhoods in one. We will follow the aromas, architecture and sea breeze that connect the city, with plenty of time for chai.",
  },
  {
    id: "dev",
    name: "Dev Malhotra",
    city: "Kochi",
    title: "Slow stories of Fort Kochi",
    languages: ["English", "Hindi", "Spanish"],
    rating: 4.91,
    reviews: 58,
    price: 1750,
    theme: "Spiritual dawn tour",
    photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=85",
    initials: "DM",
    accent: "#667a86",
    certified: true,
    policeCleared: true,
    introduction: "I collect the stories hidden in Fort Kochi's lanes: seafaring families, old spice shops and the quiet beauty of a town shaped by many cultures.",
  },
];

export const cities = ["Everywhere", "Delhi", "Agra", "Jaipur", "Varanasi", "Mumbai", "Kochi"];
export const languages = ["Any language", "English", "French", "German", "Spanish"];
export const themes = [
  "All themes",
  "Mughal architecture",
  "Culinary food walk",
  "Spiritual dawn tour",
];

export const initialState: AppState = {
  role: "tourist",
  authenticated: false,
  touristName: "Alex Morgan",
  guideName: "Aanya Sharma",
  currency: "INR",
  bookings: [],
  customGuides: [],
  reviews: [],
  available: true,
  verification: { idDocument: "", policeClearance: "" },
  emergencyLogs: [],
};

const currencyConfig: Record<Currency, { rate: number; locale: string; symbol: string }> = {
  INR: { rate: 1, locale: "en-IN", symbol: "₹" },
  USD: { rate: 0.012, locale: "en-US", symbol: "$" },
  EUR: { rate: 0.011, locale: "de-DE", symbol: "€" },
  GBP: { rate: 0.0095, locale: "en-GB", symbol: "£" },
};

export function formatPrice(amountInRupees: number, currency: Currency) {
  const config = currencyConfig[currency];
  return `${config.symbol}${new Intl.NumberFormat(config.locale, {
    maximumFractionDigits: currency === "INR" ? 0 : 2,
    minimumFractionDigits: currency === "INR" ? 0 : 2,
  }).format(amountInRupees * config.rate)}`;
}
