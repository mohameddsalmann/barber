import logoUrl from "@/assets/adham-gabriil-logo.png";
import portfolioImg1 from "@/assets/portfolio/images.jpg";
import portfolioImg2 from "@/assets/portfolio/images (1).jpg";
import portfolioImg3 from "@/assets/portfolio/images (2).jpg";
import portfolioImg4 from "@/assets/portfolio/images (3).jpg";
import portfolioImg5 from "@/assets/portfolio/images (4).jpg";
import portfolioImg6 from "@/assets/portfolio/images (5).jpg";
import portfolioImg7 from "@/assets/portfolio/textured-faux-hawk.jpg";

export { logoUrl };

export type ClockStatus = "in" | "out" | "break";

export type BarberReview = {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
};

export type Barber = {
  id: string;
  name: string;
  specialty: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  status: ClockStatus;
  avatar: string;
  bio: string;
  todayEarnings: number;
  totalClients: number;
  yearsExperience: number;
  todayCuts: number;
  portfolio: string[];
  barberReviews: BarberReview[];
  weeklySchedule: Record<string, string>;
};

export type HairstyleResult = {
  id: string;
  name: string;
  confidence: number;
  imageUrl: string;
};

export type StyleOption = {
  id: string;
  name: string;
  category: "Fades" | "Crops" | "Classic" | "Textured" | "Long";
  icon: string;
};

export type Service = {
  id: string;
  name: string;
  price: number;
  duration: number; // minutes
};

export type BookingStatus = "waiting" | "in-service" | "done" | "cancelled" | "no-show";

export type Booking = {
  id: string;
  clientName: string;
  clientId?: string;
  barberId: string;
  serviceId: string;
  time: string; // HH:MM
  status: BookingStatus;
  waitMin: number;
};

export type LoyaltyTier = "bronze" | "silver" | "gold" | "vip";

export type Client = {
  id: string;
  name: string;
  phone: string;
  email: string;
  visits: number;
  ltv: number;
  lastVisit: string;
  tier: LoyaltyTier;
  notes?: string;
  avatar: string;
};

const av = (seed: string) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=18181B,27272A&textColor=D4AF37`;

const pic = (id: number) => `https://picsum.photos/seed/barber${id}/400/400`;

