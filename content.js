export const brand = {
  name: "Apex Motors",
  tagline: "Drive the extraordinary.",
  description: "Premium new and certified pre-owned vehicles, delivered with honesty and style.",
  address: "28 Ozumba Mbadiwe Avenue, Victoria Island, Lagos",
  phone: "+234 800 000 0000",
  email: "sales@apexmotors.com",
  hours: "Mon–Sat, 8am–7pm",
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "YouTube", href: "https://youtube.com" },
    { label: "TikTok", href: "https://tiktok.com" },
    { label: "X", href: "https://x.com" }
  ]
};

const photo = (id, width = 1000) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export const cars = [
  { slug: "2024-luxury-suv", name: "Atlas Grand", category: "SUV", year: 2024, mileage: "8,400 km", price: 85000000, priceLabel: "₦85,000,000", fuel: "Petrol", transmission: "Automatic", image: photo("photo-1519641471654-76ce0107ad1b"), blurb: "Commanding presence. Considered luxury. Made for Lagos and beyond.", specs: [["Engine", "3.0L V6 Turbo"], ["Power", "335 hp"], ["Drive", "All-wheel drive"], ["Seats", "7"], ["Colour", "Obsidian Black"]], features: ["Adaptive cruise control", "Panoramic glass roof", "360° surround camera", "Premium leather upholstery"] },
  { slug: "2023-executive-sedan", name: "Aurelia S", category: "Sedan", year: 2023, mileage: "12,200 km", price: 48000000, priceLabel: "₦48,000,000", fuel: "Petrol", transmission: "Automatic", image: photo("photo-1552519507-da3b142c6e3d"), blurb: "A quieter kind of confidence. Refined comfort meets effortless performance.", specs: [["Engine", "2.0L Turbo"], ["Power", "248 hp"], ["Drive", "Rear-wheel drive"], ["Seats", "5"], ["Colour", "Graphite Grey"]], features: ["Nappa leather seating", "Wireless smartphone integration", "Active lane assist", "Dual-zone climate control"] },
  { slug: "2022-sports-coupe", name: "Veloce GT", category: "Coupe", year: 2022, mileage: "6,800 km", price: 120000000, priceLabel: "₦120,000,000", fuel: "Petrol", transmission: "Automatic", image: photo("photo-1503376780353-7e6692767b70"), blurb: "Sculpted for the long way home. A sports coupe with a pulse of its own.", specs: [["Engine", "3.0L V6 Turbo"], ["Power", "382 hp"], ["Drive", "Rear-wheel drive"], ["Seats", "4"], ["Colour", "Racing Red"]], features: ["Sport-tuned adaptive suspension", "Launch control", "Performance exhaust", "Heated sport seats"] },
  { slug: "2024-family-crossover", name: "Haven Cross", category: "SUV", year: 2024, mileage: "3,100 km", price: 38000000, priceLabel: "₦38,000,000", fuel: "Petrol", transmission: "Automatic", image: photo("photo-1519583272095-6433daf26b6e"), blurb: "Room for everyone. Thoughtful details for everything the day brings.", specs: [["Engine", "1.8L Turbo"], ["Power", "180 hp"], ["Drive", "Front-wheel drive"], ["Seats", "5"], ["Colour", "Pearl White"]], features: ["Hands-free power tailgate", "Rear parking sensors", "Flexible cargo space", "Apple CarPlay & Android Auto"] },
  { slug: "2023-pickup-truck", name: "Ranger X", category: "Truck", year: 2023, mileage: "19,500 km", price: 55000000, priceLabel: "₦55,000,000", fuel: "Diesel", transmission: "Automatic", image: photo("photo-1551830820-330a71b99659"), blurb: "Built to take the road as it comes. Work-ready, weekend-approved.", specs: [["Engine", "2.8L Turbo Diesel"], ["Power", "201 hp"], ["Drive", "Four-wheel drive"], ["Seats", "5"], ["Colour", "Stone Silver"]], features: ["Selectable terrain modes", "Reinforced load bed", "Hill descent control", "Rear-view camera"] },
  { slug: "2021-hybrid-hatchback", name: "Nova Hybrid", category: "Electric / Hybrid", year: 2021, mileage: "24,000 km", price: 22000000, priceLabel: "₦22,000,000", fuel: "Hybrid", transmission: "Automatic", image: photo("photo-1504215680853-026ed2a45def"), blurb: "A lighter footprint, without leaving anything behind. City-smart by nature.", specs: [["Engine", "1.8L Hybrid"], ["Power", "121 hp combined"], ["Drive", "Front-wheel drive"], ["Seats", "5"], ["Colour", "Silver Mist"]], features: ["Regenerative braking", "Rear camera", "Keyless entry", "Low-emission hybrid drive"] }
];

export const stats = [
  { value: 13, suffix: "+", label: "Years in business" },
  { value: 3500, suffix: "+", label: "Cars sold" },
  { value: 98, suffix: "%", label: "Customer satisfaction" },
  { value: 24, suffix: "/7", label: "After-sales support" }
];

export const benefits = [
  ["01", "150-point inspection", "Every vehicle earns its place on our floor. Our technicians check 150 critical points before you ever take the wheel."],
  ["02", "Straightforward pricing", "The number you see is the number we discuss. No last-minute surprises, no small-print games."],
  ["03", "Finance that fits", "Flexible finance options shaped around your plans, with clear terms from the very first conversation."],
  ["04", "12-month warranty", "Added peace of mind comes standard on our certified pre-owned vehicles."],
  ["05", "Delivered to your door", "Enjoy complimentary delivery anywhere in Lagos. We’ll bring your next chapter to you."]
];

export const steps = [
  ["01", "Browse", "Find your next car online or visit our Victoria Island showroom."],
  ["02", "Test drive", "Get behind the wheel and make sure it feels just right."],
  ["03", "Finance & paperwork", "We’ll make the details clear and take care of the paperwork."],
  ["04", "Delivery", "Collect it from us or enjoy free delivery within Lagos."]
];

export const testimonials = [
  ["Smooth process and no hidden fees.", "Chidi O.", "Lekki"],
  ["The 150-point inspection gave me real confidence.", "Mrs. Bello", "Ikeja"],
  ["Delivered to my door in two days.", "Engr. Femi A.", "Abuja"]
];

export const faqs = [
  ["What financing options do you offer?", "We work with trusted finance partners to offer flexible payment plans. Share your budget with our team and we’ll walk you through the available options, terms and monthly estimates before you decide."],
  ["Can I trade in my current car?", "Absolutely. Tell us a little about your car and our team will arrange a free valuation within 24 hours. You can put its value towards any vehicle in our showroom."],
  ["What does the warranty cover?", "Our certified pre-owned vehicles include a 12-month warranty covering key mechanical and electrical components. We’ll explain the exact cover for your chosen vehicle before you buy."],
  ["Can you help with documentation and registration?", "Yes. We’ll guide you through the paperwork, ownership transfer and registration process, and make sure you know exactly what’s needed at every step."]
];

export const bodyTypes = [
  ["SUV", "photo-1519641471654-76ce0107ad1b"],
  ["Sedan", "photo-1552519507-da3b142c6e3d"],
  ["Coupe", "photo-1503376780353-7e6692767b70"],
  ["Truck", "photo-1551830820-330a71b99659"],
  ["Hatchback", "photo-1504215680853-026ed2a45def"],
  ["Electric / Hybrid", "photo-1492144534655-ae79c964c9d7"]
].map(([name, id]) => ({ name, image: photo(id, 700) }));
