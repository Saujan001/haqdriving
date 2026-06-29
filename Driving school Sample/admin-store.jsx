/* ===== R2 Admin — data store ===== */
const STORE_KEY = "r2admin_v1";

const INITIAL_DATA = {
  business: {
    name: "Right 2 Drive",
    tagline: "Driving School · Minto NSW",
  },
  hero: {
    headline: "Learn to Drive with [Confidence]",
    subtext: "Professional driving lessons in Minto and surrounding Sydney suburbs. Patient instruction, flexible lesson times, and support for learners of all experience levels.",
  },
  stats: [
    { id: "s1", value: "500+", label: "Students Trained" },
    { id: "s2", value: "95%", label: "Test Pass Rate" },
    { id: "s3", value: "5", label: "Star Reviews" },
    { id: "s4", value: "7 Days", label: "Flexible Lesson Times" },
  ],
  sections: [
    { id: "why", label: "Why Choose Us", desc: "6 feature cards grid", on: true },
    { id: "lessons", label: "Lesson Types", desc: "4 lesson category cards", on: true },
    { id: "stats", label: "Stats Bar", desc: "Navy band with 4 key numbers", on: true },
    { id: "stories", label: "Success Stories", desc: "Student testimonial carousel", on: true },
    { id: "reviews", label: "Google Reviews", desc: "Live or manual Google reviews", on: true },
    { id: "packages", label: "Lesson Packages", desc: "Pricing cards", on: true },
    { id: "areas", label: "Service Areas", desc: "Suburb pills + map", on: true },
    { id: "faq", label: "FAQ", desc: "Accordion of common questions", on: true },
  ],
  branding: {
    primary: "#1E3A5F",
    accent: "#2563EB",
    logoText: "R2",
  },
  photos: [
    { id: "p1", name: "Emily R.", suburb: "Minto", quote: "Passed my driving test on the first attempt. The instructor was patient and explained everything clearly.", rating: 5 },
    { id: "p2", name: "Jake V.", suburb: "Campbelltown", quote: "Very professional and friendly. Helped me gain confidence behind the wheel.", rating: 5 },
    { id: "p3", name: "Sophie L.", suburb: "Ingleburn", quote: "Excellent lessons and great knowledge of local test routes.", rating: 5 },
    { id: "p4", name: "Kevin T.", suburb: "Glenfield", quote: "Booked the 10 lesson package. Great value and I felt completely ready on test day.", rating: 5 },
    { id: "p5", name: "Mia B.", suburb: "Macquarie Fields", quote: "Got my P plates thanks to Right 2 Drive! The instructor made me feel calm and prepared.", rating: 5 },
    { id: "p6", name: "Aaron D.", suburb: "Leumeah", quote: "So patient with me — I was a nervous driver but passed on my second go.", rating: 5 },
  ],
  packages: [
    { id: "pk1", name: "Single Lesson", price: "$75", duration: "/ 1 hour", popular: false, button: "Book Now",
      feats: ["1 hour driving lesson", "Pick-up & drop-off", "Automatic vehicle"] },
    { id: "pk2", name: "5 Lesson Package", price: "$345", duration: "/ 5 hours", popular: true, button: "Book Now",
      feats: ["5 × 1hr lessons", "Personalised lesson plan", "Save $30 vs single lessons"] },
    { id: "pk3", name: "10 Lesson Package", price: "$650", duration: "/ 10 hours", popular: false, button: "Book Now",
      feats: ["10 × 1hr lessons", "Full test preparation", "Best value — save $100"] },
  ],
  faqs: [
    { id: "f1", q: "How long is each lesson?", a: "Standard lessons run for 1 hour, but we also offer 1.5 and 2 hour sessions which many learners prefer for faster progress. Test-day packages include a warm-up lesson before your assessment." },
    { id: "f2", q: "Do you provide the car for the driving test?", a: "Yes. Our dual-control automatic vehicle is available for your NSW driving test, including a pre-test warm-up lesson so you feel comfortable and ready." },
    { id: "f3", q: "Do you offer automatic lessons?", a: "All of our lessons are conducted in modern automatic vehicles, which most learners find easier and less stressful to master." },
    { id: "f4", q: "Can beginners start with no experience?", a: "Absolutely. Many of our students have never been behind the wheel before. We start with the basics in quiet streets and build up gradually at your own pace." },
    { id: "f5", q: "What areas do you service?", a: "We're based in Minto and service the surrounding Sydney South West suburbs including Campbelltown, Ingleburn, Leumeah, Macquarie Fields, Glenfield, Liverpool, Camden and Narellan." },
  ],
  areas: ["Minto","Campbelltown","Ingleburn","Leumeah","Macquarie Fields","Glenfield","Liverpool","Camden","Narellan"],
  social: {
    facebook: { url: "https://facebook.com/right2drive", on: true },
    instagram: { url: "https://instagram.com/right2drive", on: true },
    tiktok: { url: "", on: false },
    youtube: { url: "", on: false },
  },
  contact: {
    phone: "(02) 1234 5678",
    email: "info@right2drive.com.au",
    address: "Minto NSW 2566, Australia",
    mapUrl: "https://maps.google.com/?q=Minto+NSW+2566",
    hours: [
      { day: "Monday", open: "06:00", close: "20:00", closed: false },
      { day: "Tuesday", open: "06:00", close: "20:00", closed: false },
      { day: "Wednesday", open: "06:00", close: "20:00", closed: false },
      { day: "Thursday", open: "06:00", close: "20:00", closed: false },
      { day: "Friday", open: "06:00", close: "20:00", closed: false },
      { day: "Saturday", open: "07:00", close: "18:00", closed: false },
      { day: "Sunday", open: "08:00", close: "17:00", closed: false },
    ],
  },
  reviews: {
    mode: "manual", // "auto" | "manual"
    apiKey: "",
    overall: "4.9",
    count: "120",
    items: [
      { id: "r1", name: "Daniel A.", rating: 5, date: "2026-05-12", text: "Honestly the best decision I made. My instructor was so calm and I passed first go. Highly recommend to anyone in the Minto area." },
      { id: "r2", name: "Renee N.", rating: 5, date: "2026-04-28", text: "Flexible times made it so easy to fit lessons around work. Knew all the test routes around Campbelltown. Thank you!" },
      { id: "r3", name: "Michael K.", rating: 5, date: "2026-04-15", text: "Did the 10 lesson package and it was worth every cent. Patient, professional and genuinely cares about your progress." },
    ],
  },
  activity: [
    { id: "a1", type: "edit", text: "Updated hero headline", time: "12 min ago" },
    { id: "a2", type: "photo", text: "Added success photo — Grace L.", time: "1 hour ago" },
    { id: "a3", type: "price", text: "Changed 5 Lesson Package price to $345", time: "3 hours ago" },
    { id: "a4", type: "faq", text: "Edited FAQ — \"Do you provide the car…\"", time: "Yesterday" },
    { id: "a5", type: "review", text: "Synced 4 new Google reviews", time: "Yesterday" },
    { id: "a6", type: "area", text: "Added service area — Narellan", time: "2 days ago" },
  ],
  lastUpdated: "Today at 9:42 AM",
};