export const barbers: Barber[] = [
  {
    id: "b1",
    name: "Ahmed Khalil",
    specialty: "Fade Specialist",
    tags: ["Fades", "Skin Fades", "Beard"],
    rating: 4.9,
    reviewCount: 312,
    status: "in",
    avatar: av("Ahmed Khalil"),
    bio: "Master barber with 12 years of experience. Specialized in modern fades and beard sculpting.",
    todayEarnings: 240,
    totalClients: 420,
    yearsExperience: 12,
    todayCuts: 6,
    portfolio: [portfolioImg1, portfolioImg2, portfolioImg3, portfolioImg4, portfolioImg5, portfolioImg6],
    barberReviews: [
      { id: "br1", clientName: "Karim El-Sayed", rating: 5, comment: "Best fade in the city. Ahmed is a wizard.", date: "2026-04-25", avatar: av("Karim") },
      { id: "br2", clientName: "Omar Hassan", rating: 5, comment: "Always consistent. Never lets me down.", date: "2026-04-20", avatar: av("Omar") },
      { id: "br3", clientName: "Noah Mitchell", rating: 4, comment: "Great cut, slight wait but worth it.", date: "2026-04-18", avatar: av("Noah") },
    ],
    weeklySchedule: { mon: "9am–6pm", tue: "9am–6pm", wed: "9am–6pm", thu: "9am–7pm", fri: "9am–7pm", sat: "10am–5pm", sun: "Off" },
  },
  {
    id: "b2",
    name: "Marcus Johnson",
    specialty: "Beard Expert",
    tags: ["Beards", "Hot Towel", "Shaves"],
    rating: 4.7,
    reviewCount: 198,
    status: "in",
    avatar: av("Marcus Johnson"),
    bio: "Beard sculptor and hot-towel shave artisan. Old-school precision, modern style.",
    todayEarnings: 195,
    totalClients: 310,
    yearsExperience: 8,
    todayCuts: 4,
    portfolio: [portfolioImg7, portfolioImg1, portfolioImg2, portfolioImg3, portfolioImg4, portfolioImg5],
    barberReviews: [
      { id: "br4", clientName: "David Park", rating: 5, comment: "The hot towel shave experience is unmatched.", date: "2026-04-22", avatar: av("David") },
      { id: "br5", clientName: "Liam Brooks", rating: 4, comment: "Solid beard trim, very precise lines.", date: "2026-04-15", avatar: av("Liam") },
      { id: "br6", clientName: "Sofia Torres", rating: 5, comment: "Clean shop, professional staff, beautiful work.", date: "2026-04-10", avatar: av("Sofia") },
    ],
    weeklySchedule: { mon: "10am–6pm", tue: "10am–6pm", wed: "10am–6pm", thu: "10am–7pm", fri: "10am–7pm", sat: "10am–4pm", sun: "Off" },
  },
  {
    id: "b3",
    name: "Youssef Nasser",
    specialty: "Color & Cuts",
    tags: ["Color", "Highlights", "Cuts"],
    rating: 4.8,
    reviewCount: 156,
    status: "break",
    avatar: av("Youssef Nasser"),
    bio: "Color specialist trained in Beirut and Paris. Bringing editorial-quality color to every chair.",
    todayEarnings: 310,
    totalClients: 240,
    yearsExperience: 6,
    todayCuts: 3,
    portfolio: [portfolioImg6, portfolioImg7, portfolioImg1, portfolioImg2, portfolioImg3, portfolioImg4],
    barberReviews: [
      { id: "br7", clientName: "Noah Mitchell", rating: 5, comment: "Color came out exactly like the reference photo.", date: "2026-04-26", avatar: av("Noah") },
      { id: "br8", clientName: "Ethan Wright", rating: 5, comment: "Incredible highlights. Gets compliments everywhere.", date: "2026-04-19", avatar: av("Ethan") },
      { id: "br9", clientName: "Lucas Reyes", rating: 4, comment: "Great color work, took a bit longer than expected.", date: "2026-04-12", avatar: av("Lucas") },
    ],
    weeklySchedule: { mon: "9am–5pm", tue: "9am–5pm", wed: "Off", thu: "9am–6pm", fri: "9am–6pm", sat: "10am–4pm", sun: "Off" },
  },
  {
    id: "b4",
    name: "James Carter",
    specialty: "Classic Cuts",
    tags: ["Classic", "Pompadour", "Side Part"],
    rating: 4.6,
    reviewCount: 87,
    status: "out",
    avatar: av("James Carter"),
    bio: "Heritage barber. Pompadours, side parts, and timeless gentleman's cuts.",
    todayEarnings: 0,
    totalClients: 150,
    yearsExperience: 15,
    todayCuts: 0,
    portfolio: [portfolioImg5, portfolioImg6, portfolioImg7, portfolioImg1, portfolioImg2, portfolioImg3],
    barberReviews: [
      { id: "br10", clientName: "Aiden Walsh", rating: 5, comment: "Best pompadour I've ever had. True craftsman.", date: "2026-04-23", avatar: av("Aiden") },
      { id: "br11", clientName: "James Okafor", rating: 4, comment: "Classic side part, clean and sharp.", date: "2026-04-16", avatar: av("James O") },
      { id: "br12", clientName: "Karim El-Sayed", rating: 4, comment: "Old-school vibe, great attention to detail.", date: "2026-04-09", avatar: av("Karim") },
    ],
    weeklySchedule: { mon: "8am–4pm", tue: "8am–4pm", wed: "8am–4pm", thu: "8am–4pm", fri: "Off", sat: "Off", sun: "Off" },
  },
];

export const services: Service[] = [
  { id: "s1", name: "Haircut", price: 25, duration: 30 },
  { id: "s2", name: "Fade", price: 35, duration: 45 },
  { id: "s3", name: "Beard Trim", price: 20, duration: 20 },
  { id: "s4", name: "Hair + Beard", price: 50, duration: 60 },
  { id: "s5", name: "Kids Cut", price: 18, duration: 25 },
  { id: "s6", name: "Hair Color", price: 75, duration: 90 },
];

export const products = [
  { id: "p1", name: "Pomade", price: 22 },
  { id: "p2", name: "Beard Oil", price: 28 },
  { id: "p3", name: "Shampoo", price: 18 },
  { id: "p4", name: "Wax", price: 24 },
];

export const todayQueue: Booking[] = [
  { id: "q1", clientName: "Karim El-Sayed", clientId: "c1", barberId: "b1", serviceId: "s2", time: "09:30", status: "in-service", waitMin: 0 },
  { id: "q2", clientName: "Sofia Torres", clientId: "c2", barberId: "b1", serviceId: "s1", time: "10:00", status: "waiting", waitMin: 12 },
  { id: "q3", clientName: "James Okafor", clientId: "c3", barberId: "b1", serviceId: "s4", time: "10:45", status: "waiting", waitMin: 28 },
  { id: "q4", clientName: "David Park", barberId: "b2", serviceId: "s3", time: "09:45", status: "in-service", waitMin: 0 },
  { id: "q5", clientName: "Omar Hassan", barberId: "b2", serviceId: "s4", time: "10:30", status: "waiting", waitMin: 18 },
  { id: "q6", clientName: "Liam Brooks", barberId: "b2", serviceId: "s1", time: "11:15", status: "waiting", waitMin: 45 },
  { id: "q7", clientName: "Noah Mitchell", barberId: "b3", serviceId: "s6", time: "11:00", status: "waiting", waitMin: 35 },
  { id: "q8", clientName: "Ethan Wright", barberId: "b3", serviceId: "s2", time: "13:00", status: "waiting", waitMin: 90 },
  { id: "q9", clientName: "Lucas Reyes", barberId: "b4", serviceId: "s1", time: "14:00", status: "waiting", waitMin: 150 },
  { id: "q10", clientName: "Aiden Walsh", barberId: "b4", serviceId: "s4", time: "15:30", status: "waiting", waitMin: 240 },
];

export const clients: Client[] = [
  { id: "c1", name: "Karim El-Sayed", phone: "+1 (415) 555-0142", email: "karim@example.com", visits: 48, ltv: 2400, lastVisit: "2026-04-25", tier: "vip", notes: "Prefers Ahmed. No.2 fade with hard part.", avatar: av("Karim El-Sayed") },
  { id: "c2", name: "Sofia Torres", phone: "+1 (415) 555-0188", email: "sofia@example.com", visits: 12, ltv: 580, lastVisit: "2026-04-18", tier: "silver", notes: "Allergic to certain pomades. Use natural products.", avatar: av("Sofia Torres") },
  { id: "c3", name: "James Okafor", phone: "+1 (415) 555-0103", email: "james@example.com", visits: 2, ltv: 85, lastVisit: "2026-04-22", tier: "bronze", notes: "New client. Likes textured crops.", avatar: av("James Okafor") },
  { id: "c4", name: "Omar Hassan", phone: "+1 (415) 555-0167", email: "omar@example.com", visits: 26, ltv: 1300, lastVisit: "2026-04-20", tier: "gold", avatar: av("Omar Hassan") },
  { id: "c5", name: "David Park", phone: "+1 (415) 555-0125", email: "david@example.com", visits: 18, ltv: 720, lastVisit: "2026-04-15", tier: "silver", avatar: av("David Park") },
  { id: "c6", name: "Liam Brooks", phone: "+1 (415) 555-0177", email: "liam@example.com", visits: 4, ltv: 140, lastVisit: "2026-03-28", tier: "bronze", avatar: av("Liam Brooks") },
  { id: "c7", name: "Noah Mitchell", phone: "+1 (415) 555-0192", email: "noah@example.com", visits: 31, ltv: 1820, lastVisit: "2026-04-26", tier: "gold", avatar: av("Noah Mitchell") },
  { id: "c8", name: "Ethan Wright", phone: "+1 (415) 555-0156", email: "ethan@example.com", visits: 8, ltv: 320, lastVisit: "2026-02-10", tier: "bronze", avatar: av("Ethan Wright") },
  { id: "c9", name: "Lucas Reyes", phone: "+1 (415) 555-0148", email: "lucas@example.com", visits: 22, ltv: 980, lastVisit: "2026-04-24", tier: "silver", avatar: av("Lucas Reyes") },
  { id: "c10", name: "Aiden Walsh", phone: "+1 (415) 555-0119", email: "aiden@example.com", visits: 1, ltv: 35, lastVisit: "2026-04-26", tier: "bronze", avatar: av("Aiden Walsh") },
];