const StoreContext = createContext(null);
const useStore = () => useContext(StoreContext);

function uid(prefix = "id") { return prefix + "_" + Math.random().toString(36).slice(2, 9); }

function StoreProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORE_KEY);
      if (saved) return { ...INITIAL_DATA, ...JSON.parse(saved) };
    } catch (e) {}
    return INITIAL_DATA;
  });
  const persist = useCallback((next) => {
    setData(next);
    try { localStorage.setItem(STORE_KEY, JSON.stringify(next)); } catch (e) {}
  }, []);
  // update a top-level slice (merge object or replace)
  const update = useCallback((key, value) => {
    setData(prev => {
      const next = { ...prev, [key]: typeof value === "function" ? value(prev[key]) : value };
      try { localStorage.setItem(STORE_KEY, JSON.stringify(next)); } catch (e) {}
      return next;
    });
  }, []);
  const logActivity = useCallback((type, text) => {
    setData(prev => {
      const next = { ...prev, activity: [{ id: uid("a"), type, text, time: "Just now" }, ...prev.activity].slice(0, 12) };
      try { localStorage.setItem(STORE_KEY, JSON.stringify(next)); } catch (e) {}
      return next;
    });
  }, []);
  const resetData = useCallback(() => persist(INITIAL_DATA), [persist]);
  return (
    <StoreContext.Provider value={{ data, update, logActivity, resetData, uid }}>
      {children}
    </StoreContext.Provider>
  );
}

Object.assign(window, { StoreProvider, useStore, uid, INITIAL_DATA });