export const revenueWeek = [
  { day: "Mon", revenue: 820 },
  { day: "Tue", revenue: 1240 },
  { day: "Wed", revenue: 980 },
  { day: "Thu", revenue: 1840 },
  { day: "Fri", revenue: 2100 },
  { day: "Sat", revenue: 1650 },
  { day: "Sun", revenue: 420 },
];

export const barberEarningsWeek = [
  { day: "Mon", earned: 180 },
  { day: "Tue", earned: 240 },
  { day: "Wed", earned: 210 },
  { day: "Thu", earned: 320 },
  { day: "Fri", earned: 380 },
  { day: "Sat", earned: 290 },
  { day: "Sun", earned: 0 },
];

export const topServices = [
  { name: "Fade", value: 142 },
  { name: "Haircut", value: 98 },
  { name: "Hair + Beard", value: 76 },
  { name: "Beard Trim", value: 54 },
  { name: "Hair Color", value: 22 },
  { name: "Kids Cut", value: 18 },
];

export const barberPerformance = [
  { name: "Ahmed", revenue: 1820, clients: 42 },
  { name: "Marcus", revenue: 1450, clients: 38 },
  { name: "Youssef", revenue: 1980, clients: 28 },
  { name: "James", revenue: 980, clients: 22 },
];

export const styleOptions: StyleOption[] = [
  { id: "s1", name: "Skin Fade", category: "Fades", icon: "✂️" },
  { id: "s2", name: "High Fade", category: "Fades", icon: "✂️" },
  { id: "s3", name: "Drop Fade", category: "Fades", icon: "✂️" },
  { id: "s4", name: "Low Taper", category: "Fades", icon: "✂️" },
  { id: "s5", name: "Textured Crop", category: "Crops", icon: "🌾" },
  { id: "s6", name: "French Crop", category: "Crops", icon: "🌾" },
  { id: "s7", name: "Caesar", category: "Crops", icon: "🌾" },
  { id: "s8", name: "Crew Cut", category: "Crops", icon: "🌾" },
  { id: "s9", name: "Pompadour", category: "Classic", icon: "🎩" },
  { id: "s10", name: "Side Part", category: "Classic", icon: "🎩" },
  { id: "s11", name: "Quiff", category: "Classic", icon: "🎩" },
  { id: "s12", name: "Buzz Cut", category: "Textured", icon: "🧩" },
  { id: "s13", name: "Undercut", category: "Textured", icon: "🧩" },
  { id: "s14", name: "Hard Part", category: "Textured", icon: "🧩" },
  { id: "s15", name: "Long Layers", category: "Long", icon: "💇" },
  { id: "s16", name: "Curly Top", category: "Long", icon: "💇" },
];

export const hairstyleResults: HairstyleResult[] = [
  { id: "h1", name: "Textured Crop", confidence: 94, imageUrl: pic(501) },
  { id: "h2", name: "High Fade", confidence: 91, imageUrl: pic(502) },
  { id: "h3", name: "French Crop", confidence: 88, imageUrl: pic(503) },
  { id: "h4", name: "Buzz Cut", confidence: 85, imageUrl: pic(504) },
  { id: "h5", name: "Caesar", confidence: 82, imageUrl: pic(505) },
  { id: "h6", name: "Quiff", confidence: 79, imageUrl: pic(506) },
  { id: "h7", name: "Undercut", confidence: 76, imageUrl: pic(507) },
  { id: "h8", name: "Skin Fade", confidence: 73, imageUrl: pic(508) },
  { id: "h9", name: "Pompadour", confidence: 70, imageUrl: pic(509) },
  { id: "h10", name: "Drop Fade", confidence: 67, imageUrl: pic(510) },
];

export const nearbyShops = [
  { id: "shop1", name: "Adham Gabriil — Downtown", waitMin: 8, distance: "0.4 mi" },
  { id: "shop2", name: "Adham Gabriil — Marina", waitMin: 22, distance: "1.2 mi" },
  { id: "shop3", name: "Adham Gabriil — Mission", waitMin: 35, distance: "2.1 mi" },
];

export const visitHistory = [
  { date: "2026-04-25", barber: "Ahmed Khalil", service: "Fade", spent: 35 },
  { date: "2026-04-04", barber: "Ahmed Khalil", service: "Hair + Beard", spent: 50 },
  { date: "2026-03-14", barber: "Marcus Johnson", service: "Beard Trim", spent: 20 },
  { date: "2026-02-28", barber: "Ahmed Khalil", service: "Fade", spent: 35 },
  { date: "2026-02-08", barber: "Ahmed Khalil", service: "Haircut", spent: 25 },
];

export const reviews = [
  { id: "r1", client: "Karim E.", rating: 5, comment: "Best fade in the city. Ahmed is a wizard.", date: "2026-04-25" },
  { id: "r2", client: "Sofia T.", rating: 5, comment: "Clean shop, professional staff, beautiful work.", date: "2026-04-18" },
  { id: "r3", client: "Omar H.", rating: 4, comment: "Great cut, slight wait but worth it.", date: "2026-04-20" },
  { id: "r4", client: "Noah M.", rating: 5, comment: "Color came out exactly like the reference.", date: "2026-04-26" },
];

export const teamMembers = [
  { id: "t1", name: "Adham Gabriil", role: "Owner", email: "adham@artofgents.com" },
  { id: "t2", name: "Ahmed Khalil", role: "Senior Barber", email: "ahmed@artofgents.com" },
  { id: "t3", name: "Marcus Johnson", role: "Barber", email: "marcus@artofgents.com" },
  { id: "t4", name: "Layla Said", role: "Manager", email: "layla@artofgents.com" },
];

export const statusBadge: Record<BookingStatus, { label: string; color: string; bg: string }> = {
  waiting: { label: "Waiting", color: "#D97706", bg: "rgba(217,119,6,0.15)" },
  "in-service": { label: "In Service", color: "#D4AF37", bg: "rgba(212,175,55,0.15)" },
  done: { label: "Done", color: "#16A34A", bg: "rgba(22,163,74,0.15)" },
  cancelled: { label: "Cancelled", color: "#A1A1AA", bg: "rgba(161,161,170,0.15)" },
  "no-show": { label: "No-show", color: "#DC2626", bg: "rgba(220,38,38,0.15)" },
};

export const tierBadge: Record<LoyaltyTier, { label: string; color: string }> = {
  bronze: { label: "Bronze", color: "#B87333" },
  silver: { label: "Silver", color: "#C0C0C0" },
  gold: { label: "Gold", color: "#D4AF37" },
  vip: { label: "VIP", color: "#F43F5E" },
};

export const getService = (id: string) => services.find((s) => s.id === id)!;
export const getBarber = (id: string) => barbers.find((b) => b.id === id)!;
export const getClient = (id: string) => clients.find((c) => c.id === id);
